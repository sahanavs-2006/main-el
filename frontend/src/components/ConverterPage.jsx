import React, { useState } from 'react';
import { apiService } from '../services/api';

const ConverterPage = ({ onBack, onNavigateToExecution, onAlgorithmTranslated }) => {
  const [kannadaInput, setKannadaInput] = useState('');
  const [pythonCode, setPythonCode] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [keyboardMode, setKeyboardMode] = useState('varnamala');
  const [selectedBase, setSelectedBase] = useState('');
  const [processingSteps, setProcessingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const varnamalaRows = [
    ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ'],
    ['ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ'],
    ['ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ'],
    ['ಸ', 'ಹ', 'ಳ', 'ೞ', 'ಱ']
  ];

  const numbersRows = [
    [{ num: '1', letters: '' }, { num: '2', letters: 'ABC' }, { num: '3', letters: 'DEF' }],
    [{ num: '4', letters: 'GHI' }, { num: '5', letters: 'JKL' }, { num: '6', letters: 'MNO' }],
    [{ num: '7', letters: 'PQRS' }, { num: '8', letters: 'TUV' }, { num: '9', letters: 'WXYZ' }],
    [{ num: '', letters: '' }, { num: '0', letters: '' }, { num: '⌫', letters: '' }]
  ];

  const matras = ['', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', 'ಂ', 'ಃ'];

  const getOthaksharas = (baseChar) => {
    const commonConjuncts = ['ಕ', 'ತ', 'ನ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'];
    const filtered = commonConjuncts.filter(c => c !== baseChar);
    return [
      baseChar + '್',
      baseChar + '್' + baseChar,
      ...filtered.slice(0, 8).map(c => baseChar + '್' + c)
    ];
  };

  const generateKagunitha = (baseChar) => {
    const withMatras = matras.map(matra => baseChar + matra);
    const othaksharas = getOthaksharas(baseChar);
    return [...withMatras, ...othaksharas];
  };

  const getKagunithaRows = () => {
    if (!selectedBase) return [[]];
    const allChars = generateKagunitha(selectedBase);
    const rows = [];
    for (let i = 0; i < allChars.length; i += 10) {
      rows.push(allChars.slice(i, i + 10));
    }
    return rows;
  };

  const currentKeyboard = keyboardMode === 'numbers' ? numbersRows :
    keyboardMode === 'varnamala' ? varnamalaRows :
      getKagunithaRows();

  const handleKeyPress = (char) => {
    if (keyboardMode === 'varnamala' && varnamalaRows.flat().includes(char)) {
      setSelectedBase(char);
      setKeyboardMode('kagunitha');
    } else {
      setKannadaInput(prev => prev + char);
    }
  };

  const toggleNumbersMode = () => {
    if (keyboardMode === 'numbers') {
      setKeyboardMode('varnamala');
    } else {
      setKeyboardMode('numbers');
    }
  };

  const handleBackspace = () => {
    setKannadaInput(prev => prev.slice(0, -1));
  };

  const toggleKeyboardMode = () => {
    if (keyboardMode === 'kagunitha') {
      setKeyboardMode('varnamala');
      setSelectedBase('');
    } else {
      setKeyboardMode('kagunitha');
    }
  };

  const handleTranslate = async () => {
    if (!kannadaInput.trim()) {
      setError('ದಯವಿಟ್ಟು ಕನ್ನಡ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ');
      return;
    }

    setLoading(true);
    setError(null);
    setPythonCode('');
    setProcessingSteps([]);

    try {
      // Step 1: Translation
      setCurrentStep('ಕನ್ನಡವನ್ನು ಇಂಗ್ಲಿಷ್‌ಗೆ ಅನುವಾದಿಸುತ್ತಿದೆ...');
      setProcessingSteps([{ step: 1, name: 'ಅನುವಾದ', status: 'processing' }]);

      const t = await apiService.translateKannada(kannadaInput);
      let translatedEnglish = t.data?.english || '';

      setProcessingSteps([{ step: 1, name: 'ಅನುವಾದ', status: 'complete' }]);

      // Step 2: Code Generation
      setCurrentStep('Python ಕೋಡ್ ರಚಿಸುತ್ತಿದೆ...');
      setProcessingSteps(prev => [...prev, { step: 2, name: 'ಕೋಡ್ ರಚನೆ', status: 'processing' }]);

      const response = await apiService.fullPipeline(kannadaInput, false);
      const data = response.data || {};
      const code = data.generated_code || data.python_code;

      // Use pipeline's English if available, otherwise use standalone translation
      if (data.english_description) {
        translatedEnglish = data.english_description;
      }

      if (code && code.trim()) {
        setPythonCode(code);
        setProcessingSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));
      } else {
        // Fallback: Generate code from English translation
        const gen = await apiService.generateCode(translatedEnglish || kannadaInput);
        const fallbackCode = gen.data?.generated_code;
        setPythonCode(
          (fallbackCode && fallbackCode.trim()) ? fallbackCode : "# Translation/generation unavailable right now.\nprint('Please try again later.')\n"
        );
        setProcessingSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));
      }

      // Step 3: Complete
      setCurrentStep('ಪೂರ್ಣಗೊಂಡಿದೆ! ✓');
      setProcessingSteps(prev => [...prev, { step: 3, name: 'ಪೂರ್ಣಗೊಂಡಿದೆ', status: 'complete' }]);

      // Always notify parent with both Kannada and English translation
      console.log('Algorithm data to notify:', { kannada: kannadaInput, english: translatedEnglish });
      setEnglishTranslation(translatedEnglish); // Store in local state
      if (onAlgorithmTranslated) {
        onAlgorithmTranslated(kannadaInput, translatedEnglish);
      }
    } catch (err) {
      const msg = err.response?.data?.error_kannada || err.response?.data?.error || 'Translation failed';
      setError(msg);
      setProcessingSteps(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'error' } : s));
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setCurrentStep('');
        setProcessingSteps([]);
      }, 3000);
    }
  };

  const handleClear = () => {
    setKannadaInput('');
    setPythonCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={loading}
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← ಹಿಂತಿರುಗಿ
          </button>
          <h1 className="font-kannada text-2xl md:text-3xl font-bold text-slate-900 dark:text-white drop-shadow-sm">
            ಕನ್ನಡ ಅಲ್ಗಾರಿದಮ್: ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ
          </h1>
        </div>

        {/* Processing Steps Indicator */}
        {loading && processingSteps.length > 0 && (
          <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300">
            <h3 className="font-kannada text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="animate-spin text-teal-500 dark:text-teal-400">⚙️</span>
              <span>{currentStep}</span>
            </h3>
            <div className="space-y-3">
              {processingSteps.map((step) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-green-500' :
                    step.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                      step.status === 'error' ? 'bg-red-500' :
                        'bg-slate-600'
                    }`}>
                    {step.status === 'complete' ? '✓' :
                      step.status === 'error' ? '✗' :
                        step.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-kannada">{step.name}</div>
                    {step.status === 'processing' && (
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-blue-400 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <label className="block font-kannada text-lg font-bold text-slate-900 dark:text-white mb-3">
                ಇಲ್ಲಿ ಬರೆಯಿರಿ (Type Here)
              </label>
              <textarea
                value={kannadaInput}
                onChange={(e) => setKannadaInput(e.target.value)}
                className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-kannada text-lg resize-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                placeholder="ಇಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ..."
              />
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="w-full mt-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-95"
              >
                {loading ? 'ಸಂಸ್ಕರಿಸುತ್ತಿದೆ...' : '🚀 Generate & Execute Code'}
              </button>
            </div>

            {showKeyboard && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl transition-colors duration-300">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-white/5">
                  <h3 className="font-kannada text-sm font-bold text-slate-900 dark:text-white">
                    ಕನ್ನಡ ಕೀಬೋರ್ಡ್ (Kannada Keyboard)
                  </h3>
                  <button
                    onClick={() => setShowKeyboard(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className={keyboardMode === 'numbers' ? 'py-4' : 'space-y-1.5'}>
                  {keyboardMode === 'numbers' ? (
                    <div className="flex flex-col items-center gap-3">
                      {currentKeyboard.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-3 justify-center w-full px-4">
                          {row.map((btn, btnIndex) => (
                            btn.num ? (
                              <button
                                key={`${btn.num}-${btnIndex}`}
                                onClick={() => btn.num === '⌫' ? handleBackspace() : handleKeyPress(btn.num)}
                                className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex flex-col items-center justify-center transition-colors shadow-sm"
                              >
                                <span className="text-2xl font-semibold text-slate-900">{btn.num}</span>
                                {btn.letters && <span className="text-[10px] text-slate-600 tracking-wider mt-0.5">{btn.letters}</span>}
                              </button>
                            ) : (
                              <div key={`empty-${btnIndex}`} className="flex-1"></div>
                            )
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    currentKeyboard.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1 justify-center">
                        {row.map((char, charIndex) => (
                          <button
                            key={`${char}-${charIndex}`}
                            onClick={() => handleKeyPress(char)}
                            className="min-w-[2.2rem] h-11 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xl font-kannada flex items-center justify-center transition-all text-slate-800 dark:text-white shadow-sm active:scale-95"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                  <div className="flex gap-1 justify-center mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    {(keyboardMode === 'varnamala' || keyboardMode === 'numbers') && (
                      <button
                        onClick={toggleNumbersMode}
                        className="min-w-[3rem] h-11 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold flex items-center justify-center transition-colors text-slate-700 dark:text-white px-2"
                      >
                        {keyboardMode === 'numbers' ? 'ABC' : '123'}
                      </button>
                    )}
                    {keyboardMode === 'kagunitha' && (
                      <button
                        onClick={toggleKeyboardMode}
                        className="min-w-[3rem] h-11 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-kannada font-bold flex items-center justify-center transition-colors text-slate-700 dark:text-white px-2"
                      >
                        ವರ್ಣಮಾಲೆ
                      </button>
                    )}
                    <button
                      onClick={() => handleKeyPress(' ')}
                      className="flex-1 h-11 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg font-kannada text-sm font-bold flex items-center justify-center transition-colors text-slate-700 dark:text-white"
                    >
                      ಅಂತರ (Space)
                    </button>
                    <button
                      onClick={handleBackspace}
                      className="min-w-[3.5rem] h-11 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-xl flex items-center justify-center transition-colors text-slate-700 dark:text-white"
                    >
                      ⌫
                    </button>
                    <button
                      onClick={handleTranslate}
                      className="min-w-[3.5rem] h-11 bg-teal-600 hover:bg-teal-700 border border-teal-700 rounded-lg text-xl flex items-center justify-center transition-colors text-white"
                    >
                      ↵
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showKeyboard && (
              <button
                onClick={() => setShowKeyboard(true)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-cyan-600 dark:text-cyan-400 font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                ಕೀಬೋರ್ಡ್ ತೋರಿಸಿ (Show Keyboard)
              </button>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onNavigateToExecution('# Write your Python code here\n', '')}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-3 active:scale-95"
            >
              <span>💻</span>
              <span className="font-kannada">ನೇರವಾಗಿ ಕೋಡ್ ಬರೆಯಿರಿ (Write Code Directly)</span>
            </button>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧮</span>
                <h3 className="font-kannada text-lg font-bold text-slate-900 dark:text-white">
                  ಅಲ್ಗಾರಿದಮ್ (Algorithm)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-5 min-h-[100px] space-y-4 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                {pythonCode ? (
                  <>
                    <div className="space-y-2">
                      <p className="font-kannada text-cyan-600 dark:text-yellow-400 font-bold">ಕನ್ನಡ ಇನ್‌ಪುಟ್ (Input):</p>
                      <p className="font-kannada text-slate-800 dark:text-white text-lg lg:text-xl">
                        {kannadaInput}
                      </p>
                    </div>
                    {englishTranslation && (
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                        <p className="text-teal-600 dark:text-cyan-400 font-bold mb-2 font-sans tracking-wide">English Translation:</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                          {englishTranslation}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 font-kannada text-center py-6">
                    ಅಲ್ಗಾರಿದಮ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💻</span>
                <h3 className="font-kannada text-lg font-bold text-slate-900 dark:text-white">
                  ಉತ್ಪತ್ತಿಯಾದ ಕೋಡ್ (Generated Code)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 min-h-[200px] overflow-auto border border-slate-200 dark:border-slate-800 font-mono">
                {pythonCode ? (
                  <div className="flex gap-4">
                    <div className="text-slate-400 dark:text-slate-600 text-xs select-none pt-1">
                      {Array.from({ length: pythonCode.split('\n').length }, (_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                      ))}
                    </div>
                    <pre className="text-teal-600 dark:text-green-400 text-sm flex-1 whitespace-pre-wrap leading-6">
                      {pythonCode}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-600 font-kannada text-center py-12">
                    # ಕೋಡ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ
                  </p>
                )}
              </div>
              {pythonCode && (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>✓ Lines: {pythonCode.split('\n').length}</span>
                    <span>✓ Language: Python</span>
                    <span>✓ Status: Ready</span>
                  </div>
                  <button
                    onClick={() => onNavigateToExecution(pythonCode, kannadaInput)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-kannada py-3 rounded-lg font-semibold text-lg transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>▶</span>
                    <span>ಕೋಡ್ ಚಲಾಯಿಸಿ (Run Code)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/50 backdrop-blur-sm border-l-4 border-red-500 text-red-200 p-4 rounded shadow-xl">
            <p className="font-semibold">ದೋಷ</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterPage;
