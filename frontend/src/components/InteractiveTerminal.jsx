import { useState, useEffect, useRef } from 'react';

export default function InteractiveTerminal({ code, onClose }) {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const wsRef = useRef(null);
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/execute/');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Start execution immediately
      setIsRunning(true);
      ws.send(JSON.stringify({
        type: 'execute',
        code: code
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'output') {
        setOutput(prev => [...prev, { type: data.stream, text: data.data }]);
      } else if (data.type === 'complete') {
        setIsRunning(false);
        setIsComplete(true);
        setOutput(prev => [...prev, {
          type: 'system',
          text: `\nProcess exited with code ${data.exit_code}`
        }]);
      } else if (data.type === 'error') {
        setOutput(prev => [...prev, { type: 'stderr', text: data.message }]);
        setIsRunning(false);
        setIsComplete(true);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setOutput(prev => [...prev, {
        type: 'stderr',
        text: 'WebSocket connection error'
      }]);
      setIsRunning(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsRunning(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [code]);

  useEffect(() => {
    // Auto-scroll to bottom
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  useEffect(() => {
    // Focus input when running
    if (isRunning && !isComplete) {
      inputRef.current?.focus();
    }
  }, [isRunning, isComplete]);

  const handleSubmitInput = (e) => {
    e.preventDefault();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input) {
      // Echo input to terminal
      setOutput(prev => [...prev, { type: 'input', text: input + '\n' }]);

      // Send to backend
      wsRef.current.send(JSON.stringify({
        type: 'input',
        input: input
      }));

      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white text-xs font-mono">{'>_'}</span>
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold">ಸಂವಾದಾತ್ಮಕ ಟರ್ಮಿನಲ್ (Interactive Terminal)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm bg-slate-950 dark:bg-black selection:bg-teal-500/30">
          {output.map((line, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap leading-relaxed py-0.5 ${line.type === 'stderr' ? 'text-red-400' :
                line.type === 'system' ? 'text-teal-400' :
                  line.type === 'input' ? 'text-green-400 font-bold' :
                    'text-slate-200'
                }`}
            >
              {line.type === 'input' && <span className="opacity-50 mr-2">$</span>}
              {line.text}
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Input Area */}
        {isRunning && !isComplete && (
          <form onSubmit={handleSubmitInput} className="border-t border-slate-100 dark:border-white/5 p-6 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
              <span className="text-teal-600 dark:text-teal-400 font-mono font-bold animate-pulse">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-white font-mono outline-none"
                placeholder="ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (Type here...)"
                autoFocus
              />
            </div>
          </form>
        )}

        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-between border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-500' : isRunning ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`} />
            {isComplete ? (
              <span className="text-green-600 dark:text-green-400">Execution completed</span>
            ) : isRunning ? (
              <span className="text-teal-600 dark:text-teal-400">Running...</span>
            ) : (
              <span>Ready</span>
            )}
          </div>
          <div className="opacity-50">UTF-8 • Code <span className="font-kannada">ನುಡಿ</span> R1</div>
        </div>
      </div>
    </div>
  );
}
