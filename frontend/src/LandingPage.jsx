import React, { useState } from 'react';
import { Camera, MapPin, Award, Users, Globe, ChevronRight, Sparkles } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleEnter = (mode) => {
        setIsAnimating(true);
        setTimeout(() => {
            onEnter(mode);
        }, 600);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white transition-opacity duration-600 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6 md:p-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                            <MapPin className="w-8 h-8 text-teal-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Morocco Explorer</h1>
                            <p className="text-teal-200 text-sm">Discover Moroccan Landmarks</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="max-w-4xl w-full">
                        {/* Hero Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-medium">AI-Powered Landmark Recognition</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                Explore Morocco's
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                                    Hidden Treasures
                                </span>
                            </h2>

                            <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-2xl mx-auto">
                                Upload a photo and discover the rich history and culture behind Morocco's most iconic landmarks
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="bg-teal-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                    <Camera className="w-6 h-6 text-teal-300" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Instant Recognition</h3>
                                <p className="text-teal-200 text-sm">
                                    Upload or capture photos to instantly identify Moroccan landmarks
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                    <Globe className="w-6 h-6 text-emerald-300" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Rich Information</h3>
                                <p className="text-teal-200 text-sm">
                                    Learn about history, architecture, and cultural significance
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-yellow-300" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Earn Badges</h3>
                                <p className="text-teal-200 text-sm">
                                    Collect badges as you discover more landmarks across Morocco
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => handleEnter('login')}
                                className="group bg-white text-teal-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-50 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
                            >
                                Sign In
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => handleEnter('guest')}
                                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                Continue as Guest
                                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-teal-300 mb-1">50+</div>
                                <div className="text-sm text-teal-200">Landmarks</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-emerald-300 mb-1">10K+</div>
                                <div className="text-sm text-teal-200">Explorers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">15+</div>
                                <div className="text-sm text-teal-200">Cities</div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-6 text-center text-teal-200 text-sm">
                    <p>© 2026 Morocco Explorer. Powered by AI & Cultural Heritage</p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
