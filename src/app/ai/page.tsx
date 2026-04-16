"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
  isTyping?: boolean;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export default function AgentSihuPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm **Agent SIHU**, your intelligent assistant for the Lake Victoria Basin ecosystem. I can help you with environmental monitoring, news analysis, data visualization, and much more. What would you like to explore today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tools, setTools] = useState<Tool[]>([
    { id: 'search', name: 'Web Search', icon: 'search', description: 'Search the web for information', enabled: true },
    { id: 'analyze', name: 'Data Analysis', icon: 'analytics', description: 'Analyze environmental data', enabled: true },
    { id: 'visualize', name: 'Visualization', icon: 'show_chart', description: 'Create charts and graphs', enabled: true },
    { id: 'news', name: 'News Monitor', icon: 'newspaper', description: 'Monitor basin news and updates', enabled: true },
    { id: 'predict', name: 'Predictions', icon: 'psychology', description: 'AI-powered forecasting', enabled: false },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(inputValue, attachments),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string, files: File[]): string => {
    if (files.length > 0) {
      return `I received ${files.length} file(s): ${files.map(f => f.name).join(', ')}. Let me analyze this data for you. 

Based on the uploaded content, I can see some interesting patterns in the environmental data. Would you like me to:

• Generate a detailed analysis report
• Create visualizations of the key metrics
• Compare this data with historical trends
• Provide recommendations based on the findings`;
    }

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('health') || lowerQuery.includes('nile') || lowerQuery.includes('basin')) {
      return `**Nile Basin Health Analysis**

Current Status: **84.2%** (Good)
- Water Quality: **87%** - Stable with seasonal variations
- Biodiversity Index: **82%** - Recovery in delta regions
- Carbon Sequestration: **+12.4%** this quarter

**Key Insights:**
• Upper Nile regions showing improved vegetation cover
• Delta sediment management needs attention
• Community conservation efforts yielding results

Would you like me to dive deeper into any specific metric or region?`;
    }

    if (lowerQuery.includes('mining') || lowerQuery.includes('reward') || lowerQuery.includes('san')) {
      return `**Mining Rewards Dashboard**

🪙 **Claimable Balance:** 428.50 SAN
📊 **Proof of Stewardship:** Excellent (94%)
⏰ **Next Reward Cycle:** 2.3 hours

**Recent Activity:**
• +12.5 SAN from environmental monitoring
• +8.2 SAN from community reporting
• +15.0 SAN from data validation

**Available Actions:**
• Claim all rewards to wallet
• View detailed transaction history
• Set up automatic claiming

Ready to claim your rewards?`;
    }

    if (lowerQuery.includes('news') || lowerQuery.includes('update')) {
      return `**Latest Basin Intelligence**

📰 **Breaking:** New conservation initiative launched in Lake Victoria
- Partnership between 3 countries
- Focus on invasive species management
- Expected impact: 15% biodiversity improvement

🌊 **Water Quality Alert:** Minor contamination detected in Kagera tributary
- Source identified and contained
- No impact on drinking water supplies
- Monitoring increased for next 48 hours

📈 **Economic Update:** Carbon credit trading up 8.3%
- Demand from European markets driving prices
- Local communities benefiting from direct payments

Would you like me to expand on any of these stories?`;
    }

    return `I understand you're asking about: "${query}"

As Agent SIHU, I can help you with:
• **Environmental Monitoring** - Real-time basin health data
• **News & Intelligence** - Latest updates from the region
• **Data Analysis** - Process and visualize environmental data
• **Mining Rewards** - Track and claim your SAN tokens
• **Predictions** - AI-powered forecasting for basin conditions

What specific aspect would you like to explore? You can also upload files for analysis or use voice input if preferred.`;
  };

  const toggleTool = (toolId: string) => {
    setTools(prev => prev.map(tool =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  return (
    <div className="min-h-screen bg-on-background text-surface-container-lowest font-body antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-on-background/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(11,28,48,0.05)] px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full bg-slate-800/70 text-slate-200 hover:bg-slate-700 transition-colors"
            aria-label="Open agent navigation"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Image src="/images/logo-main.png" alt="SIHU Logo" width={140} height={40} className="object-contain" />
          <h1 className="text-lg md:text-xl font-extrabold text-sky-300 font-headline tracking-tight">Agent SIHU</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-6">
            <a className="text-slate-400 hover:text-sky-300 transition-colors font-headline text-sm font-bold uppercase tracking-wider" href="/">Home</a>
            <a className="text-slate-400 hover:text-sky-300 transition-colors font-headline text-sm font-bold uppercase tracking-wider" href="/portal">News</a>
            <a className="text-sky-400 transition-colors font-headline text-sm font-bold uppercase tracking-wider" href="/ai">Agent SIHU</a>
            <a className="text-slate-400 hover:text-sky-300 transition-colors font-headline text-sm font-bold uppercase tracking-wider" href="/dapp">DApp</a>
          </div>
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
          <button className="hidden md:block material-symbols-outlined text-slate-400 hover:bg-sky-900/30 p-2 rounded-full transition-colors active:scale-95">settings_ethernet</button>
        </div>
      </header>

      {/* Agent SIHU Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-slate-950/95 border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <p className="text-slate-300 uppercase tracking-[0.3em] text-xs">Agent SIHU</p>
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { label: 'Projects', icon: 'folder_open' },
            { label: 'Artifacts', icon: 'inventory_2' },
            { label: 'Chats', icon: 'chat' },
            { label: 'Customize', icon: 'tune' },
            { label: 'Imagine', icon: 'auto_fix_high' },
            { label: 'Voice', icon: 'voice_chat' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 text-slate-200 hover:bg-slate-800/90 transition-colors"
              onClick={() => {
                setSidebarOpen(false);
                console.log(`${item.label} clicked`);
              }}
            >
              <span className="material-symbols-outlined text-sky-300">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 glass-premium p-6 rounded-2xl shadow-2xl animate-fade-in z-50 border border-white/20">
          <div className="flex flex-col gap-6 font-bold text-center text-slate-900 dark:text-white uppercase tracking-widest text-sm">
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Home</a>
            <a href="/portal" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">News</a>
            <a href="/ai" onClick={() => setMobileMenuOpen(false)} className="text-primary">Agent SIHU</a>
            <a href="/dapp" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">DApp</a>
          </div>
        </div>
      )}

      <main className="pt-20 md:pt-24 pb-40 md:pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-extrabold text-white mb-2 tracking-tighter">Agent SIHU</h2>
          <div className="flex items-center gap-2 text-sky-400/80 font-medium">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-sm md:text-base">Environmental Intelligence Protocol Active</span>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  tool.enabled
                    ? 'bg-sky-600/20 border border-sky-400/30 text-sky-300'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-grow flex flex-col bg-slate-900/30 rounded-2xl border border-white/5 overflow-hidden">
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-lg md:text-xl">smart_toy</span>
                  </div>
                )}
                <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.attachments.map((file, index) => (
                        <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">attach_file</span>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={`rounded-2xl p-4 text-sm md:text-base ${
                    message.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800/50 text-slate-100 border border-white/5'
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                  <span className="text-xs text-slate-500">
                    {mounted ? message.timestamp.toLocaleTimeString() : '\u00A0'}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-white text-lg md:text-xl">smart_toy</span>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-slate-400 text-sm">Agent SIHU is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-4 md:px-6 pb-4 border-t border-white/5">
              <div className="flex flex-wrap gap-2 mt-4">
                {attachments.map((file, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">attach_file</span>
                    {file.name}
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-slate-500 hover:text-red-400 ml-1"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-white/5">
            <div className="flex items-end gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-sky-300 transition-colors rounded-full hover:bg-white/5"
                title="Upload files"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
              />

              <div className="flex-grow relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask Agent SIHU anything about the ecosystem..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
                  rows={1}
                />
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-sky-300 hover:bg-white/5'
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                <span className="material-symbols-outlined">
                  {isRecording ? 'stop' : 'mic'}
                </span>
              </button>

              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() && attachments.length === 0}
                className="bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all active:scale-90 shadow-lg shadow-primary/20"
                title="Send message"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setInputValue("What's the current Nile Basin health status?")}
                className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-full text-xs font-bold text-sky-200 transition-colors"
              >
                Basin Health
              </button>
              <button
                onClick={() => setInputValue("Show me my mining rewards")}
                className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-full text-xs font-bold text-sky-200 transition-colors"
              >
                Mining Rewards
              </button>
              <button
                onClick={() => setInputValue("Latest news and updates")}
                className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-full text-xs font-bold text-sky-200 transition-colors"
              >
                Latest News
              </button>
              <button
                onClick={() => setInputValue("Analyze environmental data")}
                className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-full text-xs font-bold text-sky-200 transition-colors"
              >
                Data Analysis
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-on-background/80 backdrop-blur-xl z-50 rounded-t-[2rem]">
        <a className="flex flex-col items-center justify-center text-slate-500 px-5 py-2.5" href="/">
          <span className="material-symbols-outlined">home</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 px-5 py-2.5" href="/portal">
          <span className="material-symbols-outlined">newspaper</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">News</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-sky-900/40 text-sky-200 rounded-2xl px-5 py-2.5" href="/ai">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Agent SIHU</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 px-5 py-2.5" href="/dapp">
          <span className="material-symbols-outlined">dashboard_customize</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">DApp</span>
        </a>
      </nav>
    </div>
  );
}