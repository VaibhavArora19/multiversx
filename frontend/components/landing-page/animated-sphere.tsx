"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedSphere() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePosition({
        x: (clientX - centerX) / 50,
        y: (clientY - centerY) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-[600px] h-[600px] mr-[400rem]">
      {/* Main sphere */}
      <motion.div
        className=" inset-0 rounded-full bg-gradient-to-br from-primary/80 via-primary/50 to-primary/30 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      />

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full bg-primary/30 blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}

      {/* Glowing ring */}
      <motion.div
        className="absolute inset-10 rounded-full border-2 border-primary/20"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Inner core */}
      <motion.div
        className="absolute inset-20 rounded-full bg-gradient-to-tr from-primary via-primary/50 to-transparent blur-md"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          x: mousePosition.x * -1,
          y: mousePosition.y * -1,
        }}
      />
    </div>
  );
}
