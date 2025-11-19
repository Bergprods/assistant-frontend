import React from "react";
import DottedBackgroundOverlay from "../../../components/background/DottedBackgroundOverlay";
import type { Card } from "../interaction_layer/hooks/useCards";
import { Cards } from "../../../components/cards/agent-map-card";

type Props = {
  zoom?: number;
  panX?: number;
  panY?: number;
  containerWidth?: number;
  containerHeight?: number;
  cards?: Card[];
  onCardDrag?: (pointer: { x: number; y: number } | null) => void;
  onCardMove?: (id: string, x: number, y: number) => void;
  getWorkspacePoint?: (clientX: number, clientY: number) => { x: number; y: number };
  onCardDragStart?: (id: string, offsetX: number, offsetY: number) => void;
  onCardDragEnd?: () => void;
  forcedDragPos?: { id: string; x: number; y: number } | null;
  onCardNameChange?: (id: string, name: string) => void;
  onCardDelete?: (id: string) => void;
  onCardSettings?: (id: string) => void;
};

export default function MultiLayerEditScene({
  zoom = 1,
  panX = 0,
  panY = 0,
  containerWidth,
  containerHeight,
  cards = [],
  onCardDrag,
  onCardMove,
  getWorkspacePoint,
  onCardDragStart,
  onCardDragEnd,
  forcedDragPos,
  onCardNameChange,
  onCardDelete,
  onCardSettings,
}: Props) {
  console.log("MultiLayerEditScene cards prop", cards);
  return (
    <div className="multilayer-edit-scene w-full h-full relative overflow-hidden border-4 border-red-500">
      <DottedBackgroundOverlay
        zoom={zoom}
        x={panX}
        y={panY}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
      <div
        className="absolute left-0 top-0 border-2 border-green-500"
        style={{
          width: containerWidth ? `${containerWidth}px` : "100%",
          height: containerHeight ? `${containerHeight}px` : "100%",
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "top left",
          zIndex: 1,
        }}
      >
        <Cards items={cards} onCardDrag={onCardDrag} onCardMove={onCardMove} getWorkspacePoint={getWorkspacePoint} onCardDragStart={onCardDragStart} onCardDragEnd={onCardDragEnd} forcedDragPos={forcedDragPos} onCardNameChange={onCardNameChange} onCardDelete={onCardDelete} onCardSettings={onCardSettings} />
      </div>
    </div>
  );
}
