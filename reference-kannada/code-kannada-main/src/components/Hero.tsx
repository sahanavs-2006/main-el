import { motion } from "framer-motion";
import { ArrowRight, Mic, Keyboard, Code2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const pipelineSteps = [
    { icon: Mic, label: "ಕನ್ನಡ", sublabel: "Kannada Input" },
    { icon: ArrowRight, label: "", sublabel: "" },
    { icon: Code2, label: "NLP", sublabel: "Translation" },
    { icon: ArrowRight, label: "", sublabel: "" },
    { icon: Play, label: "Python", sublabel: "Execution" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              NLP-Powered Language Bridge
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">Code in </span>
            <span className="text-gradient font-kannada">ಕನ್ನಡ</span>
            <br />
            <span className="text-foreground">Execute in </span>
            <span className="text-secondary">Python</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Write algorithms in your native Kannada language and watch them transform into executable Python code through AI-powered translation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              <Keyboard className="w-5 h-5" />
              Start Coding
            </Button>
            <Button variant="outline" size="xl">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 sm:p-8"
        >
          <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
            Translation Pipeline
          </p>
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center"
              >
                {step.label === "" ? (
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-primary/10 text-primary' :
                      index === 2 ? 'bg-accent/10 text-accent' :
                      'bg-secondary/10 text-secondary'
                    }`}>
                      <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold text-sm ${index === 0 ? 'font-kannada' : ''}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
