import { useCallback, useEffect, useRef, useState } from "react";
import type { Transform } from "../../../../utils/coords";

type Params = {
  transform: Transform;
  setTransform: React.Dispatch<React.SetStateAction<Transform>>;
  disabled?: boolean; // e.g., when dragging a card
};

export function useClickDragPan({ transform, setTransform, disabled = false }: Params) {
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const isPanningRef = useRef(false);
  const setTransformRef = useRef(setTransform);
  const activeMoveRef = useRef<((e: PointerEvent) => void) | null>(null);
  const activeUpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isPanningRef.current = isPanning;
  }, [isPanning]);

  useEffect(() => {
    setTransformRef.current = setTransform;
  }, [setTransform]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // Start panning on left click anywhere inside the scene EXCEPT when clicking a card
  if (disabled || e.button !== 0) return;
  if (isPanningRef.current) return; // already panning; avoid duplicate listeners
    const target = e.target as HTMLElement | null;
    const isOnCard = !!target?.closest('.agent-workspace-card');
    if (isOnCard) return;
    e.preventDefault();
    setIsPanning(true);
    const start = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
    panStart.current = start;
    const move = (ev: PointerEvent) => {
      if (!isPanningRef.current) return;
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      const setter = setTransformRef.current ?? setTransform;
      setter((t) => ({ ...t, x: start.tx + dx, y: start.ty + dy }));
    };
    const up = () => {
      setIsPanning(false);
      panStart.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      activeMoveRef.current = null;
      activeUpRef.current = null;
    };
    activeMoveRef.current = move;
    activeUpRef.current = up;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, [disabled, transform.x, transform.y]);

  useEffect(() => {
    // If panning and suddenly disabled (e.g., started dragging a card), end pan cleanly
    if (disabled && isPanningRef.current) {
      setIsPanning(false);
      panStart.current = null;
      if (activeMoveRef.current) window.removeEventListener("pointermove", activeMoveRef.current);
      if (activeUpRef.current) window.removeEventListener("pointerup", activeUpRef.current);
      activeMoveRef.current = null;
      activeUpRef.current = null;
    }
  }, [disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsPanning(false);
      panStart.current = null;
      if (activeMoveRef.current) window.removeEventListener("pointermove", activeMoveRef.current);
      if (activeUpRef.current) window.removeEventListener("pointerup", activeUpRef.current);
      activeMoveRef.current = null;
      activeUpRef.current = null;
    };
  }, []);

  return { isPanning, onPointerDown };
}
