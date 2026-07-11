import React, { useState } from "react";

// Lightweight local stubs for `framer-motion` and `lucide-react` when
// those packages aren't installed in the environment. These provide the
// minimal shape the file expects so TypeScript/Next won't error.
const MotionDiv = ({ children, initial, animate, exit, transition, ...rest }: any) => (
  <div {...rest}>{children}</div>
);
const motion = { div: MotionDiv } as any;
const AnimatePresence: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

const makeIcon = (chr: string) => ({ size = 16, ...props }: any) => (
  <span
    {...props}
    role="img"
    aria-hidden
    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size, lineHeight: 1, ...(props.style || {}) }}
  >
    {chr}
  </span>
);

const CheckCircle2 = makeIcon("✓");
const Circle = makeIcon("○");
const X = makeIcon("✕");
const Clock = makeIcon("⏰");
const BookOpen = makeIcon("📖");
const Video = makeIcon("▶️");
const ExternalLink = makeIcon("🔗");
const Sparkles = makeIcon("✨");
const RotateCcw = makeIcon("↺");
const GraduationCap = makeIcon("🎓");
const Layers = makeIcon("🗂️");
const Cpu = makeIcon("🧠");
const Rocket = makeIcon("🚀");
const FileText = makeIcon("📝");
const Dumbbell = makeIcon("🏋️");

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "foundation" | "core" | "advanced" | "project";
type ResourceType = "article" | "video" | "course" | "book" | "practice";

interface Resource {
  title: string;
  type: ResourceType;
  platform: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: Category;
  resources: Resource[];
  prerequisites: string[];
  x: number;
  y: number;
}

