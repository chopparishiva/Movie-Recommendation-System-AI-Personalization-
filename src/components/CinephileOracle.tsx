import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Film, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { Movie, Rating } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface CinephileOracleProps {
  userRatings: (Movie & { rating: number })[];
  topRecommendations: any[];
  hybridWeight: number;
}

const CINEMATIC_QUOTES = [
  "Decomposing rating vectors into latent features...",
  "Measuring cosine dimensions across genre spaces...",
  "Consulting Godard, Kubrick, and Scorsese...",
  "Calculating matrix factorization bias weights...",
  "Formulating personalized cinematic experiences..."
];

export default function CinephileOracle({
  userRatings,
  topRecommendations,
  hybridWeight
}: CinephileOracleProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Greetings, film traveler. I am **The Cinephile Oracle**. I have analyzed your rating behaviors and the collaborative SVD models. Ask me anything about your custom recommendations, request double-feature pairings, or seek advice on your genre affinities!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(CINEMATIC_QUOTES[0]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Rotate loading thoughts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % CINEMATIC_QUOTES.length;
        setLoadingMsg(CINEMATIC_QUOTES[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userRatings,
          topRecommendations,
          message: text,
          chatHistory: messages,
          hybridWeight
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with the server.");
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected network error occurred.");
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("key")) {
        setIsConfigError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const PRESET_PROMPTS = [
    { label: "Explain My Recs", prompt: "Can you analyze my current recommendations list? Tell me why these top movies fit my profile, and explain the mathematical difference between my SVD results and Genre matching results." },
    { label: "Themed Double-Feature", prompt: "Recommend an ideal themed double-feature from my recommendations, and describe the common cinematic threads between them." },
    { label: "My Film Personality", prompt: "Looking at my ratings, how would you describe my cinematic personality? What genre gaps do I currently have?" }
  ];

  return (
    <div id="cinephile-oracle-panel" className="flex flex-col h-[680px] rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md overflow-hidden shadow-lg shadow-black/40">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-2xl bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
              The Cinephile Oracle
            </h3>
            <p className="text-[10px] font-mono text-neutral-500">AI Personalization Critic</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          Gemini 3.5 Active
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border text-xs ${
              msg.role === "user" 
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" 
                : "bg-neutral-800 border-neutral-700 text-neutral-300"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-600 text-white font-semibold rounded-tr-none shadow-md shadow-indigo-950/20"
                : "bg-neutral-950/80 border border-neutral-800 text-neutral-300 rounded-tl-none prose prose-invert max-w-none"
            }`}>
              {/* Parse simple markdown headers and boldings */}
              <div className="whitespace-pre-wrap">
                {msg.text.split("\n").map((para, pIdx) => {
                  let rendered = para;
                  
                  // Simple bullet point handling
                  const isBullet = para.trim().startsWith("-") || para.trim().startsWith("*");
                  const content = isBullet ? para.trim().substring(1).trim() : para;

                  // Simple bold parsing (**text**)
                  const parts = content.split(/\*\*(.*?)\*\*/g);
                  const parsedElements = parts.map((part, partIdx) => {
                    if (partIdx % 2 === 1) {
                      return <strong key={partIdx} className="font-semibold text-indigo-400">{part}</strong>;
                    }
                    return part;
                  });

                  if (isBullet) {
                    return (
                      <ul key={pIdx} className="list-disc pl-4 my-1">
                        <li>{parsedElements}</li>
                      </ul>
                    );
                  }

                  return (
                    <p key={pIdx} className={para.trim().startsWith("#") ? "font-bold text-neutral-100 text-sm mt-2 mb-1" : "my-1.5"}>
                      {parsedElements}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 animate-spin">
              <Loader2 className="h-4 w-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-neutral-950/40 border border-neutral-800 text-[11px] font-mono text-neutral-400 animate-pulse">
              {loadingMsg}
            </div>
          </div>
        )}

        {apiError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-xs text-rose-400 flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold text-rose-200">Consultation Failed</p>
              <p className="mt-1 leading-relaxed">{apiError}</p>
              {isConfigError && (
                <div className="mt-3 rounded-lg bg-neutral-950 p-2.5 border border-neutral-800 text-[10px] text-neutral-400 leading-normal">
                  <p className="font-bold text-neutral-300">How to fix:</p>
                  <ol className="list-decimal pl-4 mt-1 space-y-1">
                    <li>Open the **Settings** menu at the top right of AI Studio.</li>
                    <li>Click **Secrets**.</li>
                    <li>Ensure **GEMINI_API_KEY** is added with your actual API key.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Action Chips */}
      <div className="px-5 py-2.5 border-t border-neutral-800/60 bg-neutral-950/10 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
        {PRESET_PROMPTS.map((chip, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(chip.prompt)}
            className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 hover:border-indigo-500/30 hover:bg-indigo-500/5 px-3 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-indigo-300 transition-all shrink-0 whitespace-nowrap disabled:opacity-50"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about movie metrics, genre balance, or director themes..."
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-neutral-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-950/30 transition-all active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:shadow-none"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
