type Task = { run: () => unknown; cancelled: boolean };

const queue: Task[] = [];
/** `scheduled` covers the wait for `load` and for an idle period; one flush serves all tasks. */
let state: 'idle' | 'scheduled' | 'flushing' = 'idle';

const whenIdle = (callback: () => void) => {
  // Safari shipped requestIdleCallback late, hence the fallback.
  if (typeof (window as Partial<Window>).requestIdleCallback === 'function') {
    window.requestIdleCallback(callback, { timeout: 1500 });
  } else {
    setTimeout(callback, 200);
  }
};

/** Resolves in a new task, letting the browser render and handle input in between. */
const nextTask = () =>
  new Promise<void>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });

async function flush() {
  state = 'flushing';
  // Tasks queued while flushing join the same run.
  for (let task = queue.shift(); task; task = queue.shift()) {
    if (task.cancelled) continue;
    try {
      await task.run();
    } catch (error) {
      console.error(error);
    }
    await nextTask();
  }
  state = 'idle';
}

function schedule() {
  if (state !== 'idle') return;
  state = 'scheduled';
  const start = () => whenIdle(() => void flush());
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

/**
 * Queues work until the page has loaded and the main thread is idle, then runs the
 * queue one task at a time, yielding to the browser in between, so that no setup turns
 * into a long task. Async tasks are awaited before the next one starts. Returns a
 * function that cancels the task if it has not started yet.
 */
export function deferUntilIdle(run: () => unknown): () => void {
  const task: Task = { run, cancelled: false };
  queue.push(task);
  schedule();

  return () => {
    task.cancelled = true;
  };
}
