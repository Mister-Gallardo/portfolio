'use client';

import { useEffect, useRef } from 'react';
import { deferUntilIdle } from '@/lib/idle';
import { media } from '@/lib/media';

const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float t = uTime * 0.03;

  // Domain-warped noise reads as slow smoke.
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  float smoke = fbm(p * 1.7 + 2.0 * q + vec2(t * 0.5, -t * 0.25));

  // Warm light behind the portrait, drifting a little towards the pointer.
  vec2 light = vec2(0.1, 0.16) + (uPointer - 0.5) * vec2(0.12, 0.08);
  float glow = exp(-2.4 * length((p - light) * vec2(1.0, 1.3)));

  vec3 ink = vec3(0.082, 0.075, 0.059);
  vec3 umber = vec3(0.2, 0.125, 0.07);
  vec3 amber = vec3(0.66, 0.42, 0.2);

  vec3 color = mix(ink, umber, smoothstep(0.3, 0.9, smoke) * 0.85);
  color += amber * glow * (0.3 + 0.7 * smoke) * 0.6;
  color *= 1.0 - 0.5 * smoothstep(0.45, 1.3, length(p * vec2(0.85, 1.1)));

  // Dither to hide banding in the dark gradient.
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;

  fragColor = vec4(color, 1.0);
}`;

/** Share of CSS pixels actually rendered. The smoke is soft, so half resolution looks the same. */
const RENDER_SCALE = 0.5;
/** The smoke drifts slowly, so 30 fps look as smooth as 60 at half the GPU work. */
const FRAME_INTERVAL = 1000 / 30;
/** How quickly the light follows the pointer, as a time constant in ms. */
const POINTER_LAG = 400;

/**
 * Software renderers emulate the GPU on the CPU: the smoke would cost seconds of main
 * thread there. Browsers that hide the real renderer behind "WebKit WebGL" expose it
 * through the debug extension; the others report it directly.
 */
function isSoftwareRenderer(gl: WebGL2RenderingContext) {
  let renderer = String(gl.getParameter(gl.RENDERER));
  if (renderer === 'WebKit WebGL') {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  }
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

/**
 * Compiles and links without blocking: with KHR_parallel_shader_compile the driver
 * builds the program in the background and we check back every frame. Status queries
 * wait until compilation is done, because querying earlier stalls the main thread.
 */
function buildProgram(gl: WebGL2RenderingContext, onReady: (program: WebGLProgram) => void) {
  const program = gl.createProgram();
  const shaders = (
    [
      [gl.VERTEX_SHADER, VERTEX_SHADER],
      [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
    ] as const
  ).flatMap(([type, source]) => {
    const shader = gl.createShader(type);
    if (!shader) return [];
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    return [shader];
  });
  gl.linkProgram(program);

  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  let frame = 0;

  const finish = () => {
    if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
      frame = requestAnimationFrame(finish);
      return;
    }
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      onReady(program);
    } else {
      for (const shader of shaders) console.error(gl.getShaderInfoLog(shader));
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }
    for (const shader of shaders) gl.deleteShader(shader);
  };

  finish();
  return () => cancelAnimationFrame(frame);
}

/**
 * Draws the smoke at up to 30 fps while the canvas is on screen and the tab is visible.
 * Touch devices and reduced motion get a single still frame. Returns a cleanup function.
 */
function startRendering(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  canvas: HTMLCanvasElement,
) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // One triangle that covers the whole viewport.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  // biome-ignore lint/correctness/useHookAtTopLevel: a WebGL call, not a React hook.
  gl.useProgram(program);

  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uPointer = gl.getUniformLocation(program, 'uPointer');

  const animate = window.matchMedia(media.pointer).matches;
  const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
  const startedAt = performance.now();
  let frame = 0;
  let drawnAt = startedAt;
  let inView = true;

  const resize = () => {
    const width = Math.max(1, Math.round(canvas.clientWidth * RENDER_SCALE));
    const height = Math.max(1, Math.round(canvas.clientHeight * RENDER_SCALE));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  };

  const draw = (now: number) => {
    // Frame-rate independent easing towards the pointer.
    const follow = 1 - Math.exp(-(now - drawnAt) / POINTER_LAG);
    pointer.x += (pointer.targetX - pointer.x) * follow;
    pointer.y += (pointer.targetY - pointer.y) * follow;
    drawnAt = now;
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startedAt) / 1000);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    // A millisecond of slack keeps 60 Hz screens on every other frame despite jitter.
    if (now - drawnAt >= FRAME_INTERVAL - 1) draw(now);
  };

  const play = () => {
    if (animate && !frame && inView && !document.hidden) frame = requestAnimationFrame(loop);
  };

  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!frame) draw(performance.now());
  });

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    if (inView) play();
    else pause();
  });

  const onVisibilityChange = () => (document.hidden ? pause() : play());

  const onPointerMove = (event: PointerEvent) => {
    pointer.targetX = event.clientX / window.innerWidth;
    pointer.targetY = 1 - event.clientY / window.innerHeight;
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    pause();
    delete canvas.dataset.ready;
  };

  resize();
  draw(startedAt);
  play();
  resizeObserver.observe(canvas);
  if (animate) {
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.dataset.ready = 'true';

  return () => {
    pause();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
}

/**
 * Ambient smoke behind the hero, drawn with raw WebGL 2 (no 3D library). Decorative:
 * the parent hides it from assistive technology.
 */
export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelBuild: (() => void) | undefined;
    let stopRendering: (() => void) | undefined;

    // Starts once the page is idle, so the shader never competes with the first render.
    const cancelStart = deferUntilIdle(() => {
      const gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        // Refuses blocklisted GPUs; software renderers are caught by the check below.
        failIfMajorPerformanceCaveat: true,
      });
      // Either way the CSS gradient behind the canvas stays as the fallback.
      if (!gl) return;
      if (isSoftwareRenderer(gl)) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return;
      }

      cancelBuild = buildProgram(gl, (program) => {
        stopRendering = startRendering(gl, program, canvas);
      });
    });

    return () => {
      cancelStart();
      cancelBuild?.();
      stopRendering?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-[1.5s] data-ready:opacity-100"
    />
  );
}
