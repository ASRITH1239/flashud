import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get redirect path, default to account
    const from = location.state?.from?.pathname || '/account';

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            } else {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
            }

            if (result.error) throw result.error;

            if (!isLogin && result.data?.user && !result.data?.session) {
                setError('Registration successful! Please check your email to verify your account.');
            } else if (result.data?.session) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Update this if hosted elsewhere
                    redirectTo: `${window.location.origin}/account`,
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 selection:bg-brand-orange selection:text-white relative overflow-hidden pt-32">
            {/* Ambient background glows removed */}

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em] text-brand-dark">
                        {isLogin ? 'Welcome' : 'Join'} <span className="font-bold text-brand-orange">{isLogin ? 'Back' : 'Flashud'}</span>
                    </h1>
                    <p className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-[0.3em] mt-4">
                        Secure Customer Login
                    </p>
                </div>

                <div className="bg-white border border-black/5 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
                    {/* Inner subtle glow Removed */}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium tracking-[0.1em] text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-orange/50 transition-all placeholder-brand-dark/30 uppercase shadow-sm"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="UNIT@EXAMPLE.COM"
                                className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-orange/50 transition-all placeholder-brand-dark/30 uppercase shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">Password</label>
                                {isLogin && <a href="#" className="text-[9px] font-bold text-brand-orange hover:text-brand-dark transition-colors uppercase tracking-[0.1em]">Forgot?</a>}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="PASSWORD"
                                className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm text-brand-dark font-medium focus:outline-none focus:border-brand-orange/50 transition-all placeholder-brand-dark/30 tracking-widest shadow-sm"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-full bg-brand-orange text-white font-bold uppercase tracking-[0.2em] text-sm transition-all hover:bg-brand-dark hover:-translate-y-1 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        AUTHENTICATING...
                                    </>
                                ) : (
                                    isLogin ? 'Sign In' : 'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-black/10 text-center space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-white border border-black/10 text-brand-dark font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            CONTINUE WITH GOOGLE
                        </button>

                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-[10px] font-bold text-brand-dark/50 hover:text-brand-dark uppercase tracking-[0.1em] transition-colors"
                        >
                            {isLogin ? 'Create Account' : 'Back to Login'}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-[9px] font-medium text-brand-dark/40 tracking-[0.2em] uppercase">
                    AUTHORIZATION REQUIRED // RESTRICTED ACCESS
                </p>
            </div>
        </div>
    );
};

export default Login;
