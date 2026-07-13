import React from "react";
import { BookOpen, Video, GraduationCap, FileText, Dumbbell, Clock, Award } from "lucide-react";
import { UI_THEME, CATEGORY_META } from "../styles/theme";
import { type RoadmapCard } from "./types";

interface StepModalProps {
  step: RoadmapCard | null;
  onClose: () => void;
}

export const StepModal: React.FC<StepModalProps> = ({ step, onClose }) => {
  if (!step) return null;

  const getResourceIcon = (resourceStr: string) => {
    const lower = resourceStr.toLowerCase();
    if (lower.includes("video") || lower.includes("youtube")) return <Video className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("book")) return <BookOpen className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("course") || lower.includes("udemy")) return <GraduationCap className="w-4 h-4 text-zinc-400" />;
    if (lower.includes("practice") || lower.includes("exercise")) return <Dumbbell className="w-4 h-4 text-zinc-400" />;
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  const meta = CATEGORY_META[step.category] || CATEGORY_META.foundation;

  return (
    <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${UI_THEME.modal.overlay}`} onClick={onClose}>
      <div 
        className={`rounded-2xl max-w-md w-full shadow-2xl p-6 border flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 ${UI_THEME.modal.container}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between">
            <span style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }} className="text-xs font-semibold px-2.5 py-0.5 rounded-md border uppercase tracking-wider">
              {meta.label} Track
            </span>
            <span className={`text-xs font-medium flex items-center gap-1 ${UI_THEME.modal.metaText}`}>
              <Clock className={`w-3.5 h-3.5 ${UI_THEME.modal.clockIcon}`} /> {step.duration}
            </span>
          </div>
          <h2 className={`text-lg font-bold mt-2.5 ${UI_THEME.modal.title}`}>{step.title}</h2>
        </div>

        <p className={`text-sm leading-relaxed p-3 rounded-xl border ${UI_THEME.modal.descBox}`}>
          {step.description}
        </p>

        {step.prerequisites && step.prerequisites.length > 0 && (
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1 ${UI_THEME.modal.headerLabel}`}>
              <Award className="w-3.5 h-3.5" /> Prerequisites
            </h4>
            <div className="flex flex-wrap gap-1">
              {step.prerequisites.map((req, index) => (
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
            {step.resources.map((res, i) => (
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
        
        <button onClick={onClose} className={`w-full mt-2 rounded-xl py-2.5 font-medium text-sm transition-colors border ${UI_THEME.modal.closeBtn}`}>
          Close Preview
        </button>
      </div>
    </div>
  );
};