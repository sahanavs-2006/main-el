import React, { useState } from 'react';
import { apiService } from '../services/api';
import InteractiveTerminal from './InteractiveTerminal';

const CodeExecutionPage = ({ onBack, initialCode, kannadaInput, defaultShowTerminal }) => {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState('');
  const [inputsText, setInputsText] = useState('');
  const [executionSteps, setExecutionSteps] = useState([]);
  const [currentExecutionStep, setCurrentExecutionStep] = useState('');
  const [showTerminal, setShowTerminal] = useState(defaultShowTerminal || false);

  const ErrorModal = ({ message, onRetry, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-500/40 p-6">
        <h3 className="text-xl font-kannada font-bold mb-3 text-red-600 dark:text-red-300">ದೋಷ (Error)</h3>
        <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed mb-5 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors"
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

      let success = false;
      let resultData = {};

      try {
        // --- ATTEMPT REAL BACKEND EXECUTION ---

        // If we have original Kannada input, use the full pipeline for translation + generation
        if (kannadaInput && kannadaInput.trim()) {
          setExecutionSteps([{ step: 1, name: 'ತಯಾರಿ', status: 'complete' }]);

          // Step 2: Executing with Trinket/Backend
          setCurrentExecutionStep('Trinket IO ನಲ್ಲಿ ಚಲಾಯಿಸುತ್ತಿದೆ...');
          setExecutionSteps(prev => [...prev, { step: 2, name: 'ಚಾಲನೆ', status: 'processing' }]);

          const response = await apiService.fullPipeline(kannadaInput, true, parsedInputs);
          const data = response.data;

          if (data.error || data.error_kannada) {
            throw new Error(data.error_kannada || data.error);
          }

          resultData = data;
          success = true;
        } else {
          // Otherwise execute the code directly
          setExecutionSteps([{ step: 1, name: 'ತಯಾರಿ', status: 'complete' }]);

          // Step 2: Local execution
          setCurrentExecutionStep('ಸ್ಥಳೀಯವಾಗಿ ಚಲಾಯಿಸುತ್ತಿದೆ...');
          setExecutionSteps(prev => [...prev, { step: 2, name: 'ಚಾಲನೆ', status: 'processing' }]);

          const response = await apiService.executeCode(code, parsedInputs);
          const data = response.data;

          if (data.error) {
            throw new Error(data.error);
          }

          resultData = data;
          success = true;
        }

      } catch (backendError) {
        console.error("Execution API Error:", backendError);
        const errorMessage = backendError.response?.data?.error_kannada ||
          backendError.response?.data?.error ||
          backendError.message ||
          "ಕೋಡ್ ಚಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ (Could not execute code)";
        throw new Error(errorMessage);
      }

      // --- HANDLE RESULTS (Shared for both Real & Demo) ---

      if (success) {
        // Step 2 Completion
        setExecutionSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));

        // Step 3: Rendering output
        setCurrentExecutionStep('ಔಟ್‌ಪುಟ್ ತೋರಿಸುತ್ತಿದೆ...');
        setExecutionSteps(prev => [...prev, { step: 3, name: 'ಪೂರ್ಣಗೊಂಡಿದೆ', status: 'processing' }]);

        if (resultData.trinket_embed_url || resultData.trinket_iframe_html) {
          setEmbedUrl(resultData.trinket_embed_url || '');
          setEmbedHtml(resultData.trinket_iframe_html || '');
          setOutput(
            resultData.validation_output ||
            resultData.execution_output ||
            ''
          );
        } else if (resultData.generated_code && kannadaInput) {
          // If it was a pipeline run
          setOutput('Code generated successfully!\n\n' + resultData.generated_code);
        } else {
          setOutput(resultData.output || 'Code executed successfully!');
        }

        // Finalize
        setExecutionSteps(prev => prev.map(s => s.step === 3 ? { ...s, status: 'complete' } : s));
        setCurrentExecutionStep('ಯಶಸ್ವಿಯಾಗಿದೆ! ✓');
      }

    } catch (err) {
      const errorMsg = err.message || 'Failed to execute code';
      // Only show error if we strictly couldn't fallback (e.g. really bad data)
      // unlikely to reach here with the catch-all fallback above, but safety net
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col gap-4 h-[calc(100vh-80px)]">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white font-bold text-lg flex items-center gap-2 transition-colors px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <span>←</span>
            <span>ಹಿಂದೆ ಹೋಗಿ (Back)</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Python Code Editor */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {/* <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">💻</span> */}
                Python Code
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-slate-900 hover:bg-black text-white font-bold py-2 px-6 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95"
                >
                  {isRunning ? (
                    <>
                      <span className="animate-spin text-white">⟳</span>
                      <span>Running...</span>
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
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                >
                  ತೆರವುಗೊಳಿಸಿ
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <textarea
                readOnly={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono text-sm resize-none text-slate-800 dark:text-slate-300 transition-all font-medium leading-relaxed"
                placeholder="# Enter your Python code here..."
                spellCheck={false}
              />
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Lines: {code.split('\n').length}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Python 3</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Ready</span>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300 flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              {/* <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">📤</span> */}
              Output
            </h3>
            <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-6 flex-1 h-full overflow-auto border border-slate-100 dark:border-slate-800 transition-colors duration-300">
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
                <pre className="text-slate-800 dark:text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
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
    </div>
  );
};

export default CodeExecutionPage;
