import React from "react";
import { Clock } from "lucide-react";
import { UI_THEME, CATEGORY_META } from "../styles/theme";
import { type RoadmapCard } from "./types";

interface RoadmapCanvasProps {
  roadmap: RoadmapCard[];
  completedSteps: number[];
  onToggleStep: (id: number) => void;
  onSelectStep: (step: RoadmapCard) => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  roadmap,
  completedSteps,
  onToggleStep,
  onSelectStep,
}) => {
  if (roadmap.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center pt-24">
        <h2 className={`text-xl font-medium ${UI_THEME.canvas.emptyTitle}`}>SideQuest</h2>
        <p className={`text-sm mt-1 ${UI_THEME.canvas.emptySub}`}>Provide a goal above to auto-generate custom tracks.</p>
      </div>
    );
  }

  const maxLevel = Math.max(...roadmap.map((r) => r.level ?? 0));
  const dynamicHeight = Math.max(720, (maxLevel + 1) * 220 + 300);

  return (
    <div className="relative flex h-full w-full justify-center pt-24">
      <div className="relative" style={{ width: "1400px", height: `${dynamicHeight}px`, margin: "0 auto" }}>
        
        {/* SVG Bezier Curves */}
        <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <defs>
            <marker id="roadmap-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.45)" />
            </marker>
          </defs>
          {roadmap.map((step) => {
            const parentStep = roadmap.find((candidate) => step.dependsOn?.includes(candidate.id));
            if (!parentStep) return null;

            const cardWidth = 240;
            const cardHeight = 120;
            const fromX = parentStep.x + cardWidth / 2;
            const fromY = parentStep.y + cardHeight;
            const toX = step.x + cardWidth / 2;
            const toY = step.y - 10;
            const midY = (fromY + toY) / 2;
            const horizontalOffset = Math.min(Math.abs(toX - fromX) * 0.3, 50);

            return (
              <path
                key={`${parentStep.id}-${step.id}`}
                d={`M ${fromX} ${fromY} C ${fromX + horizontalOffset} ${midY}, ${toX - horizontalOffset} ${midY}, ${toX} ${toY}`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#roadmap-arrow)"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes Grid */}
        {roadmap.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const meta = CATEGORY_META[step.category] || CATEGORY_META.foundation;

          return (
            <div
              key={step.id}
              style={{ position: 'absolute', left: `${step.x}px`, top: `${step.y}px`, width: `240px` }}
              className="transition-all duration-200 hover:scale-[1.01]"
            >
              <div 
                onClick={() => onSelectStep(step)}
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
                      onChange={() => onToggleStep(step.id)} 
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
    </div>
  );
};