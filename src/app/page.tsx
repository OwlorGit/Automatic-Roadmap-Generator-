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

// Imported form styles
import { UI_THEME, CATEGORY_META, type Category } from "../styles/theme";

interface RoadmapCard {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: Category;
  resources: string[]; 
  prerequisites?: string[];
  level?: number;
  dependsOn?: number[];
  x: number;
  y: number;
}

const getCategoryLevel = (category: string) => {
  const normalized = category?.toLowerCase() || "foundation";

  if (normalized === "core") return 1;
  if (normalized === "advanced") return 2;
  if (normalized === "project") return 3;
  return 0;
};

const normalizeRoadmap = (nodes: any[]) => {
  const normalized = nodes.map((node, index) => ({
    ...node,
    id: typeof node.id === "number" ? node.id : index + 1,
    level: Number.isFinite(Number(node.level)) ? Number(node.level) : undefined,
    dependsOn: Array.isArray(node.dependsOn)
      ? node.dependsOn.filter((value: any) => Number.isFinite(Number(value))).map((value: any) => Number(value))
      : [],
    prerequisites: Array.isArray(node.prerequisites)
      ? node.prerequisites.filter((value: any) => typeof value === "string" && value.trim())
      : [],
    category: typeof node.category === "string" ? node.category : "foundation",
  }));

  const nodesById = new Map(normalized.map((node) => [node.id, node]));
  const levelById = new Map<number, number>();

  const resolveLevel = (node: any): number => {
    if (levelById.has(node.id)) {
      return levelById.get(node.id)!;
    }

    const explicitLevel = Number.isFinite(Number(node.level)) ? Number(node.level) : null;
    const parentIds = (node.dependsOn || []).filter((id: number) => nodesById.has(id));

    if (parentIds.length > 0) {
      const parentLevels = parentIds.map((id: number) => resolveLevel(nodesById.get(id)!));
      const derivedLevel = Math.max(...parentLevels.map((value: number) => value + 1));
      const resolvedLevel = explicitLevel === null ? derivedLevel : Math.max(explicitLevel, derivedLevel);
      levelById.set(node.id, resolvedLevel);
      return resolvedLevel;
    }

    const fallbackLevel = explicitLevel ?? getCategoryLevel(node.category);
    levelById.set(node.id, fallbackLevel);
    return fallbackLevel;
  };

  normalized.forEach((node) => {
    node.level = resolveLevel(node);
  });

  return normalized;
};

