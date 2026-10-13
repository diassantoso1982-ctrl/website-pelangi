import React from 'react';
import { Sparkles, Trophy, BookOpen, Film, Volume2, VolumeX, RotateCcw, Clock, HardDrive } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameHeaderProps {
  studentName: string;
  totalStars: number;
  maxStars: number;
  coins: number;
  elapsedSeconds: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStoryboard: () => void;
  onOpenMaterial: () => void;
  onOpenCertificate: () => void;
  onOpenDrive: () => void;
  onResetGame: () => void;
  isGameFinished: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  studentName,
  totalStars,
  maxStars,
  coins,
  elapsedSeconds,
  isMuted,
  onToggleMute,
  onOpenStoryboard,
  onOpenMaterial,
  onOpenCertificate,
  onOpenDrive,
  onResetGame,
  isGameFinished,
}) => {
  // Format elapsed time MM:SS
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // 3-7 minutes range indicator
  const isTargetTime = elapsedSeconds >= 180 && elapsedSeconds <= 420;

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/30 text-white px-3 sm:px-6 py-2.5 z-40 sticky top-0 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight font-['Fredoka'] bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent">
                PULAU PELANGI
              </h1>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Kelas VI SD
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
              Teks Eksplanasi: Proses Terjadinya Pelangi
            </p>
          </div>
        </div>

        {/* Stats: Student, Timer, Stars, Coins */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Player name */}
          <div className="text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 font-medium flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Penjelajah:</span>
            <span className="text-amber-300 font-bold truncate max-w-[100px] sm:max-w-[130px]">
              {studentName || 'Siswa Hebat'}
            </span>
          </div>

          {/* Target Timer 3 - 7 Minutes */}
          <div
            className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono ${
              isTargetTime
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
            title="Target durasi main: 3 - 7 menit"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{timeFormatted}</span>
            <span className="text-[10px] text-slate-400 hidden md:inline">(Target 3-7 mnt)</span>
          </div>

          {/* Stars */}
          <div className="text-xs bg-amber-950/50 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1">
            <span>⭐</span>
            <span>{totalStars} / {maxStars}</span>
          </div>

          {/* Coins */}
          <div className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-200 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1">
            <span>🪙</span>
            <span>{coins}</span>
          </div>
        </div>

        {/* Action Controls & Storyboard Modal Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Storyboard Button */}
          <button
            onClick={onOpenStoryboard}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 transition-colors shadow-sm"
            title="Lihat Lembar Storyboard Game Lengkap"
          >
            <Film className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden sm:inline">Storyboard</span>
          </button>

          {/* Materi Teks Eksplanasi Button */}
          <button
            onClick={onOpenMaterial}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-teal-600/80 hover:bg-teal-600 text-white border border-teal-400/40 transition-colors shadow-sm"
            title="Baca Materi Teks Eksplanasi Pelangi"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-200" />
            <span className="hidden sm:inline">Materi Teks</span>
          </button>

          {/* Certificate Button (Available anytime or highlighted upon finishing) */}
          <button
            onClick={onOpenCertificate}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-sm ${
              isGameFinished
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
            title="Lihat & Cetak Sertifikat Petualang"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sertifikat</span>
          </button>

          {/* Google Drive Button */}
          <button
            onClick={onOpenDrive}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white border border-emerald-400/40 transition-colors shadow-sm"
            title="Buka Integrasi Google Drive"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden md:inline">Drive</span>
          </button>

          {/* Audio Mute SFX Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={isMuted ? 'Nyalakan Efek Suara' : 'Bisukan Efek Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={onResetGame}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Mulai Ulang Petualangan"
          >
            <RotateCcw className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
