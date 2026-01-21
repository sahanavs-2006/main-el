import React, { useState } from 'react';
import { apiService } from '../services/api';
import InteractiveTerminal from './InteractiveTerminal';

const CodeExecutionPage = ({ onBack, initialCode, kannadaInput }) => {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState('');
  const [inputsText, setInputsText] = useState('');
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentExecutionStep, setCurrentExecutionStep] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);

  const ErrorModal = ({ message, onRetry, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-500/40 p-6">
        <h3 className="text-xl font-kannada font-bold mb-3 text-red-600 dark:text-red-300">ದೋಷ (Error)</h3>
        <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed mb-5 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
          >
            ಮುಚ್ಚಿ
          </button>
        </div>
      </div>
    </div>
  );

  const translateErrorToKannada = (errorMsg) => {
    // Common error translations
    const errorTranslations = {
      'Please enter some code to execute': 'ದಯವಿಟ್ಟು ಚಲಾಯಿಸಲು ಕೋಡ್ ನಮೂದಿಸಿ',
      'Failed to execute code': 'ಕೋಡ್ ಚಲಾಯಿಸುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ',
      'SyntaxError': 'ವ್ಯಾಕರಣ ದೋಷ',
      'NameError': 'ಹೆಸರು ದೋಷ',
      'TypeError': 'ಪ್ರಕಾರ ದೋಷ',
      'ValueError': 'ಮೌಲ್ಯ ದೋಷ',
      'IndentationError': 'ಇಂಡೆಂಟೇಶನ್ ದೋಷ',
      'ZeroDivisionError': 'ಶೂನ್ಯದಿಂದ ಭಾಗಾಕಾರ ದೋಷ',
      'IndexError': 'ಸೂಚಿ ದೋಷ',
      'KeyError': 'ಕೀ ದೋಷ',
      'AttributeError': 'ಗುಣಲಕ್ಷಣ ದೋಷ',
      'ImportError': 'ಆಮದು ದೋಷ',
      'ModuleNotFoundError': 'ಮಾಡ್ಯೂಲ್ ಕಂಡುಬಂದಿಲ್ಲ',
      'not defined': 'ವ್ಯಾಖ್ಯಾನಿಸಲಾಗಿಲ್ಲ',
      'invalid syntax': 'ಅಮಾನ್ಯ ವ್ಯಾಕರಣ',
      'unexpected indent': 'ಅನಿರೀಕ್ಷಿತ ಇಂಡೆಂಟ್',
      'cannot import': 'ಆಮದು ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ',
      'division by zero': 'ಶೂನ್ಯದಿಂದ ಭಾಗಾಕಾರ',
      'list index out of range': 'ಪಟ್ಟಿ ಸೂಚಿ ವ್ಯಾಪ್ತಿಯಿಂದ ಹೊರಗಿದೆ'
    };

    let translatedError = errorMsg;

    // Replace error types and messages
    Object.keys(errorTranslations).forEach(key => {
      if (translatedError.includes(key)) {
        translatedError = translatedError.replace(key, errorTranslations[key]);
      }
    });

    return translatedError;
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError(translateErrorToKannada('Please enter some code to execute'));
      return;
    }

    // Check if code uses input() - if so, use interactive terminal
    const needsInput = /input\s*\(/i.test(code);
    if (needsInput) {
      setShowTerminal(true);
      return;
    }

    // Parse inputs (comma or newline separated)
    const parsedInputs = inputsText
      .split(/\n|,/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    setIsRunning(true);
    setError(null);
    setOutput('');
    setExecutionSteps([]);
    setEmbedUrl('');
    setEmbedHtml('');

    try {
      // Step 1: Preparing code
      setCurrentExecutionStep('ಕೋಡ್ ತಯಾರಿಸುತ್ತಿದೆ...');
      setExecutionSteps([{ step: 1, name: 'ತಯಾರಿ', status: 'processing' }]);

      await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for UX

      // If we have original Kannada input, use the full pipeline for translation + generation
      if (kannadaInput && kannadaInput.trim()) {
        setExecutionSteps([{ step: 1, name: 'ತಯಾರಿ', status: 'complete' }]);

        // Step 2: Executing with Trinket
        setCurrentExecutionStep('Trinket IO ನಲ್ಲಿ ಚಲಾಯಿಸುತ್ತಿದೆ...');
        setExecutionSteps(prev => [...prev, { step: 2, name: 'ಚಾಲನೆ', status: 'processing' }]);

        const response = await apiService.fullPipeline(kannadaInput, true, parsedInputs);
        const data = response.data;

        if (data.error || data.error_kannada) {
          setError(translateErrorToKannada(data.error_kannada || data.error));
          setExecutionSteps(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'error' } : s));
          return;
        }

        setExecutionSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));

        // Step 3: Rendering output
        setCurrentExecutionStep('ಔಟ್‌ಪುಟ್ ತೋರಿಸುತ್ತಿದೆ...');
        setExecutionSteps(prev => [...prev, { step: 3, name: 'ಪೂರ್ಣಗೊಂಡಿದೆ', status: 'processing' }]);

        if (data.trinket_embed_url || data.trinket_iframe_html) {
          setEmbedUrl(data.trinket_embed_url || '');
          setEmbedHtml(data.trinket_iframe_html || '');
          setOutput(
            data.validation_output ||
            data.execution_output ||
            ''
          );
          setExecutionSteps(prev => prev.map(s => s.step === 3 ? { ...s, status: 'complete' } : s));
          setCurrentExecutionStep('ಯಶಸ್ವಿಯಾಗಿದೆ! ✓');
          return;
        }

        if (data.generated_code) {
          setOutput('Code generated successfully!\n\n' + data.generated_code);
          setExecutionSteps(prev => prev.map(s => s.step === 3 ? { ...s, status: 'complete' } : s));
          setCurrentExecutionStep('ಯಶಸ್ವಿಯಾಗಿದೆ! ✓');
          return;
        }

        setOutput('Code executed successfully!');
        setExecutionSteps(prev => prev.map(s => s.step === 3 ? { ...s, status: 'complete' } : s));
        setCurrentExecutionStep('ಯಶಸ್ವಿಯಾಗಿದೆ! ✓');
        return;
      }

      // Otherwise execute the code directly
      setExecutionSteps([{ step: 1, name: 'ತಯಾರಿ', status: 'complete' }]);

      // Step 2: Local execution
      setCurrentExecutionStep('ಸ್ಥಳೀಯವಾಗಿ ಚಲಾಯಿಸುತ್ತಿದೆ...');
      setExecutionSteps(prev => [...prev, { step: 2, name: 'ಚಾಲನೆ', status: 'processing' }]);

      const response = await apiService.executeCode(code, parsedInputs);
      const data = response.data;

      if (data.error) {
        setError(translateErrorToKannada(data.error));
        setExecutionSteps(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'error' } : s));
        return;
      }

      setOutput(data.output || 'Code executed successfully!');
      setExecutionSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));

      // Step 3: Complete
      setCurrentExecutionStep('ಯಶಸ್ವಿಯಾಗಿದೆ! ✓');
      setExecutionSteps(prev => [...prev, { step: 3, name: 'ಪೂರ್ಣಗೊಂಡಿದೆ', status: 'complete' }]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to execute code';
      setError(translateErrorToKannada(errorMsg));
      setExecutionSteps(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'error' } : s));
      console.error('Execution error:', err);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        setCurrentExecutionStep('');
        setExecutionSteps([]);
      }, 3000);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
    setError(null);
    setEmbedUrl('');
    setEmbedHtml('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Python Code Editor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600">💻</span>
              Python Code
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-teal-600/20 flex items-center gap-2 active:scale-95"
              >
                {isRunning ? (
                  <>
                    <span className="animate-spin text-white">⟳</span>
                    <span>ಚಲಾಯಿಸುತ್ತಿದೆ...</span>
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    <span>ಚಲಾಯಿಸಿ (Run)</span>
                  </>
                )}
              </button>
              <button
                onClick={handleClearOutput}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              >
                ತೆರವುಗೊಳಿಸಿ (Clear)
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none text-teal-700 dark:text-green-400 transition-all"
            placeholder="# Enter your Python code here..."
            spellCheck={false}
          />
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-black/50 backdrop-blur rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400 shadow-sm pointer-events-none">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Python 3</span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Lines: {code.split('\n').length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Python 3</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Ready</span>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">📤</span>
            Output
          </h3>
          <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-6 min-h-[200px] overflow-auto border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            {error ? (
              <div className="space-y-4">
                <div className="text-red-600 dark:text-red-400 font-bold text-lg font-kannada flex items-center gap-2">
                  <span>❌</span>
                  <span>ದೋಷ (Error)</span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-5">
                  <pre className="text-red-700 dark:text-red-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {error}
                  </pre>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium font-kannada flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span>ಸಲಹೆ: ಕೋಡ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</span>
                </div>
              </div>
            ) : output ? (
              <pre className="text-teal-600 dark:text-emerald-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="text-slate-400 dark:text-slate-500 font-kannada text-center py-16">
                <p className="text-5xl mb-6 grayscale opacity-50">📝</p>
                <p className="text-xl font-bold mb-2">ಔಟ್‌ಪುಟ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ</p>
                <p className="text-sm font-sans opacity-70">Click "ಚಲಾಯಿಸಿ" to execute code</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <ErrorModal
            message={error}
            onRetry={handleRunCode}
            onClose={() => setError(null)}
          />
        )}
        {showTerminal && (
          <InteractiveTerminal
            code={code}
            onClose={() => setShowTerminal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CodeExecutionPage;
