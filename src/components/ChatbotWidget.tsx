"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import OpenAI from "openai";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hi! I'm your LearnHub Assistant. How can I help you with your learning journey today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add User Message
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY;
      if (!apiKey) {
        throw new Error("Missing NVIDIA API Key in environment variables.");
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "You are a helpful LMS learning assistant for LearnHub. Help users find courses, understand tech topics, track their learning, and suggest what to study next. Keep answers concise." },
          { role: "user", content: userMsg }
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 512,
      });

      const assistMsg = response.choices[0]?.message?.content || "I'm sorry, I couldn't formulate a response.";
      
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: assistMsg.trim() }]);
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      const errStatus = error?.status;
      
      console.error(`\n[AI Chatbot Client Error] Context: Failed to connect to NVIDIA NIM API. Status: ${errStatus || 'Unknown'} | Details: ${errMsg}`);
      
      let userFacingError = "Sorry, I'm having trouble connecting to the AI model right now. Please try again later.";
      
      if (errStatus === 401 || errMsg.includes("401") || errMsg.includes("Missing NVIDIA API Key")) {
        userFacingError = "Authentication Error: This feature requires a valid NVIDIA API Key. Please ensure your .env.local is configured correctly.";
        console.error("-> Specific Failure: Authentication Error. The API key may be invalid, expired, or improperly scoped.");
      } else if (errStatus === 429 || errMsg.includes("429")) {
        userFacingError = "Rate Limit Exceeded: We are receiving too many requests right now. Please wait a moment and try again.";
        console.error("-> Specific Failure: Rate Limit Exceeded. Triggered NVIDIA NIM quota limits.");
      } else if (errStatus >= 500) {
        userFacingError = "Server Error: The NVIDIA AI endpoint is currently experiencing issues. Please try again later.";
        console.error("-> Specific Failure: NVIDIA Server Error. Endpoint is down or struggling.");
      } else if (errMsg.includes('model')) {
        userFacingError = "Configuration Error: The requested AI model is currently unavailable.";
        console.error("-> Specific Failure: Model Not Found. 'meta/llama-3.1-8b-instruct' may be unavailable.");
      }
      
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: userFacingError }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl bg-blue-500 text-white hover:bg-blue-600 transition-colors ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] bg-card border border-border flex flex-col shadow-2xl rounded-3xl overflow-hidden max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-semibold tracking-wide">LearnHub Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div 
                    className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-background border border-border rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-background border border-border rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-muted px-4 py-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all border border-transparent focus:border-blue-500/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 bg-blue-500 text-white rounded-xl disabled:opacity-50 hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
