import { type Category } from "../styles/theme";

const getCategoryLevel = (category: string): number => {
  const normalized = category?.toLowerCase() || "foundation";
  if (normalized === "core") return 1;
  if (normalized === "advanced") return 2;
  if (normalized === "project") return 3;
  return 0;
};

export const normalizeRoadmap = (nodes: any[]): any[] => {
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

export const buildLayout = (nodes: any[]) => {
  const byLevel = new Map<number, any[]>();

  nodes.forEach((node) => {
    const level = typeof node.level === "number" ? node.level : 0;
    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level)!.push(node);
  });

  const maxLevel = Math.max(0, ...Array.from(byLevel.keys()));
  const cardWidth = 240;
  const cardHeight = 120;
  const horizontalGap = 300;
  const verticalGap = 300;
  const canvasWidth = 1400;
  const canvasHeight = Math.max(720, (maxLevel + 1) * verticalGap + 300);

  return nodes.map((node) => {
    const level = typeof node.level === "number" ? node.level : 0;
    const siblings = byLevel.get(level) || [];
    const index = siblings.findIndex((item) => item.id === node.id);
    const centeredIndex = index - (siblings.length - 1) / 2;

    return {
      ...node,
      category: node.category || "foundation",
      duration: node.duration || "1-2 hours",
      x: canvasWidth / 2 + centeredIndex * horizontalGap - cardWidth / 2,
      y: canvasHeight / 2 + (level - maxLevel / 2) * verticalGap - cardHeight / 2
    };
  });
};