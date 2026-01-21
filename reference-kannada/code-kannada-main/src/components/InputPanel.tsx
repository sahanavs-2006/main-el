import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Keyboard, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import KannadaKeyboard from "./KannadaKeyboard";

interface InputPanelProps {
  kannadaText: string;
  setKannadaText: (text: string) => void;
  onTranslate: () => void;
  isProcessing: boolean;
}

const InputPanel = ({ kannadaText, setKannadaText, onTranslate, isProcessing }: InputPanelProps) => {
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState<"speech" | "keyboard">("keyboard");

  // Speech recognition (mock for demo - would use Web Speech API)
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech recognition
      setTimeout(() => {
        setKannadaText(kannadaText + "ಒಂದು ಸಂಖ್ಯೆಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ಅದನ್ನು ಎರಡರಿಂದ ಗುಣಿಸಿ");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleKeyboardInput = (char: string) => {
    if (char === "BACKSPACE") {
      setKannadaText(kannadaText.slice(0, -1));
    } else if (char === "SPACE") {
      setKannadaText(kannadaText + " ");
    } else if (char === "CLEAR") {
      setKannadaText("");
    } else {
      setKannadaText(kannadaText + char);
    }
  };

  const examplePrompts = [
    { kannada: "ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಸೇರಿಸಿ", english: "Add two numbers" },
    { kannada: "ಫಿಬೊನಾಚಿ ಸರಣಿ ಮುದ್ರಿಸಿ", english: "Print Fibonacci series" },
    { kannada: "ಸಂಖ್ಯೆ ಸಮ ಅಥವಾ ಬೆಸ ಎಂದು ಪರಿಶೀಲಿಸಿ", english: "Check if number is even or odd" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Kannada Input</h2>
            <p className="text-sm text-muted-foreground">ಕನ್ನಡದಲ್ಲಿ ಅಲ್ಗಾರಿದಮ್ ಬರೆಯಿರಿ</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={inputMode === "speech" ? "default" : "ghost"}
              size="icon"
              onClick={() => setInputMode("speech")}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              variant={inputMode === "keyboard" ? "default" : "ghost"}
              size="icon"
              onClick={() => setInputMode("keyboard")}
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Text area */}
        <div className="relative">
          <Textarea
            value={kannadaText}
            onChange={(e) => setKannadaText(e.target.value)}
            placeholder="ಇಲ್ಲಿ ನಿಮ್ಮ ಅಲ್ಗಾರಿದಮ್ ಬರೆಯಿರಿ... (Write your algorithm here...)"
            className="min-h-[150px] font-kannada text-lg resize-none bg-background"
          />
          {isListening && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-primary">
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Listening...</span>
            </div>
          )}
        </div>

        {/* Input mode content */}
        <AnimatePresence mode="wait">
          {inputMode === "speech" ? (
            <motion.div
              key="speech"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <Button
                variant={isListening ? "destructive" : "hero"}
                size="xl"
                onClick={toggleListening}
                className="rounded-full w-20 h-20"
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Tap to stop" : "Tap to speak in Kannada"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="keyboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <KannadaKeyboard onKeyPress={handleKeyboardInput} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example prompts */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setKannadaText(prompt.kannada)}
                className="px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <span className="font-kannada block">{prompt.kannada}</span>
                <span className="text-xs text-muted-foreground">{prompt.english}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Translate button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={onTranslate}
          disabled={!kannadaText.trim() || isProcessing}
        >
          {isProcessing ? "Processing..." : "Translate & Generate Code"}
        </Button>
      </div>
    </motion.div>
  );
};

export default InputPanel;
