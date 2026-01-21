
import React, { useState } from 'react';
import {
    GraduationCap,
    Home,
    Code2,
    BookOpen,
    HelpCircle,
    Users,
    LogIn,
    LogOut,
    ChevronDown,
    Sun,
    Moon
} from 'lucide-react';

const NavLink = ({ icon: Icon, label, onClick, active = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${active
            ? 'text-white bg-emerald-600 dark:bg-white/10'
            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const Navbar = ({ user, onLogin, onLogout, onNavigate, activePage, theme, toggleTheme }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
        setShowDropdown(false);
    };

    // Assuming onNavigateToAbout and onNavigateToLogin are new props or functions
    // For consistency with the original code's structure, I'll assume these are
    // meant to be calls to onNavigate with specific page names.
    // If they are meant to be separate functions, the parent component would need to provide them.
    const onNavigateToAbout = () => onNavigate('about');
    const onNavigateToLogin = () => onNavigate('login');


    return (
        <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 fixed top-0 left-0 z-50 shadow-2xl transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                            <span className="font-sans">Code</span> <span className="font-kannada">ನುಡಿ</span>
                        </span>
                    </div>
                </div>

                {/* Right Aligned Navigation and Actions */}
                <div className="flex items-center gap-6">
                    {/* Desktop Navigation Links - Hidden on Home */}
                    {activePage !== 'home' && (
                        <div className="hidden lg:flex items-center gap-2">
                            <NavLink
                                icon={Home}
                                label="Home"
                                onClick={() => onNavigate('home')}
                                active={activePage === 'home'}
                            />
                            <NavLink
                                icon={Code2}
                                label="Code"
                                onClick={() => onNavigate('converter')}
                                active={activePage === 'converter'}
                            />
                            <NavLink
                                icon={BookOpen}
                                label="Tutorials"
                                onClick={() => onNavigate('materials')}
                                active={activePage === 'materials'}
                            />
                            <NavLink
                                icon={HelpCircle}
                                label="Quizzes"
                                onClick={() => onNavigate('quiz')}
                                active={activePage === 'quiz'}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button - Always Visible */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-110 active:scale-95"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-teal-900 dark:text-emerald-200" />}
                        </button>

                        {/* Other buttons hidden on Home page */}
                        {activePage !== 'home' && (
                            <>
                                {/* About Us Button */}
                                <button
                                    onClick={() => onNavigate('about')}
                                    className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                >
                                    <Users className="w-4 h-4" />
                                    About Us
                                </button>

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="flex items-center gap-2 bg-slate-800 border border-white/10 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium hidden md:block">{user.username}</span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showDropdown && (
                                            <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Profile</p>
                                                    <p className="font-bold text-white truncate">{user.username}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => { onNavigate('dashboard'); setShowDropdown(false); }}
                                                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-slate-300 text-sm flex items-center gap-2"
                                                >
                                                    <Home className="w-4 h-4" /> Dashboard
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 text-sm flex items-center gap-2"
                                                >
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onNavigate('login')}
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
