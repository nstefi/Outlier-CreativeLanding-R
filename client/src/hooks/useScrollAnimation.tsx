import { useEffect, useRef } from "react";
import { useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { usePreferredReducedMotion } from "./usePreferredReducedMotion";

export function useScrollAnimation(threshold = 0.1) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  const prefersReducedMotion = usePreferredReducedMotion();

  useEffect(() => {
    if (inView || prefersReducedMotion) {
      controls.start("show");
    }
  }, [controls, inView, prefersReducedMotion]);

  return { ref, controls, inView };
}
