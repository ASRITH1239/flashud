import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);

        // Security: Disable right-click
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Security: Disable keyboard shortcuts
        const handleKeyDown = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
                alert('View Source is disabled for security reasons.');
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Branding: Console message
        console.log("%c© Copyright by Flashud Portfolio. All Rights Reserved.", "color: #FFD700; background: #000000; font-size: 16px; font-weight: bold; padding: 10px;");

        return () => {
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (err) {
            setError('Google Login failed: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            // Force strict Supabase Authentication to get a secure session for RLS
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                setError('Invalid credentials or user not registered in Supabase.');
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminEmail', data.user.email);
                navigate('/');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative selection:bg-brand-orange selection:text-white">
            {/* Background ambient glow specific to login */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full filter blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full filter blur-[100px] pointer-events-none"></div>

            <div className={`max-w-md w-full relative z-10 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Logo/Brand */}
                <div className={`text-center mb-10 transition-all duration-1000 delay-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="inline-block relative">
                        <div className="w-20 h-20 rounded-2xl bg-brand-gradient mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(255,123,0,0.5)]">
                            F
                        </div>
                        <h1 className="text-3xl font-light text-white uppercase tracking-[0.2em]">
                            Flashud <span className="text-brand-orange font-medium drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">Admin</span>
                        </h1>
                    </div>
                </div>

                {/* Login Form */}
                <div className={`bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl transition-all duration-1000 delay-700 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <h2 className="text-xl font-medium text-white/90 mb-8 uppercase tracking-widest text-center">
                        Secure Portal
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-white/60 pl-1">
                                Identity (Email)
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="flashud@gmail.com"
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-white/60 pl-1">
                                Security Code (Password)
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pr-16"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 text-xs font-bold uppercase tracking-wider hover:text-brand-orange transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? 'Authenticating...' : 'Sign In To Portal'}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.747-.067-1.48-.187-2.187H12.48z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer / Copyright */}
                <div className="text-center mt-12 text-white/40 font-medium text-xs space-y-2 uppercase tracking-[0.2em]">
                    <p>© Copyright by Flashud Portfolio</p>
                    <p className="opacity-50 tracking-wider">Secure Access Only</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
