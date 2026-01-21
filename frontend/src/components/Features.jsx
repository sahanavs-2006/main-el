
import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, Cpu, Zap, GraduationCap, Layout } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, titleKn, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group p-8 rounded-3xl bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
    >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-emerald-600 dark:text-emerald-400 font-kannada text-sm mb-4">{titleKn}</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

const Features = () => {
    const features = [
        {
            icon: Globe,
            title: "Native Language",
            titleKn: "ಕನ್ನಡದಲ್ಲೇ ಕಲಿಯಿರಿ",
            description: "Break the language barrier. Learn programming logic and structure in your mother tongue, Kannada.",
            delay: 0.1
        },
        {
            icon: Cpu,
            title: "AI Translation",
            titleKn: "ಕನ್ನಡದಿಂದ ಪೈಥಾನ್‌ಗೆ",
            description: "Our advanced NLP model translates your Kannada algorithms into clean, executable Python code instantly.",
            delay: 0.2
        },
        {
            icon: Zap,
            title: "Live Execution",
            titleKn: "ನೇರ ಮರಣದಂಡನೆ",
            description: "Test your code in real-time. See the results of your Kannada logic running in an actual Python environment.",
            delay: 0.3
        },
        {
            icon: Layout,
            title: "Visual Learning",
            titleKn: "ದೃಶ್ಯ ಕಲಿಕೆ",
            description: "Interactive dashboard and visual pipeline help you understand how code flows from logic to execution.",
            delay: 0.4
        },
        {
            icon: GraduationCap,
            title: "Concept Quizzes",
            titleKn: "ಪರಿಕಲ್ಪನೆ ರಸಪ್ರಶ್ನೆಗಳು",
            description: "Reinforce your learning with interactive quizzes designed to test your understanding of core concepts.",
            delay: 0.5
        },
        {
            icon: Code2,
            title: "Step-by-Step",
            titleKn: "ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶಿ",
            description: "From basics to advanced topics, follow a structured path designed for absolute beginners.",
            delay: 0.6
        }
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300" id="features">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
                    >
                        Powerful Features for <span className="text-teal-600 dark:text-teal-500">Modern Learners</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400 text-lg font-kannada"
                    >
                        ನಿಮ್ಮ ಕೋಡಿಂಗ್ ಪ್ರಯಾಣವನ್ನು ಸುಲಭಗೊಳಿಸುವ ಅತ್ಯಾಧುನಿಕ ವೈಶಿಷ್ಟ್ಯಗಳು
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
