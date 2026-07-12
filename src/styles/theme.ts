export type Category = "foundation" | "core" | "advanced" | "project";

// Card Layout
export interface CategoryStyle {
  label: string;
  stripe: string;
  bg: string;
  text: string;
  border: string;
}

// Global UI Layout
export const UI_THEME = {
  background: {
    screen: "bg-zinc-950",
    gridOpacity: "opacity-20",
    gridPattern: "radial-gradient(#ffffff 1px, transparent 1px)",
  },
  header: {
    panelBg: "bg-zinc-900/80",
    panelBorder: "border-zinc-800/80",
    inputBg: "bg-zinc-950",
    inputBorder: "border-zinc-800 focus:border-zinc-600",
    buttonBg: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
    progressTrack: "bg-zinc-950 border-zinc-800",
    progressBar: "bg-zinc-100",
  },
  canvas: {
    emptyTitle: "text-zinc-400",
    emptySub: "text-zinc-600",
    cardBg: "bg-zinc-900/90",
    cardBorder: "border-zinc-800 hover:border-zinc-700",
    cardCompleted: "border-zinc-900/50 opacity-25 shadow-none",
    checkbox: "bg-zinc-950 border-zinc-800 text-zinc-100",
    title: "text-zinc-200",
    titleCompleted: "line-through text-zinc-600",
    durationText: "text-zinc-500",
  },
  modal: {
    overlay: "bg-zinc-950/80",
    container: "bg-zinc-900 border-zinc-800 text-zinc-100",
    metaText: "text-zinc-400",
    clockIcon: "text-zinc-500",
    title: "text-zinc-100",
    descBox: "text-zinc-400 bg-zinc-950/50 border-zinc-800/60",
    headerLabel: "text-zinc-500",
    pillBg: "bg-zinc-950 text-zinc-400 border-zinc-800",
    divider: "border-zinc-800",
    resourceLink: "text-zinc-300 hover:text-zinc-100 bg-zinc-950 hover:bg-zinc-800/50 border-zinc-800",
    resourceIconBox: "bg-zinc-900 border-zinc-800",
    arrowIcon: "text-zinc-600",
    closeBtn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/50",
  }
};

// Neon borders and background
export const CATEGORY_META: Record<Category, CategoryStyle> = {
  foundation: { label: "Foundation", stripe: "#38bdf8", bg: "rgba(56, 189, 248, 0.06)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.2)" },
  core:       { label: "Core",       stripe: "#34d399", bg: "rgba(52, 211, 153, 0.06)", text: "#34d399", border: "rgba(52, 211, 153, 0.2)" },
  advanced:   { label: "Advanced",   stripe: "#a78bfa", bg: "rgba(167, 139, 250, 0.06)", text: "#a78bfa", border: "rgba(167, 139, 250, 0.2)" },
  project:    { label: "Project",    stripe: "#fbbf24", bg: "rgba(251, 191, 36, 0.06)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.2)" },
};