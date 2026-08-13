export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  lessons: { id: string; title: string; completed: boolean }[];
  progress: number;
  aiRecommended: boolean;
  level: number;
}

export const learningPath: LearningModule[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript",
    difficulty: "Beginner",
    estimatedTime: "8 hrs",
    progress: 100,
    aiRecommended: false,
    level: 1,
    lessons: [
      { id: "1a", title: "Variables & Data Types", completed: true },
      { id: "1b", title: "Functions & Scope", completed: true },
      { id: "1c", title: "Arrays & Objects", completed: true },
      { id: "1d", title: "Control Flow", completed: true },
    ],
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Deep dive into closures, prototypes, and async",
    difficulty: "Intermediate",
    estimatedTime: "12 hrs",
    progress: 65,
    aiRecommended: false,
    level: 2,
    lessons: [
      { id: "2a", title: "Closures & Scope", completed: true },
      { id: "2b", title: "Prototypes & Classes", completed: true },
      { id: "2c", title: "Promises & Async/Await", completed: true },
      { id: "2d", title: "Error Handling Patterns", completed: false },
      { id: "2e", title: "Modules & Tooling", completed: false },
    ],
  },
  {
    id: "3",
    title: "React",
    description: "Build modern UIs with React",
    difficulty: "Intermediate",
    estimatedTime: "15 hrs",
    progress: 40,
    aiRecommended: true,
    level: 3,
    lessons: [
      { id: "3a", title: "Components & JSX", completed: true },
      { id: "3b", title: "State & Lifecycle", completed: true },
      { id: "3c", title: "Hooks Deep Dive", completed: false },
      { id: "3d", title: "Context API", completed: false },
      { id: "3e", title: "Performance Optimization", completed: false },
    ],
  },
  {
    id: "4",
    title: "Node.js",
    description: "Server-side JavaScript with Node.js",
    difficulty: "Intermediate",
    estimatedTime: "10 hrs",
    progress: 15,
    aiRecommended: false,
    level: 4,
    lessons: [
      { id: "4a", title: "Node.js Basics", completed: true },
      { id: "4b", title: "Express Framework", completed: false },
      { id: "4c", title: "REST APIs", completed: false },
      { id: "4d", title: "Database Integration", completed: false },
    ],
  },
  {
    id: "5",
    title: "Full Stack Development",
    description: "Combine frontend and backend skills",
    difficulty: "Advanced",
    estimatedTime: "20 hrs",
    progress: 0,
    aiRecommended: false,
    level: 5,
    lessons: [
      { id: "5a", title: "Architecture Patterns", completed: false },
      { id: "5b", title: "Authentication", completed: false },
      { id: "5c", title: "Deployment", completed: false },
      { id: "5d", title: "Testing", completed: false },
      { id: "5e", title: "CI/CD Pipeline", completed: false },
    ],
  },
];
