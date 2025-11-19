import React, { useRef, useLayoutEffect, useState } from "react";
import MultilayerInteraction from "./interaction_layer/MultilayerInteraction";
import TopMenuCreateAgent from "../../components/layout/menus/top-menu";

export default function MultiLayerView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [layersActive, setLayersActive] = useState(false);

  useLayoutEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} className="multilayer-interaction w-full h-full relative">
      {/* Top menu always visible above workspace */}
      <TopMenuCreateAgent layersActive={layersActive} setLayersActive={setLayersActive} />
      <MultilayerInteraction containerWidth={size.width} containerHeight={size.height} />
    </div>
  );
}

