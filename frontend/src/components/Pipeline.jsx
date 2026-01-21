
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Code2, Play, Cpu, CheckCircle } from 'lucide-react';

const PipelineStep = ({ icon: Icon, label, labelKn, sublabel, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col items-center gap-4 group"
    >
        <div className={`w-20 h-20 rounded-3xl bg-slate-800/80 border border-white/10 flex items-center justify-center relative group-hover:border-${color}-500 transition-all duration-300 shadow-xl overflow-hidden`}>
            {/* Glow behind */}
            <div className={`absolute inset-0 bg-${color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <Icon className={`w-10 h-10 text-${color}-400 group-hover:scale-110 transition-transform duration-300`} />
        </div>
        <div className="text-center">
            <p className="text-white font-bold text-lg mb-1">{label}</p>
            <p className="text-indigo-400 font-kannada text-xs mb-1">{labelKn}</p>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">{sublabel}</p>
        </div>
    </motion.div>
);

const Pipeline = () => {
    const steps = [
        {
            icon: Mic,
            label: "Input",
            labelKn: "ಇನ್‌ಪುಟ್",
            sublabel: "Kannada Algorithm",
            color: "blue",
            delay: 0.1
        },
        {
            icon: Code2,
            label: "Process",
            labelKn: "ಪ್ರಕ್ರಿಯೆ",
            sublabel: "NLP Translation",
            color: "purple",
            delay: 0.3
        },
        {
            icon: Play,
            label: "Execute",
            labelKn: "ಮರಣದಂಡನೆ",
            sublabel: "Python Runtime",
            color: "green",
            delay: 0.5
        }
    ];

    return (
        <section className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-[40px] p-12 border border-white/5 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                    <div className="relative z-10">
                        <h3 className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">
                            Our Core Technology Pipeline
                        </h3>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    <PipelineStep {...step} />
                                    {index < steps.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + index * 0.2 }}
                                            className="hidden md:block"
                                        >
                                            <ArrowRight className="w-8 h-8 text-slate-700" />
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="mt-16 flex items-center justify-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5 max-w-xl mx-auto"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Ready to Use</p>
                                <p className="text-slate-400 text-sm">Powered by fine-tuned Large Language Models for 99.9% accuracy.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pipeline;
