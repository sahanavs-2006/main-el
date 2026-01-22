
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Github, ArrowLeft } from 'lucide-react';

const teamMembers = [
    {
        name: "Thanush Thimmaiah P H",
        role: "Project Lead",
        class: "BE ISE",
        year: "2028",
        description: "Focuses on system architecture and coordinating the project development across frontend and backend modules.",
        image: "/thanush_profile.jpg",
    },
    {
        name: "Sahana V S",
        role: "Frontend Developer",
        class: "BE CSE",
        year: "2028",
        description: "Specializes in creating intuitive user interfaces and ensuring a seamless experience for Kannada-language learners.",
        image: "/sahana_profile.jpg",
    },
    {
        name: "Sona H M",
        role: "Backend Developer",
        class: "BE CSE",
        year: "2028",
        description: "Manages backend logic and API integrations, ensuring robust communication between the UI and NLP models.",
        image: "/sona_profile.jpg",
    },
    {
        name: "Swathi R Vathar",
        role: "NLP Engineer",
        class: "BE CSE",
        year: "2028",
        description: "Works on the translation logic and language processing models that bridge Kannada input to Python code.",
        image: "/swathi_profile.jpg",
    },
    {
        name: "Vikas D A",
        role: "Content Strategist",
        class: "BE ISE",
        year: "2028",
        description: "Curates educational content and tutorials to ensure the platform is effective for rural students learning to code.",
        image: "/vikas_profile.jpg",
    },
];

const AboutPage = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-kannada">
                        ನಮ್ಮ ಬಗ್ಗೆ
                    </h1>
                    <p className="text-xl text-teal-600 dark:text-teal-400 font-medium mb-4">About Us</p>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Meet the passionate team behind Code <span className="font-kannada">ನುಡಿ</span> - dedicated to breaking language barriers in programming education for rural students.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-3xl p-8 mb-16 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        In the modern world, programming abilities—including critical thinking and problem-solving—are essential.
                        However, students in rural areas frequently lack access to high-quality instructional resources,
                        particularly in programming, because internet materials are primarily written in English.
                        They also encounter linguistic obstacles. We aim to overcome these language hurdles and give
                        rural students fair access to programming, analytical thinking, and logical reasoning education
                        through this web application that teaches programming in Kannada.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="bg-white dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl p-6 text-center group hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-slate-300 dark:border-slate-700 group-hover:border-teal-500 transition-colors shadow-lg p-0.5 bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top rounded-full"
                                    />
                                </div>

                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                            <p className="text-sm text-teal-600 dark:text-cyan-400 mb-3 font-medium">
                                {member.class} • Class of {member.year}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                {member.description}
                            </p>


                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-10 max-w-2xl mx-auto shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Have questions or suggestions? We'd love to hear from you!
                        </p>
                        <a href="mailto:codenudi123@gmail.com" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                            <Mail className="w-5 h-5" />
                            Contact Us
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
