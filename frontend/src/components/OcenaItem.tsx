import React, { useState } from "react";
import OcenaTooltip from "./OcenaTooltip";

export default function OcenaItem({ ocena }: { ocena: number }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    setPos({
      x: e.clientX + 12,  // przesunięcie w prawo
      y: e.clientY + 12,  // przesunięcie w dół
    });
  };

  return (
    <>
      <span
        className="px-2 py-1 bg-blue-200 rounded cursor-pointer hover:bg-blue-300"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMove}
      >
        {ocena}
      </span>

      {hover && <OcenaTooltip x={pos.x} y={pos.y} />}
    </>
  );
}
