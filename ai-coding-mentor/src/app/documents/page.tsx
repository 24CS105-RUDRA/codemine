"use client";

import { useState } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import { documents, documentActions } from "@/data/documents";
import EmptyState from "@/components/ui/EmptyState";
import {
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  Trash2,
  Download,
  Search,
  Bot,
  ListOrdered,
  HelpCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText size={20} className="text-red-500" />,
  csv: <FileSpreadsheet size={20} className="text-emerald-500" />,
  image: <Image size={20} className="text-blue-500" />,
  text: <File size={20} className="text-purple-500" />,
};

const actionIcons: Record<string, React.ReactNode> = {
  Summarize: <Sparkles size={14} />,
  Explain: <Bot size={14} />,
  "Ask AI": <HelpCircle size={14} />,
  "Extract Topics": <ListOrdered size={14} />,
  "Generate Quiz": <HelpCircle size={14} />,
};

const statusColors: Record<string, string> = {
  processed: "text-emerald-600 bg-emerald-500/10",
  processing: "text-amber-600 bg-amber-500/10",
  pending: "text-[var(--color-text-tertiary)] bg-[var(--color-surface-tertiary)]",
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(documents);
  const [dragOver, setDragOver] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Documents</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Upload and analyze your coding documents
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
            dragOver
              ? "border-indigo-500 bg-indigo-500/5"
              : "border-[var(--color-border)] hover:border-indigo-500/30 hover:bg-[var(--color-surface-tertiary)]"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        >
          <UploadCloud size={32} className={cn("mx-auto mb-3", dragOver ? "text-indigo-500" : "text-[var(--color-text-tertiary)]")} />
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Drag &amp; drop files here, or click to browse
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Supports PDF, CSV, images, and text files
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="glass rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-tertiary)] flex items-center justify-center">
                  {typeIcons[doc.type]}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1", statusColors[doc.status])}>
                    {doc.status === "processed" && <CheckCircle2 size={10} />}
                    {doc.status === "processing" && <AlertCircle size={10} />}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <button className="p-1 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 truncate">{doc.name}</h3>
              <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-tertiary)] mb-3">
                <span>{doc.size}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {doc.uploadedAt}</span>
              </div>
              {doc.summary && (
                <p className="text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2">{doc.summary}</p>
              )}
              {doc.topics && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {doc.topics.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {documentActions.slice(0, 3).map((action) => (
                  <button
                    key={action}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    {actionIcons[action]}
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
