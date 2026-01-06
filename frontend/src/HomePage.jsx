import { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Compass, Camera, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage({ onEnter, onContact, onAbout, onPrivacy }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Préparez-vous",
            highlight: "pour votre voyage",
            subtitle: "et découvrez tous les aspects",
            description: "Atlas Vision est fourni gratuitement. Cette plateforme est basée sur l'intelligence artificielle. Téléchargez et explorez gratuitement n'importe quel monument marocain. Merci de visiter notre site.",
            cta1: "Découvrir Plus",
            cta2: "Nous Contacter",
            icon: Compass
        },
        {
            title: "Capturez",
            highlight: "l'Histoire",
            subtitle: "avec votre appareil photo",
            description: "Prenez une photo de n'importe quel monument marocain et découvrez son histoire fascinante instantanément grâce à notre technologie d'IA avancée.",
            cta1: "Essayer Maintenant",
            cta2: "Voir la Démo",
            icon: Camera
        },
        {
            title: "Explorez",
            highlight: "la Culture",
            subtitle: "du Royaume Chérifien",
            description: "Plongez dans l'histoire riche et la culture vibrante du Maroc à travers ses monuments emblématiques et ses sites historiques uniques.",
            cta1: "Commencer",
            cta2: "Guide Touristique",
            icon: Map
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F9F7F2]" style={{ backgroundImage: 'radial-gradient(#D7C4BB 1px, transparent 1px)', backgroundSize: '32px 32px' }}>

            {/* NAVIGATION BAR */}
            <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#2C1810]/95 to-transparent backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8B4513] rounded-sm shadow-lg flex items-center justify-center text-[#FDFBF7] border-2 border-[#F0EAD6]">
                            <MapPin className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FDFBF7]">
                            ATLAS <span className="text-[#D4A574] italic">VISION</span>
                        </h1>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onEnter}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-4 md:px-6 py-2 md:py-3 rounded-sm font-bold transition-all shadow-lg border-2 border-[#10B981] hover:border-[#059669] uppercase tracking-wide text-xs md:text-sm hover:scale-105 active:scale-95"
                    >
                        Commencer
                    </button>
                </div>
            </nav>

            {/* HERO SLIDER */}
            <div className="relative h-screen flex items-center justify-center">

                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410]/90 via-[#2C1810]/85 to-[#4A3B32]/80 z-10"></div>

                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F0EAD6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}></div>
                </div>

                {/* Slides Content */}
                <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="space-y-6 md:space-y-8"
                        >
                            {/* Main Heading */}
                            <div className="space-y-2 md:space-y-4">
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight"
                                >
                                    {slides[currentSlide].title}{' '}
                                    <span className="text-[#FF6B35]">{slides[currentSlide].highlight}</span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl md:text-3xl font-serif text-white/90"
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.p>
                            </div>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "120px" }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="h-1 bg-[#FF6B35]"
                            ></motion.div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm md:text-base lg:text-lg text-[#F0EAD6] max-w-2xl leading-relaxed font-serif"
                            >
                                {slides[currentSlide].description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6"
                            >
                                <button
                                    onClick={onEnter}
                                    className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-sm font-bold transition-all shadow-2xl border-2 border-[#10B981] hover:border-[#059669] uppercase tracking-widest text-sm hover:scale-105 active:scale-95"
                                >
                                    {slides[currentSlide].cta1}
                                </button>
                                <button
                                    onClick={onContact}
                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-8 py-4 rounded-sm font-bold transition-all shadow-2xl border-2 border-[#FF6B35] hover:border-[#E55A2B] uppercase tracking-widest text-sm hover:scale-105 active:scale-95"
                                >
                                    {slides[currentSlide].cta2}
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-[#2C1810]/60 hover:bg-[#8B4513] backdrop-blur-sm text-[#FDFBF7] flex items-center justify-center transition-all shadow-xl border border-[#F0EAD6]/30 hover:border-[#F0EAD6] group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-[#2C1810]/60 hover:bg-[#8B4513] backdrop-blur-sm text-[#FDFBF7] flex items-center justify-center transition-all shadow-xl border border-[#F0EAD6]/30 hover:border-[#F0EAD6] group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1 rounded-full transition-all ${index === currentSlide
                                ? 'bg-[#FF6B35] w-12'
                                : 'bg-[#F0EAD6]/40 w-8 hover:bg-[#F0EAD6]/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-20 space-y-2">
                <div className="flex justify-center gap-3 text-[10px] md:text-xs text-[#F0EAD6]/80">
                    <button onClick={onAbout} className="hover:text-[#FF6B35] transition-colors cursor-pointer">À propos</button>
                    <span>•</span>
                    <button onClick={onContact} className="hover:text-[#FF6B35] transition-colors cursor-pointer">Contacter</button>
                    <span>•</span>
                    <button onClick={onPrivacy} className="hover:text-[#FF6B35] transition-colors cursor-pointer">Confidentialité</button>
                </div>
                <p className="text-[10px] md:text-xs text-[#F0EAD6]/60 uppercase tracking-[0.3em] font-serif">
                    Royaume du Maroc • Archives Royales • 2026
                </p>
            </div>
        </div>
    );
}

export default HomePage;
