import { useEffect, useRef } from "react";

/**
 * useAutoPan
 * Pan workspace automatically when dragging a card near the edge.
 * @param dragging Whether a card is currently being dragged
 * @param pointer { x, y } - Current pointer position (screen coords)
 * @param panBy (dx, dy) => void - Function to pan workspace
 * @param options { threshold, speed }
 */
export function useAutoPan({ dragging, pointer, panBy, options = {} }: {
  dragging: boolean;
  pointer: { x: number; y: number } | null;
  panBy: (dx: number, dy: number) => void;
  options?: { threshold?: number; speed?: number; container?: HTMLElement | null }
}) {
  const rafRef = useRef<number | null>(null);
  const threshold = options.threshold ?? 48; // px from edge
  const speed = options.speed ?? 16; // px per frame
  const container = options.container ?? document.body;

  useEffect(() => {
    if (!dragging || !pointer || !container) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    function step() {
      const rect = container.getBoundingClientRect();
      let dx = 0, dy = 0;
      if (!pointer) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
  // Move the CONTENT toward the pointer: near left -> pan content RIGHT (dx>0), near right -> LEFT (dx<0)
  if (pointer.x - rect.left < threshold) dx = +speed;   // left edge -> show more left by shifting content right
  if (rect.right - pointer.x < threshold) dx = -speed;   // right edge -> show more right by shifting content left
  if (pointer.y - rect.top < threshold) dy = +speed;     // top edge -> show more up by shifting content down
  if (rect.bottom - pointer.y < threshold) dy = -speed;  // bottom edge -> show more down by shifting content up
      if (dx !== 0 || dy !== 0) panBy(dx, dy);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [dragging, pointer, panBy, threshold, speed, container]);
}
