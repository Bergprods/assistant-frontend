import React, { useState } from "react";
import CardFrame from "../common/card/CardFrame";
import HeaderBar from "../common/header/HeaderBar";
import type { Card } from "../../views/multilayer/interaction_layer/hooks/useCards";
import { useCardDrag } from "../../views/multilayer/interaction_layer/hooks/useCardDrag";

export function Cards({ items, onCardDrag, onCardMove, getWorkspacePoint, onCardDragStart, onCardDragEnd, forcedDragPos, onCardNameChange, onCardDelete, onCardSettings }: { items: Card[]; onCardDrag?: (pointer: { x: number; y: number } | null) => void; onCardMove?: (id: string, x: number, y: number) => void; getWorkspacePoint?: (clientX: number, clientY: number) => { x: number; y: number }; onCardDragStart?: (id: string, offsetX: number, offsetY: number) => void; onCardDragEnd?: () => void; forcedDragPos?: { id: string; x: number; y: number } | null; onCardNameChange?: (id: string, name: string) => void; onCardDelete?: (id: string) => void; onCardSettings?: (id: string) => void }) {
  const [cards, setCards] = React.useState<Card[]>(items);
  const [dragging, setDragging] = React.useState(false);
  const skipNextSyncRef = React.useRef(false);
  const { onPointerDown } = useCardDrag(cards, setCards, {
    onDrag: (pointer) => {
      setDragging(!!pointer);
      if (onCardDrag) onCardDrag(pointer);
    },
    onMove: (id, x, y) => {
      if (onCardMove) onCardMove(id, x, y);
    },
    getWorkspacePoint,
    onStart: (id, ox, oy) => { setDragging(true); if (onCardDragStart) onCardDragStart(id, ox, oy); },
    onEnd: () => { 
      // Allow parent/store update to land before syncing props back into local state
      skipNextSyncRef.current = true;
      setDragging(false); 
      if (onCardDragEnd) onCardDragEnd(); 
    },
  });
  React.useEffect(() => {
    if (!dragging) {
      if (skipNextSyncRef.current) {
        // Skip this immediate sync to avoid overwriting local final position with stale props
        skipNextSyncRef.current = false;
        return;
      }
      setCards(items);
    }
  }, [items, dragging]);

  // Apply externally-forced position updates during auto-pan to keep the dragged card under the cursor immediately
  React.useEffect(() => {
    if (!forcedDragPos) return;
    setCards(prev => prev.map(c => (c.id === forcedDragPos.id ? { ...c, x: forcedDragPos
      .x, y: forcedDragPos.y } : c)));
  }, [forcedDragPos?.id, forcedDragPos?.x, forcedDragPos?.y]);
  return (
    <>
      {cards.map((card) => {
        const accent = card.color || "#4b91ff";
        return (
            <CardFrame
            key={card.id}
            x={card.x}
            y={card.y}
            width={260}
              height={200}
            accent={accent}
            className="hover:shadow-2xl"
            onPointerDown={e => { e.stopPropagation(); onPointerDown(e, card.id); }}
            style={{ cursor: "grab" }}
          >
            <div className="shrink-0">
              <HeaderBar label={card.type} accent={accent} Icon={card.icon || null} />
            </div>
            <div className="px-5 py-3 flex-1 min-h-[92px]">
              <label className="block text-[11px] text-[#b5c7db] mb-1">Name</label>
              <input
                className="w-full rounded-md bg-[#0c1424] border border-[#1e2a3e] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={card.name ?? ""}
                placeholder="Enter name"
                onChange={(e) => {
                  const name = e.target.value;
                  // update local state for immediate feedback
                  setCards(prev => prev.map(c => c.id === card.id ? { ...c, name } : c));
                  // propagate to parent/store
                  if (onCardNameChange) onCardNameChange(card.id, name);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <div className="mt-2 text-[11px] text-[#7f93ad]">ID: {card.id}</div>
            </div>
            {/* Bottom row actions */}
            <div className="w-full px-4 py-2 flex items-center justify-end gap-4 border-t border-[#1e2a3e] shrink-0">
              {/* Settings (left of delete) */}
              <button
                className="p-1.5 rounded-md hover:bg-[#0f1a2c] border border-transparent hover:border-[#1e2a3e] text-[#b5c7db]"
                title="Settings"
                onClick={(e) => { e.stopPropagation(); if (onCardSettings) onCardSettings(card.id); }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#b5c7db]">
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567l-.106.637a8.284 8.284 0 0 0-1.248.722l-.602-.35a1.875 1.875 0 0 0-2.516.671l-.75 1.299a1.875 1.875 0 0 0 .455 2.385l.522.421a8.47 8.47 0 0 0 0 1.444l-.522.421c-.86.694-1.107 1.927-.455 2.385l.75 1.299c.539.934 1.708 1.25 2.516.671l.602-.35c.4.277.815.52 1.248.722l.106.637c.151.904.933 1.567 1.85 1.567h1.5c.917 0 1.699-.663 1.85-1.567l.106-.637c.433-.202.848-.445 1.248-.722l.602.35c.808.579 1.977.263 2.516-.671l.75-1.299c.652-.458.405-1.691-.455-2.385l-.522-.421a8.47 8.47 0 0 0 0-1.444l.522-.421c.86-.694 1.107-1.927.455-2.385l-.75-1.299a1.875 1.875 0 0 0-2.516-.671l-.602.35a8.284 8.284 0 0 0-1.248-.722l-.106-.637A1.875 1.875 0 0 0 12.578 2.25h-1.5Zm.75 10.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                </svg>
              </button>
              {/* Delete (rightmost) */}
              <button
                className="p-1.5 rounded-md hover:bg-[#2a1111] border border-transparent hover:border-[#3a1a1a] text-[#ff9b9b]"
                title="Delete"
                onClick={(e) => { e.stopPropagation(); if (onCardDelete) onCardDelete(card.id); }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#ff9b9b]">
                  <path d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5h-.42l-1.047 13.11A3.75 3.75 0 0 1 13.544 22.5H10.456a3.75 3.75 0 0 1-3.738-3.39L5.67 6H5.25a.75.75 0 0 1 0-1.5H9V3.75Zm1.5.75h3V3.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4.5ZM8.183 6l1.02 12.78a2.25 2.25 0 0 0 2.253 2.22h3.086a2.25 2.25 0 0 0 2.253-2.22L17.817 6H8.183Z" />
                </svg>
              </button>
            </div>
          </CardFrame>
        );
      })}
    </>
  );
}