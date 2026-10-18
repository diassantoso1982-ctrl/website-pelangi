import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

import {
  MASCOT_IMAGE_SRC,
  FALLBACK_MASCOT,
  onImageErrorWithFallback,
} from '../assets/images';

interface MascotGuideProps {
  currentText: string;
  autoSpeak?: boolean;
  onRepeat?: () => void;
  className?: string;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  currentText,
  autoSpeak = true,
  onRepeat,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  useEffect(() => {
    const unsub = audio.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (autoSpeak && currentText) {
      audio.speak(currentText);
    }
  }, [currentText, autoSpeak]);

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      audio.stopVoice();
    } else {
      if (onRepeat) {
        onRepeat();
      } else {
        audio.speak(currentText);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audio.toggleVoiceMute();
    setIsVoiceMuted(muted);
  };

  return (
    <div
      className={`relative flex items-end gap-3 bg-white/95 backdrop-blur-md border border-amber-300 shadow-xl rounded-2xl p-3 sm:p-4 text-slate-800 transition-all ${className}`}
    >
      {/* Mascot Avatar with speech pulse animation */}
      <div className="relative shrink-0">
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-amber-50 transition-transform ${
            isSpeaking ? 'scale-105 ring-4 ring-amber-300/60 animate-bounce-subtle' : ''
          }`}
        >
          <img
            src={MASCOT_IMAGE_SRC}
            alt="Kapten Spektra - Pemandu Petualangan"
            className="w-full h-full object-cover select-none"
            loading="eager"
            onError={(e) => onImageErrorWithFallback(e, FALLBACK_MASCOT)}
          />
        </div>

        {/* Talking Badge */}
        {isSpeaking && (
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </div>

      {/* Bubble Speech Text & Controls */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-700 tracking-wide uppercase font-['Fredoka']">
              Kapten Spektra
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              · Pemandu Bahasa Indonesia VI SD
            </span>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeakToggle}
              title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Panduan Suara'}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 transition-colors"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-emerald-600' : ''}`} />
              <span className="hidden xs:inline">{isSpeaking ? 'Bicara...' : 'Putar Suara'}</span>
            </button>
            <button
              onClick={handleMuteToggle}
              title={isVoiceMuted ? 'Nyalakan Suara Pemandu' : 'Bisukan Suara Pemandu'}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Dialogue Text */}
        <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer" onClick={handleSpeakToggle}>
          {currentText}
        </p>
      </div>
    </div>
  );
};
