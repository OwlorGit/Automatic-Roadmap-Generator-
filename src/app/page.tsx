"use client";

import React, { useState, useEffect } from "react";
import { UI_THEME } from "../styles/theme";
import { type RoadmapCard } from "./types";
import { normalizeRoadmap, buildLayout } from "./utils";
import { RoadmapHeader } from "./RoadmapHeader";
import { RoadmapCanvas } from "./RoadmapCanvas";
import { StepModal } from "./StepModal";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapCard[]>([]);
  const [totalDuration, setTotalDuration] = useState("");
  const [rawRoadmapResponse, setRawRoadmapResponse] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<RoadmapCard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("completed-steps");
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setSelectedStep(null);

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
      setRawRoadmapResponse(JSON.stringify(data, null, 2));

      const nodes = data.nodes || data.steps || [];
      const positionedSteps = buildLayout(normalizeRoadmap(nodes));

      setCompletedSteps([]);
      setRoadmap(positionedSteps);
    } catch (error: any) {
      console.error("Error communicating with AI backend:", error);
      alert(error.message || "Something went wrong mapping this journey.");
    } finally {
      setIsGenerating(false);
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
    <div className={`relative min-h-screen w-screen overflow-hidden font-sans select-none ${UI_THEME.background.screen} ${UI_THEME.modal.container}`}>
      <div className={`absolute inset-0 z-0 pointer-events-none ${UI_THEME.background.gridOpacity}`} style={{ backgroundImage: UI_THEME.background.gridPattern, backgroundSize: "24px 24px" }} />

      <RoadmapHeader 
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        progressPercentage={progressPercentage}
        rawRoadmapResponse={rawRoadmapResponse}
      />

      {isGenerating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`rounded-2xl border p-8 shadow-2xl text-center ${UI_THEME.modal.container}`}>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-600 border-t-white" />
            <h2 className={`text-lg font-semibold ${UI_THEME.modal.title}`}>Generating your roadmap...</h2>
            <p className={`mt-2 text-sm ${UI_THEME.modal.descBox}`}>This usually takes a few seconds...</p>
          </div>
        </div>
      )}

      <main className="w-full h-screen relative z-10 p-24 overflow-auto">
        <RoadmapCanvas 
          roadmap={roadmap}
          completedSteps={completedSteps}
          onToggleStep={toggleStep}
          onSelectStep={setSelectedStep}
        />
      </main>

      <StepModal step={selectedStep} onClose={() => setSelectedStep(null)} />
    </div>
  );
}