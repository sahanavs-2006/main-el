import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  Trophy,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock
} from 'lucide-react';

const QuizPage = ({ onBack, onNavigateToLeaderboard }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [category, setCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizState, setQuizState] = useState('topics'); // 'topics', 'intro', 'playing', 'results'
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]); // Array of { is_correct: bool }

  // Topics configuration based on the design
  const topics = [
    { id: 'print', titleKannada: 'ಮುದ್ರಿಸಿ ಹೇಳಿಕೆ', titleEnglish: 'Print Statement', category: 'basic_syntax' },
    { id: 'datatype', titleKannada: 'ಡೇಟಾಟೈಪ್', titleEnglish: 'Data Type', category: 'data_structures' },
    { id: 'variable', titleKannada: 'ವೇರಿಯಬಲ್', titleEnglish: 'Variable', category: 'basic_syntax' },
    { id: 'operators', titleKannada: 'ನಿರ್ವಹಕಗಳು', titleEnglish: 'Operators', category: 'basic_syntax' },
    { id: 'conditional', titleKannada: 'ಷರತ್ತುಬದ್ಧ ಹೇಳಿಕೆಗಳು', titleEnglish: 'Conditional Statements', category: 'conditionals' },
    { id: 'loops', titleKannada: 'ಲೂಪ್ ಹೇಳಿಕೆಗಳು', titleEnglish: 'Loop Statements', category: 'loops' },
  ];

  useEffect(() => {
    fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      let url = `${API_URL}/public/quiz-questions/`;

      if (category !== 'all') {
        // Fetch questions by category and limit to 5
        url = `${API_URL}/public/quiz-questions/by_category/?category=${category}`;
      }

      console.log('Fetching from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);

      // Handle both paginated and direct array responses
      let questionList = Array.isArray(data) ? data : (data.results || []);

      // Limit to 5 questions per topic
      questionList = questionList.slice(0, 5);
      console.log('Questions (limited to 5):', questionList);

      setQuestions(questionList);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setShowResults(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    const newAttempts = [];
    questions.forEach((q, idx) => {
      const selectedOptionId = selectedAnswers[idx];
      const option = q.options.find(o => o.id === selectedOptionId);
      const isCorrect = option?.is_correct || false;
      if (isCorrect) correct++;
      newAttempts.push(isCorrect);
    });
    setScore(correct);
    setAttempts(newAttempts);
    setQuizState('results');
  };

  const handleRetry = () => {
    setQuizState('playing');
    setScore(0);
    setAttempts([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCategory(topic.category);
    setQuizState('intro');
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuizState('topics');
    setCategory('all');
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      setError('Questions are still loading. Please wait...');
      return;
    }
    setQuizState('playing');
    setScore(0);
    setAttempts([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
  };

  const ErrorModal = ({ message, onRetry }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-500/40 p-6">
        <h3 className="text-xl font-kannada font-bold mb-3 text-red-600 dark:text-red-300">ಸಾರಿಯಾದ ಉತ್ತರ</h3>
        <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed mb-5 whitespace-pre-wrap">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
          >
            ಹಿಂತಿರುಗಿ
          </button>
        </div>
      </div>
    </div>
  );

  // Topics Selection Screen
  if (quizState === 'topics') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-kannada">
              ಕ್ವಿಜ್ ವಿಷಯಗಳು
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Select a topic to test your knowledge
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={onBack}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Intro Screen (Image 0)
  if (quizState === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-12 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2rem] bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shadow-lg border-2 border-white dark:border-white/5">
              <HelpCircle className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 font-kannada tracking-wide">
            {selectedTopic.titleKannada}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg">
            Test your Python knowledge in Kannada
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 mb-8">
            <div className="flex justify-around items-center mb-12">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {loading ? '-' : questions.length}
                </span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Questions</span>
              </div>
              <div className="h-14 w-px bg-slate-100 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">5</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Minutes</span>
              </div>
              <div className="h-14 w-px bg-slate-100 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <Trophy className="w-9 h-9 text-orange-400 mb-1" />
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Earn Badge</span>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading || questions.length === 0}
              className={`w-full bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-500 hover:shadow-2xl hover:shadow-orange-500/30 text-white font-bold py-6 rounded-2xl text-xl transition-all flex items-center justify-center gap-3 active:scale-95 group ${loading || questions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  Start Quiz <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setQuizState('topics')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
          >
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // Results Screen (Image 2)
  if (quizState === 'results') {
    const isGoodScore = score >= 3;
    const stars = Math.ceil((score / 5) * 5);

    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-12 transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center animate-in bounce-in duration-700">
            <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shadow-inner border-4 border-white dark:border-slate-800">
              <Trophy className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            {score === 5 ? 'Excellent!' : isGoodScore ? 'Well Done!' : 'Good Try!'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-12">
            You scored {score} out of 5
          </p>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 mb-10">
            {/* Attempt Bubbles (Image 2) */}
            <div className="flex justify-center gap-4 mb-8">
              {attempts.map((isCorrect, idx) => (
                <div key={idx} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCorrect
                  ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 shadow-sm'
                  : 'bg-red-50 text-red-600 border-2 border-red-100 shadow-sm'
                  }`}>
                  {isCorrect ? <CheckCircle className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                </div>
              ))}
            </div>

            {/* Stars (Image 2) */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Sparkles
                  key={star}
                  className={`w-10 h-10 transition-all ${star <= score
                    ? 'text-yellow-400 fill-yellow-400 scale-110'
                    : 'text-slate-200 dark:text-slate-800'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 border-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 font-bold py-5 rounded-3xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
            <button
              onClick={() => { setSelectedTopic(null); setQuizState('topics'); }}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-5 rounded-3xl shadow-xl shadow-teal-500/20 hover:shadow-2xl transition-all active:scale-95"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - if no questions loaded yet, show loading
  if (quizState === 'playing' && (loading || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-bold">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = selectedAnswers[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-300">
      {/* Quiz Progress Header (Image 1) */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-extrabold font-mono">Score: {score}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-700 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 pb-32">
        {/* Question Card (Image 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none mb-8 transition-all">
          <h2 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-extrabold font-kannada mb-4 leading-tight">
            {currentQuestion.question_kannada}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-base italic border-l-4 border-slate-100 dark:border-slate-800 pl-4">
            {currentQuestion.question_english || "What is the correct syntax for this operation?"}
          </p>
        </div>

        {/* Options List (Image 1 & 3) */}
        <div className="space-y-5">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.is_correct;
            const hasAnswered = !!selectedOptionId;

            let borderClass = "border-transparent";
            let bgClass = "bg-white dark:bg-slate-900";
            let statusIcon = null;

            if (hasAnswered) {
              if (isCorrect) {
                borderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                bgClass = "bg-emerald-50/50 dark:bg-emerald-900/10";
                statusIcon = <CheckCircle className="w-7 h-7 text-emerald-500 animate-in zoom-in" />;
              } else if (isSelected && !isCorrect) {
                borderClass = "border-red-500 ring-2 ring-red-500/20";
                bgClass = "bg-red-50/50 dark:bg-red-900/10";
                statusIcon = <XCircle className="w-7 h-7 text-red-500 animate-in zoom-in" />;
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={hasAnswered}
                className={`w-full group flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${borderClass} ${bgClass} active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner transition-colors ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                    {letter}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 text-lg font-bold font-kannada text-left">{option.option_text_kannada}</span>
                </div>
                {statusIcon}
              </button>
            );
          })}
        </div>

        {/* Next Button Footer (Image 1 context) */}
        {selectedOptionId && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-100 dark:border-white/5 p-8 animate-in slide-in-from-bottom-10 shadow-2xl">
            <div className="max-w-4xl mx-auto flex justify-end">
              <button
                onClick={handleNext}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-[1.5rem] font-bold text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95 group"
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// TopicCard Component
const TopicCard = ({ topic, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(topic)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full overflow-hidden"
    >
      {/* Background Gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-slate-900 dark:text-white group-hover:text-white text-2xl font-bold text-center font-kannada mb-2">{topic.titleKannada}</h3>
        <p className="text-cyan-600 dark:text-cyan-400 group-hover:text-white/80 text-sm font-medium">{topic.titleEnglish}</p>
      </div>
    </button>
  );
};

export default QuizPage;
