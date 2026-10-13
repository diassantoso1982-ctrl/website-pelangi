import React, { useState } from 'react';
import { Trophy, Star, Printer, X, Award, CheckCircle2, Sparkles, HardDrive } from 'lucide-react';
import { audio } from '../utils/audio';

const MASCOT_IMG = '/src/assets/images/captain_spectra_mascot_1791879179604.jpg';

interface CertificateModalProps {
  studentName: string;
  totalStars: number;
  maxStars: number;
  coins: number;
  elapsedSeconds: number;
  onUpdateName: (newName: string) => void;
  onOpenDrive?: () => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  totalStars,
  maxStars,
  coins,
  elapsedSeconds,
  onUpdateName,
  onOpenDrive,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(studentName);

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins} menit ${secs} detik`;

  const handlePrint = () => {
    audio.playSparkleSound();
    window.print();
  };

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      audio.playCorrectSound();
    }
  };

  // Determine achievement title
  const predicate =
    totalStars >= 13
      ? 'Penjelajah Spektrum Istimewa (Cum Laude)'
      : totalStars >= 9
      ? 'Penjelajah Sains Sangat Mahir'
      : 'Penjelajah Sains Berbakat';

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col my-auto max-h-[95vh] print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none print:w-full">
        {/* Modal Controls (Hidden when printing) */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 flex items-center justify-between border-b border-amber-400/30 print:hidden">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200" />
            <h2 className="text-base font-bold font-['Fredoka']">
              Piagam Sertifikat Kelulusan
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDrive && (
              <button
                onClick={onOpenDrive}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md font-['Fredoka']"
                title="Simpan Sertifikat ke Google Drive"
              >
                <HardDrive className="w-4 h-4 text-emerald-200" />
                <span>Simpan ke Drive</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-md font-['Fredoka']"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-amber-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Name input row (Hidden when printing) */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 print:hidden">
          <form onSubmit={handleNameSave} className="flex items-center gap-2 max-w-md mx-auto">
            <span className="text-xs text-slate-400 font-medium">Nama di Sertifikat:</span>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Masukkan nama lengkap kamu..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Terapkan
            </button>
          </form>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto bg-gradient-to-b from-amber-50/5 via-slate-900 to-amber-950/20 print:p-8 print:bg-white print:text-slate-900">
          <div className="border-4 border-double border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-5 bg-slate-950/90 print:bg-white print:border-amber-600 print:text-slate-900 shadow-2xl relative overflow-hidden">
            {/* Background watermark */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 pointer-events-none">
              <Sparkles className="w-full h-full text-amber-400" />
            </div>

            {/* Header Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center print:border-amber-600">
                <Award className="w-8 h-8 text-amber-400 print:text-amber-600" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase print:text-amber-700">
                KEMENTERIAN PENDIDIKAN DASAR & PETUALANGAN SAINS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-['Fredoka'] tracking-tight mt-1 bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent print:text-slate-900">
                PIAGAM PENGHARGAAN RESMI
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium print:text-slate-600">
                Diberikan kepada penjelajah cerdas atas penguasaan teks eksplanasi ilmiah:
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2 border-b-2 border-dashed border-amber-400/40 inline-block min-w-[280px]">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-['Fredoka'] print:text-amber-800">
                {nameInput || studentName || 'Penjelajah Cilik'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed print:text-slate-700">
              Telah berhasil menyelesaikan seluruh 5 Pos Petualangan Pulau Pelangi, memahami secara mendalam <strong>Pernyataan Umum</strong>, <strong>Deretan Penjelas (Pembiasan, Dispersi Spektrum, dan Pemantulan Internal)</strong>, serta <strong>Penutup (Interpretasi)</strong> pada teks eksplanasi Bahasa Indonesia Kelas VI SD.
            </p>

            {/* Stats Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto pt-2">
              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-amber-400/30 print:border-slate-300 print:bg-slate-50">
                <span className="text-[10px] sm:text-xs text-slate-400 block print:text-slate-600">Total Bintang</span>
                <span className="text-base sm:text-lg font-black text-amber-400 print:text-amber-700">
                  ⭐ {totalStars} / {maxStars}
                </span>
              </div>

              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-amber-400/30 print:border-slate-300 print:bg-slate-50">
                <span className="text-[10px] sm:text-xs text-slate-400 block print:text-slate-600">Koin Sains</span>
                <span className="text-base sm:text-lg font-black text-amber-300 print:text-amber-700">
                  🪙 {coins}
                </span>
              </div>

              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-amber-400/30 print:border-slate-300 print:bg-slate-50">
                <span className="text-[10px] sm:text-xs text-slate-400 block print:text-slate-600">Waktu Tempuh</span>
                <span className="text-base sm:text-lg font-black text-sky-400 print:text-sky-700">
                  ⏱️ {timeFormatted}
                </span>
              </div>
            </div>

            {/* Predicate */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold print:border-amber-600 print:text-amber-800">
              Predikat: {predicate}
            </div>

            {/* Signatures & Stamps */}
            <div className="pt-6 grid grid-cols-2 gap-4 max-w-lg mx-auto text-xs text-slate-400 print:text-slate-700">
              <div className="space-y-1">
                <span className="block text-[11px]">Tanggal Penerbitan:</span>
                <span className="font-bold text-slate-200 print:text-slate-900">{today}</span>
                <div className="h-10 flex items-center justify-center">
                  <span className="text-[10px] font-mono border border-slate-700 px-2 py-0.5 rounded bg-slate-900 print:bg-slate-100">
                    Cap Terverifikasi ✓
                  </span>
                </div>
                <span className="block border-t border-slate-700 pt-1 font-semibold text-[11px]">
                  Pendidik / Guru Kelas VI SD
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-[11px]">Pemandu Petualangan:</span>
                <span className="font-bold text-amber-300 print:text-amber-700 font-['Fredoka']">Kapten Spektra</span>
                <div className="h-10 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 shadow-sm">
                    <img src={MASCOT_IMG} alt="Kapten Spektra" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="block border-t border-slate-700 pt-1 font-semibold text-[11px]">
                  Kepala Ekspedisi Spektrum
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
