import { motion } from "framer-motion";
import { ArrowDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface TranslationPanelProps {
  kannadaText: string;
  englishText: string;
  isProcessing: boolean;
  currentStep: number;
}

const TranslationPanel = ({ kannadaText, englishText, isProcessing, currentStep }: TranslationPanelProps) => {
  const steps = [
    { label: "Kannada Input", sublabel: "ಕನ್ನಡ ಇನ್‌ಪುಟ್" },
    { label: "English Translation", sublabel: "ಆಂಗ್ಲ ಅನುವಾದ" },
    { label: "Code Generation", sublabel: "ಕೋಡ್ ಉತ್ಪಾದನೆ" },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep && isProcessing) return "processing";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <h2 className="text-lg font-semibold text-foreground">Translation Pipeline</h2>
        <p className="text-sm text-muted-foreground">Real-time processing stages</p>
      </div>

      {/* Progress steps */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    getStepStatus(index) === "completed"
                      ? "bg-success text-success-foreground"
                      : getStepStatus(index) === "processing"
                      ? "bg-primary text-primary-foreground"
                      : getStepStatus(index) === "current"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getStepStatus(index) === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : getStepStatus(index) === "processing" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground font-kannada">{step.sublabel}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-300 ${
                    index < currentStep ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Translation display */}
        {kannadaText && (
          <div className="space-y-4">
            {/* Kannada input display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Kannada</span>
              </div>
              <p className="font-kannada text-lg text-foreground">{kannadaText}</p>
            </motion.div>

            {/* Arrow */}
            {englishText && (
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            {/* English translation display */}
            {englishText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-secondary/5 border border-secondary/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">English</span>
                </div>
                <p className="text-lg text-foreground">{englishText}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!kannadaText && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Enter Kannada text to see the translation</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TranslationPanel;
