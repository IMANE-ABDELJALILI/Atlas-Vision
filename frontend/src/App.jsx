import { useState, useRef, useEffect } from 'react';
import {
  Upload, Camera, AlertCircle, Loader2,
  Image as ImageIcon, MapPin, MessageCircle,
  Send, X, Bot, ExternalLink, ZoomIn, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from "browser-image-compression";
import HomePage from './HomePage';

// ==============================
// IMAGE COMPRESSION
// ==============================
async function compressImage(file) {
  const options = {
    maxSizeMB: 3,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

// ==============================
// LOCAL LANDMARK DATA
// ==============================
const landmarksInfo = {
  "Hassan II Mosque": {
    name: "Mosquée Hassan II",
    location: "Casablanca, Maroc",
  },
  "Koutoubia Mosque": {
    name: "Mosquée Koutoubia",
    location: "Marrakech, Maroc",
  },
  "Hassan Tower": {
    name: "Tour Hassan",
    location: "Rabat, Maroc",
  },
  "Jardin Majorelle": {
    name: "Jardin Majorelle",
    location: "Marrakech, Maroc",
  }
};

function App() {
  // ==============================
  // STATES
  // ==============================
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  // Landing State
  const [showLanding, setShowLanding] = useState(true);

  // About Modal State
  const [showAbout, setShowAbout] = useState(false);

  // Contact Modal State
  const [showContact, setShowContact] = useState(false);

  // Privacy Modal State
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Enter App (from landing page)
  const enterApp = () => {
    setShowLanding(false);
  };

  // Chat States
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ==============================
  // AUTO SCROLL CHAT
  // ==============================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ==============================
  // FILE HANDLING
  // ==============================
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setProgress(null);
  };

  // ==============================
  // ANALYZE IMAGE
  // ==============================
  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", await compressImage(image));

    try {
      const response = await fetch("https://imaneeeabdel-atlas-vision-api.hf.space/analyze-landmark", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (data.progress) {
        setProgress(data.progress);
      }

      if (data.found) {
        const details = Object.values(landmarksInfo).find(l =>
          data.name.includes(l.name) || l.name.includes(data.name)
        );

        setResult({
          found: true,
          name: details ? details.name : data.name,
          confidence: data.confidence,
          description: data.ai_description,
          location: details ? details.location : "Maroc",
          mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + " Morocco")}`
        });

        setChatMessages(prev => [
          ...prev,
          { text: `J'ai identifié ${data.name}. Posez-moi vos questions !`, isBot: true }
        ]);

      } else {
        setResult({ found: false });
      }

    } catch {
      setError("Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESET
  // ==============================
  const resetAll = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setProgress(null);
  };

  // ==============================
  // CHAT SEND
  // ==============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const monument = result?.name || "Maroc";

    setChatMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch("https://imaneeeabdel-atlas-vision-api.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monument_name: monument,
          question: inputMessage
        })
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch {
      setChatMessages(prev => [...prev, { text: "Erreur IA.", isBot: true }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* LANDING PAGE */}
      {showLanding && (
        <HomePage onEnter={enterApp} onContact={() => setShowContact(true)} onAbout={() => setShowAbout(true)} onPrivacy={() => setShowPrivacy(true)} />
      )}

      <div className={showLanding ? "hidden" : "p-4 md:p-8"}>

        {/* APP CONTENT (Existing) */}

        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER */}
          <header className="flex flex-col md:flex-row items-center justify-between gap-4 paper-card p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#8B4513] rounded-sm shadow-sm flex items-center justify-center text-[#FDFBF7]">
                <MapPin className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#2C1810]">
                Atlas <span className="text-[#8B4513] italic">Vision</span>
              </h1>
            </div>
            <button
              onClick={() => setShowLanding(true)}
              className="btn bg-[#8B4513] text-[#FDFBF7] text-xs md:text-sm py-2 px-4 border border-[#6F360E] hover:bg-[#6F360E] transition-all"
            >
               Retour à l'accueil
            </button>
          </header>

          {/* MAIN CONTENT GRID */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT COLUMN: VISUAL INPUT */}
            <div className="space-y-6">
              <div className="paper-card p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#5c4033] border-b-2 border-[#E6DCC3] pb-2 inline-block">
                  <ImageIcon className="text-[#8B4513]" /> Photographie
                </h2>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[#C19A6B] rounded-lg bg-[#F9F7F2] relative overflow-hidden transition-colors hover:bg-[#F0EAD6] m-2">
                  {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={preview}
                        alt="preview"
                        className="max-h-[450px] w-auto object-contain rounded-sm shadow-lg border-4 border-white transform rotate-1"
                      />
                      <button
                        onClick={resetAll}
                        className="absolute top-4 right-4 p-2 bg-[#FDFBF7] hover:bg-white text-[#8B4513] rounded-full shadow-md border border-[#E6DCC3] transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-[#E6DCC3] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B4513]">
                        <Upload size={32} />
                      </div>
                      <p className="text-xl font-serif font-bold text-[#5c4033] mb-2">Ajouter une photo</p>
                      <p className="text-[#8B4513] text-sm mb-6 italic">Glissez une image ou cliquez pour parcourir</p>
                      <button onClick={() => fileInputRef.current.click()} className="btn btn-primary">
                        Ouvrir la galerie
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={e => handleFileSelect(e.target.files[0])}
                  />
                </div>

                <div className="mt-6 px-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={!image || loading}
                    className={`btn w-full text-lg py-3 ${!image || loading ? 'bg-[#E6DCC3] text-[#8B4513] border-[#E6DCC3] cursor-not-allowed' : 'btn-primary'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" /> Consultation des archives...
                      </>
                    ) : (
                      <>
                        <ZoomIn size={20} /> Identifier le lieu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTELLIGENCE HUB */}
            <div className="space-y-6">

              {/* ANALYSIS RESULT */}
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="paper-card p-6 min-h-[500px]"
                  >
                    {result.found ? (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between border-b-2 border-[#8B4513] pb-4 border-double">
                          <div>
                            <h2 className="text-4xl font-serif text-[#2C1810] mb-2">{result.name}</h2>
                            <div className="flex items-center gap-2 text-[#8B4513] italic font-medium">
                              <MapPin size={18} />
                              {result.location}
                            </div>
                          </div>

                        </div>

                        <div className="prose prose-stone">
                          <p className="text-[#4A3B32] text-lg leading-relaxed font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-[#8B4513] first-letter:mr-1 first-letter:float-left">
                            {result.description}
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-[#E6DCC3] mt-4">
                          <a
                            href={result.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary flex-1 py-3 text-sm font-bold"
                          >
                            <ExternalLink size={18} /> Consulter la carte
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-[#F0EAD6] text-[#8B4513] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C19A6B]">
                          <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#2C1810]">Lieu Inconnu</h3>
                        <p className="text-[#8B4513] mt-2 italic">Nos archives ne contiennent pas ce monument.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="paper-card p-6 h-full min-h-[500px] flex flex-col items-center justify-center text-center text-[#C19A6B]">
                    <div className="w-24 h-24 bg-[#FAF7F0] rounded-full flex items-center justify-center mb-6 border-4 border-[#E6DCC3] border-double">
                      <Bot size={48} />
                    </div>
                    <p className="text-xl font-serif text-[#8B4513]">En attente d'analyse...</p>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto mt-12 text-center text-[#8B4513] text-sm font-serif opacity-80 pb-8">
          <p>© {new Date().getFullYear()} Atlas Vision. Une fenêtre ouverte sur l'histoire du Maroc.</p>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => setShowAbout(true)} className="hover:text-[#6F360E] underline decoration-[#C19A6B] cursor-pointer">À propos</button>
            <span>•</span>
            <button onClick={() => setShowContact(true)} className="hover:text-[#6F360E] underline decoration-[#C19A6B] cursor-pointer">Contacter</button>
            <span>•</span>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-[#6F360E] underline decoration-[#C19A6B] cursor-pointer">Confidentialité</button>
          </div>
        </footer>

        {/* FLOATING CHAT BUTTON & WINDOW */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="paper-card w-[350px] md:w-[400px] h-[500px] flex flex-col shadow-2xl overflow-hidden mb-2 border-2 border-[#8B4513]"
              >
                <div className="p-4 bg-[#8B4513] text-[#FDFBF7] flex items-center justify-between border-b-4 border-[#6F360E]">
                  <div className="flex items-center gap-2">
                    <Bot size={20} />
                    <h3 className="font-bold font-serif tracking-wide">Guide Touristique</h3>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-[#6F360E] p-1 rounded transition">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F7F2]">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] p-4 rounded-sm text-sm shadow-md font-serif leading-relaxed ${msg.isBot
                        ? 'bg-[#FFFDF9] text-[#4A3B32] border border-[#E6DCC3]'
                        : 'bg-[#8B4513] text-[#FDFBF7] border border-[#6F360E]'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#FFFDF9] p-3 rounded-sm border border-[#E6DCC3] shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-[#8B4513]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-3 bg-[#F0EAD6] border-t-2 border-[#E6DCC3]">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Posez une question..."
                      className="flex-1 px-3 py-2 rounded border-2 border-[#C19A6B] bg-white text-sm focus:outline-none focus:border-[#8B4513] font-serif text-[#4A3B32]"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isChatLoading}
                      className="p-2 bg-[#8B4513] text-[#FDFBF7] rounded hover:bg-[#6F360E] disabled:opacity-50 shadow-sm border border-[#6F360E]"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 rounded-full bg-[#8B4513] text-[#FDFBF7] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all border-2 border-[#F0EAD6]"
          >
            {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        </div>
      </div>

      {/* CONTACT MODAL - Available on both landing and main app */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowContact(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] w-full max-w-md rounded-lg shadow-2xl overflow-hidden border-2 border-[#8B4513] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#8B4513] to-[#6F360E] text-[#FDFBF7] relative">
                <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 text-[#F0EAD6] hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-[#F0EAD6] rounded-sm flex items-center justify-center text-[#8B4513]">
                    <MessageCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold">Contactez-nous</h2>
                    <p className="text-[#F0EAD6] text-sm">Nous sommes à votre écoute</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Email Display */}
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Adresse Email
                  </h3>
                  <div className="bg-[#F9F7F2] p-4 rounded-sm border border-[#E6DCC3] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-[#F0EAD6] shrink-0">
                      <Send size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#8B4513] uppercase font-bold mb-1">Email</p>
                      <a
                        href="mailto:imane.abdeljalili@usmba.ac.ma"
                        className="text-[#2C1810] font-mono text-sm hover:text-[#8B4513] transition-colors break-all"
                      >
                        imane.abdeljalili@usmba.ac.ma
                      </a>
                    </div>
                  </div>
                </div>

                {/* Message Info */}
                <div className="bg-[#F0EAD6] p-4 rounded-sm border border-[#C19A6B]">
                  <p className="text-[#4A3B32] text-sm font-serif leading-relaxed">
                    💡 <strong>Astuce :</strong> Cliquez sur le bouton ci-dessous pour ouvrir votre client email et nous envoyer un message directement.
                  </p>
                </div>

                {/* Send Email Button */}
                <a
                  href="mailto:imane.abdeljalili@usmba.ac.ma?subject=Contact depuis Atlas Vision&body=Bonjour,%0D%0A%0D%0A"
                  className="block w-full bg-[#8B4513] hover:bg-[#6F360E] text-[#FDFBF7] px-6 py-3 rounded-sm font-bold transition-all shadow-lg text-center border-2 border-[#6F360E] hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send size={20} />
                    <span>Envoyer un message</span>
                  </div>
                </a>

                {/* Additional Info */}
                <div className="text-center pt-4 border-t border-[#E6DCC3]">
                  <p className="text-xs text-[#8B4513] font-serif">
                    Nous vous répondrons dans les plus brefs délais
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ABOUT MODAL - Available on both landing and main app */}
      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden border-2 border-[#8B4513] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#8B4513] to-[#6F360E] text-[#FDFBF7] relative">
                <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-[#F0EAD6] hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-[#F0EAD6] rounded-sm flex items-center justify-center text-[#8B4513]">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold">Atlas Vision</h2>
                    <p className="text-[#F0EAD6] text-sm">Découvrez le patrimoine marocain</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Introduction */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    À propos d'Atlas Vision
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Atlas Vision est une plateforme innovante qui utilise l'intelligence artificielle pour identifier et explorer les monuments emblématiques du Maroc. Notre mission est de rendre le patrimoine culturel marocain accessible à tous, en offrant une expérience éducative interactive et gratuite.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Fonctionnalités
                  </h3>
                  <ul className="space-y-2 text-[#4A3B32] font-serif">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">📸</span>
                      <span><strong>Reconnaissance IA :</strong> Téléchargez une photo et identifiez instantanément les monuments marocains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">🤖</span>
                      <span><strong>Guide Touristique IA :</strong> Posez vos questions et obtenez des informations détaillées sur l'histoire et la culture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">🗺️</span>
                      <span><strong>Localisation :</strong> Accédez directement à la carte pour planifier votre visite</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">🎨</span>
                      <span><strong>Interface élégante :</strong> Design inspiré du patrimoine marocain avec une esthétique vintage</span>
                    </li>
                  </ul>
                </div>

                {/* Technology */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Technologie
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Notre plateforme utilise des technologies de pointe incluant l'apprentissage automatique, la vision par ordinateur, et le traitement du langage naturel pour offrir une expérience utilisateur exceptionnelle.
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-[#F9F7F2] p-4 rounded-sm border border-[#E6DCC3]">
                  <p className="text-[#8B4513] font-serif italic text-center">
                    "Notre vision est de préserver et promouvoir le riche patrimoine culturel du Maroc à travers la technologie moderne."
                  </p>
                </div>

                {/* Contact */}
                <div className="text-center pt-4 border-t border-[#E6DCC3]">
                  <p className="text-sm text-[#8B4513] font-serif">
                    © {new Date().getFullYear()} Atlas Vision • Royaume du Maroc
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY MODAL - Available on both landing and main app */}
      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowPrivacy(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden border-2 border-[#8B4513] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#8B4513] to-[#6F360E] text-[#FDFBF7] relative">
                <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-4 text-[#F0EAD6] hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-[#F0EAD6] rounded-sm flex items-center justify-center text-[#8B4513]">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold">Confidentialité</h2>
                    <p className="text-[#F0EAD6] text-sm">Protection de vos données</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Introduction */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Politique de Confidentialité
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Chez Atlas Vision, nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                </div>

                {/* Data Collection */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Collecte des Données
                  </h3>
                  <ul className="space-y-2 text-[#4A3B32] font-serif">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">📸</span>
                      <span><strong>Images :</strong> Les photos que vous téléchargez sont traitées localement et ne sont pas stockées sur nos serveurs de manière permanente.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">💬</span>
                      <span><strong>Conversations :</strong> Les échanges avec notre assistant IA sont temporaires et utilisés uniquement pour améliorer votre expérience.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] mt-1">🔒</span>
                      <span><strong>Données techniques :</strong> Nous collectons des informations anonymes sur l'utilisation de l'application pour améliorer nos services.</span>
                    </li>
                  </ul>
                </div>

                {/* Data Usage */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Utilisation des Données
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Vos données sont utilisées exclusivement pour fournir et améliorer nos services de reconnaissance de monuments. Nous ne vendons ni ne partageons vos informations personnelles avec des tiers à des fins commerciales.
                  </p>
                </div>

                {/* Security */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Sécurité
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                  </p>
                </div>

                {/* Your Rights */}
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#2C1810] border-b-2 border-[#E6DCC3] pb-2">
                    Vos Droits
                  </h3>
                  <p className="text-[#4A3B32] leading-relaxed font-serif">
                    Vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Pour exercer ces droits, veuillez nous contacter à l'adresse email fournie dans la section Contact.
                  </p>
                </div>

                {/* Notice */}
                <div className="bg-[#F9F7F2] p-4 rounded-sm border border-[#E6DCC3]">
                  <p className="text-[#8B4513] font-serif italic text-center text-sm">
                    En utilisant Atlas Vision, vous acceptez notre politique de confidentialité. Nous nous réservons le droit de modifier cette politique à tout moment.
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-[#E6DCC3]">
                  <p className="text-sm text-[#8B4513] font-serif">
                    Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
