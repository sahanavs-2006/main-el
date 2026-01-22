import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import ConverterPage from './components/ConverterPage';
import CodeExecutionPage from './components/CodeExecutionPage';
import QuizPage from './components/QuizPage';
import StudyMaterials from './components/StudyMaterials';
import LoginPage from './components/LoginPage';
import AboutPage from './components/AboutPage';
import Leaderboard from './components/Leaderboard';
import TutorialsPage from './components/TutorialsPage';
import Footer from './components/Footer';

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [executionData, setExecutionData] = useState({ code: '', input: '' });
  const [algorithmData, setAlgorithmData] = useState({ kannada: '', english: '' });

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    console.log('Theme changed to:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  const handleNavigateToExecution = (code, input) => {
    setExecutionData({ code, input });
    setPage('execution');
  };

  const contentPadding = (page === 'home' || page === 'login' || page === 'dashboard' || page === 'about' || page === 'quiz' || page === 'leaderboard' || page === 'converter' || page === 'materials' || page === 'execution' || page === 'tutorials') ? '' : 'pt-28'; // offset for fixed navbar

  if (page === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLogin}
        onBack={() => setPage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50">
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={setPage}
        activePage={page}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className={contentPadding}>
        {page === 'home' ? (
          <HomeHero onNavigate={() => setPage('dashboard')} />
        ) : page === 'dashboard' ? (
          <Dashboard
            onNavigateToConverter={() => setPage('converter')}
            onNavigateToQuiz={() => setPage('quiz')}
            onNavigateToTutorials={() => setPage('tutorials')}
            onNavigateToMaterials={() => setPage('materials')}
            onNavigateToNotes={() => setPage('notes')}
            onNavigateToAbout={() => setPage('about')}
            algorithmData={algorithmData}
            user={user}
          />
        ) : page === 'about' ? (
          <AboutPage />
        ) : page === 'quiz' ? (
          <QuizPage
            onBack={() => setPage('dashboard')}
            onNavigateToLeaderboard={() => setPage('leaderboard')}
          />
        ) : page === 'leaderboard' ? (
          <Leaderboard onBack={() => setPage('quiz')} />
        ) : page === 'tutorials' ? (
          <TutorialsPage
            onBack={() => setPage('dashboard')}
            onTryCode={(code) => {
              setExecutionData({ code: code || '', input: '', showTerminal: true, fromTutorials: true });
              setPage('execution');
            }}
          />
        ) : page === 'materials' ? (
          <StudyMaterials onBack={() => setPage('dashboard')} />
        ) : page === 'notes' ? (
          <div className="p-8 text-center text-slate-500">Notes Page (Coming Soon)</div>
        ) : page === 'execution' ? (
          <CodeExecutionPage
            onBack={() => setPage(executionData.fromTutorials ? 'tutorials' : 'converter')}
            initialCode={executionData.code}
            kannadaInput={executionData.input}
            defaultShowTerminal={executionData.showTerminal}
          />
        ) : (
          <ConverterPage
            onBack={() => setPage('dashboard')}
            onNavigateToExecution={handleNavigateToExecution}
            onAlgorithmTranslated={(kannada, english) => {
              setAlgorithmData({ kannada, english });
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
