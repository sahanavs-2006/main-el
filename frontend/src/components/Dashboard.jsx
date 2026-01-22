import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Lightbulb, Trophy, ArrowRight, Sparkles, Code2, BookOpen, Star } from 'lucide-react';

const Dashboard = ({ onNavigateToConverter, onNavigateToQuiz, onNavigateToTutorials, onNavigateToMaterials, onNavigateToNotes, onNavigateToAbout, algorithmData, user }) => {
    const [myRank, setMyRank] = useState(null);

    useEffect(() => {
        console.log('Dashboard algorithmData changed:', algorithmData);
        fetchMyRank();
    }, [algorithmData]);

    const fetchMyRank = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const response = await axios.get(`${API_URL}/leaderboard/my-rank/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setMyRank(response.data);
        } catch (error) {
            console.error('Error fetching rank:', error);
        }
    };

    const features = [
        {
            title: 'ಕನ್ನಡ ಟ್ಯೂಟೋರಿಯಲ್ಸ್',
            subtitle: 'Interactive Tutorials',
            description: 'Learn Python concepts step-by-step in Kannada',
            icon: '📖',
            iconGradient: 'from-teal-400 to-teal-600',
            bgColor: 'bg-white dark:bg-slate-900',
            borderColor: 'border-slate-900 dark:border-white',
            glowColor: 'shadow-slate-200/50 dark:shadow-none',
            onClick: onNavigateToTutorials
        },
        {
            title: 'ಕೋಡಿಂಗ್ ಅಭ್ಯಾಸ',
            subtitle: 'Practice Coding',
            description: 'Write Kannada logic, run Python code instantly',
            icon: '💻',
            iconGradient: 'from-emerald-400 to-teal-500',
            bgColor: 'bg-white dark:bg-slate-900',
            borderColor: 'border-slate-900 dark:border-white',
            glowColor: 'shadow-teal-500/10 dark:shadow-none',
            onClick: onNavigateToConverter,
            isPrimary: true
        },
        {
            title: 'ರಸ ಪ್ರಶ್ನೆ',
            subtitle: 'Quizzes',
            description: 'Test your knowledge with interactive quizzes',
            icon: '✏️',
            iconGradient: 'from-amber-400 to-orange-500',
            bgColor: 'bg-white dark:bg-slate-900',
            borderColor: 'border-slate-900 dark:border-white',
            glowColor: 'shadow-slate-200/50 dark:shadow-none',
            onClick: onNavigateToQuiz
        },
        {
            title: 'ನಮ್ಮ ಬಗ್ಗೆ',
            subtitle: 'About Us',
            description: 'Learn about our mission and team',
            icon: '🎓',
            iconGradient: 'from-blue-400 to-indigo-600',
            bgColor: 'bg-white dark:bg-slate-900',
            borderColor: 'border-slate-900 dark:border-white',
            glowColor: 'shadow-slate-200/50 dark:shadow-none',
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
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12 px-4 transition-colors duration-300">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">




                {/* Feature Cards Section */}
                <div className="mb-20 mt-12">
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
                                className={`group relative overflow-hidden rounded-3xl border-2 
                  ${feature.borderColor}
                  transition-all duration-500 
                  hover:shadow-xl hover:-translate-y-1
                  focus:outline-none 
                  ${feature.isPrimary ? 'sm:col-span-2 lg:col-span-1 border-teal-500' : 'border-slate-200 dark:border-white'}
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

                                {/* Card Background */}
                                <div className={`relative ${feature.bgColor} p-6 md:p-8 ${feature.isPrimary ? 'h-72' : 'h-64'} flex flex-col items-center justify-center text-center`}>


                                    {/* Icon container - Restored and made static */}
                                    <div className={`relative mb-4 ${feature.isPrimary ? 'w-24 h-24' : 'w-20 h-20'} rounded-full bg-slate-100 dark:bg-slate-800 p-[3px] shadow-lg`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
                                            <div className={`${feature.isPrimary ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
                                                {feature.icon}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text content */}
                                    <h2 className="font-kannada text-xl md:text-2xl lg:text-3xl text-slate-900 dark:text-white font-bold mb-1 transition-colors duration-300">
                                        {feature.title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">
                                        {feature.subtitle}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Action indicator for primary card */}
                                    {feature.isPrimary && (
                                        <div className="mt-4 flex items-center gap-2 text-teal-600 dark:text-yellow-400 font-bold text-xs animate-bounce">
                                            <span>Click to begin</span>
                                            <span>→</span>
                                        </div>
                                    )}
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
