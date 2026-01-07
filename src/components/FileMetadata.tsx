import { FileText, HardDrive, Clock, Hash, FileType } from 'lucide-react';

interface FileMetadataProps {
  file: File;
  fileHash: string;
}

export const FileMetadata = ({ file, fileHash }: FileMetadataProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileExtension = (filename: string): string => {
    const ext = filename.split('.').pop();
    return ext ? ext.toUpperCase() : 'UNKNOWN';
  };

  const metadata = [
    {
      icon: FileText,
      label: 'File Name',
      value: file.name,
      mono: false,
    },
    {
      icon: FileType,
      label: 'Type',
      value: file.type || 'application/octet-stream',
      mono: true,
    },
    {
      icon: HardDrive,
      label: 'Size',
      value: formatFileSize(file.size),
      mono: true,
    },
    {
      icon: Clock,
      label: 'Last Modified',
      value: formatDate(new Date(file.lastModified)),
      mono: false,
    },
    {
      icon: Hash,
      label: 'SHA-256 Hash',
      value: fileHash || 'Computing...',
      mono: true,
      truncate: true,
    },
  ];

  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">File Metadata</h3>
            <p className="text-xs text-muted-foreground">
              Extension: <span className="font-mono text-primary">.{getFileExtension(file.name)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {metadata.map((item, index) => (
          <div key={index} className="px-6 py-4 flex items-start gap-4">
            <item.icon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p 
                className={`text-sm text-foreground ${item.mono ? 'font-mono' : ''} ${
                  item.truncate ? 'truncate' : ''
                }`}
                title={item.value}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