const buildLayout = (nodes: any[]) => {
  const byLevel = new Map<number, any[]>();

  nodes.forEach((node) => {
    const level = typeof node.level === "number" ? node.level : 0;
    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level)!.push(node);
  });

  return nodes.map((node) => {
    const level = typeof node.level === "number" ? node.level : 0;
    const siblings = byLevel.get(level) || [];
    const index = siblings.findIndex((item) => item.id === node.id);

    return {
      ...node,
      category: node.category || "foundation",
      duration: node.duration || "1-2 hours",
      x: 140 + level * 340,
      y: 180 + index * 190,
    };
  });
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapCard[]>([]);
  const [totalDuration, setTotalDuration] = useState("");
  const [rawRoadmapResponse, setRawRoadmapResponse] = useState("");
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
      setRawRoadmapResponse(JSON.stringify(data, null, 2));

      const nodes = data.nodes || data.steps || [];
      const normalizedNodes = normalizeRoadmap(nodes);
      const positionedSteps = buildLayout(normalizedNodes);

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
    <div className={`relative min-h-screen w-screen overflow-hidden font-sans select-none ${UI_THEME.background.screen} ${UI_THEME.modal.container}`}>
      
      {/* Background Grid */}
      <div 
        className={`absolute inset-0 z-0 pointer-events-none ${UI_THEME.background.gridOpacity}`} 
        style={{
          backgroundImage: UI_THEME.background.gridPattern,
          backgroundSize: "24px 24px"
        }}
      />

      {/* CONTROL DASHBOARD PANEL */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className={`backdrop-blur-md shadow-2xl border rounded-2xl p-4 flex flex-col gap-3 ${UI_THEME.header.panelBg} ${UI_THEME.header.panelBorder}`}>
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none text-sm placeholder-zinc-500 transition-colors ${UI_THEME.header.inputBg} ${UI_THEME.header.inputBorder}`}
            />
            <button type="submit" className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow-sm ${UI_THEME.header.buttonBg}`}>
              Generate
            </button>
          </form>

          {/* Progress Bar */}
          <div className={`w-full h-1.5 rounded-full overflow-hidden border ${UI_THEME.header.progressTrack}`}>
            <div 
              className={`h-full transition-all duration-500 ease-out ${UI_THEME.header.progressBar}`} 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {rawRoadmapResponse && (
            <details className="rounded-xl border border-white/10 bg-black/20 p-2">
              <summary className="cursor-pointer text-[11px] uppercase tracking-wide text-zinc-400">
                Gemini response preview
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[10px] leading-relaxed text-zinc-300">
                {rawRoadmapResponse}
              </pre>
            </details>
          )}
        </div>
      </header>

      {/* INFINITE CANVAS SCENE */}
      <main className="w-full h-screen relative z-10 p-24 overflow-auto">
        {roadmap.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center pt-24">
            <h2 className={`text-xl font-medium ${UI_THEME.canvas.emptyTitle}`}>Your Learning Board</h2>
            <p className={`text-sm mt-1 ${UI_THEME.canvas.emptySub}`}>Provide a goal above to auto-generate custom tracks.</p>
          </div>
        ) : (
          <div className="relative w-full h-full min-w-[2500px] min-h-[900px]">
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
                  {/* CARD TEMPLATE */}
                  <div 
                    onClick={() => setSelectedStep(step)}
                    style={{ borderTopColor: meta.stripe }}
                    className={`p-4 shadow-xl border-t-2 border rounded-xl cursor-pointer backdrop-blur-sm transition-all duration-150 ${UI_THEME.canvas.cardBg} ${
                      isDone ? UI_THEME.canvas.cardCompleted : UI_THEME.canvas.cardBorder
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                        <input 
                          type="checkbox"
                          checked={isDone} 
                          onChange={() => toggleStep(step.id)} 
                          className={`h-4 w-4 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer transition-transform active:scale-95 ${UI_THEME.canvas.checkbox}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span 
                          style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }} 
                          className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border mb-2"
                        >
                          {meta.label}
                        </span>

                        <h3 className={`font-medium text-sm truncate ${isDone ? UI_THEME.canvas.titleCompleted : UI_THEME.canvas.title}`}>
                          {step.title}
                        </h3>

                        <div className={`flex items-center gap-1 mt-2 text-[11px] ${UI_THEME.canvas.durationText}`}>
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

      {/* INTERACTIVE MODAL */}
      {selectedStep && (
        <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${UI_THEME.modal.overlay}`} onClick={() => setSelectedStep(null)}>
          <div 
            className={`rounded-2xl max-w-md w-full shadow-2xl p-6 border flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 ${UI_THEME.modal.container}`} 
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
                <span className={`text-xs font-medium flex items-center gap-1 ${UI_THEME.modal.metaText}`}>
                  <Clock className={`w-3.5 h-3.5 ${UI_THEME.modal.clockIcon}`} /> {selectedStep.duration}
                </span>
              </div>
              <h2 className={`text-lg font-bold mt-2.5 ${UI_THEME.modal.title}`}>{selectedStep.title}</h2>
            </div>

            <p className={`text-sm leading-relaxed p-3 rounded-xl border ${UI_THEME.modal.descBox}`}>
              {selectedStep.description}
            </p>

            {selectedStep.prerequisites && selectedStep.prerequisites.length > 0 && (
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1 ${UI_THEME.modal.headerLabel}`}>
                  <Award className="w-3.5 h-3.5" /> Prerequisites
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedStep.prerequisites.map((req, index) => (
                    <span key={index} className={`text-xs px-2 py-0.5 rounded-md border ${UI_THEME.modal.pillBg}`}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`border-t pt-3 ${UI_THEME.modal.divider}`}>
              <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1 ${UI_THEME.modal.headerLabel}`}>
                <BookOpen className="w-3.5 h-3.5" /> Interactive Resources
              </h4>
              <ul className="flex flex-col gap-2">
                {selectedStep.resources.map((res, i) => (
                  <li key={i}>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`text-xs font-medium flex items-center gap-2 p-2.5 rounded-xl transition-colors group border ${UI_THEME.modal.resourceLink}`}
                    >
                      <div className={`p-1 border rounded-md ${UI_THEME.modal.resourceIconBox}`}>
                        {getResourceIcon(res)}
                      </div>
                      <span className="truncate flex-1">{res}</span>
                      <span className={`text-[10px] group-hover:translate-x-0.5 transition-transform ${UI_THEME.modal.arrowIcon}`}>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={() => setSelectedStep(null)} className={`w-full mt-2 rounded-xl py-2.5 font-medium text-sm transition-colors border ${UI_THEME.modal.closeBtn}`}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}