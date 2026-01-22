
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowLeft, GraduationCap } from 'lucide-react';
import { login, register } from '../services/api';

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <Icon className="w-4 h-4" />
            </div>
        )}
        <input
            {...props}
            className={`flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${Icon ? 'pl-9' : ''}`}
        />
    </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 font-bold shadow-lg shadow-teal-600/20',
        secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
        link: 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline-offset-4 hover:underline p-0 h-auto'
    };

    return (
        <button
            className={`inline-flex items-center justify-center rounded-md text-sm transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const LoginPage = ({ onLoginSuccess, onBack }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Unified form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay for realistic feel (Demo Mode)
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Validation
            if (!formData.username || !formData.password) {
                throw new Error("Please enter username and password");
            }

            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            // For signup, require full name (unless it's login)
            if (!isLogin && !formData.full_name?.trim()) {
                throw new Error("Please enter your name");
            }

            // DEMO MODE: Create a mock user session locally
            // This bypasses backend for the project demo
            const demoUser = {
                id: 'demo-' + Date.now(),
                username: formData.username,
                email: formData.email || `${formData.username}@example.com`,
                first_name: formData.full_name || formData.username,
                token: 'demo-token-' + Date.now() // Mock token
            };

            // Store user in localStorage
            localStorage.setItem('token', demoUser.token);
            localStorage.setItem('user', JSON.stringify(demoUser));

            // Dispatch a custom event (optional, keeping consistent with snippet idea)
            window.dispatchEvent(new CustomEvent('demo-auth-change', { detail: demoUser }));

            // Notify parent
            onLoginSuccess(demoUser);

        } catch (err) {
            console.error(err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Back button */}
            <Button
                variant="ghost"
                onClick={onBack}
                className="absolute top-6 left-6 gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/25 rounded-3xl p-8 shadow-2xl relative z-10 transition-colors duration-300">
                    {/* Header with Custom Symbol */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-xl mb-4 transform hover:scale-105 transition-transform duration-300">
                            <GraduationCap className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-kannada text-center">
                            {isLogin ? "ಮತ್ತೆ ಸ್ವಾಗತ" : "ಖಾತೆ ರಚಿಸಿ"}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 rounded-lg text-sm text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-4 mb-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Full Name</label>
                                    <Input
                                        icon={User}
                                        type="text"
                                        name="full_name"
                                        placeholder="Enter your name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Username</label>
                            <Input
                                icon={User}
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                            <Input
                                icon={Mail}
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                            <Input
                                icon={Lock}
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!isLogin && (
                            /* Confirm Password field removed as per user request */
                            null
                        )}

                        <Button type="submit" disabled={loading} className="w-full mt-6 h-12 text-base">
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </Button>
                    </form>

                    <div className="mt-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <Button
                                variant="link"
                                className="ml-2 font-bold"
                                onClick={toggleMode}
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </Button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
