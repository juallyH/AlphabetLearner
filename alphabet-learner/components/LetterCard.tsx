import React from 'react';
import { LetterState, AudioState } from '../types';
import { Loader2, Volume2, Music } from 'lucide-react';

interface LetterCardProps {
  letter: LetterState;
  audioState: AudioState;
  onClick: (char: string) => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, audioState, onClick }) => {
  const { isPlaying, isLoading, error } = audioState;

  return (
    <button
      onClick={() => onClick(letter.char)}
      disabled={isLoading || isPlaying}
      className={`
        relative group flex flex-col items-center justify-center 
        aspect-square rounded-2xl shadow-md border-b-4 
        transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl
        active:scale-95 active:border-b-0 active:translate-y-1
        ${letter.color}
        ${isLoading ? 'opacity-80 cursor-wait' : 'cursor-pointer'}
        ${isPlaying ? 'ring-4 ring-offset-2 ring-indigo-400 scale-105' : ''}
      `}
      aria-label={`Read letter ${letter.char}`}
    >
      {/* Background Icon Decoration */}
      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <Music size={24} />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center z-10">
        <span className="text-6xl md:text-7xl font-black drop-shadow-sm select-none">
          {letter.char}
        </span>
        <span className="text-xs md:text-sm font-bold opacity-0 group-hover:opacity-60 transition-opacity mt-1 uppercase tracking-wider">
          Click to Listen
        </span>
      </div>

      {/* Loading/Playing Status Overlay */}
      {(isLoading || isPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
          {isLoading && <Loader2 className="w-10 h-10 animate-spin text-white drop-shadow-md" />}
          {isPlaying && <Volume2 className="w-10 h-10 text-white drop-shadow-md animate-pulse" />}
        </div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
           <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Error</span>
        </div>
      )}
    </button>
  );
};

export default LetterCard;
