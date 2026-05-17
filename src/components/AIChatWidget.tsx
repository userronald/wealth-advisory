import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, AlertTriangle, ShieldCheck, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEducationalResponse } from '@/lib/ai-assistant';
import { saveSchemeView } from '@/lib/storage';
import { useUserStore } from '@/store/useUserStore';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function AIChatWidget() {
  const currentUser = useUserStore(state => state.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${currentUser?.name || 'there'}! I am your Wealth Academy AI tutor. Ask me any personal finance question simply! (e.g., "What is SIP?", "What is PPF?", "Should I save first?", or "How to start saving?")`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!currentUser) return null; // Only available for onboarded users

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Save telemetry log for chatbot usage
    saveSchemeView('ai_chat_query_' + text.substring(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '_'), currentUser.id);

    // Simulated typing effect for premium UX
    setTimeout(() => {
      const responseText = generateEducationalResponse(text);
      const aiMsg: Message = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const suggestions = [
    "What is SIP?",
    "What is PPF?",
    "Should I save first?",
    "How to start saving?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            saveSchemeView('ai_chat_bubble_open', currentUser.id);
          }}
          className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-[#D4AF37] hover:from-emerald-600 hover:to-[#c59d2a] text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 relative cursor-pointer group"
          title="Ask AI Tutor"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          <MessageSquare className="h-6 w-6" />
          
          {/* Subtle Hover Tooltip */}
          <span className="absolute -top-10 right-0 bg-slate-950 border border-slate-800 text-[10px] font-black text-emerald-400 px-2.5 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            AI FINANCIAL TUTOR
          </span>
        </button>
      )}

      {/* Floating Chat Panel Drawer */}
      {isOpen && (
        <Card className="w-[380px] max-w-[calc(100vw-2rem)] h-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-300 rounded-2xl">
          {/* Header */}
          <CardHeader className="p-4 border-b border-slate-800 flex flex-row justify-between items-center bg-slate-950/40 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#D4AF37] animate-pulse" />
                <CardTitle className="text-sm font-extrabold text-white">Wealth Academy AI</CardTitle>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                <AlertTriangle className="h-2.5 w-2.5" />
                Educational Guidance Only
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </button>
          </CardHeader>

          {/* Messages Grid */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold leading-relaxed bg-slate-950/10">
            {messages.map((msg, index) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={index}
                  className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in zoom-in-95 duration-200`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                      isAI
                        ? 'bg-slate-900 border border-slate-800/80 text-slate-300'
                        : 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/5'
                    }`}
                  >
                    {msg.text.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Footer Area */}
          <CardFooter className="p-3 border-t border-slate-800 flex flex-col gap-3 bg-slate-950/40 shrink-0">
            {/* Quick Suggestions list */}
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-[9px] font-bold px-2 py-1 rounded bg-slate-800/60 hover:bg-emerald-500/10 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/20 text-slate-400 transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex gap-2 w-full"
            >
              <input
                type="text"
                placeholder="Ask me a personal finance question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 font-medium transition-all duration-300"
              />
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-auto px-3.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                disabled={!inputValue.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
