import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/driveAuth';
import {
  listDriveFiles,
  uploadCertificateToDrive,
  deleteFileFromDrive,
  DriveFileItem,
} from '../services/driveService';
import {
  X,
  HardDrive,
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { audio } from '../utils/audio';

interface GoogleDriveModalProps {
  studentName: string;
  totalStars: number;
  maxStars: number;
  coins: number;
  elapsedSeconds: number;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  studentName,
  totalStars,
  maxStars,
  coins,
  elapsedSeconds,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessLink, setUploadSuccessLink] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Destructive delete confirmation dialog state (MANDATORY per Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsub = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchFiles();
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
      }
    );
    return () => unsub();
  }, []);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const list = await listDriveFiles();
      setFiles(list);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat file Google Drive.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      audio.playStepSound();
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        audio.playSparkleSound();
        audio.speak('Berhasil terhubung dengan Google Drive!');
        fetchFiles();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal login Google.';
      setErrorMsg(message);
      audio.playWrongSound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    audio.playStepSound();
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
    setUploadSuccessLink(null);
  };

  const handleSaveToDrive = async () => {
    if (!user) {
      handleSignIn();
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      setUploadSuccessLink(null);
      audio.playStepSound();

      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const fileName = `Sertifikat Pulau Pelangi - ${studentName || 'Siswa'}.html`;

      const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat Penjelajah Pulau Pelangi - ${studentName}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .card { max-width: 700px; margin: 0 auto; background: #1e293b; border: 4px solid #f59e0b; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    h1 { color: #fde68a; font-size: 28px; margin-bottom: 8px; }
    h2 { color: #38bdf8; font-size: 20px; font-weight: normal; margin-top: 0; }
    .name { font-size: 32px; font-weight: bold; color: #fbbf24; border-bottom: 2px dashed #f59e0b; display: inline-block; padding: 10px 30px; margin: 20px 0; }
    .desc { font-size: 15px; color: #cbd5e1; line-height: 1.6; max-width: 550px; margin: 0 auto 25px; }
    .stats { display: flex; justify-content: center; gap: 20px; margin: 20px 0; }
    .stat-box { background: #0f172a; border: 1px solid #334155; padding: 12px 20px; border-radius: 12px; }
    .stat-label { font-size: 11px; color: #94a3b8; }
    .stat-val { font-size: 18px; font-weight: bold; color: #fef08a; }
    .footer { margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #334155; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>KEMENTERIAN PENDIDIKAN & PETUALANGAN SAINS</h2>
    <h1>PIAGAM PENGHARGAAN RESMI</h1>
    <p style="color: #94a3b8; font-size: 14px;">Teks Eksplanasi Bahasa Indonesia Kelas VI SD</p>
    <div class="name">${studentName || 'Penjelajah Cilik'}</div>
    <div class="desc">
      Telah berhasil menuntaskan 5 Pos Petualangan Pulau Pelangi dan memahami struktur teks eksplanasi:
      <strong>Pernyataan Umum</strong>, <strong>Deretan Penjelas (Pembiasan, Dispersi Spektrum, dan Pemantulan Internal)</strong>, serta <strong>Penutup (Interpretasi)</strong>.
    </div>
    <div class="stats">
      <div class="stat-box">
        <div class="stat-label">Bintang Diraih</div>
        <div class="stat-val">⭐ ${totalStars} / ${maxStars}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Koin Sains</div>
        <div class="stat-val">🪙 ${coins}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Durasi Main</div>
        <div class="stat-val">⏱️ ${mins}m ${secs}s</div>
      </div>
    </div>
    <div class="footer">
      Diterbitkan pada ${today} · Dipandu oleh Kapten Spektra
    </div>
  </div>
</body>
</html>`;

      const newFile = await uploadCertificateToDrive(fileName, htmlContent);
      audio.playCorrectSound();
      setUploadSuccessLink(newFile.webViewLink || null);
      audio.speak('Sertifikat berhasil disimpan ke Google Drive Anda!');
      fetchFiles();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan ke Google Drive.';
      setErrorMsg(message);
      audio.playWrongSound();
    } finally {
      setIsUploading(false);
    }
  };

  // Perform destructive file deletion with mandatory user confirmation
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMsg(null);
      await deleteFileFromDrive(fileToDelete.id);
      audio.playStepSound();
      setFileToDelete(null);
      fetchFiles();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus file.';
      setErrorMsg(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-400 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-5 py-4 flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-emerald-300/40 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Fredoka']">
                Integrasi Google Drive
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                Simpan & Kelola Sertifikat Petualang di Google Drive Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-10 h-10 rounded-full border border-emerald-400 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white">
                  {user.displayName || 'Pengguna Google'}
                </div>
                <div className="text-[11px] text-slate-400">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-300">
              Masuk dengan akun Google untuk menyimpan sertifikat ke Google Drive Anda.
            </div>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Keluar
            </button>
          ) : (
            /* Official Google Sign-in Button style per guideline */
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="gsi-material-button inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-800 hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>{isLoading ? 'Menghubungkan...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-200">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {uploadSuccessLink && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sertifikat Berhasil Disimpan ke Google Drive!</span>
              </div>
              <a
                href={uploadSuccessLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
              >
                <span>Buka di Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Action Box */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white font-['Fredoka']">
                Simpan Sertifikat & Laporan Petualang
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Nama: <strong>{studentName}</strong> · Skor: <strong>{totalStars}/{maxStars} ⭐</strong>
              </p>
            </div>

            <button
              onClick={handleSaveToDrive}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 font-['Fredoka'] whitespace-nowrap cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Menyimpan...' : 'Simpan ke Google Drive'}</span>
            </button>
          </div>

          {/* Files List in Drive */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                File Tersimpan di Google Drive ({files.length})
              </h4>
              {user && (
                <button
                  onClick={fetchFiles}
                  disabled={isLoading}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>
              )}
            </div>

            {!user ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                Silakan masuk dengan akun Google di atas untuk melihat riwayat file.
              </div>
            ) : files.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                Belum ada file sertifikat yang disimpan. Klik tombol "Simpan ke Google Drive" di atas untuk membuat file pertama Anda!
              </div>
            ) : (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/80 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {file.createdTime ? new Date(file.createdTime).toLocaleString('id-ID') : 'Tanggal tidak diketahui'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors"
                          title="Buka di tab baru"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Hapus file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/80 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold font-['Fredoka']">
                Konfirmasi Hapus File Google Drive
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus file{' '}
              <strong className="text-white">"{fileToDelete.name}"</strong> dari Google Drive Anda? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
