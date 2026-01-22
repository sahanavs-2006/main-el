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
    ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ'],
    ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ'],
    ['ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ'],
    ['ಷ', 'ಸ', 'ಹ', 'ಳ', 'ೞ', 'ಱ']
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

      let translatedEnglish = '';
      let code = '';

      try {
        // Attempt real API calls
        const response = await apiService.fullPipeline(kannadaInput, false);
        const data = response.data || {};

        if (data.status === 'error' || data.error || data.error_kannada) {
          throw new Error(data.error_kannada || data.error || "Processing failed");
        }

        translatedEnglish = data.english_description || "";
        code = data.generated_code || data.python_code || "";

        setProcessingSteps([{ step: 1, name: 'ಅನುವಾದ', status: 'complete' }]);

        if (!code && !translatedEnglish) {
          throw new Error("ಸರ್ವರ್ ಯಾವುದೇ ಡೇಟಾವನ್ನು ಹಿಂತಿರುಗಿಸಿಲ್ಲ (Server returned no data)");
        }

        setCurrentStep('ಪೂರ್ಣಗೊಂಡಿದೆ! ✓');
        setProcessingSteps(prev => [...prev, { step: 2, name: 'ಕೋಡ್ ರಚನೆ', status: 'complete' }]);

      } catch (apiError) {
        console.error("Pipeline API Error:", apiError);
        const errorMessage = apiError.response?.data?.error_kannada ||
          apiError.response?.data?.error ||
          apiError.message ||
          "ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ (Server connection failed)";
        throw new Error(errorMessage);
      }

      // Finalize Code Setting
      if (code) {
        setPythonCode(code);
        setProcessingSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'complete' } : s));
      } else {
        // Fallback if even logic fails (extremely unlikely)
        setPythonCode("# Could not generate code.\nprint('Please try again.')");
        setProcessingSteps(prev => prev.map(s => s.step === 2 ? { ...s, status: 'error' } : s));
      }

      // Step 3: Complete
      setCurrentStep('ಪೂರ್ಣಗೊಂಡಿದೆ! ✓');
      setProcessingSteps(prev => [...prev, { step: 3, name: 'ಪೂರ್ಣಗೊಂಡಿದೆ', status: 'complete' }]);

      // Notify parent
      console.log('Algorithm data:', { kannada: kannadaInput, english: translatedEnglish });
      setEnglishTranslation(translatedEnglish);
      if (onAlgorithmTranslated) {
        onAlgorithmTranslated(kannadaInput, translatedEnglish);
      }

    } catch (err) {
      const msg = err.message || 'Translation failed';
      setError(msg);
      setProcessingSteps(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'error' } : s));
      console.error('Process error:', err);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-center relative">
          <h1 className="font-kannada text-2xl md:text-3xl font-bold text-slate-900 dark:text-white drop-shadow-sm text-center">
            ಕನ್ನಡ ಅಲ್ಗಾರಿದಮ್: ಬರೆಯಿರಿ
          </h1>
        </div>

        {/* Processing Steps Indicator */}
        {loading && processingSteps.length > 0 && (
          <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300">
            <h3 className="font-kannada text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="animate-spin text-slate-500 dark:text-slate-400">⚙️</span>
              <span>{currentStep}</span>
            </h3>
            <div className="space-y-3">
              {processingSteps.map((step) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-emerald-500 text-white' :
                    step.status === 'processing' ? 'bg-emerald-500 animate-pulse text-white' :
                      step.status === 'error' ? 'bg-red-500 text-white' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                    {step.status === 'complete' ? '✓' :
                      step.status === 'error' ? '✗' :
                        step.step}
                  </div>
                  <div className="flex-1 pl-1">
                    <div className="text-slate-900 dark:text-white font-kannada text-base leading-relaxed">{step.name}</div>
                    {step.status === 'processing' && (
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-emerald-500 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
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
                className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-kannada text-lg resize-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                placeholder="ಇಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ..."
              />
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
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
                      className="min-w-[3.5rem] h-11 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-xl flex items-center justify-center transition-colors text-slate-700 dark:text-white"
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
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
              >
                ಕೀಬೋರ್ಡ್ ತೋರಿಸಿ (Show Keyboard)
              </button>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onNavigateToExecution('# Write your Python code here\n', '')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95"
            >
              <span>💻</span>
              <span className="font-kannada">ನೇರವಾಗಿ ಕೋಡ್ ಬರೆಯಿರಿ (Write Code Directly)</span>
            </button>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-kannada text-lg font-bold text-slate-900 dark:text-white">
                  ಅಲ್ಗಾರಿದಮ್ (Algorithm)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-5 min-h-[100px] space-y-4 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                {pythonCode ? (
                  <>
                    <div className="space-y-2">
                      <p className="font-kannada text-slate-600 dark:text-slate-400 font-bold">ಕನ್ನಡ ಇನ್‌ಪುಟ್ (Input):</p>
                      <p className="font-kannada text-slate-800 dark:text-white text-lg lg:text-xl">
                        {kannadaInput}
                      </p>
                    </div>
                    {englishTranslation && (
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                        <p className="text-slate-600 dark:text-slate-400 font-bold mb-2 font-sans tracking-wide">English Translation:</p>
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
                    <pre className="text-slate-800 dark:text-slate-200 text-sm flex-1 whitespace-pre leading-6">
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

                  <button
                    onClick={() => onNavigateToExecution(pythonCode, kannadaInput)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-kannada py-3 rounded-lg font-semibold text-lg transition-all shadow-xl flex items-center justify-center gap-2"
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
