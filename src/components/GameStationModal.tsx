import React, { useState, useEffect } from 'react';
import { GameStation, GameStationId, Question } from '../types/game';
import { STATION_QUESTIONS, RAINBOW_COLORS, EXPLANATION_TEXT_PARAGRAPHS } from '../data/storyboardData';
import { audio } from '../utils/audio';
import { MascotGuide } from './MascotGuide';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Sun,
  Droplet,
  Layers,
  Repeat,
  Trophy,
  HelpCircle,
} from 'lucide-react';

const DIAGRAM_IMG = '/src/assets/images/droplet_dispersion_diagram_1791879180051.jpg';

interface GameStationModalProps {
  station: GameStation;
  onClose: () => void;
  onCompleteStation: (stationId: GameStationId, starsEarned: number, bonusCoins: number) => void;
}

export const GameStationModal: React.FC<GameStationModalProps> = ({
  station,
  onClose,
  onCompleteStation,
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'activity' | 'quiz' | 'result'>('intro');
  const [mascotText, setMascotText] = useState(station.voiceIntro);

  // Station 2 mini-game: Refraction angle
  const [refractionAngle, setRefractionAngle] = useState(25);
  const [isRefracted, setIsRefracted] = useState(false);

  // Station 3 mini-game: Spectrum ordering (Me-Ji-Ku-Hi-Bi-Ni-U)
  const [orderedColors, setOrderedColors] = useState<{ id: string; name: string; code: string }[]>([]);
  const [availableColors, setAvailableColors] = useState(
    [...RAINBOW_COLORS].sort(() => Math.random() - 0.5)
  );
  const [isSpectrumCorrect, setIsSpectrumCorrect] = useState(false);

  // Station 4 mini-game: Internal reflection
  const [internalAngle, setInternalAngle] = useState(30);
  const [isReflected, setIsReflected] = useState(false);

  // Station 5: Text structure reconstruction
  const [placedSections, setPlacedSections] = useState<{ id: string; structure: string; title: string }[]>([]);
  const [availableSections, setAvailableSections] = useState(
    [
      { id: 'sec1', structure: 'Pernyataan Umum', title: '1. Pengenalan Pelangi sebagai Fenomena Optik di Langit' },
      { id: 'sec2', structure: 'Deretan Penjelas', title: '2. Proses Pembiasan, Dispersi MeJiKuHiBiNiU, & Pantulan' },
      { id: 'sec3', structure: 'Penutup / Interpretasi', title: '3. Simpulan Ilmiah & Apresiasi Keteraturan Alam' },
    ].sort(() => Math.random() - 0.5)
  );
  const [isStructureCorrect, setIsStructureCorrect] = useState(false);

  // Quiz state
  const questions: Question[] = STATION_QUESTIONS[station.id] || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  // Start with station introduction voice
  useEffect(() => {
    setMascotText(station.voiceIntro);
    audio.speak(station.voiceIntro);
  }, [station]);

  // Handle Station 2 Slider
  const handleRefractionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRefractionAngle(val);
    if (val >= 40 && val <= 44) {
      if (!isRefracted) {
        setIsRefracted(true);
        audio.playSparkleSound();
        const praise = 'Luar biasa! Sudut tepat sekitar 42 derajat! Sinar matahari berhasil dibiaskan masuk ke dalam butiran air!';
        setMascotText(praise);
        audio.speak(praise);
      }
    } else {
      setIsRefracted(false);
    }
  };

  // Handle Station 3 Color Click
  const handleColorPick = (color: typeof RAINBOW_COLORS[0]) => {
    audio.playStepSound();
    audio.speak(`${color.name}! ${color.hint}`);
    const newOrdered = [...orderedColors, color];
    const newAvail = availableColors.filter((c) => c.id !== color.id);
    setOrderedColors(newOrdered);
    setAvailableColors(newAvail);

    // Check if finished
    if (newOrdered.length === RAINBOW_COLORS.length) {
      const isRightOrder = newOrdered.every((c, idx) => c.id === RAINBOW_COLORS[idx].id);
      if (isRightOrder) {
        setIsSpectrumCorrect(true);
        audio.playCorrectSound();
        const praise = 'Keren sekali penjelajah cilik! Spektrum Me-Ji-Ku-Hi-Bi-Ni-U berhasil kamu susun dengan sempurna dari merah hingga ungu!';
        setMascotText(praise);
        audio.speak(praise);
      } else {
        setIsSpectrumCorrect(false);
        audio.playWrongSound();
        const hint = 'Wah hampir tepat! Ingat urutan jembatan keledai: Me-Ji-Ku-Hi-Bi-Ni-U! Yuk ulangi lagi susunannya!';
        setMascotText(hint);
        audio.speak(hint);
      }
    }
  };

  const handleResetColors = () => {
    setOrderedColors([]);
    setAvailableColors([...RAINBOW_COLORS].sort(() => Math.random() - 0.5));
    setIsSpectrumCorrect(false);
  };

  // Handle Station 4 Internal Reflection
  const handleInternalReflectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalAngle(val);
    if (val >= 41 && val <= 43) {
      if (!isReflected) {
        setIsReflected(true);
        audio.playSparkleSound();
        const praise = 'Mantap jiwa! Cahaya memantul sempurna di dinding belakang butiran air lalu memancar ke mata pengamat!';
        setMascotText(praise);
        audio.speak(praise);
      }
    } else {
      setIsReflected(false);
    }
  };

  // Handle Station 5 Structure Pick
  const handlePickSection = (sec: { id: string; structure: string; title: string }) => {
    audio.playStepSound();
    const newPlaced = [...placedSections, sec];
    const newAvail = availableSections.filter((s) => s.id !== sec.id);
    setPlacedSections(newPlaced);
    setAvailableSections(newAvail);

    if (newPlaced.length === 3) {
      if (
        newPlaced[0].id === 'sec1' &&
        newPlaced[1].id === 'sec2' &&
        newPlaced[2].id === 'sec3'
      ) {
        setIsStructureCorrect(true);
        audio.playCorrectSound();
        const praise = 'Luar biasa hebat! Kamu berhasil menyusun struktur teks eksplanasi: Pernyataan Umum, Deretan Penjelas, dan Penutup secara runtut!';
        setMascotText(praise);
        audio.speak(praise);
      } else {
        setIsStructureCorrect(false);
        audio.playWrongSound();
        const hint = 'Urutannya belum tepat! Urutan teks eksplanasi yang benar adalah: 1. Pernyataan Umum, 2. Deretan Penjelas, 3. Penutup. Yuk coba susun lagi!';
        setMascotText(hint);
        audio.speak(hint);
      }
    }
  };

  const handleResetSections = () => {
    setPlacedSections([]);
    setAvailableSections(
      [
        { id: 'sec1', structure: 'Pernyataan Umum', title: '1. Pengenalan Pelangi sebagai Fenomena Optik di Langit' },
        { id: 'sec2', structure: 'Deretan Penjelas', title: '2. Proses Pembiasan, Dispersi MeJiKuHiBiNiU, & Pantulan' },
        { id: 'sec3', structure: 'Penutup / Interpretasi', title: '3. Simpulan Ilmiah & Apresiasi Keteraturan Alam' },
      ].sort(() => Math.random() - 0.5)
    );
    setIsStructureCorrect(false);
  };

  // Handle Quiz Option Selection
  const handleSelectOption = (optionId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswerChecked) return;
    const currentQ = questions[currentQuestionIndex];
    const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

    if (!selectedOpt) return;
    setIsAnswerChecked(true);

    if (selectedOpt.isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      audio.playCorrectSound();
      const praise =
        selectedOpt.correctVoice ||
        'Hebat sekali! Jawabanmu tepat dan sesuai dengan prinsip teks eksplanasi!';
      setFeedbackText(praise);
      setMascotText(praise);
      audio.speak(praise);
    } else {
      audio.playWrongSound();
      const encouraging =
        selectedOpt.wrongVoice ||
        'Hampir tepat! Perhatikan lagi penjelasan materi dan tetap semangat ya!';
      setFeedbackText(encouraging);
      setMascotText(encouraging);
      audio.speak(encouraging);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
      setFeedbackText('');
      const nextQ = questions[currentQuestionIndex + 1];
      setMascotText(nextQ.voiceQuestion);
      audio.speak(nextQ.voiceQuestion);
    } else {
      // Completed all questions in this station
      setCurrentStep('result');
      audio.playVictoryFanfare();
      const finishText = `Selamat! Kamu telah menyelesaikan Pos ${station.id}: ${station.name}! Kamu meraih bintang petualang!`;
      setMascotText(finishText);
      audio.speak(finishText);
    }
  };

  const handleFinishStation = () => {
    const stars = Math.min(3, Math.max(1, correctAnswersCount + 1));
    const bonusCoins = stars * 100;
    onCompleteStation(station.id, stars, bonusCoins);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-5 py-3.5 flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black font-['Fredoka'] flex items-center justify-center text-sm shadow-md">
              #{station.id}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Fredoka'] leading-none">
                Pos {station.id}: {station.name}
              </h2>
              <span className="text-xs text-amber-100 font-semibold">
                Struktur: {station.structurePart}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-amber-200 hover:text-white transition-colors"
            title="Tutup Pos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot Voice Guide Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800">
          <MascotGuide currentText={mascotText} />
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP: INTRO */}
          {currentStep === 'intro' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Target Pembelajaran Bahasa Indonesia Kelas VI SD</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {station.description}
                </p>
                <div className="mt-3 p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs sm:text-sm text-amber-200">
                  💡 <strong>Fokus Struktur:</strong> Teks eksplanasi menyajikan proses terjadinya fenomena alam berdasarkan sebab-akibat ilmiah. Bagian <strong>{station.structurePart}</strong> di pos ini akan diuji melalui interaksi langsung!
                </div>
              </div>

              {/* Action: Next to Activity / Quiz */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    audio.playStepSound();
                    if (station.id >= 2 && station.id <= 5) {
                      setCurrentStep('activity');
                    } else {
                      setCurrentStep('quiz');
                      if (questions.length > 0) {
                        setMascotText(questions[0].voiceQuestion);
                        audio.speak(questions[0].voiceQuestion);
                      }
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2 font-['Fredoka']"
                >
                  <span>Mulai Tantangan Pos {station.id}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP: ACTIVITY MINI-GAMES FOR STATIONS 2, 3, 4, 5 */}
          {currentStep === 'activity' && (
            <div className="space-y-6 animate-fade-in">
              {/* STATION 2: REFRACTION SIMULATOR */}
              {station.id === 2 && (
                <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-sky-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-sky-300 flex items-center gap-2">
                      <Droplet className="w-5 h-5" />
                      Simulator Pembiasan: Sinar Matahari Masuk ke Tetes Air
                    </h3>
                    <span className="text-xs bg-sky-950 px-2.5 py-1 rounded-md text-sky-300 font-mono">
                      Sudut: {refractionAngle}°
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Geser tuas sudut pembiasan cahaya matahari hingga sinar berbelok dan terurai sempurna di dalam butiran air hujan (~42°)!
                  </p>

                  {/* Visual Drop Canvas Simulation */}
                  <div className="relative h-48 sm:h-56 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                    {/* Sun Icon */}
                    <div className="absolute left-6 top-6 flex items-center gap-2 text-amber-400">
                      <Sun className="w-8 h-8 animate-spin-slow" />
                      <span className="text-xs font-bold">Cahaya Matahari</span>
                    </div>

                    {/* Droplet representation */}
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-sky-400/20 via-sky-300/40 to-white/60 border-2 border-sky-300/80 shadow-[0_0_30px_rgba(56,189,248,0.4)] flex items-center justify-center">
                      <div className="text-[11px] text-sky-200 font-bold text-center px-2">
                        Butiran Air Hujan (Medium Lebih Rapat)
                      </div>

                      {/* Laser beam */}
                      <div
                        className={`absolute h-1.5 transition-all duration-300 ${
                          isRefracted
                            ? 'w-24 bg-gradient-to-r from-red-500 via-yellow-400 to-violet-500 shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                            : 'w-16 bg-white/40'
                        }`}
                        style={{
                          transform: `rotate(${refractionAngle - 30}deg)`,
                        }}
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-3 right-3">
                      {isRefracted ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                          Pembiasan Sempurna!
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                          Sesuaikan sudut (~42°)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Pengatur Sudut Pembiasan (Target: 40° - 44°):
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="75"
                      value={refractionAngle}
                      onChange={handleRefractionChange}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STATION 3: RAINBOW SPECTRUM DISPERSION (MeJiKuHiBiNiU) */}
              {station.id === 3 && (
                <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-purple-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Tantangan Dispersi: Susun Spektrum Me-Ji-Ku-Hi-Bi-Ni-U
                    </h3>
                    <button
                      onClick={handleResetColors}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      Ulangi
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Klik warna berikut secara berurutan dari sudut pembiasan terkecil (Merah) hingga terbesar (Ungu) sesuai jembatan keledai ilmiah: <strong>Me-Ji-Ku-Hi-Bi-Ni-U</strong>!
                  </p>

                  {/* Target Slot Row */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700">
                    <div className="text-[11px] font-bold text-slate-400 mb-2">
                      Urutan Terpasang ({orderedColors.length}/7):
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-h-[48px]">
                      {orderedColors.map((c, idx) => (
                        <div
                          key={c.id}
                          className="rounded-lg p-2 text-center text-xs font-bold shadow-md text-white flex flex-col items-center justify-center animate-scale-in"
                          style={{ backgroundColor: c.code }}
                        >
                          <span className="text-[10px] opacity-80">#{idx + 1}</span>
                          <span className="text-xs font-black">{c.name}</span>
                        </div>
                      ))}
                      {Array.from({ length: 7 - orderedColors.length }).map((_, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs font-mono"
                        >
                          ?
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Options to Pick */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-2">
                      Pilihan Warna Tersedia (Klik untuk memilih):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleColorPick(color)}
                          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                          style={{ backgroundColor: color.code }}
                        >
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isSpectrumCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Hebat! 7 warna pelangi terurai sempurna sesuai urutan dispersi cahaya!</span>
                    </div>
                  )}
                </div>
              )}

              {/* STATION 4: INTERNAL REFLECTION & 42-DEGREE ANGLE */}
              {station.id === 4 && (
                <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Tantangan Pemantulan Internal Total & Sudut 42°
                    </h3>
                    <span className="text-xs bg-amber-950 px-2.5 py-1 rounded-md text-amber-300 font-mono">
                      Sudut Pantul: {internalAngle}°
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Diagram Illustration */}
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[4/3]">
                      <img
                        src={DIAGRAM_IMG}
                        alt="Diagram Pemantulan Internal Pelangi"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-slate-300">
                        Cahaya yang masuk dipantulkan di bagian dalam dinding belakang tetesan air. Saat keluar kembali ke udara, cahaya membentuk sudut <strong>42°</strong> menuju mata kita!
                      </p>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">
                          Arahkan Sudut Pantul ke Mata Pengamat (Target: 42°):
                        </label>
                        <input
                          type="range"
                          min="20"
                          max="65"
                          value={internalAngle}
                          onChange={handleInternalReflectionChange}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      {isReflected ? (
                        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Sudut 42° tercapai! Busur pelangi terpancar sempurna ke mata pengamat!</span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs">
                          👉 Geser tuas hingga angka menunjukkan 42°.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STATION 5: TEXT STRUCTURE RECONSTRUCTION */}
              {station.id === 5 && (
                <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-indigo-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Rekonstruksi Struktur Teks Eksplanasi Pelangi
                    </h3>
                    <button
                      onClick={handleResetSections}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      Ulangi
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Susunlah 3 bagian pokok teks eksplanasi ini ke dalam urutan yang tepat dan logis:
                  </p>

                  {/* Target Boxes */}
                  <div className="space-y-2">
                    {['Pernyataan Umum', 'Deretan Penjelas', 'Penutup / Interpretasi'].map(
                      (strName, idx) => {
                        const item = placedSections[idx];
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                              item
                                ? 'bg-slate-800 border-indigo-400 text-white'
                                : 'bg-slate-950/60 border-dashed border-slate-700 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-300 text-xs font-black flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold">
                                {item ? item.title : `Slot ${idx + 1}: ${strName}`}
                              </span>
                            </div>
                            {item && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Available Options */}
                  {availableSections.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400">
                        Pilihan Paragraf (Klik untuk memasukkan ke slot di atas):
                      </div>
                      <div className="space-y-1.5">
                        {availableSections.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => handlePickSection(sec)}
                            className="w-full text-left p-3 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between"
                          >
                            <span>{sec.title}</span>
                            <span className="text-[10px] text-indigo-300 font-mono">Pilih</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isStructureCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Sempurna! Teks eksplanasi tersusun utuh: Pernyataan Umum → Deretan Penjelas → Penutup!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Next Button from Activity to Quiz */}
              <div className="flex justify-end">
                <button
                  disabled={
                    (station.id === 2 && !isRefracted) ||
                    (station.id === 3 && !isSpectrumCorrect) ||
                    (station.id === 4 && !isReflected) ||
                    (station.id === 5 && !isStructureCorrect)
                  }
                  onClick={() => {
                    audio.playStepSound();
                    setCurrentStep('quiz');
                    if (questions.length > 0) {
                      setMascotText(questions[0].voiceQuestion);
                      audio.speak(questions[0].voiceQuestion);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm sm:text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2 font-['Fredoka']"
                >
                  <span>Lanjut ke Kuis Pemahaman</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP: QUIZ QUESTIONS */}
          {currentStep === 'quiz' && questions.length > 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>
                  Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                </span>
                <span className="text-amber-400 font-bold">
                  Skor Pos: {correctAnswersCount * 100} Poin
                </span>
              </div>

              {/* Question Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-relaxed">
                  {questions[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {questions[currentQuestionIndex].options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optStyle =
                    'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';

                  if (isSelected && !isAnswerChecked) {
                    optStyle = 'bg-amber-950/70 border-amber-400 text-amber-200 ring-2 ring-amber-400/30';
                  }

                  if (isAnswerChecked) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'opacity-50 bg-slate-900 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswerChecked && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswerChecked && isSelected && !opt.isCorrect && (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {isAnswerChecked && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-700 space-y-1 text-xs sm:text-sm animate-fade-in">
                  <div className="font-bold text-amber-300">Penjelasan Guru:</div>
                  <p className="text-slate-300">
                    {questions[currentQuestionIndex].options.find((o) => o.id === selectedOptionId)?.explanation}
                  </p>
                </div>
              )}

              {/* Check Answer or Next Button */}
              <div className="flex justify-end gap-3 pt-2">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedOptionId}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-md transition-all font-['Fredoka']"
                  >
                    Kunci & Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition-all flex items-center gap-1.5 font-['Fredoka']"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP: RESULT & STARS */}
          {currentStep === 'result' && (
            <div className="text-center py-6 space-y-5 animate-scale-in">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black font-['Fredoka'] text-amber-300">
                  Pos {station.id} Selesai dengan Gemilang!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Kamu telah menaklukkan materi bagian <strong>{station.structurePart}</strong>.
                </p>
              </div>

              {/* Stars badge */}
              <div className="flex items-center justify-center gap-2 text-3xl">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>

              <div className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-bold">
                Hadiah: +3 Bintang Petualang & +300 Koin Sains!
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleFinishStation}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base shadow-xl transition-transform active:scale-95 font-['Fredoka']"
                >
                  Kembali ke Peta Petualangan 🗺️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
