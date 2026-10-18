export type WaveOptions = {
  /** Empty space before the first stop and after the last one, in steps. */
  leadIn: number;
  leadOut: number;
};

export type Wave = {
  width: number;
  height: number;
  /** SVG path data in the same coordinate space as `width` and `height`. */
  path: string;
  /** Stops lying exactly on the curve, as fractions of width and height. */
  stops: { x: number; y: number }[];
};

const STEP = 1000;
const HEIGHT = 1000;
/** Phase advance of the sine per step, and its phase at the left edge. */
const FREQUENCY = Math.PI * 0.9;
const PHASE = 0.6;
/** Bézier segments per period: six already trace the sine to well under a pixel. */
const SEGMENTS_PER_PERIOD = 6;

/**
 * A gentle sine wave across `count` evenly spaced stops, filling its box from the top
 * edge to the bottom one. Positions are returned as fractions, so the SVG can stretch
 * with the track while the stops stay exactly on the line.
 */
export function createWave(count: number, { leadIn, leadOut }: WaveOptions): Wave {
  const width = (leadIn + count + leadOut) * STEP;
  const peak = HEIGHT / 2;
  const angle = (x: number) => (x / STEP) * FREQUENCY + PHASE;
  const yAt = (x: number) => HEIGHT / 2 + Math.sin(angle(x)) * peak;
  const slopeAt = (x: number) => (Math.cos(angle(x)) * peak * FREQUENCY) / STEP;

  // Cubic Hermite segments: the control points follow the exact tangent of the sine,
  // so a handful of curves replaces hundreds of straight samples.
  const period = (2 * Math.PI * STEP) / FREQUENCY;
  const segments = Math.ceil((width / period) * SEGMENTS_PER_PERIOD);
  const third = width / segments / 3;
  const point = (x: number, y: number) => `${Math.round(x)} ${Math.round(y)}`;

  let path = `M${point(0, yAt(0))}`;
  for (let index = 0; index < segments; index++) {
    const from = index * 3 * third;
    const to = from + 3 * third;
    path += `C${point(from + third, yAt(from) + slopeAt(from) * third)} ${point(to - third, yAt(to) - slopeAt(to) * third)} ${point(to, yAt(to))}`;
  }

  const stops = Array.from({ length: count }, (_, index) => {
    const x = (leadIn + index + 0.5) * STEP;
    return { x: x / width, y: yAt(x) / HEIGHT };
  });

  return { width, height: HEIGHT, path, stops };
}
