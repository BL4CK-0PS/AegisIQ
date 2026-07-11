import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface JobDescriptionUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function JobDescriptionUpload({ onUpload, isLoading }: JobDescriptionUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = () => {
    if (file) onUpload(file);
  };

  return (
    <Card variant="elevated">
      {file ? (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
            <FileText className="h-6 w-6 text-primary-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-surface-200">{file.name}</p>
            <p className="text-xs text-surface-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="rounded-lg p-2 text-surface-400 hover:bg-surface-700 hover:text-surface-200"
          >
            <X size={16} />
          </button>
          <Button onClick={handleUpload} isLoading={isLoading} size="sm">
            Process
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-primary-500 bg-primary-900/10"
              : "border-surface-600 hover:border-surface-500 hover:bg-surface-800/50"
          }`}
        >
          <Upload className="mb-3 h-10 w-10 text-surface-400" />
          <p className="mb-1 text-sm font-medium text-surface-200">
            Drop your job description here
          </p>
          <p className="text-xs text-surface-500">
            Supports PDF, DOCX, and TXT files
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFile(selectedFile);
            }}
          />
        </div>
      )}
    </Card>
  );
}
