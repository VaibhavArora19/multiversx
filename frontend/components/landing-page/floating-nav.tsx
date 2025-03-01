"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function FloatingNav() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);

  return (
    <motion.div style={{ opacity, y }} className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-full border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
        <Sparkles className="h-5 w-5 text-primary" />
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary">
            Testimonials
          </a>
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </motion.div>
  );
}
