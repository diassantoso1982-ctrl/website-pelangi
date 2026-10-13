import React, { useState } from 'react';
import { OFFICIAL_STORYBOARD, EXPLANATION_TEXT_PARAGRAPHS } from '../data/storyboardData';
import { Film, BookOpen, CheckSquare, X, Clock, Target, Volume2, Sparkles, Printer } from 'lucide-react';
import { audio } from '../utils/audio';

interface StoryboardModalProps {
  onClose: () => void;
}

export const StoryboardModal: React.FC<StoryboardModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'modul' | 'rubrik'>('storyboard');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-indigo-400 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 px-5 py-4 flex items-center justify-between border-b border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-300 flex items-center justify-center">
              <Film className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-['Fredoka']">
                DOKUMEN RESMI STORYBOARD & MODUL PEMBELAJARAN
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Bahasa Indonesia Kelas VI SD · Teks Eksplanasi "Proses Terjadinya Pelangi"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/60 hover:bg-indigo-600 text-xs font-semibold flex items-center gap-1.5 border border-indigo-400/30 transition-colors"
              title="Cetak Dokumen Storyboard"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-indigo-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 px-5 flex-wrap">
          <button
            onClick={() => setActiveTab('storyboard')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'storyboard'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>1. Storyboard Game Map (6 Scene)</span>
          </button>
          <button
            onClick={() => setActiveTab('modul')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'modul'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Teks Eksplanasi & Struktur</span>
          </button>
          <button
            onClick={() => setActiveTab('rubrik')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rubrik'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>3. Panduan Guru & Rubrik Asesmen</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-200 text-sm">
          {/* TAB 1: STORYBOARD 6 SCENES */}
          {activeTab === 'storyboard' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-amber-300 font-['Fredoka']">
                    Alur Permainan Edukatif (3 - 7 Menit)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Storyboard ini memandu integrasi pedagogis struktur teks eksplanasi (Pernyataan Umum, Deretan Penjelas Sebab-Akibat, Penutup/Interpretasi) dengan narasi suara interaktif.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total Durasi: ±5 Menit</span>
                </div>
              </div>

              {/* Scene Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFICIAL_STORYBOARD.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-400/60 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center font-['Fredoka']">
                          S{scene.sceneNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white font-['Fredoka']">
                          {scene.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                        ⏱️ {scene.estimatedDuration}
                      </span>
                    </div>

                    <div className="text-xs space-y-2">
                      <div>
                        <span className="font-bold text-indigo-300">Struktur: </span>
                        <span className="text-slate-200 font-semibold">{scene.structureSection}</span>
                      </div>

                      <div>
                        <span className="font-bold text-amber-400">Deskripsi Visual: </span>
                        <p className="text-slate-300 mt-0.5">{scene.visualDescription}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Narasi Pemandu (Voice Over):</span>
                        </div>
                        <p className="italic text-slate-300 font-serif text-[11px] leading-relaxed">
                          {scene.mascotNarration}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-sky-400">Mekanika Game: </span>
                        <p className="text-slate-300 mt-0.5">{scene.gameMechanic}</p>
                      </div>

                      <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-1.5 flex items-center gap-1">
                        <Target className="w-3 h-3 text-indigo-400" />
                        <span><strong>Tujuan:</strong> {scene.learningObjective}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TEKS EKSPLANASI & STRUKTUR */}
          {activeTab === 'modul' && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <h3 className="text-base font-bold text-teal-300 font-['Fredoka']">
                  Materi Teks Eksplanasi Kelas VI SD
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong>Teks Eksplanasi</strong> adalah teks yang menjelaskan proses terjadinya atau terbentuknya suatu fenomena alam, sosial, atau budaya secara ilmiah. Teks ini menjawab pertanyaan <em>"Mengapa" (hubungan sebab-akibat)</em> dan <em>"Bagaimana" (urutan proses kronologis)</em>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
                    <div className="font-bold text-amber-300">1. Pernyataan Umum</div>
                    <p className="text-slate-300">
                      Mengenalkan fenomena, definisi, dan keberadaan awal peristiwa (apa dan kapan).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                    <div className="font-bold text-emerald-300">2. Deretan Penjelas</div>
                    <p className="text-slate-300">
                      Uraian sebab-akibat terperinci: pembiasan (refraksi), penguraian (dispersi), dan pemantulan internal.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
                    <div className="font-bold text-purple-300">3. Penutup / Interpretasi</div>
                    <p className="text-slate-300">
                      Simpulan akhir, ulasan penulis, dan nilai ilmiah/apresiasi terhadap kebesaran alam.
                    </p>
                  </div>
                </div>
              </div>

              {/* Teks Lengkap Proses Terjadinya Pelangi */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Naskah Lengkap Model Teks Eksplanasi: "Proses Terjadinya Pelangi"
                </h4>

                <div className="space-y-3">
                  {EXPLANATION_TEXT_PARAGRAPHS.map((para) => (
                    <div
                      key={para.id}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 font-['Fredoka']">
                          {para.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          {para.structure}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed indent-4">
                        {para.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN GURU & ASESMEN */}
          {activeTab === 'rubrik' && (
            <div className="space-y-5">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <h3 className="text-base font-bold text-amber-300 font-['Fredoka']">
                  Petunjuk Penggunaan untuk Guru & Siswa
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Game ini dirancang untuk Pembelajaran Berdiferensiasi dan Asesmen Formatif Bahasa Indonesia Kelas 6 SD. Dapat dimainkan mandiri oleh siswa selama 3-7 menit di lab komputer, tablet, maupun layar interaktif kelas.
                </p>
              </div>

              {/* Rubrik Penilaian */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-700">
                      <th className="p-3">Pos & Aspek Penilaian</th>
                      <th className="p-3">Kriteria Bintang 3 (Sangat Baik)</th>
                      <th className="p-3">Kriteria Bintang 2 (Cukup)</th>
                      <th className="p-3">Kriteria Bintang 1 (Perlu Bimbingan)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-3 font-bold text-amber-300">Pos 1: Pernyataan Umum</td>
                      <td className="p-3 text-slate-300">Mampu mengenali definisi dan ciri pernyataan umum secara mandiri dan tepat.</td>
                      <td className="p-3 text-slate-400">Mampu menjawab setelah 1 kali petunjuk suara bantuan.</td>
                      <td className="p-3 text-slate-400">Masih tertukar dengan deretan penjelas.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-sky-300">Pos 2 & 3: Deretan Penjelas</td>
                      <td className="p-3 text-slate-300">Mampu menjelaskan pembiasan dan mengurutkan MeJiKuHiBiNiU tanpa kesalahan.</td>
                      <td className="p-3 text-slate-400">Mengurutkan warna dengan 1-2 perbaikan posisi.</td>
                      <td className="p-3 text-slate-400">Perlu mengulang simulator pembiasan beberapa kali.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-purple-300">Pos 4 & 5: Rekonstruksi & Penutup</td>
                      <td className="p-3 text-slate-300">Menyusun paragraf utuh eksplanasi secara runtut 100% tepat.</td>
                      <td className="p-3 text-slate-400">Menyusun paragraf dengan 1 kali bantuan koreksi.</td>
                      <td className="p-3 text-slate-400">Belum memahami posisi simpulan interpretasi.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
