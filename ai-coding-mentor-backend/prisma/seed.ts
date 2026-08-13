import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      email: "alex@example.com",
      name: "Alex Patel",
      password: hashedPassword,
      role: "student",
      learningGoal: "Full Stack Development",
      preferredLang: "JavaScript",
      profile: {
        create: {
          currentStreak: 12,
          maxStreak: 15,
          totalSolved: 84,
          accuracy: 87,
          totalHours: 42,
          level: "Intermediate",
          xp: 2450,
        },
      },
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create learning progress
  const topics = [
    { topic: "JavaScript", score: 92, level: "Advanced", problemsSolved: 32 },
    { topic: "React", score: 84, level: "Intermediate", problemsSolved: 21 },
    { topic: "Algorithms", score: 71, level: "Intermediate", problemsSolved: 18 },
    { topic: "Node.js", score: 68, level: "Beginner", problemsSolved: 8 },
    { topic: "SQL", score: 60, level: "Beginner", problemsSolved: 5 },
    { topic: "TypeScript", score: 75, level: "Intermediate", problemsSolved: 10 },
  ];

  for (const t of topics) {
    await prisma.learningProgress.upsert({
      where: { userId_topic: { userId: user.id, topic: t.topic } },
      update: t,
      create: { userId: user.id, ...t },
    });
  }

  console.log("Created learning progress");

  // Create challenges
  const challengesData = [
    {
      title: "Two Sum",
      slug: "two-sum",
      description: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
      difficulty: "Easy",
      topic: "Arrays",
      category: "JavaScript",
      estimatedTime: 15,
      starterCode: "function twoSum(nums, target) {\n  // Your code here\n}",
      testCases: JSON.stringify([
        { input: "[2,7,11,15],9", output: "[0,1]" },
        { input: "[3,2,4],6", output: "[1,2]" },
      ]),
      constraints: JSON.stringify(["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"]),
      hints: JSON.stringify(["Think about using a hash map", "Store complement values"]),
      examples: JSON.stringify([
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      ]),
    },
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      description: "Determine if a string of parentheses is valid.",
      difficulty: "Easy",
      topic: "Stacks",
      category: "JavaScript",
      estimatedTime: 20,
      starterCode: "function isValid(s) {\n  // Your code here\n}",
      testCases: JSON.stringify([{ input: '"()[]{}"', output: "true" }]),
      constraints: JSON.stringify(["1 <= s.length <= 10^4"]),
      hints: JSON.stringify(["Use a stack data structure"]),
      examples: JSON.stringify([{ input: '"()[]{}"', output: "true" }]),
    },
    {
      title: "Merge Intervals",
      slug: "merge-intervals",
      description: "Merge all overlapping intervals.",
      difficulty: "Medium",
      topic: "Arrays",
      category: "JavaScript",
      estimatedTime: 35,
      starterCode: "function merge(intervals) {\n  // Your code here\n}",
      testCases: JSON.stringify([
        { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      ]),
      constraints: JSON.stringify(["1 <= intervals.length <= 10^4"]),
      hints: JSON.stringify(["Sort intervals first", "Compare start and end values"]),
      examples: JSON.stringify([
        { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      ]),
    },
    {
      title: "Coin Change",
      slug: "coin-change",
      description: "Find the fewest coins needed to make up an amount.",
      difficulty: "Medium",
      topic: "Dynamic Programming",
      category: "Algorithms",
      estimatedTime: 40,
      starterCode: "function coinChange(coins, amount) {\n  // Your code here\n}",
      testCases: JSON.stringify([{ input: "[1,5,10,25],30", output: "2" }]),
      constraints: JSON.stringify(["1 <= coins.length <= 12", "0 <= amount <= 10^4"]),
      hints: JSON.stringify(["Use bottom-up DP"]),
      examples: JSON.stringify([{ input: "[1,5,10,25],30", output: "2" }]),
    },
    {
      title: "LRU Cache",
      slug: "lru-cache",
      description: "Design a data structure that follows LRU cache constraints.",
      difficulty: "Hard",
      topic: "Design",
      category: "JavaScript",
      estimatedTime: 60,
      starterCode: "class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {}\n  put(key, value) {}\n}",
      testCases: JSON.stringify([{ input: "2,put(1,1),get(1)", output: "1" }]),
      constraints: JSON.stringify(["1 <= capacity <= 3000"]),
      hints: JSON.stringify(["Use a HashMap + Doubly Linked List"]),
      examples: JSON.stringify([{ input: "2,put(1,1),get(1)", output: "1" }]),
    },
    {
      title: "React Tic Tac Toe",
      slug: "react-tic-tac-toe",
      description: "Build a tic-tac-toe game using React hooks.",
      difficulty: "Easy",
      topic: "React",
      category: "React",
      estimatedTime: 30,
      starterCode: "function TicTacToe() {\n  // Your code here\n}",
      testCases: JSON.stringify([{ input: "click", output: "X or O" }]),
      constraints: JSON.stringify(["3x3 board"]),
      hints: JSON.stringify(["Use useState for board state"]),
      examples: JSON.stringify([{ input: "click", output: "X or O" }]),
    },
  ];

  for (const c of challengesData) {
    await prisma.challenge.upsert({
      where: { slug: c.slug },
      update: c,
      create: c as any,
    });
  }

  console.log("Created challenges");

  // Create learning modules
  const modules = [
    {
      title: "JavaScript Fundamentals",
      description: "Master the core concepts of JavaScript",
      difficulty: "Beginner",
      estimatedTime: 8,
      level: 1,
      sortOrder: 1,
      lessons: {
        create: [
          { title: "Variables & Data Types", sortOrder: 1 },
          { title: "Functions & Scope", sortOrder: 2 },
          { title: "Arrays & Objects", sortOrder: 3 },
          { title: "Control Flow", sortOrder: 4 },
        ],
      },
    },
    {
      title: "Advanced JavaScript",
      description: "Deep dive into closures, prototypes, and async",
      difficulty: "Intermediate",
      estimatedTime: 12,
      level: 2,
      sortOrder: 2,
      lessons: {
        create: [
          { title: "Closures & Scope", sortOrder: 1 },
          { title: "Prototypes & Classes", sortOrder: 2 },
          { title: "Promises & Async/Await", sortOrder: 3 },
          { title: "Error Handling Patterns", sortOrder: 4 },
          { title: "Modules & Tooling", sortOrder: 5 },
        ],
      },
    },
    {
      title: "React",
      description: "Build modern UIs with React",
      difficulty: "Intermediate",
      estimatedTime: 15,
      level: 3,
      sortOrder: 3,
      lessons: {
        create: [
          { title: "Components & JSX", sortOrder: 1 },
          { title: "State & Lifecycle", sortOrder: 2 },
          { title: "Hooks Deep Dive", sortOrder: 3 },
          { title: "Context API", sortOrder: 4 },
          { title: "Performance Optimization", sortOrder: 5 },
        ],
      },
    },
    {
      title: "Node.js",
      description: "Server-side JavaScript with Node.js",
      difficulty: "Intermediate",
      estimatedTime: 10,
      level: 4,
      sortOrder: 4,
      lessons: {
        create: [
          { title: "Node.js Basics", sortOrder: 1 },
          { title: "Express Framework", sortOrder: 2 },
          { title: "REST APIs", sortOrder: 3 },
          { title: "Database Integration", sortOrder: 4 },
        ],
      },
    },
    {
      title: "Full Stack Development",
      description: "Combine frontend and backend skills",
      difficulty: "Advanced",
      estimatedTime: 20,
      level: 5,
      sortOrder: 5,
      lessons: {
        create: [
          { title: "Architecture Patterns", sortOrder: 1 },
          { title: "Authentication", sortOrder: 2 },
          { title: "Deployment", sortOrder: 3 },
          { title: "Testing", sortOrder: 4 },
          { title: "CI/CD Pipeline", sortOrder: 5 },
        ],
      },
    },
  ];

  for (const m of modules) {
    await prisma.learningModule.create({ data: m as any });
  }

  console.log("Created learning modules");

  // Create some notifications
  const notifications = [
    {
      userId: user.id,
      type: "ai",
      title: "AI Recommendation",
      message: "Your JavaScript fundamentals are strong. Consider reviewing async patterns.",
    },
    {
      userId: user.id,
      type: "learning",
      title: "Streak Milestone",
      message: "You've maintained a 12-day learning streak!",
    },
    {
      userId: user.id,
      type: "challenge",
      title: "Challenge Completed",
      message: 'You solved "Two Sum" in 12 minutes. Great work!',
      read: true,
    },
    {
      userId: user.id,
      type: "system",
      title: "System Update",
      message: "New AI model deployed for code analysis.",
      read: true,
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  console.log("Created notifications");

  // Create activity logs
  const activities = [
    {
      userId: user.id,
      type: "debug",
      title: "Debugged JavaScript function",
      description: "Fixed async/await issue in fetchUserData",
    },
    {
      userId: user.id,
      type: "challenge",
      title: "Completed React exercise",
      description: "Built a dynamic form with validation",
    },
    {
      userId: user.id,
      type: "document",
      title: "Uploaded programming PDF",
      description: "Advanced React Patterns documentation",
    },
    {
      userId: user.id,
      type: "chat",
      title: "Asked AI about recursion",
      description: "Deep dive into recursive algorithms",
    },
  ];

  for (const a of activities) {
    await prisma.activityLog.create({ data: a });
  }

  console.log("Created activity logs");

  // Create recommendations
  const recs = [
    {
      userId: user.id,
      title: "Master JavaScript Promises",
      reason: "Based on your recent debugging activity",
      difficulty: "Intermediate",
      estimatedTime: 45,
      topic: "JavaScript",
      type: "topic",
      progress: 40,
    },
    {
      userId: user.id,
      title: "React Custom Hooks Deep Dive",
      reason: "You've been working with React components",
      difficulty: "Advanced",
      estimatedTime: 80,
      topic: "React",
      type: "topic",
      progress: 30,
    },
    {
      userId: user.id,
      title: "Build a REST API",
      reason: "Apply your Node.js knowledge",
      difficulty: "Intermediate",
      estimatedTime: 180,
      topic: "Node.js",
      type: "project",
      progress: 0,
    },
  ];

  for (const r of recs) {
    await prisma.recommendation.create({ data: r });
  }

  console.log("Created recommendations");

  console.log("\nSeed completed successfully!");
  console.log("Demo user: alex@example.com / password123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
