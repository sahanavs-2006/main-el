import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Trophy, Star, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MainNav from "@/components/MainNav";

const quizQuestions = [
  {
    id: 1,
    question: "ಪೈಥಾನ್‌ನಲ್ಲಿ ಅಸ್ಥಿರವನ್ನು ಘೋಷಿಸಲು ಯಾವ ಕೀವರ್ಡ್ ಬಳಸಲಾಗುತ್ತದೆ?",
    questionEn: "What keyword is used to declare a variable in Python?",
    options: [
      { text: "var", correct: false },
      { text: "let", correct: false },
      { text: "No keyword needed", correct: true },
      { text: "dim", correct: false },
    ],
  },
  {
    id: 2,
    question: "print() ಕಾರ್ಯವು ಏನು ಮಾಡುತ್ತದೆ?",
    questionEn: "What does the print() function do?",
    options: [
      { text: "Takes input from user", correct: false },
      { text: "Displays output on screen", correct: true },
      { text: "Creates a variable", correct: false },
      { text: "Performs calculation", correct: false },
    ],
  },
  {
    id: 3,
    question: "ಪೈಥಾನ್‌ನಲ್ಲಿ // ಆಪರೇಟರ್ ಏನು ಮಾಡುತ್ತದೆ?",
    questionEn: "What does the // operator do in Python?",
    options: [
      { text: "Division", correct: false },
      { text: "Floor Division", correct: true },
      { text: "Modulus", correct: false },
      { text: "Power", correct: false },
    ],
  },
  {
    id: 4,
    question: "ಪೈಥಾನ್‌ನಲ್ಲಿ ಷರತ್ತು ಹೇಳಿಕೆಗೆ ಯಾವ ಕೀವರ್ಡ್ ಬಳಸಲಾಗುತ್ತದೆ?",
    questionEn: "Which keyword is used for conditional statement in Python?",
    options: [
      { text: "switch", correct: false },
      { text: "case", correct: false },
      { text: "if", correct: true },
      { text: "when", correct: false },
    ],
  },
  {
    id: 5,
    question: "ಲೂಪ್ ಅನ್ನು ಅಕಾಲಿಕವಾಗಿ ನಿಲ್ಲಿಸಲು ಯಾವ ಕೀವರ್ಡ್ ಬಳಸಲಾಗುತ್ತದೆ?",
    questionEn: "Which keyword is used to stop a loop prematurely?",
    options: [
      { text: "stop", correct: false },
      { text: "exit", correct: false },
      { text: "end", correct: false },
      { text: "break", correct: true },
    ],
  },
];

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(optionIndex);
    const isCorrect = quizQuestions[currentQuestion].options[optionIndex].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswers([...answers, isCorrect]);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <MainNav />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                ಕ್ವಿಜ್‌ಗಳು
              </h1>
              <p className="text-muted-foreground mb-8">Test your Python knowledge in Kannada</p>

              <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{quizQuestions.length}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">5</p>
                    <p className="text-sm text-muted-foreground">Minutes</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-accent mx-auto" />
                    <p className="text-sm text-muted-foreground">Earn Badge</p>
                  </div>
                </div>

                <Button variant="hero" size="xl" onClick={handleStartQuiz} className="w-full">
                  Start Quiz
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                score >= quizQuestions.length * 0.7 ? "bg-success/10" : "bg-accent/10"
              }`}>
                <Trophy className={`w-12 h-12 ${
                  score >= quizQuestions.length * 0.7 ? "text-success" : "text-accent"
                }`} />
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">
                {score >= quizQuestions.length * 0.7 ? "Excellent!" : "Good Try!"}
              </h2>
              <p className="text-muted-foreground mb-8">
                You scored {score} out of {quizQuestions.length}
              </p>

              <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto mb-8">
                <div className="flex justify-center gap-2 mb-4">
                  {answers.map((correct, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        correct ? "bg-success/10" : "bg-destructive/10"
                      }`}
                    >
                      {correct ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.ceil((score / quizQuestions.length) * 5)
                          ? "text-accent fill-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" size="lg" onClick={resetQuiz}>
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button variant="hero" size="lg" onClick={() => navigate("/tutorials")}>
                  Learn More
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Score: {score}
                  </span>
                </div>
                <Progress
                  value={((currentQuestion + 1) / quizQuestions.length) * 100}
                  className="h-2"
                />
              </div>

              {/* Question */}
              <div className="glass-effect rounded-2xl p-8 mb-6">
                <h2 className="font-kannada text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  {quizQuestions[currentQuestion].question}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {quizQuestions[currentQuestion].questionEn}
                </p>
              </div>

              {/* Options */}
              <div className="grid gap-4">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = option.correct;
                  const showCorrectness = selectedAnswer !== null;

                  return (
                    <motion.button
                      key={index}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        showCorrectness
                          ? isCorrect
                            ? "bg-success/10 border-2 border-success"
                            : isSelected
                            ? "bg-destructive/10 border-2 border-destructive"
                            : "glass-effect opacity-50"
                          : "glass-effect hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                          showCorrectness
                            ? isCorrect
                              ? "bg-success text-success-foreground"
                              : isSelected
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted text-muted-foreground"
                            : "bg-muted text-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium text-foreground">{option.text}</span>
                        {showCorrectness && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-success ml-auto" />
                        )}
                        {showCorrectness && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-destructive ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Quizzes;
