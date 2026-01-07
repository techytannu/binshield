import { Shield, Cpu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-lg" />
              <div className="relative p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                BinShield
              </h1>
              <p className="text-xs text-muted-foreground">
                Binary Malware Analyzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <Cpu className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">
              Static Analysis Mode
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
