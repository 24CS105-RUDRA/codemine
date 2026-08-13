import OpenAI from "openai";
import { config } from "../config";

// Groq uses OpenAI-compatible SDK — just point to Groq's base URL
const groq = new OpenAI({
  apiKey: config.groq.apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are an expert AI Coding Mentor. You help students and developers understand programming concepts, debug code, and improve their skills.

Strict Rules:
- ONLY answer questions related to computer science, programming, coding, debugging, web/app development, software engineering, databases, system design, or technical concepts.
- NEVER answer off-topic questions, including food recipes (such as how to make kaju katli, tea, curry, etc.), politics, travel, sports, history, general lifestyle, or entertainment.
- If the user asks an off-topic question, refuse politely but firmly (e.g., "I'm sorry, as your AI Coding Mentor, I can only help you with programming and technical questions. Let's get back to coding!"), and suggest a technical topic they could ask about instead.

Guidelines:
- Be concise and clear
- Use code examples when helpful
- Explain the "why" not just the "how"
- Use markdown for formatting
- Provide step-by-step reasoning for complex problems
- Be encouraging but honest
- Suggest related topics when relevant

When analyzing code:
1. Identify the issue
2. Explain why it happens
3. Provide a fix
4. Explain the fix
5. Suggest best practices

When explaining concepts:
1. Start with a simple definition
2. Give a practical example
3. Show common use cases
4. Mention pitfalls to avoid`;

interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIResponse {
  content: string;
  code?: string;
  language?: string;
}

export class AIService {
  async chat(history: AIChatMessage[], newMessage: string): Promise<AIResponse> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: newMessage },
      ];

      const completion = await groq.chat.completions.create({
        model: config.groq.model,
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      });

      const responseContent = completion.choices[0]?.message?.content || "I couldn't generate a response.";

      // Extract code blocks if present
      const codeMatch = responseContent.match(/```(\w+)?\n([\s\S]*?)```/);
      let code: string | undefined;
      let language: string | undefined;

      if (codeMatch) {
        language = codeMatch[1] || "javascript";
        code = codeMatch[2].trim();
      }

      return { content: responseContent, code, language };
    } catch (error: any) {
      console.error("Groq API Error:", error.message);
      return { content: this.getFallbackResponse(newMessage) };
    }
  }

  async analyzeCode(code: string, language: string): Promise<any> {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.model,
        messages: [
          {
            role: "system",
            content: `You are a code review expert. Analyze the given code and provide:
1. Code quality score (0-100)
2. Bugs or issues found
3. Security concerns
4. Performance suggestions
5. Readability assessment
Respond in valid JSON format with keys: quality, bugs, security, performance, readability.`,
          },
          {
            role: "user",
            content: `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
          },
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return { quality: 75, issues: [{ type: "info", message: content }] };
      }
    } catch (error: any) {
      console.error("Groq analyzeCode error:", error.message);
      return { quality: 70, issues: [{ type: "info", message: "AI analysis unavailable." }] };
    }
  }

  async explainError(code: string, error: string): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.model,
        messages: [
          { role: "system", content: "Explain the error in the code and provide a fix. Be concise." },
          { role: "user", content: `Code:\n\`\`\`\n${code}\n\`\`\`\n\nError:\n${error}` },
        ],
        max_tokens: 1000,
        temperature: 0.5,
      });
      return completion.choices[0]?.message?.content || "Unable to explain this error.";
    } catch {
      return "Error explanation unavailable.";
    }
  }

  async generateChallenge(title: string, difficulty: string, topic: string): Promise<any> {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.model,
        messages: [
          {
            role: "system",
            content: `You generate coding challenges. Return valid JSON with:
{
  "title": "...",
  "description": "...",
  "starterCode": "...",
  "examples": [{"input": "...", "output": "..."}],
  "constraints": ["..."],
  "hints": ["..."],
  "testCases": [{"input": "...", "output": "..."}]
}`,
          },
          {
            role: "user",
            content: `Generate a ${difficulty} ${topic} coding challenge titled "${title}".`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }

  async summarizeDocument(content: string, fileName: string): Promise<{ summary: string; topics: string[] }> {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.model,
        messages: [
          {
            role: "system",
            content: `Summarize the document and extract key topics. Return valid JSON:
{ "summary": "...", "topics": ["..."] }`,
          },
          {
            role: "user",
            content: `Document: ${fileName}\n\nContent:\n${content.slice(0, 4000)}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const resp = completion.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(resp);
      } catch {
        return { summary: resp, topics: ["General"] };
      }
    } catch {
      return { summary: "Document processed.", topics: ["General"] };
    }
  }

  private getFallbackResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("async") || lower.includes("await")) {
      return `## Async/Await

**Async/await** is syntactic sugar over Promises that makes asynchronous code read like synchronous code.

### Key Points:
- \`async\` function always returns a Promise
- \`await\` pauses execution until the Promise resolves
- Use \`try/catch\` for error handling

### Example:
\`\`\`javascript
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
\`\`\`

Would you like me to explain Promises, error handling patterns, or parallel execution?`;
    }

    if (lower.includes("react") || lower.includes("hook")) {
      return `## React Hooks

Hooks let you use state and lifecycle features in functional components.

### Common Hooks:
- **useState** — Local state management
- **useEffect** — Side effects
- **useContext** — Context consumption
- **useCallback** — Memoized callbacks
- **useMemo** — Memoized values

### Example:
\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => { document.title = \`Count: \${count}\`; }, [count]);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

What specific hook concept would you like to explore?`;
    }

    return `That's a great question! I can help you with:

- **Programming Concepts** — data types, functions, OOP, functional programming
- **JavaScript/TypeScript** — closures, prototypes, async/await, ES6+
- **React** — components, hooks, state management, performance
- **Debugging** — error analysis, common pitfalls, best practices
- **Algorithms** — sorting, searching, data structures, Big O

Could you provide more details about what you'd like to learn?`;
  }
}