interface RoadmapData {
  skill: string;
  description: string;
  totalDuration: string;
  nodes: RoadmapNode[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W = 210;
const CARD_H = 112;

const CATEGORY_META: Record<Category, { label: string; stripe: string; bg: string; text: string }> = {
  foundation: { label: "Foundation", stripe: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8" },
  core:       { label: "Core",       stripe: "#10b981", bg: "#f0fdf4", text: "#047857" },
  advanced:   { label: "Advanced",   stripe: "#8b5cf6", bg: "#f5f3ff", text: "#6d28d9" },
  project:    { label: "Project",    stripe: "#f59e0b", bg: "#fffbeb", text: "#b45309" },
};

const RESOURCE_ICONS: Record<ResourceType, React.ElementType> = {
  article:  FileText,
  video:    Video,
  course:   GraduationCap,
  book:     BookOpen,
  practice: Dumbbell,
};

// ─── Roadmap Data ─────────────────────────────────────────────────────────────

const mlRoadmap: RoadmapData = {
  skill: "Machine Learning",
  description: "From linear algebra to deploying production models — a complete ML engineering path.",
  totalDuration: "6–9 months",
  nodes: [
    {
      id: "math", title: "Math Foundations", duration: "4–6 weeks", category: "foundation",
      prerequisites: [], x: 60, y: 40,
      description: "Linear algebra, calculus, and probability are the mathematical bedrock of every ML algorithm. Study vectors, matrix operations, partial derivatives, and probability distributions before touching any ML library.",
      resources: [
        { title: "3Blue1Brown: Essence of Linear Algebra", type: "video", platform: "YouTube" },
        { title: "Khan Academy Calculus", type: "course", platform: "Khan Academy" },
        { title: "Introduction to Probability (Blitzstein)", type: "book", platform: "Harvard OpenCourseWare" },
      ]
    },
    {
      id: "python", title: "Python for ML", duration: "3–4 weeks", category: "foundation",
      prerequisites: [], x: 650, y: 40,
      description: "Python is the lingua franca of ML. Master NumPy, list comprehensions, generators, and classes before touching scikit-learn or PyTorch. The investment pays dividends at every later stage.",
      resources: [
        { title: "Python Crash Course (Matthes)", type: "book", platform: "No Starch Press" },
        { title: "NumPy Quickstart Tutorial", type: "article", platform: "numpy.org" },
        { title: "100 NumPy Exercises", type: "practice", platform: "GitHub" },
      ]
    },
    {
      id: "pandas", title: "Data Wrangling", duration: "2–3 weeks", category: "core",
      prerequisites: ["math", "python"], x: 355, y: 230,
      description: "Master pandas for real-world data manipulation. Clean messy datasets, engineer features, handle missing values, and conduct exploratory data analysis before any modeling attempt.",
      resources: [
        { title: "Pandas Documentation Tutorial", type: "article", platform: "pandas.pydata.org" },
        { title: "Data Cleaning Challenge — Kaggle", type: "practice", platform: "Kaggle" },
        { title: "Python for Data Analysis (McKinney)", type: "book", platform: "O'Reilly" },
      ]
    },
    {
      id: "stats", title: "Statistics & EDA", duration: "3–4 weeks", category: "core",
      prerequisites: ["pandas"], x: 60, y: 420,
      description: "Applied statistics for ML practitioners: hypothesis testing, confidence intervals, distributions, correlation analysis, and visual EDA with matplotlib and seaborn.",
      resources: [
        { title: "StatQuest with Josh Starmer", type: "video", platform: "YouTube" },
        { title: "Think Stats (Downey)", type: "book", platform: "O'Reilly" },
        { title: "Seaborn Tutorial Gallery", type: "article", platform: "seaborn.pydata.org" },
      ]
    },
    {
      id: "sklearn", title: "Classical ML", duration: "5–7 weeks", category: "core",
      prerequisites: ["pandas"], x: 650, y: 420,
      description: "Linear & logistic regression, decision trees, SVMs, k-NN, and clustering. Understand the bias–variance tradeoff and use scikit-learn pipelines to build reproducible workflows.",
      resources: [
        { title: "Hands-On ML with Scikit-Learn (Géron)", type: "book", platform: "O'Reilly" },
        { title: "fast.ai Practical Machine Learning", type: "course", platform: "fast.ai" },
        { title: "scikit-learn User Guide", type: "article", platform: "scikit-learn.org" },
      ]
    },
    {
      id: "evaluation", title: "Model Evaluation", duration: "2–3 weeks", category: "core",
      prerequisites: ["stats", "sklearn"], x: 355, y: 610,
      description: "Cross-validation strategies, precision/recall/F1, ROC-AUC curves, and hyperparameter tuning with GridSearchCV and Bayesian optimization via Optuna.",
      resources: [
        { title: "Model Evaluation & Selection — StatQuest", type: "video", platform: "YouTube" },
        { title: "Optuna Documentation", type: "article", platform: "optuna.org" },
        { title: "scikit-learn Model Selection Guide", type: "article", platform: "scikit-learn.org" },
      ]
    },
    {
      id: "deep", title: "Deep Learning", duration: "6–8 weeks", category: "advanced",
      prerequisites: ["evaluation"], x: 355, y: 800,
      description: "Neural networks from scratch, backpropagation, PyTorch fundamentals, regularization, and training your first image classifier end-to-end on a real dataset.",
      resources: [
        { title: "fast.ai: Deep Learning for Coders", type: "course", platform: "fast.ai" },
        { title: "Deep Learning (Goodfellow, Bengio, Courville)", type: "book", platform: "MIT Press" },
        { title: "PyTorch Official Tutorials", type: "article", platform: "pytorch.org" },
      ]
    },
    {
      id: "nlp", title: "NLP & Transformers", duration: "4–5 weeks", category: "advanced",
      prerequisites: ["deep"], x: 60, y: 990,
      description: "Tokenization, word embeddings, attention mechanisms, and fine-tuning large language models on custom datasets using the Hugging Face ecosystem.",
      resources: [
        { title: "Hugging Face NLP Course", type: "course", platform: "Hugging Face" },
        { title: "Attention Is All You Need (Vaswani et al.)", type: "article", platform: "arXiv" },
        { title: "NLP with Transformers (Tunstall)", type: "book", platform: "O'Reilly" },
      ]
    },
    {
      id: "mlops", title: "MLOps & Deployment", duration: "3–4 weeks", category: "advanced",
      prerequisites: ["deep"], x: 650, y: 990,
      description: "Package models as REST APIs with FastAPI, containerize with Docker, track experiments with MLflow, and deploy to AWS SageMaker or GCP Vertex AI.",
      resources: [
        { title: "Designing ML Systems (Huyen)", type: "book", platform: "O'Reilly" },
        { title: "MLflow Documentation", type: "article", platform: "mlflow.org" },
        { title: "FastAPI + Docker Deployment", type: "video", platform: "YouTube" },
      ]
    },
    {
      id: "capstone", title: "Capstone Project", duration: "4–6 weeks", category: "project",
      prerequisites: ["nlp", "mlops"], x: 355, y: 1180,
      description: "Build and ship a real end-to-end ML project. Compete on Kaggle, collect a custom dataset, or solve a genuine business problem. Document methodology and publish on GitHub.",
      resources: [
        { title: "Kaggle Competitions", type: "practice", platform: "Kaggle" },
        { title: "Cookiecutter Data Science Template", type: "practice", platform: "GitHub" },
        { title: "Building an ML Portfolio", type: "article", platform: "Towards Data Science" },
      ]
    },
  ]
};

const webDevRoadmap: RoadmapData = {
  skill: "Web Development",
  description: "From HTML basics to full-stack applications with React and Node.js.",
  totalDuration: "4–6 months",
  nodes: [
    {
      id: "html", title: "HTML & CSS", duration: "3–4 weeks", category: "foundation",
      prerequisites: [], x: 60, y: 40,
      description: "Semantic HTML5, the CSS box model, Flexbox, Grid, and responsive design. Build a few real pages from scratch before moving on — reading about layout is not the same as doing it.",
      resources: [
        { title: "The Odin Project: Foundations", type: "course", platform: "theodinproject.com" },
        { title: "CSS Tricks: A Complete Guide to Grid", type: "article", platform: "css-tricks.com" },
        { title: "Kevin Powell — CSS on YouTube", type: "video", platform: "YouTube" },
      ]
    },
    {
      id: "js", title: "JavaScript Fundamentals", duration: "4–6 weeks", category: "foundation",
      prerequisites: [], x: 650, y: 40,
      description: "Variables, functions, closures, the event loop, promises, async/await, DOM manipulation, and modern ES6+ syntax. JavaScript is strange — budget time to internalize it properly.",
      resources: [
        { title: "Eloquent JavaScript (Haverbeke)", type: "book", platform: "eloquentjavascript.net" },
        { title: "javascript.info", type: "article", platform: "javascript.info" },
        { title: "JavaScript: The Hard Parts — Frontend Masters", type: "course", platform: "Frontend Masters" },
      ]
    },
    {
      id: "react", title: "React", duration: "4–5 weeks", category: "core",
      prerequisites: ["html", "js"], x: 355, y: 230,
      description: "Components, props, state, hooks (useState, useEffect, useContext), routing with React Router, and data fetching patterns. Build at least two complete projects.",
      resources: [
        { title: "React Official Docs (react.dev)", type: "article", platform: "react.dev" },
        { title: "Epic React — Kent C. Dodds", type: "course", platform: "epicreact.dev" },
        { title: "Build a React project from scratch", type: "practice", platform: "GitHub" },
      ]
    },
    {
      id: "node", title: "Node.js & Express", duration: "3–4 weeks", category: "core",
      prerequisites: ["react"], x: 60, y: 420,
      description: "Server-side JavaScript, HTTP servers, REST API design, Express middleware, file system access, and environment management with dotenv.",
      resources: [
        { title: "Node.js Documentation", type: "article", platform: "nodejs.org" },
        { title: "The Odin Project: NodeJS", type: "course", platform: "theodinproject.com" },
        { title: "Node.js Design Patterns (Casciaro)", type: "book", platform: "Packt" },
      ]
    },
    {
      id: "db", title: "Databases", duration: "3–4 weeks", category: "core",
      prerequisites: ["react"], x: 650, y: 420,
      description: "Relational databases with PostgreSQL, schema design, SQL queries, joins, and ORMs. Plus an introduction to document stores like MongoDB for schemaless data.",
      resources: [
        { title: "PostgreSQL Tutorial", type: "article", platform: "postgresqltutorial.com" },
        { title: "Prisma ORM Documentation", type: "article", platform: "prisma.io" },
        { title: "Mode SQL Tutorial", type: "practice", platform: "mode.com" },
      ]
    },
    {
      id: "auth", title: "Auth & Security", duration: "2–3 weeks", category: "core",
      prerequisites: ["node", "db"], x: 355, y: 610,
      description: "JWT tokens, OAuth2, session management, bcrypt password hashing, CORS, HTTPS, and common vulnerabilities from the OWASP Top 10.",
      resources: [
        { title: "Auth0 Developer Docs", type: "article", platform: "auth0.com" },
        { title: "OWASP Top Ten Project", type: "article", platform: "owasp.org" },
        { title: "Web Application Security (OWASP)", type: "book", platform: "O'Reilly" },
      ]
    },
    {
      id: "deploy", title: "Deployment & DevOps", duration: "2–3 weeks", category: "advanced",
      prerequisites: ["auth"], x: 355, y: 800,
      description: "CI/CD with GitHub Actions, containerization with Docker, deploying to Vercel/Railway/Fly.io, environment variables, and basic monitoring with uptime checks.",
      resources: [
        { title: "GitHub Actions Documentation", type: "article", platform: "github.com" },
        { title: "Docker Getting Started", type: "article", platform: "docker.com" },
        { title: "The Twelve-Factor App", type: "article", platform: "12factor.net" },
      ]
    },
    {
      id: "project", title: "Full-Stack Project", duration: "4–6 weeks", category: "project",
      prerequisites: ["deploy"], x: 355, y: 990,
      description: "Build and ship a complete full-stack application with user auth, a real database, and a polished UI. Deploy it publicly and add it to your portfolio.",
      resources: [
        { title: "Build 15 JavaScript Projects (fCC)", type: "practice", platform: "freeCodeCamp" },
        { title: "T3 Stack Tutorial", type: "video", platform: "YouTube" },
        { title: "Indie Hackers — Project Inspiration", type: "article", platform: "indiehackers.com" },
      ]
    },
  ]
};

const uxDesignRoadmap: RoadmapData = {
  skill: "UX Design",
  description: "Build user-centered design intuition — from research fundamentals to shipping polished interfaces.",
  totalDuration: "4–6 months",
  nodes: [
    {
      id: "principles", title: "Design Principles", duration: "2–3 weeks", category: "foundation",
      prerequisites: [], x: 60, y: 40,
      description: "Visual hierarchy, Gestalt principles, color theory, typography basics, and the fundamental vocabulary of design. These mental models underlie every good design decision.",
      resources: [
        { title: "The Design of Everyday Things (Norman)", type: "book", platform: "Basic Books" },
        { title: "Figma Design Basics", type: "course", platform: "Figma Community" },
        { title: "Refactoring UI (Wathan & Schoger)", type: "book", platform: "refactoringui.com" },
      ]
    },
    {
      id: "research", title: "User Research", duration: "3–4 weeks", category: "foundation",
      prerequisites: [], x: 650, y: 40,
      description: "User interviews, usability testing, survey design, affinity mapping, and turning raw observations into actionable insights. Research prevents building the wrong thing.",
      resources: [
        { title: "Just Enough Research (Hall)", type: "book", platform: "A Book Apart" },
        { title: "Nielsen Norman Group Articles", type: "article", platform: "nngroup.com" },
        { title: "Maze User Research Platform", type: "practice", platform: "maze.co" },
      ]
    },
    {
      id: "figma", title: "Figma Mastery", duration: "4–5 weeks", category: "core",
      prerequisites: ["principles", "research"], x: 355, y: 230,
      description: "Auto-layout, components and variants, design tokens, prototyping, and collaboration workflows. Figma fluency separates junior from mid-level designers.",
      resources: [
        { title: "Figma Academy", type: "course", platform: "Figma Community" },
        { title: "Design System Checklist", type: "article", platform: "designsystemchecklist.com" },
        { title: "UI Challenges", type: "practice", platform: "uichallenge.io" },
      ]
    },
    {
      id: "ia", title: "Information Architecture", duration: "2–3 weeks", category: "core",
      prerequisites: ["figma"], x: 60, y: 420,
      description: "Site maps, content hierarchy, card sorting, navigation patterns, and mental models. Good IA is invisible — bad IA makes users feel lost.",
      resources: [
        { title: "How to Make Sense of Any Mess (Covert)", type: "book", platform: "howtomadesenseof.com" },
        { title: "Card Sorting Guide — UXmatters", type: "article", platform: "uxmatters.com" },
        { title: "Optimal Workshop", type: "practice", platform: "optimalworkshop.com" },
      ]
    },
    {
      id: "interaction", title: "Interaction Design", duration: "3–4 weeks", category: "core",
      prerequisites: ["figma"], x: 650, y: 420,
      description: "Micro-interactions, animation principles, state transitions, feedback loops, and affordances. Motion should communicate, not decorate.",
      resources: [
        { title: "Designing Interface Animation (Head)", type: "book", platform: "Rosenfeld Media" },
        { title: "Google Material Motion", type: "article", platform: "material.io" },
        { title: "Protopie Tutorials", type: "video", platform: "YouTube" },
      ]
    },
    {
      id: "systems", title: "Design Systems", duration: "4–5 weeks", category: "advanced",
      prerequisites: ["ia", "interaction"], x: 355, y: 610,
      description: "Component libraries, token architecture, documentation, accessibility standards, and maintaining a living design system at scale.",
      resources: [
        { title: "Design Systems (Suárez et al.)", type: "book", platform: "Smashing Magazine" },
        { title: "Atomic Design (Brad Frost)", type: "article", platform: "bradfrost.com" },
        { title: "Storybook Documentation", type: "article", platform: "storybook.js.org" },
      ]
    },
    {
      id: "portfolio", title: "Portfolio & Case Studies", duration: "4–6 weeks", category: "project",
      prerequisites: ["systems"], x: 355, y: 800,
      description: "Document your design process in 3 detailed case studies. Show research, iterations, final design, and measurable outcomes. Your portfolio is your interview.",
      resources: [
        { title: "How to Write a UX Case Study — UXfolio", type: "article", platform: "uxfol.io" },
        { title: "Portfolio Reviews — ADPList", type: "practice", platform: "adplist.org" },
        { title: "UX Portfolio Formula (Lewis)", type: "book", platform: "uxportfolioformula.com" },
      ]
    },
  ]
};

function generateGenericRoadmap(skill: string): RoadmapData {
  return {
    skill,
    description: `A structured path to master ${skill} — from first principles to confident practice.`,
    totalDuration: "3–5 months",
    nodes: [
      {
        id: "f1", title: "Core Concepts", duration: "3–4 weeks", category: "foundation",
        prerequisites: [], x: 60, y: 40,
        description: `The essential vocabulary, mental models, and first principles of ${skill}. Don't skip this phase — it determines the ceiling of everything that follows.`,
        resources: [
          { title: `Introduction to ${skill}`, type: "course", platform: "Coursera" },
          { title: `${skill} Explained`, type: "video", platform: "YouTube" },
        ]
      },
      {
        id: "f2", title: "Tools & Setup", duration: "1–2 weeks", category: "foundation",
        prerequisites: [], x: 650, y: 40,
        description: "Configure your workspace with the standard toolchain used by professionals. Getting the environment right prevents hours of debugging later.",
        resources: [
          { title: "Official Documentation", type: "article", platform: "Official Docs" },
          { title: "Environment Setup Guide", type: "article", platform: "Dev.to" },
        ]
      },
      {
        id: "c1", title: "Fundamentals in Practice", duration: "4–5 weeks", category: "core",
        prerequisites: ["f1", "f2"], x: 355, y: 230,
        description: "Apply the core concepts by building real, small projects. Develop intuition through repetition and deliberate practice — reading is not learning.",
        resources: [
          { title: `${skill} — Practical Course`, type: "course", platform: "Udemy" },
          { title: "Practice Exercises", type: "practice", platform: "GitHub" },
        ]
      },
      {
        id: "c2", title: "Intermediate Patterns", duration: "4–5 weeks", category: "core",
        prerequisites: ["c1"], x: 60, y: 420,
        description: "Intermediate techniques, professional conventions, and the patterns that separate beginners from practitioners.",
        resources: [
          { title: `${skill} — Intermediate`, type: "book", platform: "O'Reilly" },
          { title: "Community Challenges", type: "practice", platform: "Discord" },
        ]
      },
      {
        id: "c3", title: "Specialization", duration: "5–6 weeks", category: "core",
        prerequisites: ["c1"], x: 650, y: 420,
        description: "Choose a subfield that aligns with your goals and go deep. Breadth is for orientation; depth is for employment.",
        resources: [
          { title: "Specialization Track", type: "course", platform: "LinkedIn Learning" },
          { title: "Domain-specific Books", type: "book", platform: "O'Reilly" },
        ]
      },
      {
        id: "a1", title: "Advanced Techniques", duration: "5–6 weeks", category: "advanced",
        prerequisites: ["c2", "c3"], x: 355, y: 610,
        description: "High-leverage patterns and techniques used by senior practitioners. Requires solid foundations in the core material.",
        resources: [
          { title: "Advanced Topics", type: "book", platform: "Manning" },
          { title: "Conference Talks", type: "video", platform: "YouTube" },
        ]
      },
      {
        id: "p1", title: "Portfolio Project", duration: "4–6 weeks", category: "project",
        prerequisites: ["a1"], x: 355, y: 800,
        description: "Build something real and public. A portfolio project is your best proof of competence. Document your process, publish it, and share it with the community.",
        resources: [
          { title: "How to Build a Portfolio", type: "article", platform: "freeCodeCamp" },
          { title: "GitHub Showcase Projects", type: "practice", platform: "GitHub" },
        ]
      },
    ]
  };
}

const SKILL_MAP: Record<string, RoadmapData> = {
  "machine learning": mlRoadmap,
  "ml": mlRoadmap,
  "ai": mlRoadmap,
  "artificial intelligence": mlRoadmap,
  "web development": webDevRoadmap,
  "web dev": webDevRoadmap,
  "frontend": webDevRoadmap,
  "full stack": webDevRoadmap,
  "ux design": uxDesignRoadmap,
  "ux": uxDesignRoadmap,
  "ui design": uxDesignRoadmap,
  "ui/ux": uxDesignRoadmap,
  "design": uxDesignRoadmap,
};

function getRoadmap(skill: string): RoadmapData {
  return SKILL_MAP[skill.toLowerCase().trim()] ?? generateGenericRoadmap(skill);
}

function getEdges(nodes: RoadmapNode[]): [string, string][] {
  const edges: [string, string][] = [];
  nodes.forEach(node => {
    node.prerequisites.forEach(prereq => {
      edges.push([prereq, node.id]);
    });
  });
  return edges;
}

// ─── Dot Grid ─────────────────────────────────────────────────────────────────

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, #b8ae9e 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

// ─── SVG Edges ────────────────────────────────────────────────────────────────

function RoadmapEdges({ nodes, completedIds }: { nodes: RoadmapNode[]; completedIds: Set<string> }) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const edges = getEdges(nodes);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <marker id="arr-pending" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L7,3 z" fill="#c4b9a8" />
        </marker>
        <marker id="arr-done" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L7,3 z" fill="#10b981" />
        </marker>
      </defs>
      {edges.map(([fromId, toId]) => {
        const from = nodeMap.get(fromId);
        const to = nodeMap.get(toId);
        if (!from || !to) return null;

        const x1 = from.x + CARD_W / 2;
        const y1 = from.y + CARD_H;
        const x2 = to.x + CARD_W / 2;
        const y2 = to.y - 4;
        const gap = y2 - y1;
        const cp1y = y1 + gap * 0.45;
        const cp2y = y2 - gap * 0.45;

        const isDone = completedIds.has(fromId) && completedIds.has(toId);

        return (
          <path
            key={`${fromId}-${toId}`}
            d={`M ${x1} ${y1} C ${x1} ${cp1y}, ${x2} ${cp2y}, ${x2} ${y2}`}
            fill="none"
            stroke={isDone ? "#10b981" : "#c4b9a8"}
            strokeWidth={isDone ? 2 : 1.5}
            strokeDasharray={isDone ? undefined : "5 4"}
            markerEnd={isDone ? "url(#arr-done)" : "url(#arr-pending)"}
            style={{ transition: "stroke 0.4s" }}
          />
        );
      })}
    </svg>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────

function NodeCard({
  node,
  isCompleted,
  isSelected,
  stepNumber,
  onClick,
}: {
  node: RoadmapNode;
  isCompleted: boolean;
  isSelected: boolean;
  stepNumber: number;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[node.category];

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: CARD_W,
        height: CARD_H,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className={[
        "bg-white rounded-xl overflow-hidden shadow-md border select-none",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
        isSelected ? "ring-2 ring-blue-400 ring-offset-2 shadow-xl -translate-y-1" : "",
        isCompleted ? "opacity-80" : "",
      ].join(" ")}
    >
      {/* Top category stripe */}
      <div className="h-[3px] w-full" style={{ backgroundColor: meta.stripe }} />

      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-2.5 right-2.5">
          <CheckCircle2 size={13} style={{ color: "#10b981" }} />
        </div>
      )}

      {/* Step number */}
      <span
        className="absolute top-2.5 left-3 text-gray-300"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
      >
        {String(stepNumber).padStart(2, "0")}
      </span>

      {/* Body */}
      <div className="px-3 pt-5 pb-2">
        <div
          className="text-gray-800 font-semibold leading-tight mb-2"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", fontWeight: 600 }}
        >
          {node.title}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
            {node.duration}
          </span>
        </div>
      </div>

      {/* Category chip */}
      <div className="absolute bottom-2 right-2">
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
          style={{ backgroundColor: meta.bg, color: meta.text }}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  node,
  isCompleted,
  onToggleComplete,
  onClose,
}: {
  node: RoadmapNode;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onClose: () => void;
}) {
  const meta = CATEGORY_META[node.category];

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 320 }}
      className="fixed right-0 top-0 bottom-0 w-[380px] bg-white shadow-2xl flex flex-col z-50 overflow-hidden"
      style={{ borderLeft: "1px solid rgba(0,0,0,0.07)", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex-shrink-0" style={{ borderTop: `4px solid ${meta.stripe}` }}>
        <div className="flex items-start justify-between mb-3">
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: meta.bg, color: meta.text }}
          >
            {meta.label}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors -mt-0.5"
          >
            <X size={15} />
          </button>
        </div>
        <h2
          className="text-gray-900 leading-snug mb-2"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: 700 }}
        >
          {node.title}
        </h2>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
            {node.duration}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Overview</p>
          <p className="text-sm text-gray-700 leading-relaxed">{node.description}</p>
        </div>

        {/* Resources */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Resources</p>
          <div className="space-y-2">
            {node.resources.map((resource, i) => {
              const Icon = RESOURCE_ICONS[resource.type];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${meta.stripe}18` }}
                  >
                    <Icon size={14} style={{ color: meta.stripe }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{resource.platform}</p>
                  </div>
                  <ExternalLink size={11} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onToggleComplete}
          className={[
            "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200",
            "flex items-center justify-center gap-2 active:scale-[0.98]",
            isCompleted
              ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100"
              : "text-white hover:brightness-110",
          ].join(" ")}
          style={isCompleted ? {} : { backgroundColor: meta.stripe }}
        >
          {isCompleted ? (
            <><CheckCircle2 size={15} /> Completed — mark incomplete</>
          ) : (
            <><Circle size={15} /> Mark as complete</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Landing View ─────────────────────────────────────────────────────────────

const EXAMPLES = [
  "Machine Learning", "Web Development", "UX Design",
  "Data Science", "iOS Development", "Rust", "Digital Marketing",
];

function LandingView({ onGenerate }: { onGenerate: (skill: string) => void }) {
  const [input, setInput] = useState("");

  const submit = () => {
    if (input.trim()) onGenerate(input.trim());
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#f0ebe0", fontFamily: "'DM Sans', sans-serif" }}
    >
      <DotGrid />

      {/* Decorative sticky notes */}
      <div className="absolute top-10 left-10 rotate-[-3deg] opacity-50 pointer-events-none">
        <div
          className="bg-yellow-100 border border-yellow-200 shadow-sm rounded px-3 py-2 text-yellow-700"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}
        >
          learn anything →
        </div>
      </div>
      <div className="absolute top-16 right-14 rotate-[2deg] opacity-50 pointer-events-none">
        <div
          className="bg-blue-50 border border-blue-200 shadow-sm rounded px-3 py-2 text-blue-600"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}
        >
          track your progress ✓
        </div>
      </div>
      <div className="absolute bottom-24 left-14 rotate-[2deg] opacity-50 pointer-events-none">
        <div
          className="bg-emerald-50 border border-emerald-200 shadow-sm rounded px-3 py-2 text-emerald-700"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}
        >
          AI-powered roadmaps 🧠
        </div>
      </div>
      <div className="absolute bottom-32 right-10 rotate-[-2deg] opacity-40 pointer-events-none">
        <div
          className="bg-violet-50 border border-violet-200 shadow-sm rounded px-3 py-2 text-violet-600"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}
        >
          click steps for details
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">
        {/* Brand */}
        <div className="mb-1.5">
          <span
            className="text-gray-900 leading-none"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "68px", fontWeight: 700, letterSpacing: "-1px" }}
          >
            SkillMap
          </span>
        </div>
        <p className="text-gray-500 mb-9 text-[15px] leading-relaxed">
          Describe a skill you want to learn.<br />
          Get a visual, step-by-step roadmap — instantly.
        </p>

        {/* Input card */}
        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="e.g. Machine Learning, Web Development, UX Design…"
            className="flex-1 px-4 py-3 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#2563eb" }}
          >
            <Sparkles size={14} />
            Generate
          </button>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => { setInput(ex); }}
              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[12px] text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Generating View ──────────────────────────────────────────────────────────

function GeneratingView({ skill }: { skill: string }) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#f0ebe0" }}
    >
      <DotGrid />
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "#2563eb" }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.9, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
        <p
          className="text-gray-700"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "26px" }}
        >
          Drawing your {skill} roadmap…
        </p>
        <p className="text-sm text-gray-400 mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Mapping out the best learning path for you
        </p>
      </div>
    </div>
  );
}

// ─── Roadmap View ─────────────────────────────────────────────────────────────

function RoadmapView({ roadmap, onReset }: { roadmap: RoadmapData; onReset: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const selectedNode = roadmap.nodes.find(n => n.id === selectedId) ?? null;

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCardClick = (id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  // Assign step numbers in order of node array
  const stepNumbers: Record<string, number> = {};
  roadmap.nodes.forEach((n, i) => { stepNumbers[n.id] = i + 1; });

  const maxX = Math.max(...roadmap.nodes.map(n => n.x + CARD_W)) + 80;
  const maxY = Math.max(...roadmap.nodes.map(n => n.y + CARD_H)) + 80;
  const pct = roadmap.nodes.length === 0 ? 0 : Math.round((completedIds.size / roadmap.nodes.length) * 100);

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "#f0ebe0", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200/80 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span
            className="text-gray-900"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: 700 }}
          >
            SkillMap
          </span>
          <div className="w-px h-5 bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700">{roadmap.skill}</span>
          <span
            className="text-gray-400"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
          >
            ~{roadmap.totalDuration}
          </span>
        </div>
        <div className="flex items-center gap-5">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-gray-500" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
              {completedIds.size}/{roadmap.nodes.length}
            </span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw size={13} />
            New Roadmap
          </button>
        </div>
      </div>

      {/* Legend row */}
      <div className="flex items-center gap-5 px-6 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([cat, meta]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.stripe }} />
            <span className="text-xs text-gray-500">{meta.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[10px] text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          click any card to explore
        </div>
      </div>

      {/* Whiteboard canvas */}
      <div className="flex-1 overflow-auto relative">
        <div
          className="relative"
          style={{ width: maxX, height: maxY, minWidth: "100%", minHeight: "100%" }}
        >
          <DotGrid />
          <RoadmapEdges nodes={roadmap.nodes} completedIds={completedIds} />
          {roadmap.nodes.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              isCompleted={completedIds.has(node.id)}
              isSelected={selectedId === node.id}
              stepNumber={stepNumbers[node.id] ?? i + 1}
              onClick={() => handleCardClick(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <DetailPanel
            key={selectedNode.id}
            node={selectedNode}
            isCompleted={completedIds.has(selectedNode.id)}
            onToggleComplete={() => toggleComplete(selectedNode.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type Screen = "landing" | "generating" | "roadmap";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [skill, setSkill] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const handleGenerate = (skillInput: string) => {
    setSkill(skillInput);
    setScreen("generating");
    setTimeout(() => {
      setRoadmap(getRoadmap(skillInput));
      setScreen("roadmap");
    }, 1800);
  };

  const handleReset = () => {
    setRoadmap(null);
    setSkill("");
    setScreen("landing");
  };

  if (screen === "landing") return <LandingView onGenerate={handleGenerate} />;
  if (screen === "generating") return <GeneratingView skill={skill} />;
  if (screen === "roadmap" && roadmap) return <RoadmapView roadmap={roadmap} onReset={handleReset} />;
  return null;
}
