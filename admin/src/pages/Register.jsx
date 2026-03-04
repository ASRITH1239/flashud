import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setSuccess(''); // Clear success when user types
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        // Password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if admin already exists
            const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const defaultAdmin = { email: 'admin@flashud.com', password: 'admin123' };
            
            if (formData.email === defaultAdmin.email || storedAdmins.some(admin => admin.email === formData.email)) {
                setError('An admin with this email already exists');
                setIsLoading(false);
                return;
            }

            // Add new admin
            const newAdmin = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                createdAt: new Date().toISOString()
            };

            const updatedAdmins = [...storedAdmins, newAdmin];
            localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));

            setSuccess('Admin account created successfully! Redirecting to login...');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError('Registration failed. Please try again.');
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
                    <p className="text-gray-400 transition-all duration-1000 delay-500">Admin Registration</p>
                </div>

                {/* Registration Form */}
                <div className={`border-2 border-fashion-orange/20 p-8 transition-all duration-1000 delay-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <h2 className="text-2xl font-bold text-fashion-orange mb-6 text-center">
                        Create Admin Account
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm animate-pulse">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-500 text-sm animate-pulse">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500 transition-all duration-300 focus:scale-[1.02]"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@example.com"
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
                                    placeholder="Create a password (min. 6 characters)"
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

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-3 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] pr-12"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-fashion-orange transition-colors"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Admin Account'
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-fashion-orange hover:text-fashion-orange/80 transition-colors text-sm"
                            >
                                Already have an account? Sign In
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className={`text-center mt-8 text-gray-500 text-sm transition-all duration-1000 delay-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
                    <p>© 2024 FlashUD Admin Portal</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
