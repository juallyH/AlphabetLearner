import { LetterState } from './types';

const COLORS = [
  'bg-red-200 text-red-800 border-red-300',
  'bg-orange-200 text-orange-800 border-orange-300',
  'bg-amber-200 text-amber-800 border-amber-300',
  'bg-green-200 text-green-800 border-green-300',
  'bg-emerald-200 text-emerald-800 border-emerald-300',
  'bg-teal-200 text-teal-800 border-teal-300',
  'bg-cyan-200 text-cyan-800 border-cyan-300',
  'bg-sky-200 text-sky-800 border-sky-300',
  'bg-blue-200 text-blue-800 border-blue-300',
  'bg-indigo-200 text-indigo-800 border-indigo-300',
  'bg-violet-200 text-violet-800 border-violet-300',
  'bg-purple-200 text-purple-800 border-purple-300',
  'bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300',
  'bg-pink-200 text-pink-800 border-pink-300',
  'bg-rose-200 text-rose-800 border-rose-300',
];

export const ALPHABET: LetterState[] = Array.from({ length: 26 }, (_, i) => {
  const char = String.fromCharCode(65 + i);
  return {
    char,
    word: `${char} is for...`, 
    color: COLORS[i % COLORS.length],
  };
});
