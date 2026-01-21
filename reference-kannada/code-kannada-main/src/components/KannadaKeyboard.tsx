import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Space } from "lucide-react";

interface KannadaKeyboardProps {
  onKeyPress: (char: string) => void;
}

const KannadaKeyboard = ({ onKeyPress }: KannadaKeyboardProps) => {
  const [showVowels, setShowVowels] = useState(true);

  const vowels = [
    "ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ೠ",
    "ಎ", "ಏ", "ಐ", "ಒ", "ಓ", "ಔ", "ಅಂ", "ಅಃ"
  ];

  const consonants = [
    "ಕ", "ಖ", "ಗ", "ಘ", "ಙ",
    "ಚ", "ಛ", "ಜ", "ಝ", "ಞ",
    "ಟ", "ಠ", "ಡ", "ಢ", "ಣ",
    "ತ", "ಥ", "ದ", "ಧ", "ನ",
    "ಪ", "ಫ", "ಬ", "ಭ", "ಮ",
    "ಯ", "ರ", "ಲ", "ವ", "ಶ",
    "ಷ", "ಸ", "ಹ", "ಳ", "ೞ"
  ];

  const vowelSigns = [
    "ಾ", "ಿ", "ೀ", "ು", "ೂ", "ೃ",
    "ೆ", "ೇ", "ೈ", "ೊ", "ೋ", "ೌ", "್"
  ];

  const numbers = ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"];

  const currentKeys = showVowels ? vowels : consonants;

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={showVowels ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowVowels(true)}
        >
          ಸ್ವರಗಳು (Vowels)
        </Button>
        <Button
          variant={!showVowels ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowVowels(false)}
        >
          ವ್ಯಂಜನಗಳು (Consonants)
        </Button>
      </div>

      {/* Main keys */}
      <div className="grid grid-cols-8 gap-1.5">
        {currentKeys.map((char) => (
          <button
            key={char}
            onClick={() => onKeyPress(char)}
            className="h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors font-kannada text-lg font-medium"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Vowel signs */}
      {!showVowels && (
        <div className="grid grid-cols-7 gap-1.5">
          {vowelSigns.map((char) => (
            <button
              key={char}
              onClick={() => onKeyPress(char)}
              className="h-9 rounded-lg bg-secondary/10 hover:bg-secondary hover:text-secondary-foreground transition-colors font-kannada text-lg font-medium"
            >
              {char}
            </button>
          ))}
        </div>
      )}

      {/* Numbers row */}
      <div className="grid grid-cols-10 gap-1.5">
        {numbers.map((char) => (
          <button
            key={char}
            onClick={() => onKeyPress(char)}
            className="h-9 rounded-lg bg-accent/10 hover:bg-accent hover:text-accent-foreground transition-colors font-kannada text-base font-medium"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Control keys */}
      <div className="flex gap-2">
        <button
          onClick={() => onKeyPress("SPACE")}
          className="flex-1 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Space className="w-4 h-4" />
          Space
        </button>
        <button
          onClick={() => onKeyPress("BACKSPACE")}
          className="px-6 h-10 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Delete className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={() => onKeyPress("CLEAR")}
          className="px-6 h-10 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default KannadaKeyboard;
