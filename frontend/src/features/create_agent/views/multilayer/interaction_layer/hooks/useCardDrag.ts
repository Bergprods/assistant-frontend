import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { Card } from "./useCards";

export function useCardDrag(
  cards: Card[],
  setCards: Dispatch<SetStateAction<Card[]>>,
  options?: {
    onDrag?: (pointer: { x: number; y: number } | null) => void,
    onMove?: (id: string, x: number, y: number) => void,
    getWorkspacePoint?: (clientX: number, clientY: number) => { x: number; y: number },
    onStart?: (id: string, offsetX: number, offsetY: number) => void,
    onEnd?: () => void,
  }
) {
  const dragCardId = useRef<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  function onPointerDown(e: React.PointerEvent, cardId: string) {
    dragCardId.current = cardId;
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const p = optionsRef.current?.getWorkspacePoint
      ? optionsRef.current.getWorkspacePoint(e.clientX, e.clientY)
      : { x: e.clientX, y: e.clientY };
    dragOffset.current = {
      x: p.x - card.x,
      y: p.y - card.y,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    if (optionsRef.current && optionsRef.current.onDrag) optionsRef.current.onDrag({ x: e.clientX, y: e.clientY });
    if (optionsRef.current && optionsRef.current.onStart) optionsRef.current.onStart(cardId, dragOffset.current.x, dragOffset.current.y);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragCardId.current) return;
    const p = optionsRef.current?.getWorkspacePoint
      ? optionsRef.current.getWorkspacePoint(e.clientX, e.clientY)
      : { x: e.clientX, y: e.clientY };
    const newX = p.x - dragOffset.current.x;
    const newY = p.y - dragOffset.current.y;
    setCards(prev => (
      prev.map(card => (
        card.id === dragCardId.current
          ? { ...card, x: newX, y: newY }
          : card
      ))
    ));
    if (optionsRef.current && optionsRef.current.onMove) optionsRef.current.onMove(dragCardId.current, newX, newY);
    if (optionsRef.current && optionsRef.current.onDrag) optionsRef.current.onDrag({ x: e.clientX, y: e.clientY });
  }

  function onPointerUp(e: PointerEvent) {
    // On release, compute final position and flush to state/store to avoid snap-back
    if (dragCardId.current) {
      const id = dragCardId.current;
      const p = optionsRef.current?.getWorkspacePoint
        ? optionsRef.current.getWorkspacePoint(e.clientX, e.clientY)
        : { x: e.clientX, y: e.clientY };
      const newX = p.x - dragOffset.current.x;
      const newY = p.y - dragOffset.current.y;
      setCards(prev => (
        prev.map(card => (
          card.id === id ? { ...card, x: newX, y: newY } : card
        ))
      ));
      if (optionsRef.current && optionsRef.current.onMove) optionsRef.current.onMove(id, newX, newY);
    }
    dragCardId.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    if (optionsRef.current && optionsRef.current.onDrag) optionsRef.current.onDrag(null);
    if (optionsRef.current && optionsRef.current.onEnd) optionsRef.current.onEnd();
  }

  return { onPointerDown };
}
