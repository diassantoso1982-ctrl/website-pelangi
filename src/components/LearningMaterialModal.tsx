import React, { useState } from 'react';
import { EXPLANATION_TEXT_PARAGRAPHS } from '../data/storyboardData';
import { BookOpen, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { audio } from '../utils/audio';

interface LearningMaterialModalProps {
  onClose: () => void;
}

export const LearningMaterialModal: React.FC<LearningMaterialModalProps> = ({ onClose }) => {
  const [readingParaId, setReadingParaId] = useState<string | null>(null);

  const handleReadParagraph = (paraId: string, text: string) => {
    if (readingParaId === paraId) {
      audio.stopVoice();
      setReadingParaId(null);
    } else {
      setReadingParaId(paraId);
      audio.speak(text, () => {
        setReadingParaId(null);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-teal-400 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 px-5 py-4 flex items-center justify-between border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/30 border border-teal-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-['Fredoka']">
                MATERI PEMBELAJARAN TEKS EKSPLANASI
              </h2>
              <p className="text-xs text-teal-200 font-medium">
                Bahasa Indonesia Kelas VI SD · Tema: Proses Terjadinya Pelangi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.stopVoice();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-teal-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-200">
          {/* Quick Summary of 3 Structures */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wide flex items-center gap-1.5 font-['Fredoka']">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Tiga Struktur Wajib Teks Eksplanasi
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Teks eksplanasi disusun dengan pola logis sebab-akibat. Perhatikan 3 blok utama di bawah ini:
            </p>
          </div>

          {/* Paragraph Cards with Audio Reader */}
          <div className="space-y-4">
            {EXPLANATION_TEXT_PARAGRAPHS.map((para) => (
              <div
                key={para.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 transition-all hover:border-teal-400/50"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold text-xs font-['Fredoka']">
                      {para.id.toUpperCase()}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white font-['Fredoka']">
                      {para.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-300">
                      {para.structure}
                    </span>

                    <button
                      onClick={() => handleReadParagraph(para.id, para.content)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                        readingParaId === para.id
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-teal-600/60 hover:bg-teal-600 text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{readingParaId === para.id ? 'Membaca...' : 'Dengarkan'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif indent-6">
                  {para.content}
                </p>
              </div>
            ))}
          </div>

          {/* Ciri Kebahasaan */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm space-y-2">
            <h4 className="font-bold text-amber-300 font-['Fredoka']">
              Ciri Kebahasaan Teks Eksplanasi Kelas 6 SD:
            </h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>
                <strong>Konjungsi Kausalitas (Sebab-Akibat):</strong> <em>karena, sebab, oleh karena itu, sehingga, dengan demikian</em>.
              </li>
              <li>
                <strong>Konjungsi Kronologis (Urutan Waktu):</strong> <em>diawali, kemudian, setelah itu, lalu, pada akhirnya</em>.
              </li>
              <li>
                <strong>Istilah Ilmiah (Sains):</strong> <em>refraksi (pembiasan), dispersi (penguraian cahaya), spektrum warna, medium rapat</em>.
              </li>
              <li>
                <strong>Fokus pada Fenomena Umum:</strong> Bukan membahas manusia atau dongeng, melainkan fenomena alam yang objektif.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
