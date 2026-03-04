import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        // Simulate API call for authentication
        try {
            // In a real application, you would make an API call here
            // For demo purposes, we'll use a simple check
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            // Check against stored admin users or default credentials
            const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const defaultAdmin = { email: 'admin@flashud.com', password: 'admin123' };
            
            const allAdmins = [defaultAdmin, ...storedAdmins];
            const isValidAdmin = allAdmins.some(admin => 
                admin.email === formData.email && admin.password === formData.password
            );
            
            if (isValidAdmin) {
                // Store authentication token/session
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminEmail', formData.email);
                
                // Redirect to dashboard
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-fashion-black flex items-center justify-center px-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-20 w-72 h-72 bg-fashion-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${isAnimating ? 'animate-bounce' : ''}`}></div>
                <div className={`absolute top-40 right-20 w-96 h-96 bg-fashion-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${isAnimating ? 'animate-ping' : ''} animation-delay-2000`}></div>
                <div className={`absolute bottom-20 left-1/2 w-80 h-80 bg-fashion-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${isAnimating ? 'animate-spin' : ''} animation-delay-4000`}></div>
            </div>

            <div className={`max-w-md w-full relative z-10 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Logo/Brand with Animation */}
                <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="inline-block relative">
                        <h1 className="text-4xl font-bold text-fashion-orange uppercase tracking-widest mb-2 animate-pulse">
                            FlashUD
                        </h1>
                        <div className="absolute -inset-1 bg-fashion-orange rounded-lg blur opacity-25 animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 transition-all duration-1000 delay-500">Admin Portal</p>
                </div>

                {/* Login Form */}
                <div className={`border-2 border-fashion-orange/20 p-8 transition-all duration-1000 delay-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <h2 className="text-2xl font-bold text-fashion-orange mb-6 text-center">
                        Admin Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@flashud.com"
                                className="w-full px-4 py-3 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500 transition-all duration-300 focus:scale-[1.02]"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] pr-12"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-fashion-orange transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 font-bold rounded-lg border-2 transition-all transform hover:scale-[1.02] ${
                                isLoading
                                    ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                                    : 'bg-fashion-orange text-fashion-black border-fashion-orange hover:bg-transparent hover:text-fashion-orange'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⚡</span>
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-fashion-orange hover:text-fashion-orange/80 transition-colors text-sm"
                            >
                                Don't have an account? Register Admin
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials Info */}
                    <div className="mt-6 p-4 bg-fashion-orange/10 border border-fashion-orange/20 rounded-lg">
                        <p className="text-xs text-gray-400 text-center">
                            <strong>Demo Credentials:</strong><br />
                            Email: admin@flashud.com<br />
                            Password: admin123
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>© 2024 FlashUD Admin Portal</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
