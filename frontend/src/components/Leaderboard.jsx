import React, { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, Target, Award, Star, Crown } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Leaderboard = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'ಎಲ್ಲಾ (All)', icon: '🏆' },
        { value: 'basic_syntax', label: 'ಮೂಲಭೂತ (Basic)', icon: '📝' },
        { value: 'loops', label: 'ಲೂಪ್ಸ್ (Loops)', icon: '🔁' },
        { value: 'conditionals', label: 'ಶರ್ತುಗಳು (Conditionals)', icon: '❓' },
        { value: 'functions', label: 'ಫಂಕ್ಷನ್ಸ್ (Functions)', icon: '⚡' },
        { value: 'data_structures', label: 'ಡೇಟಾ ರಚನೆಗಳು (Data)', icon: '📦' },
    ];

    useEffect(() => {
        fetchLeaderboard();
        fetchMyRank();
    }, [selectedCategory]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
            const response = await axios.get(`${API_URL}/leaderboard/${params}`);
            setLeaderboard(response.data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRank = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
            const response = await axios.get(`${API_URL}/leaderboard/my-rank/${params}`, {
                headers: { Authorization: `Token ${token}` }
            });
            setMyRank(response.data);
        } catch (error) {
            console.error('Error fetching rank:', error);
        }
    };

    const getRankDisplay = (rank) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
        return <span className="font-bold text-slate-600 dark:text-slate-300">#{rank}</span>;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
        return 'bg-gradient-to-r from-cyan-500 to-teal-600';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold flex items-center gap-2 transition-colors"
                >
                    ← ಹಿಂತಿರುಗಿ
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
                    </div>
                    <h1 className="font-kannada text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
                        ಶ್ರೇಷ್ಠರ ಪಟ್ಟಿ (Leaderboard)
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Top performers • ಉನ್ನತ ಸಾಧಕರು
                    </p>
                </div>

                {/* My Rank Card */}
                {myRank && (
                    <div className="mb-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl p-1 shadow-2xl">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{getRankDisplay(myRank.rank)}</div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-xl">{myRank.username}</p>
                                        <p className="text-slate-600 dark:text-slate-400 font-kannada">ನಿಮ್ಮ ಸ್ಥಾನ (Your Rank)</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{myRank.totalScore}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{myRank.accuracy}% ನಿಖರತೆ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`px-4 py-2 rounded-xl font-kannada font-semibold transition-all ${selectedCategory === cat.value
                                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="p-6 bg-gradient-to-r from-cyan-500 to-teal-600">
                        <h2 className="text-2xl font-bold text-white font-kannada">ಟಾಪ್ ಪರ್ಫಾರ್ಮರ್ಸ್ (Top Performers)</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left font-kannada text-slate-700 dark:text-slate-300">ಸ್ಥಾನ</th>
                                    <th className="px-6 py-4 text-left font-kannada text-slate-700 dark:text-slate-300">ಹೆಸರು</th>
                                    <th className="px-6 py-4 text-center font-kannada text-slate-700 dark:text-slate-300">ಅಂಕಗಳು</th>
                                    <th className="px-6 py-4 text-center font-kannada text-slate-700 dark:text-slate-300">ನಿಖರತೆ</th>
                                    <th className="px-6 py-4 text-center font-kannada text-slate-700 dark:text-slate-300">ಪ್ರಯತ್ನಗಳು</th>
                                    <th className="px-6 py-4 text-center font-kannada text-slate-700 dark:text-slate-300">ಹಂತ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr
                                        key={entry.userId}
                                        className={`border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${myRank && entry.userId === myRank.userId ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getRankDisplay(entry.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-white">{entry.username}</span>
                                                {entry.rank <= 3 && <Award className="w-4 h-4 text-yellow-500" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className="font-bold text-slate-900 dark:text-white">{entry.totalScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${entry.accuracy >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    entry.accuracy >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {entry.accuracy}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                                            {entry.totalAttempts}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <TrendingUp className="w-4 h-4 text-cyan-500" />
                                                <span className="font-bold text-slate-900 dark:text-white">{entry.level}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {leaderboard.length === 0 && (
                        <div className="p-12 text-center">
                            <Target className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-kannada text-lg">
                                ಇನ್ನೂ ಯಾರೂ ಕ್ವಿಜ್ ಪ್ರಯತ್ನಿಸಿಲ್ಲ
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                                Be the first to take the quiz!
                            </p>
                        </div>
                    )}
                </div>

                {/* Motivational Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 font-kannada text-sm">
                        💪 ಕಲಿತು ಬೆಳೆಯುತ್ತ ಹೋಗೋಣ • Keep learning and climbing! 🚀
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
