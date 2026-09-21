import { useEffect, useRef } from "react";
import { useCursor } from "../../context/CursorContext";

import "./Cursor.css";

export default function PremiumCursor() {
  const { cursor, visible, hover, click } = useCursor();

  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let raf;

    const animate = () => {
      const { x, y } = cursor.current;

      if (ringRef.current) {
        ringRef.current.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          translate(-50%, -50%)
          scale(${hover ? 1 : 0.65})
        `;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          translate(-50%, -50%)
          scale(${click ? 0.72 : 1})
        `;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, [cursor, hover, click]);

  return (
    <>
      {/* Ring */}
      <div
        ref={ringRef}
        className={[
          "cursor-ring",
          visible ? "cursor-visible" : "",
          hover ? "cursor-hover" : "",
        ].join(" ")}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        className={[
          "cursor-dot",
          visible ? "cursor-visible" : "",
        ].join(" ")}
      />
    </>
  );
}