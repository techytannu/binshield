import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FileUploadZone } from '@/components/FileUploadZone';
import { FileMetadata } from '@/components/FileMetadata';
import { BinaryVisualization, AnalysisResult } from '@/components/BinaryVisualization';
import { AnalysisResults } from '@/components/AnalysisResults';
import { calculateSHA256 } from '@/utils/hash';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setAnalysisResult(null);
    
    // Calculate hash
    const hash = await calculateSHA256(selectedFile);
    setFileHash(hash);
    setIsProcessing(false);
  }, []);

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setFileHash('');
    setAnalysisResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {!file ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Analyze Files Without Execution
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Upload any file to visualize its binary structure as a grayscale image. 
                Detect suspicious patterns, encrypted sections, and potential malware 
                signatures through static analysis.
              </p>
            </div>
            <FileUploadZone 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
            />
            
            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { title: 'Binary Visualization', desc: 'Convert bytes to grayscale pixels' },
                { title: 'Entropy Analysis', desc: 'Detect encrypted/packed sections' },
                { title: 'Pattern Matching', desc: 'Identify known file signatures' },
              ].map((feature, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reset button */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze New File
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left column - Visualization */}
              <div className="space-y-6">
                <BinaryVisualization 
                  file={file} 
                  onAnalysisComplete={handleAnalysisComplete}
                />
                <FileMetadata file={file} fileHash={fileHash} />
              </div>

              {/* Right column - Analysis Results */}
              <div>
                {analysisResult ? (
                  <AnalysisResults result={analysisResult} />
                ) : (
                  <div className="rounded-lg bg-card border border-border p-12 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-muted-foreground">Analyzing file structure...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-xs text-muted-foreground">
            BinShield performs static binary analysis only. Files are processed locally 
            in your browser and never uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
