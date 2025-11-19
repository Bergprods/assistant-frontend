import React, { useEffect, useRef, useState } from "react";
import MultiLayerEditScene from "../scenes/MultiLayerEditScene";
import { useZoom } from "./hooks/useZoom";
import { usePanZoom } from "./hooks/usePanZoom";
import { useCards } from "./hooks/useCards";
import { useCardDrop } from "./hooks/useCardDrop";
import { useAutoPan } from "./hooks/useAutoPan";
import { useClickDragPan } from "./hooks/useClickDragPan";
import { screenToWorld } from "../../../utils/coords";

interface MultilayerInteractionProps {
  containerWidth?: number;
  containerHeight?: number;
}

export default function MultilayerInteraction({ containerWidth, containerHeight }: MultilayerInteractionProps) {
  // Hooks that must exist before refs depending on them
  const cardStore = useCards();
  const { zoom, handleWheel } = useZoom();
  const { transform, setTransform } = usePanZoom({ x: 0, y: 0, zoom });

  // --- Card drag state for auto-pan ---
  const [cardDragging, setCardDragging] = useState(false);
  const [cardPointer, setCardPointer] = useState<{ x: number; y: number } | null>(null);
  const [activeDrag, setActiveDrag] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [forcedDragPos, setForcedDragPos] = useState<{ id: string; x: number; y: number } | null>(null);

  // --- Background click-drag pan ---
  const { isPanning, onPointerDown: onBackgroundPointerDown } = useClickDragPan({
    transform,
    setTransform,
    disabled: cardDragging,
  });

  // Get scene ref before using it in auto-pan
  const { sceneRef, handleDragOver, handleDrop } = useCardDrop({ cardStore, transform });

  // Auto-pan when dragging cards near edges
  useAutoPan({
    dragging: cardDragging,
    pointer: cardPointer,
    panBy: (dx, dy) => setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy })),
    options: { threshold: 64, speed: 18, container: sceneRef.current }
  });

  // While autopanning (transform changes) and dragging, keep the dragged card under the cursor
  useEffect(() => {
    if (!cardDragging || !cardPointer || !activeDrag) return;
    const el = sceneRef.current;
    if (!el) return;
    const world = screenToWorld(cardPointer.x, cardPointer.y, el, transform);
    const newX = world.x - activeDrag.offsetX;
    const newY = world.y - activeDrag.offsetY;
    if (cardStore.update) cardStore.update(activeDrag.id, { x: newX, y: newY });
    setForcedDragPos({ id: activeDrag.id, x: newX, y: newY });
  }, [transform.x, transform.y]);

  // Also recompute forced pos on pointer movement while dragging (covers the moment when auto-pan stops)
  useEffect(() => {
    if (!cardDragging || !cardPointer || !activeDrag) return;
    const el = sceneRef.current;
    if (!el) return;
    const world = screenToWorld(cardPointer.x, cardPointer.y, el, transform);
    const newX = world.x - activeDrag.offsetX;
    const newY = world.y - activeDrag.offsetY;
    setForcedDragPos({ id: activeDrag.id, x: newX, y: newY });
  }, [cardPointer?.x, cardPointer?.y]);

  // (Pan cancel logic handled in useClickDragPan via disabled)

  // (cardDragging state already declared above)

  useEffect(() => {
    setTransform((prev) => ({ ...prev, zoom }));
  }, [zoom, setTransform]);

  return (
    <div
      className="multilayer-interaction-layer w-full h-full relative"
      onWheel={handleWheel}
    >
      {/* Bakgrundslager för pan */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
        onPointerDown={onBackgroundPointerDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <MultiLayerEditScene
          zoom={zoom}
          panX={transform.x}
          panY={transform.y}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          cards={cardStore.items}
          onCardDrag={pointer => {
            setCardDragging(!!pointer);
            setCardPointer(pointer);
          }}
          onCardMove={(id, x, y) => {
            // Uppdatera global store så att positionerna inte "snäpper ihop"
            if (cardStore.update) cardStore.update(id, { x, y });
          }}
          getWorkspacePoint={(clientX, clientY) => {
            const el = sceneRef.current;
            if (!el) return { x: clientX, y: clientY };
            return screenToWorld(clientX, clientY, el, transform);
          }}
          onCardDragStart={(id, offsetX, offsetY) => setActiveDrag({ id, offsetX, offsetY })}
          onCardDragEnd={() => { setActiveDrag(null); setForcedDragPos(null); }}
          forcedDragPos={forcedDragPos}
          onCardNameChange={(id, name) => { if (cardStore.update) cardStore.update(id, { name }); }}
          onCardDelete={(id) => { if (cardStore.remove) cardStore.remove(id); }}
          onCardSettings={(id) => { /* TODO: open settings modal */ console.debug('open settings for', id); }}
        />
      </div>
    </div>
  );
}

// ...existing code...
