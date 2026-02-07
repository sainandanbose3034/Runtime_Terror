import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';

const Login = () => {
    const { loginWithGoogle, loginWithEmail, signupWithEmail, currentUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    React.useEffect(() => {
        if (currentUser) {
            sessionStorage.removeItem('safetyAlertSent');
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignup) {
                await signupWithEmail(email, password, name);
            } else {
                await loginWithEmail(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-galactic opacity-20 z-0"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-nasa-blue/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="glass-panel max-w-md w-full p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="bg-nasa-blue inline-block p-4 rounded-full shadow-[0_0_20px_rgba(11,61,145,0.5)] mb-4">
                        <Globe size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Access Terminal</h2>
                    <p className="text-slate-400 mt-2">{isSignup ? 'Create new credentials.' : 'Identify yourself.'}</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                    {isSignup && (
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-space-dark border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-nasa-blue"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-space-dark border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-nasa-blue"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-space-dark border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-nasa-blue"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-nasa-blue hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(11,61,145,0.4)]"
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-space-card text-slate-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02]"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-nasa-blue text-sm hover:underline"
                    >
                        {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    By accessing this system, you agree to the <br /> NASA Open Data Policy & Security Protocols.
                </p>
            </div>
        </div>
    );
};

export default Login;
