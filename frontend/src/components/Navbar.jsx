import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Rocket, LogOut, LayoutDashboard, Globe, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-space-dark/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            {/* Orbital Ring - Outer */}
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="60 140" className="opacity-50" />
                            </svg>

                            {/* Core - Inner glowing planet */}
                            <div className="relative flex items-center justify-center z-10 w-full h-full">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-full pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-[200%] h-full animate-shimmer"></div>
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300">
                            COSMIC WATCH
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${isActive('/dashboard') ? 'text-cyan-400 bg-white/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                    <LayoutDashboard size={18} />
                                    <span>{t('navbar.dashboard')}</span>
                                </Link>
                                <Link to="/watchlist" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${isActive('/watchlist') ? 'text-cyan-400 bg-white/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                    <Rocket size={18} />
                                    <span>{t('navbar.watchlist')}</span>
                                </Link>
                                <Link to="/resources" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${isActive('/resources') ? 'text-cyan-400 bg-white/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                    <BookOpen size={18} />
                                    <span>{t('navbar.resources')}</span>
                                </Link>
                                <div className="h-6 w-px bg-white/10 mx-2"></div>
                                <LanguageSwitcher />
                                <div className="h-6 w-px bg-white/10 mx-2"></div>
                                <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-red-400 transition-colors">
                                    <LogOut size={18} />
                                    <span>{t('navbar.logout')}</span>
                                </button>
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20 border border-white/20">
                                    {currentUser.email[0].toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <>
                                <LanguageSwitcher />
                                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                                    {t('navbar.login')}
                                </Link>
                                <Link to="/signup" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-all shadow-lg hover:shadow-cyan-500/20">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <LanguageSwitcher />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-space-card/95 backdrop-blur-xl border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 text-slate-300 hover:bg-white/5 rounded-md">
                                    {t('navbar.dashboard')}
                                </Link>
                                <Link to="/watchlist" className="block px-3 py-2 text-slate-300 hover:bg-white/5 rounded-md">
                                    {t('navbar.watchlist')}
                                </Link>
                                <Link to="/resources" className="block px-3 py-2 text-slate-300 hover:bg-white/5 rounded-md">
                                    {t('navbar.resources')}
                                </Link>
                                <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-md">
                                    {t('navbar.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-slate-300 hover:bg-white/5 rounded-md">
                                    {t('navbar.login')}
                                </Link>
                                <Link to="/signup" className="block px-3 py-2 text-cyan-400 hover:bg-white/5 rounded-md">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
