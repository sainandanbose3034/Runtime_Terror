import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Activity, Globe, ArrowRight } from 'lucide-react';
import RealisticEarth from '../components/RealisticEarth';

const Home = () => {
    const { currentUser } = useAuth();
    return (
        <div className="min-h-screen pt-20 relative">
            <div className="fixed inset-0 z-0">
                <RealisticEarth />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden pointer-events-none">
                <div className="relative z-10 max-w-4xl mx-auto pointer-events-auto">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-nasa-blue/30 border border-nasa-blue/50 text-cyan-400 font-mono text-sm animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                        ● SYSTEM ONLINE // MONITORING ACTIVE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Defending Earth from <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-nasa-blue">Cosmic Threats</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Real-time tracking of Near-Earth Objects (NEOs) using NASA's NeoWs API.
                        Analyze trajectories, assess impact risks, and secure our future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-nasa-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(11,61,145,0.5)] hover:shadow-[0_0_30px_rgba(11,61,145,0.7)] flex items-center justify-center gap-2"
                        >
                            <Globe size={20} /> Launch Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-20 bg-space-bg/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-nasa-blue/20 p-4 rounded-xl inline-block mb-4 text-nasa-blue">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Live NASA Feed</h3>
                            <p className="text-slate-400">Direct integration with the Jet Propulsion Laboratory (JPL) to provide up-to-the-second data on approaching asteroids.</p>
                        </div>
                        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-nasa-red/20 p-4 rounded-xl inline-block mb-4 text-nasa-red">
                                <ShieldAlert size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Risk Analysis</h3>
                            <p className="text-slate-400">Advanced algorithms classify objects based on estimated diameter, velocity, and miss distance to identify potential hazards.</p>
                        </div>
                        <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-emerald-500/20 p-4 rounded-xl inline-block mb-4 text-emerald-400">
                                <Activity size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Personal Watchlist</h3>
                            <p className="text-slate-400">Create an account to track specific objects of interest and receive alerts if their trajectory becomes threatening.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
