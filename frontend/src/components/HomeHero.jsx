
import React from 'react';
import { GraduationCap } from 'lucide-react';

// Ensure the image is placed at frontend/public with this filename (add .jpg/.png extension):
// village-group-kids-uniform-using-260nw-2150952253.jpg
const HomeHero = ({ onNavigate }) => {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                onNavigate && onNavigate('left');
            } else if (e.key === 'ArrowRight') {
                onNavigate && onNavigate('right');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);
    return (
        <section id="home" className="relative pt-16 min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 transition-colors duration-300">
            {/* Subtle background glow without floating effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto h-full px-4 grid md:grid-cols-2 gap-8 items-start pt-4">
                <div className="hidden md:block">
                    <img
                        src="/village-group-kids-uniform-using-260nw-2150952253.png"
                        alt="Children learning"
                        className="w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50"
                    />
                </div>

                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 grid place-items-center shadow-2xl border-2 border-white/30 backdrop-blur">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-500 to-teal-400 dark:from-white dark:via-cyan-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                            <span className="font-sans">Code</span> <span className="font-kannada">ನುಡಿ</span>
                        </h1>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 max-w-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700/50">
                        <h2 className="font-kannada text-4xl font-extrabold text-slate-900 dark:text-white mb-3 drop-shadow-lg">ಕನ್ನಡದಲ್ಲಿ ಕೋಡ್ ಮಾಡಲು ಕಲಿಯಿರಿ</h2>
                        <h3 className="font-kannada text-2xl font-bold text-teal-600 dark:text-cyan-300 mb-4 drop-shadow">ಕೋಡಿಂಗ್ ತಿಳಿಯುವ ಹೊಸ ವಿಧಾನ</h3>
                        <p className="font-kannada text-slate-600 dark:text-slate-200 text-base md:text-lg leading-relaxed mb-6">
                            ಕೋಡ್ ನುಡಿ ಎನ್ನುವುದು ಕನ್ನಡದಲ್ಲಿ ಕೋಡಿಂಗ್ ಕಲಿಯಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸಂವಾದಾತ್ಮಕ, ಸ್ವಯಂ ಗತಿಯ ಮತ್ತು ಬಳಕೆದಾರ ಸ್ನೇಹಿ ವೇದಿಕೆಯಾಗಿದೆ. ವಿದ್ಯಾರ್ಥಿಗಳಲ್ಲಿ ಕೋಡಿಂಗ್ ಕೌಶಲ್ಯ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಚಿಂತನೆಯನ್ನು ಬೆಳೆಸುವುದು ಇದರ ಉದ್ದೇಶ. ಹ್ಯಾಪಿ ಕೋಡಿಂಗ್!
                        </p>
                        <button
                            onClick={onNavigate}
                            className="inline-flex bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl text-lg font-kannada shadow-xl shadow-cyan-600/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                        >
                            ಮುಂದುವರಿಸಿ
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
