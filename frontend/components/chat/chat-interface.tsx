"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { useSendMessage } from "@/hooks/send-message";
import { useGetAgents } from "@/hooks/agent";
import { RotatingLines } from "react-loader-spinner";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatInterface() {
  const { mutateAsync } = useSendMessage();
  const { data } = useGetAgents();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your DeFi companion. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    const response = await mutateAsync({ agentId: data.agents[0].id, message: userMessage.content });

    console.log("response is", response);

    setIsLoading(false);

    const aiMessages: Message[] = [];

    for (let i = 0; i < response.length; i++) {
      const aiMessage: Message = {
        id: messages.length + i + 2,
        content: response[i].text,
        sender: "ai",
        timestamp: new Date(),
      };

      aiMessages.push(aiMessage);
    }
    setMessages((prev) => [...prev, ...aiMessages]);
  };

  return (
    <Card className="flex flex-col min-h-[96vh]">
      <ScrollArea className="flex-1 p-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender === "ai" ? "/mx.png" : "/user-avatar.png"} />
                  <AvatarFallback>{message.sender === "ai" ? "AI" : "U"}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg px-4 py-2 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className={`flex max-w-[80%] items-start gap-3`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={"/ai-avatar.png"} />
                <AvatarFallback>{"AI"}</AvatarFallback>
              </Avatar>
              <div className={`rounded-lg ${"bg-muted"}`}>
                <RotatingLines
                  visible={true}
                  width="30"
                  strokeWidth="5"
                  animationDuration="0.55"
                  ariaLabel="rotating-lines-loading"
                  strokeColor="#608BC1"
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input placeholder="Ask anything about DeFi..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
