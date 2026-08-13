export const userData = {
  name: "Alex Patel",
  role: "Computer Science Student",
  avatar: "AP",
  streak: 12,
  problemsSolved: 84,
  accuracy: 87,
  learningHours: 42,
  weeklyGoal: 10,
  weeklyProgress: 7,
  joinedDate: "2025-09-15",
  preferredLanguages: ["JavaScript", "Python", "TypeScript"],
  learningGoal: "Full Stack Development",
  level: "Intermediate",
};

export const dashboardStats = [
  { label: "Learning Streak", value: "12", unit: "days", change: "+2", positive: true },
  { label: "Problems Solved", value: "84", unit: "total", change: "+8", positive: true },
  { label: "Accuracy", value: "87", unit: "%", change: "+3", positive: true },
  { label: "Learning Hours", value: "42", unit: "hours", change: "+6", positive: true },
];

export const weeklyActivity = [
  { day: "Mon", problems: 5, time: 45 },
  { day: "Tue", problems: 8, time: 62 },
  { day: "Wed", problems: 3, time: 28 },
  { day: "Thu", problems: 12, time: 90 },
  { day: "Fri", problems: 7, time: 55 },
  { day: "Sat", problems: 15, time: 120 },
  { day: "Sun", problems: 10, time: 75 },
];

export const recentActivity = [
  {
    id: "1",
    type: "debug" as const,
    title: "Debugged JavaScript function",
    description: "Fixed async/await issue in fetchUserData",
    time: "2 hours ago",
    icon: "Bug",
  },
  {
    id: "2",
    type: "challenge" as const,
    title: "Completed React exercise",
    description: "Built a dynamic form with validation",
    time: "5 hours ago",
    icon: "Trophy",
  },
  {
    id: "3",
    type: "document" as const,
    title: "Uploaded programming PDF",
    description: "Advanced React Patterns documentation",
    time: "1 day ago",
    icon: "FileText",
  },
  {
    id: "4",
    type: "chat" as const,
    title: "Asked AI about recursion",
    description: "Deep dive into recursive algorithms",
    time: "1 day ago",
    icon: "Bot",
  },
  {
    id: "5",
    type: "review" as const,
    title: "Code review completed",
    description: "Reviewed useState hook implementation",
    time: "2 days ago",
    icon: "GitPullRequest",
  },
];

export const aiRecommendations = [
  {
    id: "1",
    title: "Master Async/Await Patterns",
    reason: "Based on your recent debugging activity",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    topic: "JavaScript",
    progress: 65,
  },
  {
    id: "2",
    title: "React Custom Hooks Deep Dive",
    reason: "You've been working with React components",
    difficulty: "Advanced",
    estimatedTime: "1 hr 20 min",
    topic: "React",
    progress: 30,
  },
  {
    id: "3",
    title: "Algorithm: Dynamic Programming",
    reason: "Improve your problem-solving skills",
    difficulty: "Advanced",
    estimatedTime: "2 hrs",
    topic: "Algorithms",
    progress: 0,
  },
];

export const performanceData = [
  { month: "Sep", accuracy: 72, solved: 12 },
  { month: "Oct", accuracy: 76, solved: 18 },
  { month: "Nov", accuracy: 80, solved: 22 },
  { month: "Dec", accuracy: 83, solved: 15 },
  { month: "Jan", accuracy: 85, solved: 28 },
  { month: "Feb", accuracy: 87, solved: 32 },
];
