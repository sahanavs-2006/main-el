import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNav from "@/components/MainNav";
import Hero from "@/components/Hero";
import InputPanel from "@/components/InputPanel";
import TranslationPanel from "@/components/TranslationPanel";
import CodePanel from "@/components/CodePanel";

const Code = () => {
  const [showEditor, setShowEditor] = useState(true);
  const [kannadaText, setKannadaText] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [kannadaError, setKannadaError] = useState("");

  // Mock translation and code generation
  const handleTranslate = async () => {
    if (!kannadaText.trim()) return;

    setIsProcessing(true);
    setCurrentStep(0);
    setEnglishText("");
    setPythonCode("");
    setOutput("");
    setError("");
    setKannadaError("");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentStep(1);

    const mockTranslations: Record<string, string> = {
      "ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಸೇರಿಸಿ": "Add two numbers",
      "ಫಿಬೊನಾಚಿ ಸರಣಿ ಮುದ್ರಿಸಿ": "Print Fibonacci series",
      "ಸಂಖ್ಯೆ ಸಮ ಅಥವಾ ಬೆಸ ಎಂದು ಪರಿಶೀಲಿಸಿ": "Check if number is even or odd",
      "ಒಂದು ಸಂಖ್ಯೆಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ಅದನ್ನು ಎರಡರಿಂದ ಗುಣಿಸಿ": "Take a number and multiply it by two",
    };

    const translatedText = mockTranslations[kannadaText] || "Process the given algorithm";
    setEnglishText(translatedText);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCurrentStep(2);

    const mockCode: Record<string, string> = {
      "Add two numbers": `# Program to add two numbers
def add_numbers(a, b):
    """Add two numbers and return the result."""
    return a + b

# Example usage
num1 = 10
num2 = 20
result = add_numbers(num1, num2)
print(f"The sum of {num1} and {num2} is: {result}")`,

      "Print Fibonacci series": `# Program to print Fibonacci series
def fibonacci(n):
    """Generate Fibonacci series up to n terms."""
    series = []
    a, b = 0, 1
    for _ in range(n):
        series.append(a)
        a, b = b, a + b
    return series

# Print first 10 Fibonacci numbers
n_terms = 10
fib_series = fibonacci(n_terms)
print(f"Fibonacci series ({n_terms} terms): {fib_series}")`,

      "Check if number is even or odd": `# Program to check if a number is even or odd
def check_even_odd(number):
    """Check if a number is even or odd."""
    if number % 2 == 0:
        return "even"
    else:
        return "odd"

# Example usage
num = 7
result = check_even_odd(num)
print(f"The number {num} is {result}.")`,

      "Take a number and multiply it by two": `# Program to multiply a number by two
def multiply_by_two(number):
    """Multiply the given number by two."""
    return number * 2

# Example usage
num = 5
result = multiply_by_two(num)
print(f"{num} multiplied by 2 is: {result}")`,
    };

    const generatedCode = mockCode[translatedText] || `# Generated Python code
# Based on: "${translatedText}"

def main():
    # Your algorithm implementation here
    print("Algorithm executed successfully!")

if __name__ == "__main__":
    main()`;

    setPythonCode(generatedCode);
    setCurrentStep(3);
    setIsProcessing(false);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput("");
    setError("");
    setKannadaError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockOutputs: Record<string, string> = {
      add_numbers: "The sum of 10 and 20 is: 30",
      fibonacci: "Fibonacci series (10 terms): [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
      check_even_odd: "The number 7 is odd.",
      multiply_by_two: "5 multiplied by 2 is: 10",
    };

    if (pythonCode.includes("add_numbers")) {
      setOutput(mockOutputs["add_numbers"]);
    } else if (pythonCode.includes("fibonacci")) {
      setOutput(mockOutputs["fibonacci"]);
    } else if (pythonCode.includes("check_even_odd")) {
      setOutput(mockOutputs["check_even_odd"]);
    } else if (pythonCode.includes("multiply_by_two")) {
      setOutput(mockOutputs["multiply_by_two"]);
    } else {
      setOutput("Algorithm executed successfully!");
    }

    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <MainNav />

      <main className="pt-20">
        {/* Editor Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Start Coding in <span className="font-kannada text-gradient">ಕನ್ನಡ</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Write your algorithm in Kannada and watch it transform into executable Python code
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputPanel
                  kannadaText={kannadaText}
                  setKannadaText={setKannadaText}
                  onTranslate={handleTranslate}
                  isProcessing={isProcessing}
                />
                <TranslationPanel
                  kannadaText={kannadaText}
                  englishText={englishText}
                  isProcessing={isProcessing}
                  currentStep={currentStep}
                />
              </div>

              <CodePanel
                pythonCode={pythonCode}
                isExecuting={isExecuting}
                output={output}
                error={error}
                kannadaError={kannadaError}
                onExecute={handleExecute}
              />
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Learn Coding in Kannada?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Breaking language barriers in programming education
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Native Language Input",
                  description: "Write algorithms in your mother tongue, making programming concepts easier to understand.",
                  emoji: "🗣️",
                },
                {
                  title: "AI-Powered Translation",
                  description: "Advanced NLP models convert your Kannada descriptions into accurate Python code.",
                  emoji: "🤖",
                },
                {
                  title: "Instant Execution",
                  description: "Run your code immediately and see results with errors translated back to Kannada.",
                  emoji: "⚡",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Code;
