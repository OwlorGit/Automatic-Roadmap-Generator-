import {type Category} from "../styles/theme";

export interface RoadmapCard {
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