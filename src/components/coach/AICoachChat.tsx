import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AICoachChat: React.FC = () => {
  const { chatMessages, sendMessageToCoach, isCoachLoading, userProfile, habits } = useApp();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Erstelle mein Workout für heute.',
    'Plane meine nächste Woche.',
    'Was kann ich heute verbessern?',
    'Erstelle einen ausgewogenen Ernährungsplan.',
    'Passe meinen Tagesplan an.',
    'Welche Erholung brauche ich heute?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isCoachLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isCoachLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessageToCoach(message);
  };

  const handleQuickPromptClick = async (promptText: string) => {
    if (isCoachLoading) return;
    await sendMessageToCoach(promptText);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Persönlicher KI-Begleiter
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Winter Arc AI Coach
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Grounded Coach für Workouts, Ernährung, Gewohnheiten und Regeneration.
          </p>
        </div>

        {/* User Context Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141B2A] border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kontext: {userProfile.name} • {userProfile.experience} • {userProfile.dailyTime} Min.</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="frost-card rounded-3xl border border-slate-800 flex flex-col h-[600px] shadow-2xl overflow-hidden relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#182131] border border-slate-700 text-white'
                      : 'bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] text-slate-950 shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed space-y-1 ${
                    isUser
                      ? 'bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-medium rounded-tr-none shadow-md shadow-[#66D9FF]/10'
                      : 'bg-[#182131] border border-slate-700/80 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-[10px] block text-right pt-1 font-mono ${
                      isUser ? 'text-slate-900/70' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isCoachLoading && (
            <div className="flex gap-3 max-w-xl mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] text-slate-950 flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#182131] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#66D9FF]" />
                <span>Coach denkt nach & gleicht dein Profil ab...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-[#0B0F19]/60 border-t border-slate-800/80 overflow-x-auto flex gap-2">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickPromptClick(p)}
              disabled={isCoachLoading}
              className="px-3 py-1.5 rounded-xl bg-[#141B2A] hover:bg-[#182131] border border-slate-800 hover:border-[#66D9FF]/40 text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-[#66D9FF]" />
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 md:p-4 bg-[#141B2A] border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Frag deinen Winter Arc Coach nach Tipps, Workouts oder Ernährung..."
            disabled={isCoachLoading}
            className="flex-1 bg-[#182131] border border-slate-700 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#66D9FF] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isCoachLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 hover:opacity-90 disabled:opacity-40 shadow-lg shadow-[#66D9FF]/20 transition-all"
            title="Senden"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-2xl bg-[#141B2A]/50 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Wichtiger Gesundheitshinweis:</strong> Der KI-Coach bietet Ratschläge für Fitness und Gewohnheiten. Er stellt keine medizinischen Diagnosen. Bei Schmerzen, Verletzungen oder Krankheit pausiere bitte das Training und konsultiere qualifiziertes medizinisches Fachpersonal.
        </p>
      </div>
    </div>
  );
};
