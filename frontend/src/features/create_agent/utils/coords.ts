export type Transform = { x: number; y: number; zoom: number };

export function screenToWorld(
  clientX: number,
  clientY: number,
  sceneEl: HTMLElement,
  t: Transform
) {
  const rect = sceneEl.getBoundingClientRect(); // scenens skärmposition
  const sx = clientX - rect.left;               // screen → scenens lokala
  const sy = clientY - rect.top;
  const wx = (sx - t.x) / t.zoom;               // scenens lokala → world
  const wy = (sy - t.y) / t.zoom;
  return { x: wx, y: wy };
}