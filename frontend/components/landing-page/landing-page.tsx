"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles, Star, Zap, ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import { AnimatedCounter } from "@/components/landing-page/animated-counter";
import { AnimatedBackground } from "@/components/landing-page/animated-background";
import { CustomCursor } from "@/components/landing-page/custom-cursor";
import { FloatingNav } from "@/components/landing-page/floating-nav";
import { TextReveal } from "@/components/landing-page/text-reveal";
import { useRouter } from "next/navigation";
import { MagneticButton } from "./magnetic-button";
import { AnimatedSphere } from "@/components/landing-page/animated-sphere";

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const router = useRouter();

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className=" min-h-screen overflow-hidden w-full">
      <CustomCursor mousePosition={mousePosition} />
      <FloatingNav />
      <AnimatedBackground />

      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-screen w-full">
        <div className="relative min-h-screen flex items-center justify-between gap-4 py-24 md:py-32 w-full">
          <motion.div className="relative z-10 max-w-2xl ml-20" style={{ opacity, scale, y }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4" variant="secondary">
                🚀 The Future of DeFi is Here
              </Badge>
            </motion.div>
            <TextReveal text="Revolutionize Your DeFi Journey" />
            <TextReveal
              text="with AI-Powered Insights"
              className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
              delay={0.2}
            />
            <motion.p
              className="mt-6 text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Navigate the complexities of decentralized finance with confidence. Let our AI guide you to smarter investment decisions.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <MagneticButton>
                <Button size="lg" className="h-12 px-8 text-lg" onClick={() => router.push("/chat")}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg" onClick={() => router.push("/dashboard")}>
                  Dashboard
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* <Scene /> */}
            <AnimatedSphere />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-b bg-gradient-to-b from-background/50 to-background">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold tracking-tight">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <TextReveal text="Powerful Features for Smart Investing" className="text-3xl font-bold tracking-tight md:text-4xl" />
          <p className="mt-4 text-xl text-muted-foreground">Everything you need to succeed in DeFi</p>
        </motion.div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Card className="relative bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/25">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <TextReveal text="Trusted by DeFi Experts" className="text-3xl font-bold tracking-tight md:text-4xl" />
          <p className="mt-4 text-xl text-muted-foreground">Join thousands of satisfied users</p>
        </motion.div>
        <div className="mt-16">
          <div className="flex flex-nowrap gap-8 overflow-x-hidden">
            <motion.div
              animate={{
                x: [0, -2000],
              }}
              transition={{
                duration: 50,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="flex gap-8 pr-8"
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card key={index} className="w-[400px] shrink-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <div className="flex items-center">
                            {Array(5)
                              .fill(null)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                                />
                              ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{testimonial.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t">
        <div className="w-full py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center gap-4 text-center"
          >
            <TextReveal text="Start Your DeFi Journey Today" className="text-3xl font-bold tracking-tight md:text-4xl" />
            <p className="max-w-[600px] text-xl text-muted-foreground">Join the future of finance with our AI-powered platform</p>
            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <MagneticButton>
                <Button size="lg" className="h-12 px-8 text-lg" onClick={() => router.push("/chat")}>
                  Get Started Now
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="w-full flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-4 px-8 md:px-0">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Built with ❤️ for the DeFi community</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const stats = [
  { value: 50, label: "Active Users", prefix: "$", suffix: "K+" },
  { value: 2, label: "Total Volume", prefix: "$", suffix: "B+" },
  { value: 150, label: "Protocols Supported", suffix: "+" },
  { value: 99, label: "Success Rate", suffix: "%" },
];

const features = [
  {
    title: "AI-Powered Insights",
    description: "Get personalized investment recommendations based on real-time market analysis",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    title: "Real-time Analytics",
    description: "Track your portfolio performance with advanced analytics and visualizations",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Risk Management",
    description: "Stay informed about market risks and opportunities with AI predictions",
    icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
  },
];

const testimonials = [
  {
    name: "Alex Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    text: "This platform has completely transformed how I approach DeFi investing. The AI insights are incredibly valuable.",
  },
  {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    text: "As a beginner in DeFi, this tool has been invaluable. It's like having a expert guide by your side.",
  },
  {
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    text: "The real-time analytics and AI recommendations have helped me make better investment decisions.",
  },
];
