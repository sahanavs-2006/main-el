
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

const NavLink = ({ icon: Icon, label, onClick, active = false, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${active
            ? 'text-white bg-emerald-600 dark:bg-white/10'
            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            } ${className}`}
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
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white text-xl leading-tight">
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
                                onClick={() => onNavigate('dashboard')}
                                active={activePage === 'dashboard'}
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
                                onClick={() => onNavigate('tutorials')}
                                active={activePage === 'tutorials'}
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
                        {/* Other buttons hidden on Home page */}
                        {activePage !== 'home' && (
                            <>
                                {/* About Us Button */}
                                <NavLink
                                    icon={Users}
                                    label="About Us"
                                    onClick={() => onNavigate('about')}
                                    active={activePage === 'about'}
                                    className="hidden sm:flex"
                                />

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="outline-none focus:scale-105 transition-transform"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg border-2 border-dashed border-emerald-300 shadow-md">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        </button>

                                        {showDropdown && (
                                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                                <div className="px-5 py-3">
                                                    <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-0.5">{user.username}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{user.email}</p>
                                                </div>

                                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors font-medium"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        icon={LogIn}
                                        label="Login"
                                        onClick={() => onNavigate('login')}
                                        active={activePage === 'login'}
                                    />
                                )}
                            </>
                        )}

                        {/* Theme Toggle Button - Always Visible */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-110 active:scale-95"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-teal-900 dark:text-emerald-200" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
