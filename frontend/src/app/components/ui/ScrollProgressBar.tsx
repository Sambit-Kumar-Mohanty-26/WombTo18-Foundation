"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[4px] origin-left z-[9999]"
      style={{
        scaleX,
        background: "linear-gradient(to right, #F29F05, #1D6E3F, #00AEEF)",
        boxShadow: "0 2px 10px rgba(29, 110, 63, 0.2)"
      }}
    />
  );
}
