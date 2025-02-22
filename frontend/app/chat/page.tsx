"use client";

import { Navbar } from "@/components/(ui)/navbar";
import { ChatInterface } from "@/components/chat/chat-interface";

const ChatPage = () => {
  return (
    <div className="w-full">
      <Navbar title="Chat" />
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
