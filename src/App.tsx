import React, { useState, useEffect } from 'react';
import { GameStation, GameStationId, UserProgress } from './types/game';
import { GAME_STATIONS } from './data/storyboardData';
import { audio } from './utils/audio';
import { GameHeader } from './components/GameHeader';
import { MapCanvas } from './components/MapCanvas';
import { MascotGuide } from './components/MascotGuide';
import { GameStationModal } from './components/GameStationModal';
import { StoryboardModal } from './components/StoryboardModal';
import { LearningMaterialModal } from './components/LearningMaterialModal';
import { CertificateModal } from './components/CertificateModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import {
  Sparkles,
  Compass,
  Play,
  RotateCcw,
  Trophy,
  BookOpen,
  Film,
  Award,
  Volume2,
  HardDrive,
} from 'lucide-react';

import {
  MASCOT_IMAGE_SRC,
  MAP_BG_IMAGE_SRC,
  FALLBACK_MASCOT,
  FALLBACK_MAP,
  onImageErrorWithFallback,
} from './assets/images';

const LOCAL_STORAGE_KEY = 'pulau_pelangi_game_progress_v1';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [studentName, setStudentName] = useState('Petualang Cilik');
  const [completedStations, setCompletedStations] = useState<GameStationId[]>([]);
  const [stationStars, setStationStars] = useState<Record<GameStationId, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [coins, setCoins] = useState(0);
  const [activeModalStationId, setActiveModalStationId] = useState<GameStationId | null>(null);
  const [activePawnStationId, setActivePawnStationId] = useState<GameStationId>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);

  // Guide Mascot text on map screen
  const [mapMascotText, setMapMascotText] = useState(
    'Halo penjelajah cilik! Klik Pos 1 di dermaga pantai untuk memulai petualangan teks eksplanasi pelangi kita!'
  );

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: UserProgress = JSON.parse(saved);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.completedStations) setCompletedStations(parsed.completedStations);
        if (parsed.stationStars) setStationStars(parsed.stationStars);
        if (parsed.coins) setCoins(parsed.coins);
        if (parsed.elapsedSeconds) setElapsedSeconds(parsed.elapsedSeconds);
        if (parsed.hasFinishedGame) setIsGameFinished(parsed.hasFinishedGame);
        if (parsed.completedStations.length > 0) setHasStarted(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (hasStarted) {
      const progress: UserProgress = {
        studentName,
        completedStations,
        stationStars,
        totalScore: Object.values(stationStars).reduce((a, b) => a + b, 0) * 100,
        coins,
        activeStationId: activePawnStationId,
        gameStartTime: Date.now(),
        elapsedSeconds,
        hasFinishedGame: isGameFinished,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [hasStarted, studentName, completedStations, stationStars, coins, activePawnStationId, elapsedSeconds, isGameFinished]);

  // Timer loop (3-7 minutes game tracker)
  useEffect(() => {
    if (!hasStarted || isGameFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isGameFinished]);

  const totalStars = Object.values(stationStars).reduce((acc, curr) => acc + curr, 0);
  const maxStars = 15;

  // Start game handler
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    setHasStarted(true);
    audio.playSparkleSound();
    const welcome = `Selamat datang, ${studentName || 'Petualang Cilik'}! Aku Kapten Spektra. Ayo kita selidiki bagaimana cahaya matahari dan air hujan menciptakan busur pelangi! Klik Pos Satu di pantai!`;
    setMapMascotText(welcome);
    audio.speak(welcome);
  };

  // Station complete handler
  const handleCompleteStation = (stationId: GameStationId, starsEarned: number, bonusCoins: number) => {
    if (!completedStations.includes(stationId)) {
      const newCompleted = [...completedStations, stationId];
      setCompletedStations(newCompleted);

      setStationStars((prev) => ({
        ...prev,
        [stationId]: Math.max(prev[stationId] || 0, starsEarned),
      }));

      setCoins((prev) => prev + bonusCoins);

      if (stationId < 5) {
        const nextId = (stationId + 1) as GameStationId;
        setActivePawnStationId(nextId);
        const nextStation = GAME_STATIONS.find((s) => s.id === nextId);
        const praise = `Hebat sekali! Pos ${stationId} berhasil kamu selesaikan! Sekarang mari lanjutkan ke Pos ${nextId}: ${nextStation?.name}!`;
        setMapMascotText(praise);
        audio.speak(praise);
      } else {
        // Finished Pos 5 (All complete)
        setIsGameFinished(true);
        audio.playVictoryFanfare();
        const finishMessage = `Hore! Luar biasa ${studentName}! Kamu telah menyelesaikan seluruh 5 Pos dan menyusun Teks Eksplanasi Pelangi dengan sempurna! Buka Sertifikat Kelulusanmu sekarang!`;
        setMapMascotText(finishMessage);
        audio.speak(finishMessage);
        setShowCertificateModal(true);
      }
    }
  };

  const handleResetGame = () => {
    if (window.confirm('Mulai ulang petualangan dari awal? Progres saat ini akan diatur kembali ke Pos 1.')) {
      audio.stopVoice();
      setCompletedStations([]);
      setStationStars({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      setCoins(0);
      setElapsedSeconds(0);
      setIsGameFinished(false);
      setActivePawnStationId(1);
      setActiveModalStationId(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      audio.speak('Petualangan diatur ulang! Ayo mulai lagi menjelajah Pulau Pelangi!');
    }
  };

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const currentStationData = GAME_STATIONS.find((s) => s.id === activeModalStationId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-amber-950">
      {/* Top Header */}
      <GameHeader
        studentName={studentName}
        totalStars={totalStars}
        maxStars={maxStars}
        coins={coins}
        elapsedSeconds={elapsedSeconds}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStoryboard={() => setShowStoryboardModal(true)}
        onOpenMaterial={() => setShowMaterialModal(true)}
        onOpenCertificate={() => setShowCertificateModal(true)}
        onOpenDrive={() => setShowDriveModal(true)}
        onResetGame={handleResetGame}
        isGameFinished={isGameFinished}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Welcome Screen if not started */}
        {!hasStarted ? (
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 p-6 sm:p-10 my-auto flex flex-col md:flex-row items-center gap-8">
            {/* Background art blur */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <img
                src={MAP_BG_IMAGE_SRC}
                alt="Pulau Pelangi"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => onImageErrorWithFallback(e, FALLBACK_MAP)}
              />
            </div>

            {/* Mascot Avatar Card */}
            <div className="relative z-10 shrink-0 flex flex-col items-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-amber-100 ring-8 ring-amber-300/30">
                <img
                  src={MASCOT_IMAGE_SRC}
                  alt="Kapten Spektra"
                  className="w-full h-full object-cover select-none"
                  loading="eager"
                  onError={(e) => onImageErrorWithFallback(e, FALLBACK_MASCOT)}
                />
              </div>
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md font-['Fredoka']">
                🦜 Kapten Spektra
              </div>
            </div>

            {/* Intro Details & Form */}
            <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Media Game Interaktif Bahasa Indonesia Kelas VI SD</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Fredoka'] tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent">
                PETUALANGAN PULAU PELANGI
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Jelajahi 5 pos pulau rahasia untuk memecahkan misteri proses terjadinya pelangi secara ilmiah! Pelajari <strong>Pernyataan Umum</strong>, <strong>Deretan Penjelas (Refraksi, Dispersi Spektrum, Pemantulan Internal)</strong>, dan <strong>Penutup (Interpretasi)</strong>. Dilengkapi panduan suara interaktif!
              </p>

              {/* Player Name Form */}
              <form onSubmit={handleStartGame} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1.5">
                    Nama Penjelajah Cilik:
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Raditya Pratama / Siti Aulia"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm sm:text-base shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 font-['Fredoka']"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Mulai Berlayar (3 - 7 Menit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowStoryboardModal(true)}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Film className="w-4 h-4 text-indigo-400" />
                    <span>Lihat Storyboard</span>
                  </button>
                </div>
              </form>

              {/* Game Duration & Target Note */}
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center md:justify-start gap-3">
                <span>⏱️ Durasi: 3–7 Menit</span>
                <span>•</span>
                <span>🎙️ Suara Pemandu Bahasa Indonesia</span>
                <span>•</span>
                <span>⭐ 5 Pos Petualangan</span>
              </div>
            </div>
          </div>
        ) : (
          /* Active Island Map Canvas View */
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Guide Mascot Banner */}
            <MascotGuide
              currentText={mapMascotText}
              onRepeat={() => audio.speak(mapMascotText)}
            />

            {/* Full Island Map Canvas */}
            <div className="flex-1 min-h-[320px] flex items-center justify-center">
              <MapCanvas
                stations={GAME_STATIONS}
                completedStations={completedStations}
                stationStars={stationStars}
                activeStationId={activePawnStationId}
                onSelectStation={(id) => {
                  setActivePawnStationId(id);
                  setActiveModalStationId(id);
                }}
              />
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 font-['Fredoka']">Tahapan Petualangan:</span>
                <span className="text-slate-300">
                  {completedStations.length} dari 5 Pos Selesai ({Math.round((completedStations.length / 5) * 100)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStoryboardModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Storyboard Resmi</span>
                </button>

                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Modul Teks Pelangi</span>
                </button>

                <button
                  onClick={() => setShowDriveModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                  title="Simpan atau Kelola Dokumen di Google Drive"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Google Drive</span>
                </button>

                {completedStations.length === 5 && (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1 shadow-md animate-pulse font-['Fredoka']"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Klaim Sertifikat 🏆</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}

      {/* 1. Station Challenge Modal */}
      {activeModalStationId && currentStationData && (
        <GameStationModal
          station={currentStationData}
          onClose={() => setActiveModalStationId(null)}
          onCompleteStation={handleCompleteStation}
        />
      )}

      {/* 2. Storyboard Document Modal */}
      {showStoryboardModal && (
        <StoryboardModal onClose={() => setShowStoryboardModal(false)} />
      )}

      {/* 3. Learning Material Modal */}
      {showMaterialModal && (
        <LearningMaterialModal onClose={() => setShowMaterialModal(false)} />
      )}

      {/* 4. Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          studentName={studentName}
          totalStars={totalStars}
          maxStars={maxStars}
          coins={coins}
          elapsedSeconds={elapsedSeconds}
          onUpdateName={(name) => setStudentName(name)}
          onOpenDrive={() => setShowDriveModal(true)}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* 5. Google Drive Integration Modal */}
      {showDriveModal && (
        <GoogleDriveModal
          studentName={studentName}
          totalStars={totalStars}
          maxStars={maxStars}
          coins={coins}
          elapsedSeconds={elapsedSeconds}
          onClose={() => setShowDriveModal(false)}
        />
      )}
    </div>
  );
}
