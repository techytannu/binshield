import { Shield, AlertTriangle, CheckCircle, Activity, Search, AlertCircle } from 'lucide-react';
import { AnalysisResult } from './BinaryVisualization';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          label: 'High Risk',
          description: 'This file exhibits patterns commonly associated with malicious content.',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          label: 'Medium Risk',
          description: 'Some suspicious patterns detected. Exercise caution.',
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/30',
          label: 'Low Risk',
          description: 'No obvious malicious patterns detected in the binary structure.',
        };
    }
  };

  const riskConfig = getRiskConfig(result.riskLevel);
  const RiskIcon = riskConfig.icon;

  const getEntropyLevel = (entropy: number) => {
    if (entropy > 7.5) return { label: 'Very High', color: 'text-destructive' };
    if (entropy > 7) return { label: 'High', color: 'text-warning' };
    if (entropy > 5) return { label: 'Normal', color: 'text-success' };
    return { label: 'Low', color: 'text-muted-foreground' };
  };

  const entropyLevel = getEntropyLevel(result.entropy);

  return (
    <div className="space-y-4">
      {/* Risk Level Card */}
      <div className={`rounded-lg border ${riskConfig.border} ${riskConfig.bg} p-6`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${riskConfig.bg}`}>
            <RiskIcon className={`w-8 h-8 ${riskConfig.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-xl font-bold ${riskConfig.color}`}>
                {riskConfig.label}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {riskConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Entropy */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Entropy</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-foreground">
              {result.entropy}
            </span>
            <span className="text-sm text-muted-foreground">/ 8</span>
          </div>
          <p className={`text-xs mt-1 ${entropyLevel.color}`}>
            {entropyLevel.label} - {result.entropy > 7 
              ? 'Possibly encrypted or compressed' 
              : 'Normal byte distribution'}
          </p>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(result.entropy / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Suspicious Regions */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Suspicious Regions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-foreground">
              {result.suspiciousRegions}
            </span>
            <span className="text-sm text-muted-foreground">detected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            High-entropy sections or known patterns
          </p>
        </div>
      </div>

      {/* Pattern Matches */}
      {result.patternMatches.length > 0 && (
        <div className="rounded-lg bg-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-foreground">
                Pattern Matches ({result.patternMatches.length})
              </span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {result.patternMatches.map((pattern, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded bg-warning/5 border border-warning/20"
              >
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                <span className="text-sm font-mono text-foreground">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg bg-secondary/30 border border-border p-4">
        <p className="text-xs text-muted-foreground text-center">
          <strong className="text-foreground">Disclaimer:</strong> This is a static analysis tool based on 
          binary visualization and pattern matching. It does not execute files and cannot detect 
          all types of malware. For comprehensive security analysis, use dedicated antivirus software.
        </p>
      </div>
    </div>
  );
};
