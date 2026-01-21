import { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const InputSection = ({ onProcess, loading }) => {
  const [kannadaText, setKannadaText] = useState('');
  const [useTrinket, setUseTrinket] = useState(true);

  const {
    isListening,
    transcript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition('kn-IN');

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const textToProcess = kannadaText || transcript;
    if (textToProcess.trim()) {
      onProcess(textToProcess, useTrinket);
    }
  };

  const handleClear = () => {
    setKannadaText('');
    resetTranscript();
  };

  const loadExample = (text) => {
    setKannadaText(text);
    resetTranscript();
  };

  const examples = [
    'ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಸೇರಿಸುವ ಕಾರ್ಯ',
    '1 ರಿಂದ 10 ರವರೆಗೆ ಸಂಖ್ಯೆಗಳನ್ನು ಮುದ್ರಿಸಿ',
    'ಹಲೋ ವರ್ಲ್ಡ್ ಮುದ್ರಿಸಿ',
  ];

  const displayText = kannadaText || transcript;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
      {!isSupported && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-bold">⚠️ Browser Support</p>
          <p>Speech recognition may not be fully supported. Use Chrome or Edge for best results.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Speech Controls */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={!isSupported || loading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white
              transition-all duration-300 shadow-lg
              ${isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105'
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
          >
            <span className="text-2xl">🎤</span>
            <span>{isListening ? 'Listening...' : 'Start Speaking'}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700 transition-all disabled:opacity-50"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Status Messages */}
        {isListening && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-4 rounded">
            🎤 Listening... Speak in Kannada
          </div>
        )}

        {speechError && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 mb-4 rounded">
            ❌ {speechError}
          </div>
        )}

        {/* Input Textarea */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Kannada Input (ಕನ್ನಡ ಇನ್‌ಪುಟ್):
          </label>
          <textarea
            value={displayText}
            onChange={(e) => setKannadaText(e.target.value)}
            placeholder="Click the mic and speak in Kannada, or type here...
ಉದಾಹರಣೆ: ಎರಡು ಸಂಖ್ಯೆಗಳನ್ನು ಸೇರಿಸುವ ಕಾರ್ಯ"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none kannada-text text-lg resize-vertical min-h-[120px]"
            disabled={loading}
          />
        </div>

        {/* Example Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => loadExample(example)}
              disabled={loading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              📝 Example {index + 1}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useTrinket}
              onChange={(e) => setUseTrinket(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
            />
            <span className="text-gray-700 font-medium">
              Use Trinket IO (Interactive Browser Execution)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!displayText.trim() || loading}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? '⏳ Processing...' : '🚀 Generate & Execute Code'}
        </button>
      </form>
    </div>
  );
};

export default InputSection;
