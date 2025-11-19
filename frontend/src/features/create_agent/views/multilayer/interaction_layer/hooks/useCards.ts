import { useState } from "react";

export type Card = {
  id: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  icon?: React.ComponentType<any> | null;
  name?: string;
};

export function useCards() {
  const [items, setItems] = useState<Card[]>([]);

  function add(card: Card) {
    console.log("useCards.add called", card);
    setItems(prev => {
      const next = [...prev, card];
      console.log("useCards add, prev:", prev, "next:", next);
      return next;
    });
  }

  function update(id: string, patch: Partial<Card>) {
    setItems(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }

  function remove(id: string) {
    setItems(prev => prev.filter(c => c.id !== id));
  }

  return { items, add, update, remove };
}
