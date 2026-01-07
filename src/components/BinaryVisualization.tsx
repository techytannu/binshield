import { useEffect, useRef, useState } from 'react';
import { Grid3X3, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BinaryVisualizationProps {
  file: File;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  entropy: number;
  suspiciousRegions: number;
  patternMatches: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const BinaryVisualization = ({ file, onAnalysisComplete }: BinaryVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });

  useEffect(() => {
    const processFile = async () => {
      setIsProcessing(true);
      
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Calculate dimensions for square-ish image
      const totalBytes = bytes.length;
      const width = Math.min(512, Math.ceil(Math.sqrt(totalBytes)));
      const height = Math.ceil(totalBytes / width);
      
      setDimensions({ width, height });

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.createImageData(width, height);
      
      // Convert bytes to grayscale pixels
      for (let i = 0; i < totalBytes; i++) {
        const pixelIndex = i * 4;
        const grayValue = bytes[i];
        imageData.data[pixelIndex] = grayValue;     // R
        imageData.data[pixelIndex + 1] = grayValue; // G
        imageData.data[pixelIndex + 2] = grayValue; // B
        imageData.data[pixelIndex + 3] = 255;       // A
      }

      // Fill remaining pixels with pattern
      for (let i = totalBytes; i < width * height; i++) {
        const pixelIndex = i * 4;
        imageData.data[pixelIndex] = 20;
        imageData.data[pixelIndex + 1] = 20;
        imageData.data[pixelIndex + 2] = 25;
        imageData.data[pixelIndex + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);

      // Analyze the binary data
      const analysis = analyzeBytes(bytes);
      onAnalysisComplete(analysis);
      
      setIsProcessing(false);
    };

    processFile();
  }, [file, onAnalysisComplete]);

  const analyzeBytes = (bytes: Uint8Array): AnalysisResult => {
    // Calculate entropy
    const frequency = new Array(256).fill(0);
    for (const byte of bytes) {
      frequency[byte]++;
    }
    
    let entropy = 0;
    for (const count of frequency) {
      if (count > 0) {
        const p = count / bytes.length;
        entropy -= p * Math.log2(p);
      }
    }

    // Detect suspicious patterns
    const suspiciousPatterns = [
      [0x4D, 0x5A], // MZ header (executable)
      [0x50, 0x4B], // PK (ZIP/Office)
      [0x7F, 0x45, 0x4C, 0x46], // ELF
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // Null padding
    ];

    let suspiciousRegions = 0;
    const patternMatches: string[] = [];

    // Check for executable headers
    if (bytes[0] === 0x4D && bytes[1] === 0x5A) {
      patternMatches.push('Windows Executable (PE)');
      suspiciousRegions++;
    }
    if (bytes[0] === 0x7F && bytes[1] === 0x45) {
      patternMatches.push('Linux Executable (ELF)');
      suspiciousRegions++;
    }

    // Check for high entropy sections (possibly encrypted/packed)
    const sectionSize = Math.floor(bytes.length / 10);
    for (let i = 0; i < 10; i++) {
      const section = bytes.slice(i * sectionSize, (i + 1) * sectionSize);
      const sectionEntropy = calculateSectionEntropy(section);
      if (sectionEntropy > 7.5) {
        suspiciousRegions++;
      }
    }

    // Check for embedded scripts
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const text = textDecoder.decode(bytes.slice(0, Math.min(10000, bytes.length)));
    if (text.includes('<script') || text.includes('eval(') || text.includes('exec(')) {
      patternMatches.push('Embedded Script Detected');
      suspiciousRegions++;
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (entropy > 7.5 || suspiciousRegions > 3) {
      riskLevel = 'high';
    } else if (entropy > 6 || suspiciousRegions > 1) {
      riskLevel = 'medium';
    }

    return {
      entropy: Math.round(entropy * 100) / 100,
      suspiciousRegions,
      patternMatches,
      riskLevel,
    };
  };

  const calculateSectionEntropy = (section: Uint8Array): number => {
    const frequency = new Array(256).fill(0);
    for (const byte of section) {
      frequency[byte]++;
    }
    
    let entropy = 0;
    for (const count of frequency) {
      if (count > 0) {
        const p = count / section.length;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${file.name}_visualization.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Grid3X3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Binary Visualization</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {dimensions.width} × {dimensions.height} px
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            className="h-8 w-8"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setZoom(z => Math.min(4, z + 0.25))}
            className="h-8 w-8"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center bg-background/50 min-h-[300px] overflow-auto">
        <div 
          className="relative rounded-lg overflow-hidden border border-border"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Processing binary...</span>
              </div>
            </div>
          )}
          <canvas 
            ref={canvasRef}
            className="block"
            style={{ 
              imageRendering: 'pixelated',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      <div className="px-6 py-3 border-t border-border bg-secondary/20">
        <p className="text-xs text-muted-foreground text-center">
          Each pixel represents one byte. Brightness = byte value (0-255). 
          Uniform regions may indicate padding or null bytes.
        </p>
      </div>
    </div>
  );
};
