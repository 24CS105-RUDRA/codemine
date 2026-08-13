import { exec } from "child_process";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { CodeExecutionResult } from "../types";

const execAsync = promisify(exec);

const TEMP_DIR = path.join(process.cwd(), ".tmp-exec");

interface LanguageConfig {
  extension: string;
  command: string;
  timeout: number;
}

const LANGUAGES: Record<string, LanguageConfig> = {
  javascript: { extension: ".js", command: "node", timeout: 5000 },
  typescript: { extension: ".ts", command: "npx tsx", timeout: 5000 },
  python: { extension: ".py", command: "python3", timeout: 5000 },
  python3: { extension: ".py", command: "python3", timeout: 5000 },
};

export class CodeExecutionService {
  async execute(
    code: string,
    language: string,
    input: string = "",
    timeoutMs: number = 5000
  ): Promise<CodeExecutionResult> {
    const config = LANGUAGES[language] || LANGUAGES.javascript;
    const id = uuidv4();
    const filePath = path.join(TEMP_DIR, `${id}${config.extension}`);

    try {
      await fs.mkdir(TEMP_DIR, { recursive: true });
      await fs.writeFile(filePath, code);

      const startTime = Date.now();
      let stdout = "";
      let stderr = "";
      let exitCode = 0;

      try {
        const inputArg = input ? ` << 'EOF'\n${input}\nEOF` : "";
        const result = await execAsync(
          `${config.command} ${filePath}${inputArg}`,
          {
            timeout: Math.min(timeoutMs, config.timeout),
            maxBuffer: 1024 * 1024,
            env: { ...process.env, NODE_ENV: "production" },
          }
        );
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (error: any) {
        exitCode = error.code || 1;
        stdout = error.stdout || "";
        stderr = error.stderr || error.message;
      }

      const runtime = Date.now() - startTime;

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode,
        runtime,
        memory: 0,
        timedOut: runtime >= timeoutMs,
      };
    } catch (error: any) {
      return {
        stdout: "",
        stderr: error.message,
        exitCode: 1,
        runtime: 0,
        memory: 0,
        timedOut: false,
      };
    } finally {
      try {
        await fs.unlink(filePath);
      } catch {}
    }
  }

  async runTests(
    code: string,
    language: string,
    testCases: { input: string; output: string }[]
  ): Promise<{ passed: number; total: number; results: any[] }> {
    const results = [];
    let passed = 0;

    for (const tc of testCases) {
      const result = await this.execute(code, language, tc.input);
      const output = result.stdout.trim();
      const expected = tc.output.trim();

      const isCorrect = output === expected;
      if (isCorrect) passed++;

      results.push({
        input: tc.input,
        expected,
        output,
        passed: isCorrect,
        error: result.stderr || undefined,
      });
    }

    return { passed, total: testCases.length, results };
  }
}
