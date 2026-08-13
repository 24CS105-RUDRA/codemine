export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  difficulty: string;
  estimatedTime: string;
  progress: number;
  topic: string;
  type: "topic" | "project";
}

export const topicRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Master JavaScript Promises",
    reason: "Based on your recent async debugging activity",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    progress: 40,
    topic: "JavaScript",
    type: "topic",
  },
  {
    id: "2",
    title: "React Context API Deep Dive",
    reason: "You frequently use prop drilling in your components",
    difficulty: "Intermediate",
    estimatedTime: "1 hr",
    progress: 20,
    topic: "React",
    type: "topic",
  },
  {
    id: "3",
    title: "TypeScript Generics",
    reason: "Strengthen your TypeScript skills",
    difficulty: "Advanced",
    estimatedTime: "1 hr 30 min",
    progress: 0,
    topic: "TypeScript",
    type: "topic",
  },
  {
    id: "4",
    title: "Data Structures: Graphs",
    reason: "Essential for algorithm mastery",
    difficulty: "Advanced",
    estimatedTime: "2 hrs",
    progress: 10,
    topic: "Algorithms",
    type: "topic",
  },
  {
    id: "5",
    title: "Node.js Error Handling",
    reason: "Improve backend reliability",
    difficulty: "Intermediate",
    estimatedTime: "50 min",
    progress: 0,
    topic: "Node.js",
    type: "topic",
  },
  {
    id: "6",
    title: "CSS Grid & Flexbox Mastery",
    reason: "Perfect your layout skills",
    difficulty: "Beginner",
    estimatedTime: "40 min",
    progress: 75,
    topic: "CSS",
    type: "topic",
  },
];

export const projectRecommendations: Recommendation[] = [
  {
    id: "p1",
    title: "Build a REST API",
    reason: "Apply your Node.js knowledge",
    difficulty: "Intermediate",
    estimatedTime: "3 hrs",
    progress: 0,
    topic: "Node.js",
    type: "project",
  },
  {
    id: "p2",
    title: "React Dashboard",
    reason: "Practice component architecture",
    difficulty: "Intermediate",
    estimatedTime: "4 hrs",
    progress: 0,
    topic: "React",
    type: "project",
  },
  {
    id: "p3",
    title: "Task Manager App",
    reason: "Full stack practice project",
    difficulty: "Beginner",
    estimatedTime: "2 hrs",
    progress: 30,
    topic: "JavaScript",
    type: "project",
  },
  {
    id: "p4",
    title: "Weather Application",
    reason: "Learn API integration",
    difficulty: "Easy",
    estimatedTime: "1.5 hrs",
    progress: 0,
    topic: "JavaScript",
    type: "project",
  },
];
