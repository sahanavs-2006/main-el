import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Play, CheckCircle, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MainNav from "@/components/MainNav";

const tutorials = [
  {
    id: 1,
    title: "ಅಸ್ಥಿರಗಳು",
    titleEn: "Variables",
    description: "Learn how to store and use data in variables",
    descriptionKn: "ಅಸ್ಥಿರಗಳಲ್ಲಿ ಡೇಟಾವನ್ನು ಹೇಗೆ ಸಂಗ್ರಹಿಸುವುದು ಮತ್ತು ಬಳಸುವುದು ಎಂದು ಕಲಿಯಿರಿ",
    duration: "10 min",
    completed: true,
    lessons: 5,
  },
  {
    id: 2,
    title: "ಮುದ್ರಣ ಹೇಳಿಕೆಗಳು",
    titleEn: "Print Statements",
    description: "Display output on the screen using print",
    descriptionKn: "ಮುದ್ರಣವನ್ನು ಬಳಸಿ ಪರದೆಯ ಮೇಲೆ ಔಟ್‌ಪುಟ್ ಪ್ರದರ್ಶಿಸಿ",
    duration: "8 min",
    completed: true,
    lessons: 4,
  },
  {
    id: 3,
    title: "ಆಪರೇಟರ್‌ಗಳು",
    titleEn: "Operators",
    description: "Mathematical and logical operators in Python",
    descriptionKn: "ಪೈಥಾನ್‌ನಲ್ಲಿ ಗಣಿತ ಮತ್ತು ತಾರ್ಕಿಕ ಆಪರೇಟರ್‌ಗಳು",
    duration: "15 min",
    completed: false,
    lessons: 6,
  },
  {
    id: 4,
    title: "ಡೇಟಾ ಪ್ರಕಾರಗಳು",
    titleEn: "Data Types",
    description: "Understanding different data types",
    descriptionKn: "ವಿಭಿನ್ನ ಡೇಟಾ ಪ್ರಕಾರಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು",
    duration: "12 min",
    completed: false,
    lessons: 5,
  },
  {
    id: 5,
    title: "ಷರತ್ತು ಹೇಳಿಕೆಗಳು",
    titleEn: "Conditional Statements",
    description: "If-else conditions and decision making",
    descriptionKn: "If-else ಷರತ್ತುಗಳು ಮತ್ತು ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವಿಕೆ",
    duration: "20 min",
    completed: false,
    lessons: 8,
  },
  {
    id: 6,
    title: "ಲೂಪ್‌ಗಳು",
    titleEn: "Loops",
    description: "For and while loops for repetition",
    descriptionKn: "ಪುನರಾವರ್ತನೆಗಾಗಿ For ಮತ್ತು while ಲೂಪ್‌ಗಳು",
    duration: "25 min",
    completed: false,
    lessons: 10,
  },
  {
    id: 7,
    title: "ಕಾರ್ಯಗಳು",
    titleEn: "Functions",
    description: "Creating and using functions",
    descriptionKn: "ಕಾರ್ಯಗಳನ್ನು ರಚಿಸುವುದು ಮತ್ತು ಬಳಸುವುದು",
    duration: "18 min",
    completed: false,
    lessons: 7,
  },
  {
    id: 8,
    title: "ದೋಷ ನಿರ್ವಹಣೆ",
    titleEn: "Error Handling",
    description: "Handling errors and exceptions",
    descriptionKn: "ದೋಷಗಳು ಮತ್ತು ಅಪವಾದಗಳನ್ನು ನಿರ್ವಹಿಸುವುದು",
    duration: "15 min",
    completed: false,
    lessons: 6,
  },
];

const Tutorials = () => {
  const navigate = useNavigate();
  const [selectedTutorial, setSelectedTutorial] = useState<number | null>(null);

  const completedCount = tutorials.filter((t) => t.completed).length;
  const progressPercent = (completedCount / tutorials.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <MainNav />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                ಟ್ಯುಟೋರಿಯಲ್ಸ್
              </h1>
              <p className="text-muted-foreground">Tutorials - Learn at your own pace</p>
            </div>
          </div>

          {/* Progress */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {tutorials.length} completed
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </motion.div>

        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedTutorial(tutorial.id)}
              className={`glass-effect rounded-2xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-lg ${
                tutorial.completed ? "border-success/30" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${
                  tutorial.completed ? "bg-success/10" : "bg-secondary/10"
                } flex items-center justify-center`}>
                  {tutorial.completed ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-secondary" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {tutorial.duration}
                </div>
              </div>

              <h3 className="font-kannada text-xl font-semibold text-foreground mb-1">
                {tutorial.title}
              </h3>
              <p className="text-sm font-medium text-primary mb-2">{tutorial.titleEn}</p>
              <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{tutorial.lessons} lessons</span>
                <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                  {tutorial.completed ? "Review" : "Start"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tutorials;
