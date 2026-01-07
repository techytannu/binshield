import { useCallback, useState } from 'react';
import { Upload, File, Shield } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUploadZone = ({ onFileSelect, isProcessing }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 ${
        isDragging 
          ? 'border-primary bg-primary/10 scale-[1.02]' 
          : 'border-border hover:border-primary/50 bg-card/50'
      } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Animated scan line */}
      {isDragging && (
        <div className="absolute inset-0 scan-line pointer-events-none" />
      )}

      <label className="flex flex-col items-center justify-center gap-6 p-12 cursor-pointer">
        <div className={`relative ${isDragging ? 'animate-float' : ''}`}>
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative p-6 rounded-2xl bg-secondary/80 border border-border glow-effect">
            {isDragging ? (
              <File className="w-12 h-12 text-primary" />
            ) : (
              <Upload className="w-12 h-12 text-primary" />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragging ? 'Drop file to analyze' : 'Upload file for analysis'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Drag and drop any file here, or click to browse. 
            The file will be converted to binary and visualized as a grayscale image.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary">Secure Analysis Mode</span>
        </div>

        <input
          type="file"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
};
