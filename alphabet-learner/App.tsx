import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ALPHABET } from './constants';
import LetterCard from './components/LetterCard';
import { generateLetterSpeech } from './services/gemini';
import { decodeAudioData, decodeBase64 } from './utils/audio';
import { AudioState } from './types';
import { Volume2, BookOpen, GraduationCap, Share2, Check } from 'lucide-react';

const App: React.FC = () => {
  // Global Audio Context
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Track audio state per letter
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [loadingLetter, setLoadingLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Share button state
  const [isCopied, setIsCopied] = useState(false);

  // Cache for decoded audio buffers to avoid re-fetching
  const audioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Initialize AudioContext lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000, // Match Gemini TTS default
      });
    }
    return audioContextRef.current;
  }, []);

  const playAudio = async (char: string) => {
    // 1. Setup UI State
    if (activeLetter === char) return; // Prevent double click
    setError(null);
    setLoadingLetter(char);
    
    try {
      const ctx = getAudioContext();
      
      // Resume context if needed (browser policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      let buffer = audioCacheRef.current.get(char);

      // 2. Fetch if not cached
      if (!buffer) {
        const response = await generateLetterSpeech(char);
        
        if (!response.audioData) {
          throw new Error("No audio received");
        }

        const pcmData = decodeBase64(response.audioData);
        buffer = await decodeAudioData(pcmData, ctx, 24000);
        
        // Cache it
        audioCacheRef.current.set(char, buffer);
      }

      // 3. Play Audio
      setLoadingLetter(null);
      setActiveLetter(char);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.0;
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.onended = () => {
        setActiveLetter(null);
      };

      source.start();

    } catch (err) {
      console.error(err);
      setError("Failed to load audio");
      setLoadingLetter(null);
      setActiveLetter(null);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
              Alphabet <span className="text-indigo-600">Learner</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200
                ${isCopied 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'}
              `}
              title="Copy Link to Clipboard"
            >
              {isCopied ? <Check size={16} /> : <Share2 size={16} />}
              <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Powered By Badge */}
            <div className="hidden sm:flex items-center space-x-2 text-slate-500 text-sm font-medium pl-2 border-l border-slate-200">
               <span>Powered by Gemini</span>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
                 <Volume2 size={16} />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800">
            Let's Learn English!
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Click on any card to hear the letter pronounced clearly.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-pulse">
             <div className="p-2 bg-red-500 rounded-full text-white">!</div>
             <p>{error}. Please try again or check your API key.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {ALPHABET.map((letter) => (
            <LetterCard
              key={letter.char}
              letter={letter}
              audioState={{
                isPlaying: activeLetter === letter.char,
                isLoading: loadingLetter === letter.char,
                error: null, // Global error handling used for simplicity
              }}
              onClick={playAudio}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-slate-400 text-sm">
           <div className="flex items-center justify-center gap-2 mb-2">
             <BookOpen size={16} />
             <span>Educational Tool</span>
           </div>
           <p>© {new Date().getFullYear()} Alphabet Learner. Audio generated in real-time.</p>
        </div>

      </main>
    </div>
  );
};

export default App;