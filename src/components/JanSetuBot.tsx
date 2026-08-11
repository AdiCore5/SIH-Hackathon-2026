import React, { useState, useRef, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  cta?: { label: string; action: string; value?: string };
}

interface JanSetuBotProps {
  lang: Language;
  onNavigate: (tab: string, arg?: string) => void;
}

export const JanSetuBot: React.FC<JanSetuBotProps> = ({ lang, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Namaste! 🙏 I'm JanSetu AI. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Trigger typing indicator
    setIsTyping(true);

    try {
      // Find context if there's any preselected grievance ID in chat
      const chatResponse = await api.sendChat(messageText);
      
      // Delay response slightly for natural feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const aiMsg: ChatMessage = { sender: 'ai', text: chatResponse.reply };
      
      // Map intent data to CTAs
      if (chatResponse.intent === 'lodge_grievance') {
        aiMsg.cta = { label: "Lodge Grievance", action: "lodge" };
      } else if (chatResponse.intent === 'track_grievance' && chatResponse.data?.id) {
        aiMsg.cta = { label: "Track Timeline", action: "track", value: chatResponse.data.id };
      } else if (chatResponse.intent === 'department_routing' && chatResponse.data?.dept_id) {
        aiMsg.cta = { label: "File Complaint Now", action: "lodge" };
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', text: "I apologize, but I am facing a minor connection issue. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCtaClick = (cta: { action: string; value?: string }) => {
    setIsOpen(false);
    if (cta.action === 'lodge') {
      onNavigate('lodge');
    } else if (cta.action === 'track') {
      onNavigate('track', cta.value);
    }
  };

  const quickQuestions = [
    "How do I lodge a complaint?",
    "Track complaint JS-2026-001245",
    "Which department handles water issues?",
    "My complaint is delayed"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. CHAT WINDOW PANEL */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-80 md:w-96 h-[480px] shadow-premium flex flex-col overflow-hidden mb-4 transition-all scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Sparkles size={16} />
              </div>
              <div>
                <h5 className="font-extrabold text-xs">JanSetu AI</h5>
                <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Online Assistant
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/60">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-slate-850 text-slate-100 rounded-tl-none border border-slate-800'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* CTA button inside bubble */}
                  {msg.cta && (
                    <button
                      onClick={() => handleCtaClick(msg.cta!)}
                      className="mt-3 bg-white text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[10px] hover:bg-slate-100 transition-all w-fit block"
                    >
                      {msg.cta.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 bg-slate-850 border border-slate-800 px-3 py-2.5 rounded-xl rounded-tl-none text-[10px] text-slate-400 w-fit">
                <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 font-semibold">JanSetu is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions block (visible when no input) */}
          {inputText === '' && (
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full text-[9px] font-semibold tracking-wide shrink-0 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or enter Grievance ID..."
              className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl transition-all"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

      {/* 2. CHAT TRIGGER BUTTON */}
      <button
        id="jansetu-bot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-indigo-800 text-white flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all relative group"
        title="JanSetu AI Chatbot"
      >
        <MessageSquare size={24} />
        {/* Floating tooltip */}
        <span className="absolute right-16 bg-slate-900 border border-slate-800 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-xl shadow-glass opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap">
          Talk to JanSetu AI 💬
        </span>
      </button>

    </div>
  );
};
