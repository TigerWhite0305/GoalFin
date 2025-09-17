// src/types/portfolio.types.ts

export type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  tags?: string[];
};

export type Skill = {
  id: number;
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  startDate: string; // ISO string
  endDate?: string;  // ISO string or undefined if current
  description?: string;
};
