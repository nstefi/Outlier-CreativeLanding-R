import { useEffect, useState } from "react";
import { usePreferredReducedMotion } from "./usePreferredReducedMotion";

export function useParallax(speed = 0.05) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePreferredReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      requestAnimationFrame(() => {
        setPosition({
          x: mouseX * 100 * speed,
          y: mouseY * 100 * speed,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [speed, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return { style: {} };
  }

  return {
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: "transform 0.2s cubic-bezier(0.2, 0.49, 0.32, 0.99)",
    },
  };
}
