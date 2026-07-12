"use client";

import React, { useState, useEffect } from "react";
// 1. Import the icons you provided
import {
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  Dumbbell,
  Clock,
  Award,
} from "lucide-react";

// 2. Define the structural types you created
type Category = "foundation" | "core" | "advanced" | "project";
type ResourceType = "article" | "video" | "course" | "book" | "practice";

interface RoadmapCard {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: Category;
  resources: string[]; // Keeping strings to match your array definition cleanly
  prerequisites?: string[];
  x: number;
  y: number;
}

// Map configuration details to your Category object
const CATEGORY_META: Record<Category, { label: string; stripe: string; bg: string; text: string; border: string }> = {
  foundation: { label: "Foundation", stripe: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  core:       { label: "Core",       stripe: "#10b981", bg: "#f0fdf4", text: "#047857", border: "#bbf7d0" },
  advanced:   { label: "Advanced",   stripe: "#8b5cf6", bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  project:    { label: "Project",    stripe: "#f59e0b", bg: "#fffbeb", text: "#b45309", border: "#fef08a" },
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapCard[]>([]);
  const [totalDuration, setTotalDuration] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<RoadmapCard | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("completed-steps");
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "API Network response failed");
      }
      
      const data = await response.json();

      // Set global meta data if returned from backend, fallback if missing
      setTotalDuration(data.totalDuration || "Flexible");

      // Plottings cards with structural coordinates on the open whiteboard
      const nodes = data.nodes || data.steps || [];
      const positionedSteps = nodes.map((step: any, index: number) => ({
        ...step,
        // Enforcing fallback attributes if the AI fails to generate categories
        category: step.category || "foundation",
        duration: step.duration || "1-2 hours",
        x: 80 + (index * 260),       
        y: index % 2 === 0 ? 220 : 400, 
      }));

      setCompletedSteps([]);
      setRoadmap(positionedSteps);

    } catch (error: any) {
      console.error("Error communicating with AI backend:", error);
      alert(error.message || "Something went wrong mapping this journey.");
    }
  };

  const toggleStep = (id: number) => {
    const updated = completedSteps.includes(id)
      ? completedSteps.filter((stepId) => stepId !== id)
      : [...completedSteps, id];
    
    setCompletedSteps(updated);
    localStorage.setItem("completed-steps", JSON.stringify(updated));
  };

  // Helper utility function to match a standard icon to a text link
  const getResourceIcon = (resourceStr: string) => {
    const lower = resourceStr.toLowerCase();
    if (lower.includes("video") || lower.includes("youtube")) return <Video className="w-4 h-4 text-zinc-500" />;
    if (lower.includes("book")) return <BookOpen className="w-4 h-4 text-zinc-500" />;
    if (lower.includes("course") || lower.includes("udemy")) return <GraduationCap className="w-4 h-4 text-zinc-500" />;
    if (lower.includes("practice") || lower.includes("exercise")) return <Dumbbell className="w-4 h-4 text-zinc-500" />;
    return <FileText className="w-4 h-4 text-zinc-500" />;
  };

  const progressPercentage = roadmap.length 
    ? Math.round((completedSteps.filter(id => roadmap.some(s => s.id === id)).length / roadmap.length) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen w-screen bg-zinc-50 overflow-hidden font-sans select-none">
      
      {/* WHITEBOARD DOT BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#cbcbcb 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* CONTROL DASHBOARD PANEL */}
      <header className="absolute top-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className="bg-white/90 backdrop-blur-md shadow-xl border border-zinc-200 rounded-2xl p-4 flex flex-col gap-3">
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button type="submit" className="bg-black text-white hover:bg-zinc-800 rounded-xl px-5 py-2 text-sm font-medium transition-all shadow-sm">
              Generate
            </button>
          </form>

          {roadmap.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between text-xs font-semibold text-zinc-500 px-0.5">
                <span className="flex items-center gap-1">⏱️ Est. Time: {totalDuration}</span>
                <span>{progressPercentage}% Completed</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
                <div 
                  className="bg-black h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* INFINITE CANVAS SCENE */}
      <main className="w-full h-screen relative z-10 p-24 overflow-auto">
        {roadmap.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center pt-24">
            <h2 className="text-2xl font-bold text-zinc-400">Your Learning Board</h2>
            <p className="text-zinc-400 text-sm mt-1">Provide a goal above to auto-generate custom tracks.</p>
          </div>
        ) : (
          <div className="relative w-full h-full min-w-[1200px] min-h-[700px]">
            {roadmap.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const meta = CATEGORY_META[step.category] || CATEGORY_META.foundation;

              return (
                <div
                  key={step.id}
                  style={{ 
                    position: 'absolute', 
                    left: `${step.x}px`, 
                    top: `${step.y}px`,
                    width: `240px` // Clean default bounds matching your styling dimensions
                  }}
                  className="transition-all duration-200 hover:scale-[1.02]"
                >
                  {/* UPGRADED WHITEBOARD INTERACTIVE STICKY CARD */}
                  <div 
                    onClick={() => setSelectedStep(step)}
                    style={{ borderTopColor: meta.stripe }}
                    className={`p-4 shadow-sm border-t-4 border rounded-xl cursor-pointer bg-white transition-all duration-150 ${
                      isDone ? 'bg-zinc-50/80 border-zinc-200 opacity-60 shadow-none' : 'hover:shadow-md border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Interactive HTML Node Checkbox */}
                      <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                        <input 
                          type="checkbox"
                          checked={isDone} 
                          onChange={() => toggleStep(step.id)} 
                          className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer transition-transform active:scale-95"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Dynamic Category Tag Pill */}
                        <span 
                          style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }} 
                          className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border mb-2"
                        >
                          {meta.label}
                        </span>

                        <h3 className={`font-bold text-sm truncate ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {step.title}
                        </h3>

                        <div className="flex items-center gap-1 text-zinc-400 mt-2 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>{step.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* RICH VISUAL POPUP INTERACTIVE MODAL */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStep(null)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-zinc-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150" 
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between">
                <span 
                  style={{ 
                    backgroundColor: CATEGORY_META[selectedStep.category].bg, 
                    color: CATEGORY_META[selectedStep.category].text,
                    borderColor: CATEGORY_META[selectedStep.category].border
                  }} 
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                >
                  {CATEGORY_META[selectedStep.category].label} Track
                </span>
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedStep.duration}
                </span>
              </div>
              <h2 className="text-xl font-black text-zinc-900 mt-2">{selectedStep.title}</h2>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              {selectedStep.description}
            </p>

            {/* Display Prerequisites conditional block if returned by AI */}
            {selectedStep.prerequisites && selectedStep.prerequisites.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Prerequisites
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedStep.prerequisites.map((req, index) => (
                    <span key={index} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contextual Resource Curated Link Lists */}
            <div className="border-t border-zinc-100 pt-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Interactive Resources
              </h4>
              <ul className="flex flex-col gap-2">
                {selectedStep.resources.map((res, i) => (
                  <li key={i}>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-zinc-700 font-semibold hover:text-black flex items-center gap-2 p-2.5 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 rounded-xl transition-colors group"
                    >
                      <div className="p-1 bg-white rounded-md border border-zinc-200 shadow-sm group-hover:scale-105 transition-transform">
                        {getResourceIcon(res)}
                      </div>
                      <span className="truncate flex-1">{res}</span>
                      <span className="text-zinc-400 text-[10px] group-hover:translate-x-0.5 transition-transform">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={() => setSelectedStep(null)} className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-2.5 font-bold text-sm transition-colors shadow-sm">
              Done Reviewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}