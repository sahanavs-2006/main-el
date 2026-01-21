import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check, Terminal, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodePanelProps {
  pythonCode: string;
  isExecuting: boolean;
  output: string;
  error: string;
  kannadaError: string;
  onExecute: () => void;
}

const CodePanel = ({ pythonCode, isExecuting, output, error, kannadaError, onExecute }: CodePanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Python Code</h2>
          <p className="text-sm text-muted-foreground">Generated from your algorithm</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!pythonCode}>
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={onExecute}
            disabled={!pythonCode || isExecuting}
          >
            {isExecuting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 overflow-auto">
        {pythonCode ? (
          <div className="p-4">
            <pre className="p-4 rounded-xl bg-foreground/5 overflow-x-auto">
              <code className="font-mono text-sm text-foreground">{pythonCode}</code>
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Terminal className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Python code will appear here after translation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Output / Error section */}
      {(output || error) && (
        <div className="border-t border-border">
          <div className="px-6 py-3 bg-muted/30 flex items-center gap-2">
            {error ? (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            ) : (
              <Terminal className="w-4 h-4 text-success" />
            )}
            <span className="text-sm font-medium">
              {error ? "Error" : "Output"}
            </span>
          </div>
          <div className="p-4">
            {output && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-success/5 border border-success/20"
              >
                <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <pre className="font-mono text-sm text-destructive whitespace-pre-wrap">{error}</pre>
                </div>
                {kannadaError && (
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">ಕನ್ನಡದಲ್ಲಿ ದೋಷ:</p>
                    <p className="font-kannada text-sm text-foreground">{kannadaError}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CodePanel;
