"use client";

import { motion } from "framer-motion";

export function CustomCursor({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <motion.div
        className="fixed z-50 pointer-events-none h-4 w-4 rounded-full bg-primary/30 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 500,
          mass: 0.1,
        }}
      />
      <motion.div
        className="fixed z-50 pointer-events-none h-2 w-2 rounded-full bg-primary mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.1,
        }}
      />
    </>
  );
}
