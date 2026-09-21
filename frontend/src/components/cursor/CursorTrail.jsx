import { useEffect, useRef } from "react";
import { useCursor } from "../../context/CursorContext";

const COUNT = 3;

export default function CursorTrail() {
  const { cursor, visible } = useCursor();

  const refs = useRef([]);

  const points = useRef(
    Array.from({ length: COUNT }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }))
  );

  useEffect(() => {
    let raf;

    const animate = () => {
      const target = cursor.current;

      points.current[0].x += (target.x - points.current[0].x) * 0.22;
      points.current[0].y += (target.y - points.current[0].y) * 0.22;

      for (let i = 1; i < COUNT; i++) {
        points.current[i].x +=
          (points.current[i - 1].x - points.current[i].x) * 0.28;

        points.current[i].y +=
          (points.current[i - 1].y - points.current[i].y) * 0.28;
      }

      refs.current.forEach((el, i) => {
        if (!el) return;

        const p = points.current[i];

        el.style.transform = `
          translate3d(${p.x}px, ${p.y}px,0)
          translate(-50%,-50%)
          scale(${1 - i * .15})
        `;

        el.style.opacity = visible
          ? 0.10 - i * 0.03
          : 0;
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, [cursor, visible]);

  return (
    <>
      {Array.from({ length: COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="cursor-trail"
        />
      ))}
    </>
  );
}