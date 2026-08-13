import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

console.log("Using API Key:", apiKey ? `${apiKey.slice(0, 8)}...` : "None");
console.log("Using Model:", model);

const groq = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

async function run() {
  try {
    const completion = await groq.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello! Say test." }
      ],
      max_tokens: 50,
    });
    console.log("SUCCESS:", completion.choices[0]?.message?.content);
  } catch (error: any) {
    console.error("FAILED ERROR:", error.message || error);
  }
}

run();
