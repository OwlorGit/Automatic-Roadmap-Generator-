import React from "react";
import { UI_THEME } from "../styles/theme";

interface RoadmapHeaderProps {
  prompt: string;
  setPrompt: (val: string) => void;
  isGenerating: boolean;
  onGenerate: (e: React.FormEvent) => void;
  progressPercentage: number;
  rawRoadmapResponse?: string;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  progressPercentage,
  rawRoadmapResponse,
}) => {
  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <div className={`backdrop-blur-md shadow-2xl border rounded-2xl p-4 flex flex-col gap-3 ${UI_THEME.header.panelBg} ${UI_THEME.header.panelBorder}`}>
        <form onSubmit={onGenerate} className="flex gap-2">
          <input
            type="text"
            placeholder="What do you want to learn today?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none text-sm placeholder-zinc-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${UI_THEME.header.inputBg} ${UI_THEME.header.inputBorder}`}
          />
          <button
            type="submit"
            disabled={isGenerating}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${UI_THEME.header.buttonBg}`}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </form>

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
  );
};