import { useState, useCallback } from "react";
import { Transform } from "@/features/create_agent/utils/coords";

export function usePanZoom(initial: Transform = { x: 0, y: 0, zoom: 1 }) {
  const [transform, setTransform] = useState<Transform>(initial);

  // TODO: Implement pan logic (pointer events)
  // For now, only zoom is supported
  const setZoom = useCallback((zoom: number) => {
    setTransform((t) => ({ ...t, zoom }));
  }, []);

  // Handlers for pan/zoom events (stub)
  const handlers = {};

  return { transform, setTransform, setZoom, handlers };
}
