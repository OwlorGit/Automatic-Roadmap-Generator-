"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  Dumbbell,
  Clock,
  Award,
} from "lucide-react";

type Category = "foundation" | "core" | "advanced" | "project";
type ResourceType = "article" | "video" | "course" | "book" | "practice";

interface RoadmapCard {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: Category;
  resources: string[]; 
  prerequisites?: string[];
  x: number;
  y: number;
}

// Minimal, muted neon borders and backgrounds optimized for a true dark theme
const CATEGORY_META: Record<Category, { label: string; stripe: string; bg: string; text: string; border: string }> = {
  foundation: { label: "Foundation", stripe: "#38bdf8", bg: "rgba(56, 189, 248, 0.06)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.2)" },
  core:       { label: "Core",       stripe: "#34d399", bg: "rgba(52, 211, 153, 0.06)", text: "#34d399", border: "rgba(52, 211, 153, 0.2)" },
  advanced:   { label: "Advanced",   stripe: "#a78bfa", bg: "rgba(167, 139, 250, 0.06)", text: "#a78bfa", border: "rgba(167, 139, 250, 0.2)" },
  project:    { label: "Project",    stripe: "#fbbf24", bg: "rgba(251, 191, 36, 0.06)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.2)" },
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

      setTotalDuration(data.totalDuration || "Flexible");

      const nodes = data.nodes || data.steps || [];
      const positionedSteps = nodes.map((step: any, index: number) => ({
        ...step,
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

  const getResourceIcon = (resourceStr: string) => {
    const lower = resourceStr.toLowerCase();
    if (lower.includes("video") || lower.includes("youtube")) return <Video className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("book")) return <BookOpen className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("course") || lower.includes("udemy")) return <GraduationCap className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("practice") || lower.includes("exercise")) return <Dumbbell className="w-4 h-4 text-zinc-400" />;
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  const progressPercentage = roadmap.length 
    ? Math.round((completedSteps.filter(id => roadmap.some(s => s.id === id)).length / roadmap.length) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen w-screen bg-zinc-950 overflow-hidden font-sans select-none text-zinc-100">
      
      {/* Background Grid - Darkened opacity for less distraction */}
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* CONTROL DASHBOARD PANEL */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className="bg-zinc-900/80 backdrop-blur-md shadow-2xl border border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-3">
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 text-sm text-zinc-100 placeholder-zinc-500 transition-colors"
            />
            <button type="submit" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow-sm">
              Generate
            </button>
          </form>

          {/* Progress Bar Track Adaptations */}
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="bg-zinc-100 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* INFINITE CANVAS SCENE */}
      <main className="w-full h-screen relative z-10 p-24 overflow-auto">
        {roadmap.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center pt-24">
            <h2 className="text-xl font-medium text-zinc-400">Your Learning Board</h2>
            <p className="text-zinc-600 text-sm mt-1">Provide a goal above to auto-generate custom tracks.</p>
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
                    width: `240px`
                  }}
                  className="transition-all duration-200 hover:scale-[1.01]"
                >
                  {/* DARK THEME STICKY CARD */}
                  <div 
                    onClick={() => setSelectedStep(step)}
                    style={{ borderTopColor: meta.stripe }}
                    className={`p-4 shadow-xl border-t-2 border rounded-xl cursor-pointer bg-zinc-900/90 backdrop-blur-sm transition-all duration-150 ${
                      isDone ? 'border-zinc-900/50 opacity-25 shadow-none' : 'hover:border-zinc-700 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Interactive HTML Node Checkbox */}
                      <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                        <input 
                          type="checkbox"
                          checked={isDone} 
                          onChange={() => toggleStep(step.id)} 
                          className="h-4 w-4 bg-zinc-950 rounded border-zinc-800 text-zinc-100 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-transform active:scale-95"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Dynamic Category Tag Pill */}
                        <span 
                          style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }} 
                          className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border mb-2"
                        >
                          {meta.label}
                        </span>

                        <h3 className={`font-medium text-sm truncate ${isDone ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                          {step.title}
                        </h3>

                        <div className="flex items-center gap-1 text-zinc-500 mt-2 text-[11px]">
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
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStep(null)}>
          <div 
            className="bg-zinc-900 rounded-2xl max-w-md w-full shadow-2xl p-6 border border-zinc-800 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-zinc-100" 
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
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-md border uppercase tracking-wider"
                >
                  {CATEGORY_META[selectedStep.category].label} Track
                </span>
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> {selectedStep.duration}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 mt-2.5">{selectedStep.title}</h2>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
              {selectedStep.description}
            </p>

            {/* Display Prerequisites conditional block if returned by AI */}
            {selectedStep.prerequisites && selectedStep.prerequisites.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Prerequisites
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedStep.prerequisites.map((req, index) => (
                    <span key={index} className="text-xs bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contextual Resource Curated Link Lists */}
            <div className="border-t border-zinc-800 pt-3">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Interactive Resources
              </h4>
              <ul className="flex flex-col gap-2">
                {selectedStep.resources.map((res, i) => (
                  <li key={i}>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-zinc-300 font-medium hover:text-zinc-100 flex items-center gap-2 p-2.5 bg-zinc-950 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl transition-colors group"
                    >
                      <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-md">
                        {getResourceIcon(res)}
                      </div>
                      <span className="truncate flex-1">{res}</span>
                      <span className="text-zinc-600 text-[10px] group-hover:translate-x-0.5 transition-transform">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={() => setSelectedStep(null)} className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl py-2.5 font-medium text-sm transition-colors border border-zinc-700/50">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}