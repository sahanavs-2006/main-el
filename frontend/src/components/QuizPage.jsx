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

    // Update score immediately for real-time feedback
    const currentQuestion = questions[currentIndex];
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (selectedOption && selectedOption.is_correct) {
      setScore(prev => prev + 1);
    }
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 transition-colors duration-300">

        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center shadow-lg border-2 border-white dark:border-white/5">
              <HelpCircle className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-kannada tracking-wide">
            {selectedTopic.titleKannada}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium text-base">
            Test your Python knowledge in Kannada
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 mb-4 max-w-sm mx-auto">
            <div className="flex justify-around items-center mb-4">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white mb-0.5">
                  {loading ? '-' : questions.length}
                </span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Questions</span>
              </div>
              <div className="h-8 w-px bg-slate-100 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white mb-0.5">5</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Minutes</span>
              </div>
              <div className="h-8 w-px bg-slate-100 dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <Trophy className="w-5 h-5 text-teal-500 mb-0.5" />
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Earn Badge</span>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading || questions.length === 0}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 text-white font-bold py-3 rounded-lg text-base transition-all flex items-center justify-center gap-2 active:scale-95 group ${loading || questions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Start Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12 transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center animate-in bounce-in duration-700">
            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shadow-inner border-2 border-white dark:border-slate-800">
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {score === 5 ? 'Excellent!' : isGoodScore ? 'Well Done!' : 'Good Try!'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium mb-6">
            You scored {score} out of 5
          </p>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-6">
            {/* Attempt Bubbles (Image 2) */}
            <div className="flex justify-center gap-2 mb-4">
              {attempts.map((isCorrect, idx) => (
                <div key={idx} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isCorrect
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                  {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
              ))}
            </div>

            {/* Stars (Image 2) */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Sparkles
                  key={star}
                  className={`w-6 h-6 transition-all ${star <= score
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-200 dark:text-slate-800'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 border-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={() => { setSelectedTopic(null); setQuizState('topics'); }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all active:scale-95"
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex items-center justify-center">
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
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${((currentIndex + (selectedOptionId ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 pb-32">
        {/* Question Card (Image 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none mb-6 transition-all">
          <h2 className="text-slate-900 dark:text-white text-xl md:text-2xl font-extrabold font-kannada mb-3 leading-snug">
            {currentQuestion.question_kannada}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm italic border-l-2 border-slate-100 dark:border-slate-800 pl-3">
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
                className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${borderClass} ${bgClass} active:scale-[0.99]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base shadow-sm transition-colors ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                    {letter}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 text-base font-semibold font-kannada text-left">{option.option_text_kannada}</span>
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
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95 group"
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      className="group relative bg-white dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-white/50 rounded-3xl p-8 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-2 w-full overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center">

        <h3 className="text-slate-900 dark:text-white group-hover:text-black dark:group-hover:text-white text-2xl font-bold text-center font-kannada mb-2">{topic.titleKannada}</h3>
        <p className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 text-sm font-medium">{topic.titleEnglish}</p>
      </div>
    </button>
  );
};

export default QuizPage;
