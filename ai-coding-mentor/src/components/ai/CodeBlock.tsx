"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={cn("rounded-xl overflow-hidden bg-[#1e1e2e] text-sm font-mono", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs text-[#a6adc8]">{filename}</span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#6c7086]">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] text-[#a6adc8] hover:bg-white/5 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[#cdd6f4] leading-relaxed">
        {showLineNumbers ? (
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="inline-block w-8 text-right mr-4 text-[#6c7086] select-none text-xs">
                  {i + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}
