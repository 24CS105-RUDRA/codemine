export interface Document {
  id: string;
  name: string;
  type: "pdf" | "csv" | "image" | "text";
  size: string;
  uploadedAt: string;
  status: "processed" | "processing" | "pending";
  summary?: string;
  topics?: string[];
}

export const documents: Document[] = [
  {
    id: "1",
    name: "JavaScript Notes.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "2 hours ago",
    status: "processed",
    summary: "Comprehensive JavaScript fundamentals covering closures, promises, and ES6+ features.",
    topics: ["Closures", "Promises", "ES6", "Arrow Functions"],
  },
  {
    id: "2",
    name: "React Patterns.pdf",
    type: "pdf",
    size: "3.1 MB",
    uploadedAt: "1 day ago",
    status: "processed",
    summary: "Advanced React patterns including compound components, render props, and hooks.",
    topics: ["React", "Hooks", "Design Patterns"],
  },
  {
    id: "3",
    name: "algorithm_complexity.csv",
    type: "csv",
    size: "156 KB",
    uploadedAt: "3 days ago",
    status: "processed",
    summary: "Time and space complexity analysis of common algorithms.",
    topics: ["Big O", "Algorithms", "Complexity"],
  },
  {
    id: "4",
    name: "data_structures.md",
    type: "text",
    size: "89 KB",
    uploadedAt: "1 week ago",
    status: "processed",
    summary: "Notes on trees, graphs, hash maps, and linked lists.",
    topics: ["Trees", "Graphs", "Hash Maps", "Linked Lists"],
  },
  {
    id: "5",
    name: "SQL Cheat Sheet.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadedAt: "2 weeks ago",
    status: "processed",
    summary: "Quick reference for SQL queries, joins, and optimization.",
    topics: ["SQL", "Joins", "Queries"],
  },
  {
    id: "6",
    name: "TypeScript Cheatsheet.png",
    type: "image",
    size: "450 KB",
    uploadedAt: "3 days ago",
    status: "processed",
    summary: "Visual TypeScript type system reference.",
    topics: ["TypeScript", "Types", "Generics"],
  },
];

export const documentActions = [
  "Summarize",
  "Explain",
  "Ask AI",
  "Extract Topics",
  "Generate Quiz",
];
