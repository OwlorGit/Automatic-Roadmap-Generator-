"use client";

import React, { useState, useEffect } from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  resources: string[];
  x: number;
  y: number;
}

const MOCK_ROADMAP: Step[] = [
  { id: 1, title: "1. Camera Settings", description: "Master Shutter Speed, Aperture, and ISO.", resources: ["YouTube: Exposure Triangle Guide", "Article: Photography Basics 101"], x: 100, y: 150 },
  { id: 2, title: "2. Composition Rules", description: "Learn the Rule of Thirds and Leading Lines.", resources: ["Video: Framing and Composition", "PDF: Framing Cheat Sheet"], x: 450, y: 150 },
  { id: 3, title: "3. Lighting Fundamentals", description: "Understand golden hour vs. harsh midday sun.", resources: ["Course: Manipulating Natural Light"], x: 275, y: 350 },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState<Step[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("completed-steps");
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

const handleGenerate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  try {
    // 1. Fetch real structured JSON from our new Gemini endpoint
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

    // 2. Loop through the steps from Gemini and plot them onto our whiteboard coordinates
    const positionedSteps = data.steps.map((step: any, index: number) => ({
      ...step,
      x: 100 + (index * 320),       // Spaces cards apart cleanly from left to right
      y: index % 2 === 0 ? 200 : 380, // Alternates up and down for that sticky-note whiteboard look
    }));

    // 3. Clear old checked marks and load the new AI steps into view!
    setCompletedSteps([]);
    setRoadmap(positionedSteps);

  } catch (error) {
    console.error("Error communicating with AI backend:", error);
    alert("Something went wrong mapping this journey. Check your terminal logs!");
  }
};

  const toggleStep = (id: number) => {
    const updated = completedSteps.includes(id)
      ? completedSteps.filter((stepId) => stepId !== id)
      : [...completedSteps, id];
    
    setCompletedSteps(updated);
    localStorage.setItem("completed-steps", JSON.stringify(updated));
  };

  const progressPercentage = roadmap.length 
    ? Math.round((completedSteps.filter(id => roadmap.some(s => s.id === id)).length / roadmap.length) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen w-screen bg-zinc-50 overflow-hidden font-sans select-none">
      
      {/* BACKGROUND GRID */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#cbcbcb 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* TOP CONTROL BAR */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className="bg-white/80 backdrop-blur-md shadow-lg border border-zinc-200 rounded-2xl p-4 flex flex-col gap-3">
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              placeholder="What do you want to learn? (e.g. Photography)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button type="submit" className="bg-black text-white hover:bg-zinc-800 rounded-xl px-5 py-2 text-sm font-medium transition-colors">
              Generate
            </button>
          </form>

          {/* Progress Bar */}
          {roadmap.length > 0 && (
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-black h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-zinc-600 min-w-[35px] text-right">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>
      </header>

      {/* INFINITE CANVAS */}
      <main className="w-full h-screen relative z-10 p-24 overflow-auto">
        {roadmap.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center pt-24">
            <h2 className="text-2xl font-bold text-zinc-400">Your Infinite Canvas</h2>
            <p className="text-zinc-400 text-sm mt-1">Type a prompt above to lay out your path.</p>
          </div>
        ) : (
          <div className="relative w-full h-full min-w-[1000px] min-h-[600px]">
            {roadmap.map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  style={{ position: 'absolute', left: `${step.x}px`, top: `${step.y}px` }}
                  className="transition-transform duration-200 hover:scale-[1.02]"
                >
                  {/* Replaced Card Component with standard div */}
                  <div 
                    onClick={() => setSelectedStep(step)}
                    className={`w-64 p-4 shadow-md border rounded-xl cursor-pointer border-zinc-200 bg-white hover:border-black transition-colors ${isDone ? 'bg-zinc-50 border-zinc-300 opacity-75' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Replaced Checkbox Component with standard HTML input */}
                      <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                        <input 
                          type="checkbox"
                          checked={isDone} 
                          onChange={() => toggleStep(step.id)} 
                          className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${isDone ? 'line-through text-zinc-400' : 'text-black'}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* DETAILS POPUP MODAL */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStep(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-zinc-100 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Step Details</span>
              <h2 className="text-xl font-bold text-black mt-0.5">{selectedStep.title}</h2>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">{selectedStep.description}</p>
            
            <div className="border-t border-zinc-100 pt-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Curated Resources</h4>
              <ul className="flex flex-col gap-2">
                {selectedStep.resources.map((res, i) => (
                  <li key={i}>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-zinc-900 font-medium hover:underline flex items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      🌐 {res}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={() => setSelectedStep(null)} className="w-full mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl py-2 font-medium text-sm transition-colors">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}