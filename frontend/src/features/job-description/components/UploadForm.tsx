import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface UploadFormProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function UploadForm({ onUpload, isLoading }: UploadFormProps) {
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
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
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
            <p className="text-xs text-surface-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="rounded-lg p-2 text-surface-400 hover:bg-surface-700"
          >
            <X size={16} />
          </button>
          <Button onClick={() => onUpload(file)} isLoading={isLoading} size="sm">
            Process
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging ? "border-primary-500 bg-primary-900/10" : "border-surface-600 hover:border-surface-500"
          }`}
        >
          <Upload className="mb-3 h-10 w-10 text-surface-400" />
          <p className="mb-1 text-sm font-medium text-surface-200">Drop your file here</p>
          <p className="text-xs text-surface-500">PDF, DOCX, or TXT</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}
    </Card>
  );
}
