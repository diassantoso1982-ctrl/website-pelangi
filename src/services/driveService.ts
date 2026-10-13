import { getAccessToken } from './driveAuth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

export const listDriveFiles = async (): Promise<DriveFileItem[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Pengguna belum masuk ke Google Drive.');

  const query = encodeURIComponent("name contains 'Pulau Pelangi' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,createdTime,size)&orderBy=createdTime desc&pageSize=20`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal mengambil daftar file: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
};

export const uploadCertificateToDrive = async (
  fileName: string,
  htmlContent: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Pengguna belum masuk ke Google Drive.');

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/html',
    description: 'Sertifikat & Laporan Belajar Teks Eksplanasi Pelangi - Bahasa Indonesia Kelas VI SD',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    htmlContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal mengunggah ke Google Drive: ${res.statusText}`);
  }

  const createdFile: DriveFileItem = await res.json();
  return createdFile;
};

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Pengguna belum masuk ke Google Drive.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal menghapus file dari Google Drive: ${res.statusText}`);
  }
};
