import { useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { screenToWorld, Transform } from "../../../../utils/coords";
import {getDraggingCardType} from "../state/dragState";
import type { Card } from "./useCards";
import { CARD_TYPES } from "../../../../components/cards/card-types";

interface UseCardDropOptions {
  cardStore: {
    add: (card: Card) => void;
    items: Card[];
  };
  transform: Transform;
}

export function useCardDrop({ cardStore, transform }: UseCardDropOptions) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = getDraggingCardType();
      const color = e.dataTransfer.getData("application/card-color");
  const icon = CARD_TYPES.find((c) => c.type === type)?.icon || null;
      console.log("Drop event", { type, color, icon, x: e.clientX, y: e.clientY });
      if (!type) {
        console.error("Ingen typ mottagen i drop! Kontrollera dragstart.");
        return;
      }
      if (!sceneRef.current) return;
      const { x, y } = screenToWorld(
        e.clientX,
        e.clientY,
        sceneRef.current,
        transform
      );
      console.log("Calling cardStore.add", { id: "will-be-nanoid", type, color, icon, x, y });
      cardStore.add({ id: nanoid(), type, color, icon, x, y });
      setTimeout(() => {
        console.log("CardStore.items after add (delayed)", cardStore.items);
      }, 100);
    },
    [cardStore, transform]
  );

  return { sceneRef, handleDragOver, handleDrop };
}