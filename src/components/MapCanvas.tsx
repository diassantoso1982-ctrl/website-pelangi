import React from 'react';
import { GameStation, GameStationId } from '../types/game';
import { Lock, Check, Star, Sparkles, Navigation } from 'lucide-react';
import { audio } from '../utils/audio';

import {
  MASCOT_IMAGE_SRC,
  MAP_BG_IMAGE_SRC,
  FALLBACK_MASCOT,
  FALLBACK_MAP,
  onImageErrorWithFallback,
} from '../assets/images';

interface MapCanvasProps {
  stations: GameStation[];
  completedStations: GameStationId[];
  stationStars: Record<GameStationId, number>;
  activeStationId: GameStationId | null;
  onSelectStation: (stationId: GameStationId) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  stations,
  completedStations,
  stationStars,
  activeStationId,
  onSelectStation,
}) => {
  // Determine if a station is unlocked
  const isStationUnlocked = (station: GameStation) => {
    if (station.id === 1) return true;
    const prevId = (station.id - 1) as GameStationId;
    return completedStations.includes(prevId);
  };

  const handleStationClick = (station: GameStation) => {
    if (!isStationUnlocked(station)) {
      audio.playWrongSound();
      audio.speak(`Pos ${station.id} masih terkunci! Selesaikan pos sebelumnya terlebih dahulu ya!`);
      return;
    }
    audio.playStepSound();
    onSelectStation(station.id);
  };

  // Find position of current pawn (active station or first uncompleted station)
  const currentTargetStation =
    stations.find((s) => s.id === activeStationId) ||
    stations.find((s) => !completedStations.includes(s.id)) ||
    stations[stations.length - 1];

  return (
    <div className="relative w-full aspect-[16/9] max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-slate-950 select-none">
      {/* Map Background Artwork */}
      <img
        src={MAP_BG_IMAGE_SRC}
        alt="Peta Petualangan Pulau Pelangi - Bahasa Indonesia Kelas 6 SD"
        className="w-full h-full object-cover object-center pointer-events-none"
        loading="eager"
        onError={(e) => onImageErrorWithFallback(e, FALLBACK_MAP)}
      />

      {/* Atmospheric Overlays: Soft sunray & cloud shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

      {/* SVG Connecting Paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1000 562.5"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="20%" stopColor="#F97316" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="80%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Trail 1 -> 2 */}
        <path
          d="M 255 360 Q 310 320, 385 250"
          fill="none"
          stroke={completedStations.includes(1) ? 'url(#rainbowGrad)' : '#FEF08A'}
          strokeWidth="7"
          strokeDasharray={completedStations.includes(1) ? 'none' : '8 6'}
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Trail 2 -> 3 */}
        <path
          d="M 385 250 Q 510 330, 630 320"
          fill="none"
          stroke={completedStations.includes(2) ? 'url(#rainbowGrad)' : '#FEF08A'}
          strokeWidth="7"
          strokeDasharray={completedStations.includes(2) ? 'none' : '8 6'}
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Trail 3 -> 4 */}
        <path
          d="M 630 320 Q 720 310, 805 260"
          fill="none"
          stroke={completedStations.includes(3) ? 'url(#rainbowGrad)' : '#FEF08A'}
          strokeWidth="7"
          strokeDasharray={completedStations.includes(3) ? 'none' : '8 6'}
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Trail 4 -> 5 */}
        <path
          d="M 805 260 Q 720 160, 500 130"
          fill="none"
          stroke={completedStations.includes(4) ? 'url(#rainbowGrad)' : '#FEF08A'}
          strokeWidth="7"
          strokeDasharray={completedStations.includes(4) ? 'none' : '8 6'}
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>

      {/* Explorer Character Pawn (Kapten Spektra) moving on active waypoint */}
      {currentTargetStation && (
        <div
          className="absolute z-30 transition-all duration-700 ease-out pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${currentTargetStation.x}%`,
            top: `${currentTargetStation.y - 4}%`,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Pin Marker */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-2xl overflow-hidden bg-amber-400 ring-4 ring-amber-300 animate-bounce">
              <img
                src={MASCOT_IMAGE_SRC}
                alt="Pion Petualang Kapten Spektra"
                className="w-full h-full object-cover select-none"
                loading="eager"
                onError={(e) => onImageErrorWithFallback(e, FALLBACK_MASCOT)}
              />
            </div>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-400 -mt-1 drop-shadow-md"></div>
            <div className="px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-black border border-amber-400/50 shadow-md whitespace-nowrap mt-1">
              📍 Posisi Kamu
            </div>
          </div>
        </div>
      )}

      {/* Station Nodes / Checkpoint Buttons */}
      {stations.map((station) => {
        const unlocked = isStationUnlocked(station);
        const isDone = completedStations.includes(station.id);
        const stars = stationStars[station.id] || 0;
        const isActive = activeStationId === station.id;

        return (
          <div
            key={station.id}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95"
            style={{
              left: `${station.x}%`,
              top: `${station.y}%`,
            }}
          >
            {/* Pulsing Aura if Active and Unlocked */}
            {unlocked && !isDone && (
              <span className="absolute -inset-3 rounded-full bg-amber-400/50 animate-ping pointer-events-none" />
            )}

            <button
              onClick={() => handleStationClick(station)}
              className={`relative group flex flex-col items-center focus:outline-none transition-all ${
                unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
              }`}
              title={`${station.name} (${station.structurePart})`}
            >
              {/* Node Button Circle */}
              <div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-['Fredoka'] font-black shadow-xl border-2 transition-all ${
                  isDone
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-white text-white shadow-emerald-500/40'
                    : unlocked
                    ? 'bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 border-white text-slate-950 shadow-amber-500/50 ring-4 ring-amber-300/60'
                    : 'bg-slate-700 border-slate-500 text-slate-400 shadow-none'
                }`}
              >
                {isDone ? (
                  <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
                ) : unlocked ? (
                  <span className="text-base sm:text-xl font-bold">#{station.id}</span>
                ) : (
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                )}
              </div>

              {/* Station Label & Tag */}
              <div className="mt-1.5 flex flex-col items-center pointer-events-none">
                <div
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black shadow-md border whitespace-nowrap transition-all ${
                    isDone
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                      : unlocked
                      ? 'bg-slate-950/90 text-amber-300 border-amber-400/50'
                      : 'bg-slate-900/90 text-slate-400 border-slate-700'
                  }`}
                >
                  {station.name}
                </div>

                {/* Structure Subtitle */}
                <div className="text-[9px] sm:text-[10px] font-bold text-amber-200/90 bg-black/60 px-1.5 py-0.2 rounded mt-0.5 tracking-tight border border-white/10">
                  {station.structurePart}
                </div>

                {/* Stars earned */}
                {isDone && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3].map((sIndex) => (
                      <Star
                        key={sIndex}
                        className={`w-3 h-3 ${
                          sIndex <= stars
                            ? 'text-amber-400 fill-amber-400 drop-shadow'
                            : 'text-slate-600 fill-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          </div>
        );
      })}

      {/* Floating Legend / Quick Guide Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-amber-500/30 text-white text-[10px] sm:text-xs hidden sm:flex items-center gap-3 shadow-lg">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
          <span>1. Pernyataan Umum</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
          <span>2-4. Deretan Penjelas</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span>
          <span>5. Penutup / Ulasan</span>
        </div>
      </div>
    </div>
  );
};
