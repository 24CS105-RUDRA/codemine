export interface Notification {
  id: string;
  type: "ai" | "learning" | "challenge" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: "1",
    type: "ai",
    title: "AI Recommendation",
    message: "Your JavaScript fundamentals are strong. Consider reviewing async patterns.",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "learning",
    title: "Streak Milestone",
    message: "You've maintained a 12-day learning streak!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "challenge",
    title: "Challenge Completed",
    message: "You solved 'Two Sum' in 12 minutes. Great work!",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "New AI model deployed for code analysis.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "5",
    type: "ai",
    title: "Score Improvement",
    message: "Your React score improved by 12% this week.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "learning",
    title: "Learning Goal",
    message: "You're 70% towards your weekly goal. Keep going!",
    time: "3 days ago",
    read: true,
  },
];
