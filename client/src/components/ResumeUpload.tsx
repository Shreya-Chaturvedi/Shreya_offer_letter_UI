import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { convertFileToBase64, formatFileSize, validateFileType, validateFileSize } from '@/utils/fileUtils';

interface ResumeUploadProps {
  onFileUpload: (base64: string, fileName: string, fileSize: number) => void;
  error?: string;
}

export function ResumeUpload({ onFileUpload, error }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    setUploadError('');

    if (!validateFileType(selectedFile)) {
      setUploadError('Please upload a PDF or DOC file');
      return;
    }

    if (!validateFileSize(selectedFile, 10)) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    try {
      const base64 = await convertFileToBase64(selectedFile);
      setFile(selectedFile);
      onFileUpload(base64, selectedFile.name, selectedFile.size);
    } catch (err) {
      setUploadError('Failed to process file. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadError('');
    onFileUpload('', '', 0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground mb-2">
        Resume Upload <span className="text-destructive">*</span>
      </label>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-accent' 
            : 'border-border hover:border-primary/50'
          }
          ${error || uploadError ? 'border-destructive' : ''}
        `}
        data-testid="resume-upload-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
          className="hidden"
          data-testid="resume-file-input"
        />

        {!file ? (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-primary" />
            <div>
              <p className="text-base font-medium text-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PDF or DOC (max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-card rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-mono truncate" data-testid="resume-file-name">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="ml-2 h-8 w-8 rounded-full hover-elevate active-elevate-2 flex items-center justify-center flex-shrink-0"
              aria-label="Remove file"
              data-testid="button-remove-resume"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-destructive mt-1" role="alert" data-testid="resume-upload-error">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
