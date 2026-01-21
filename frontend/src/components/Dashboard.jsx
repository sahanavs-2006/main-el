import React, { useEffect } from 'react';
import { Users, Lightbulb, Trophy, ArrowRight, Sparkles, Code2, BookOpen, Star } from 'lucide-react';

const Dashboard = ({ onNavigateToConverter, onNavigateToQuiz, onNavigateToMaterials, onNavigateToNotes, onNavigateToAbout, algorithmData }) => {
    useEffect(() => {
        console.log('Dashboard algorithmData changed:', algorithmData);
    }, [algorithmData]);

    const features = [
        {
            title: 'ಕನ್ನಡ ಟ್ಯೂಟೋರಿಯಲ್ಸ್',
            subtitle: 'Study Materials',
            description: 'Download comprehensive study guides and PDFs',
            icon: '📚',
            iconGradient: 'from-teal-400 via-teal-500 to-teal-600',
            bgColor: 'from-teal-500/10 to-teal-600/10 dark:from-teal-500/20 dark:to-teal-600/20',
            borderColor: 'border-teal-200 dark:border-teal-400/30',
            glowColor: 'shadow-teal-500/10 dark:shadow-teal-500/20',
            onClick: onNavigateToMaterials
        },
        {
            title: 'ಕೋಡಿಂಗ್ ಅಭ್ಯಾಸ',
            subtitle: 'Practice Coding',
            description: 'Write Kannada logic, run Python code instantly',
            icon: '💻',
            iconGradient: 'from-cyan-400 via-teal-500 to-teal-600',
            bgColor: 'from-slate-700/80 to-slate-900/80',
            borderColor: 'border-cyan-400/50',
            glowColor: 'shadow-cyan-400/40',
            onClick: onNavigateToConverter,
            isPrimary: true
        },
        {
            title: 'ರಸ ಪ್ರಶ್ನೆ',
            subtitle: 'Quizzes',
            description: 'Test your knowledge with interactive quizzes',
            icon: '✏️',
            iconGradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
            bgColor: 'from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20',
            borderColor: 'border-emerald-200 dark:border-emerald-400/30',
            glowColor: 'shadow-emerald-500/10 dark:shadow-emerald-500/20',
            onClick: onNavigateToQuiz
        },
        {
            title: 'ನಮ್ಮ ಬಗ್ಗೆ',
            subtitle: 'About Us',
            description: 'Learn about our mission and team',
            icon: '🎓',
            iconGradient: 'from-cyan-400 via-cyan-500 to-teal-600',
            bgColor: 'from-cyan-500/10 to-teal-600/10 dark:from-cyan-500/20 dark:to-teal-600/20',
            borderColor: 'border-cyan-200 dark:border-cyan-400/30',
            glowColor: 'shadow-cyan-500/10 dark:shadow-cyan-500/20',
            onClick: onNavigateToAbout
        }
    ];

    const phases = [
        {
            phase: 1,
            icon: Users,
            iconBg: 'from-cyan-500 to-teal-600',
            title: 'ಹಂತ 1: ನೋಂದಣಿ ಮತ್ತು ತಯಾರಿ',
            subtitle: 'Phase 1: Registration & Prep',
            date: 'ಯಾವಾಗಲೂ ತೆರೆದಿರುತ್ತದೆ',
            description: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ ಮತ್ತು ಕಲಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
            items: [
                'ಉಚಿತ ನೋಂದಣಿ',
                'ಕನ್ನಡದಲ್ಲಿ ಕೋಡಿಂಗ್ ಮೂಲಭೂತಗಳು',
                'ಆಲ್ಗಾರಿದಮ್ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
                'ಕೀಬೋರ್ಡ್ ಬಳಕೆಯನ್ನು ಕಲಿಯಿರಿ'
            ]
        },
        {
            phase: 2,
            icon: Lightbulb,
            iconBg: 'from-teal-500 to-emerald-600',
            title: 'ಹಂತ 2: ಕಲಿಕೆ ಮತ್ತು ಅಭ್ಯಾಸ',
            subtitle: 'Phase 2: Learning & Practice',
            date: 'ನಿಮ್ಮ ವೇಗದಲ್ಲಿ ಕಲಿಯಿರಿ',
            description: 'ಕನ್ನಡದಲ್ಲಿ ಕೋಡ್ ಬರೆಯಿರಿ ಮತ್ತು ತಕ್ಷಣ ಚಲಾಯಿಸಿ',
            items: [
                'ಕನ್ನಡ ಆಲ್ಗಾರಿದಮ್ ಬರೆಯಿರಿ',
                'Python ಕೋಡ್ ಉತ್ಪಾದನೆ',
                'ತಕ್ಷಣ ಕೋಡ್ ಚಲಾಯಿಸಿ',
                'ದೋಷಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ'
            ]
        },
        {
            phase: 3,
            icon: Trophy,
            iconBg: 'from-emerald-500 to-green-600',
            title: 'ಹಂತ 3: ಯಶಸ್ಸು ಮತ್ತು ಬೆಳವಣಿಗೆ',
            subtitle: 'Phase 3: Success & Growth',
            date: 'ನಿರಂತರ ಪ್ರಗತಿ',
            description: 'ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಿ',
            items: [
                'ಕ್ವಿಜ್‌ಗಳನ್ನು ಪರಿಹರಿಸಿ',
                'ಪ್ರಮಾಣಪತ್ರ ಗಳಿಸಿ',
                'ಸಮುದಾಯದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',
                'ಕನ್ನಡದಲ್ಲಿ ಕೋಡಿಂಗ್ ಮಾಸ್ಟರ್ ಆಗಿ'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-12 px-4 relative overflow-hidden transition-colors duration-300">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Radial glow behind center */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Subtle floating particles */}
                <div className="absolute top-20 left-[10%] w-2 h-2 bg-cyan-400/40 rounded-full animate-float" />
                <div className="absolute top-40 right-[15%] w-3 h-3 bg-teal-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-cyan-400/40 rounded-full animate-float" style={{ animationDelay: '4s' }} />
                <div className="absolute top-60 right-[30%] w-2 h-2 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header with fade-in animation */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="font-kannada text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-3 drop-shadow-2xl dark:bg-gradient-to-r dark:from-white dark:via-cyan-100 dark:to-white dark:bg-clip-text dark:text-transparent">
                        Code <span className="font-kannada">ನುಡಿ</span> ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium">Empowering the next generation in Kannada</p>
                </div>

                {/* Algorithm Section */}
                {algorithmData?.kannada && (
                    <div className="mb-20 bg-white dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-600/50 p-8 md:p-12 shadow-2xl animate-slideUp" style={{ animationDelay: '0.6s' }}>
                        <h2 className="font-kannada text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-teal-500" />
                            <span>ಅಲ್ಗಾರಿದಮ್ (Algorithm)</span>
                        </h2>

                        <div className="space-y-6">
                            {/* Kannada Algorithm */}
                            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                                <h3 className="font-kannada text-lg font-semibold text-teal-600 dark:text-yellow-400 mb-3">ಇನ್‌ಪುಟ್ (Kannada):</h3>
                                <p className="font-kannada text-slate-800 dark:text-white text-lg leading-relaxed">{algorithmData.kannada}</p>
                            </div>

                            {/* English Translation */}
                            {algorithmData?.english && algorithmData.english.trim() && (
                                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                                    <h3 className="font-semibold text-teal-600 dark:text-cyan-400 mb-3 text-lg">English Translation:</h3>
                                    <p className="text-slate-800 dark:text-white text-base leading-relaxed">{algorithmData.english}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Feature Cards Section */}
                <div className="mb-20">
                    <h2 className="font-kannada text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4 drop-shadow-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        ಪ್ರಾರಂಭಿಸಿ (Get Started)
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-sm md:text-base animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                        Choose your learning path and start coding in Kannada
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                onClick={feature.onClick}
                                className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border-2 
                  ${feature.borderColor} ${feature.glowColor}
                  transition-all duration-500 
                  hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2
                  focus:outline-none focus:ring-4 focus:ring-yellow-400/50
                  ${feature.isPrimary ? 'sm:col-span-2 lg:col-span-1 ring-2 ring-yellow-400/60 shadow-yellow-400/30' : ''}
                  animate-slideUp`}
                                style={{
                                    animationDelay: `${index * 0.15}s`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {/* Primary badge */}
                                {feature.isPrimary && (
                                    <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                                        <span className="text-sm">⭐</span>
                                        <span>Start Here</span>
                                    </div>
                                )}

                                {/* Card Background with glassmorphism */}
                                <div className={`relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl p-8 md:p-10 ${feature.isPrimary ? 'h-80' : 'h-72'} flex flex-col items-center justify-center text-center`}>

                                    {/* Animated glow effect on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Icon container with 3D effect */}
                                    <div className={`relative mb-6 ${feature.isPrimary ? 'w-32 h-32' : 'w-28 h-28'} rounded-full bg-gradient-to-br ${feature.iconGradient} p-[3px] shadow-2xl group-hover:shadow-3xl transition-all duration-500 animate-float`}
                                        style={{ animationDelay: `${index * 0.5}s` }}>
                                        <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-xl flex items-center justify-center group-hover:bg-slate-900/70 transition-colors duration-300">
                                            <div className={`${feature.isPrimary ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                                {feature.icon}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text content */}
                                    <h2 className={`font-kannada ${feature.isPrimary ? 'text-3xl md:text-4xl text-white' : 'text-2xl md:text-3xl text-slate-900 dark:text-white'} font-bold mb-2 drop-shadow-lg group-hover:text-cyan-600 dark:group-hover:text-yellow-100 transition-colors duration-300`}>
                                        {feature.title}
                                    </h2>
                                    <p className={`${feature.isPrimary ? 'text-white/80' : 'text-slate-600 dark:text-white/80'} text-sm md:text-base font-semibold mb-3`}>
                                        {feature.subtitle}
                                    </p>
                                    <p className={`${feature.isPrimary ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300'} text-xs md:text-sm ${feature.isPrimary ? 'max-w-md' : 'max-w-xs'} leading-relaxed`}>
                                        {feature.description}
                                    </p>

                                    {/* Action indicator for primary card */}
                                    {feature.isPrimary && (
                                        <div className="mt-6 flex items-center gap-2 text-yellow-400 font-semibold text-sm animate-bounce">
                                            <span>Click to begin</span>
                                            <span>→</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hover shimmer effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Journey Phases */}
                <div className="mb-12 text-center animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">ನಿಮ್ಮ ಕಲಿಕೆಯ ಹಂತಗಳು</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        From registration to victory - here's your journey through Code <span className="font-kannada">ನುಡಿ</span>
                    </p>
                </div>

                <div className="mb-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {phases.map((phase, index) => {
                            const Icon = phase.icon;
                            return (
                                <div key={index} className="relative animate-slideUp" style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'both' }}>
                                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 h-full flex flex-col group">

                                        {/* Phase Indicator */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <span className="text-4xl font-bold text-slate-400 dark:text-slate-600 select-none">
                                                0{index + 1}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-kannada text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            {phase.title}
                                        </h3>
                                        <p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">{phase.subtitle}</p>

                                        {/* Date/Status */}
                                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs w-fit">
                                            <Sparkles className="w-3 h-3 text-yellow-500" />
                                            <span className="font-kannada">{phase.date}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 font-kannada text-sm leading-relaxed">{phase.description}</p>

                                        {/* Items */}
                                        <ul className="space-y-3 mt-auto">
                                            {phase.items.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                                    <div className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <ArrowRight className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                                    </div>
                                                    <span className="font-kannada">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Connector Arrow */}
                                    {index < phases.length - 1 && (
                                        <div className="hidden lg:block absolute top-[28%] -right-4 transform -translate-y-1/2 z-10 transition-transform duration-500 group-hover:translate-x-1">
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-lg border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-teal-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
