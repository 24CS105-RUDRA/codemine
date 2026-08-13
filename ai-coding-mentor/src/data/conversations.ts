export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  code?: string;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

export const conversations: Conversation[] = [
  { id: "1", title: "Async/Await explained", lastMessage: "Thanks for the explanation!", timestamp: "2 hours ago", messageCount: 6 },
  { id: "2", title: "React hooks deep dive", lastMessage: "How does useEffect cleanup work?", timestamp: "5 hours ago", messageCount: 12 },
  { id: "3", title: "Debugging fetch API", lastMessage: "The issue was CORS headers.", timestamp: "1 day ago", messageCount: 8 },
  { id: "4", title: "JavaScript closures", lastMessage: "Can you show more examples?", timestamp: "2 days ago", messageCount: 15 },
  { id: "5", title: "TypeScript generics", lastMessage: "That makes sense now!", timestamp: "3 days ago", messageCount: 10 },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you explain why my async function isn't returning the expected value?",
    timestamp: "2:30 PM",
  },
  {
    id: "2",
    role: "assistant",
    content: "The issue is likely caused by not awaiting the async function or missing the return statement. When you call an async function, it returns a Promise, not the actual value.",
    timestamp: "2:31 PM",
    code: `// Problem: Not awaiting the async call
async function fetchUserData() {
  const response = await fetch('/api/user');
  return response.json();
}

// Issue: fetchUserData() returns a Promise
const data = fetchUserData();
console.log(data); // Promise {<pending>}

// Solution: Use await or .then()
const data = await fetchUserData();
console.log(data); // { name: "Alex", ... }

// Or:
fetchUserData().then(data => {
  console.log(data);
});`,
    language: "typescript",
  },
  {
    id: "3",
    role: "user",
    content: "What's the difference between `await` and `.then()`?",
    timestamp: "2:33 PM",
  },
  {
    id: "4",
    role: "assistant",
    content: "Both handle Promises, but they differ in readability and use cases:\n\n**`await`** pauses execution until the Promise resolves, making code look synchronous. It can only be used inside an `async` function.\n\n**`.then()`** chains callbacks and is more flexible for composition.\n\nIn most cases, `await` leads to cleaner, more readable code.",
    timestamp: "2:34 PM",
    code: `// Using .then() - callback chaining
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => renderPosts(posts))
  .catch(err => handleError(err));

// Using await - cleaner, sequential
try {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  renderPosts(posts);
} catch (err) {
  handleError(err);
}`,
    language: "typescript",
  },
  {
    id: "5",
    role: "assistant",
    content: "Would you like me to explain error handling patterns with async/await, or show you how to run multiple async operations in parallel?",
    timestamp: "2:35 PM",
  },
];
