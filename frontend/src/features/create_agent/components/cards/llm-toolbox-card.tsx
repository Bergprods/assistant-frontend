import React from 'react'
import { setDraggingCardType } from '../../views/multilayer/interaction_layer/state/dragState'
import LlmToolBtn from '../buttons/llm-tool-btn'
import { CARD_TYPES } from "./card-types";

const LlmToolboxCard = () => {
  return (
    <div className="flex gap-4 mt-4">
      {CARD_TYPES.map(card => (
        <LlmToolBtn
          key={card.type}
          label={card.label}
          icon={<card.icon />}
          accent={card.color}
          draggable={true}
          onDragStart={e => {
            e.dataTransfer.setData("application/card-type", card.type);
            e.dataTransfer.setData("application/card-color", card.color);
            setDraggingCardType(card.type);
            console.log("DragStart", card.type, card.color);
          }}
        />
      ))}
    </div>
  )
}

export default LlmToolboxCard
