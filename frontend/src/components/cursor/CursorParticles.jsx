import { useEffect, useRef } from "react";
import { useCursor } from "../../context/CursorContext";

const PARTICLE_COUNT = 6;

export default function CursorParticles() {
  const { mouse } = useCursor();

  const containerRef = useRef(null);

  useEffect(() => {
    const createParticle = () => {
      if (!containerRef.current) return;

      const particle = document.createElement("span");

      particle.className = "cursor-particle";

      const angle = Math.random() * Math.PI * 2;
      const distance = 12 + Math.random() * 18;

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      particle.style.left = `${mouse.current.x}px`;
      particle.style.top = `${mouse.current.y}px`;

      particle.style.setProperty("--x", `${x}px`);
      particle.style.setProperty("--y", `${y}px`);

      const size = 2 + Math.random() * 2;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      containerRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 550);
    };

    const handleClick = () => {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [mouse]);

  return (
    <div
      ref={containerRef}
      className="cursor-particles"
    />
  );
}