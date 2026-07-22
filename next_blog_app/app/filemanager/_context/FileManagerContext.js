'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ── Type helpers ─────────────────────────────────────────────── */
export const FOLDER_COLORS = [
  { name: 'indigo',  hex: '#4F46E5', bg: 'rgba(79,70,229,0.1)'   },
  { name: 'violet',  hex: '#7C3AED', bg: 'rgba(124,58,237,0.1)'  },
  { name: 'sky',     hex: '#0EA5E9', bg: 'rgba(14,165,233,0.1)'  },
  { name: 'emerald', hex: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
  { name: 'amber',   hex: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  { name: 'rose',    hex: '#F43F5E', bg: 'rgba(244,63,94,0.1)'   },
  { name: 'orange',  hex: '#F97316', bg: 'rgba(249,115,22,0.1)'  },
  { name: 'teal',    hex: '#14B8A6', bg: 'rgba(20,184,166,0.1)'  },
];

const FILE_TYPE_MAP = {
  pdf:  { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444', emoji: '📄' },
  doc:  { bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6', emoji: '📝' },
  docx: { bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6', emoji: '📝' },
  xls:  { bg: 'rgba(16,185,129,0.1)', color: '#10B981', emoji: '📊' },
  xlsx: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', emoji: '📊' },
  ppt:  { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', emoji: '📋' },
  pptx: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', emoji: '📋' },
  jpg:  { bg: 'rgba(236,72,153,0.1)', color: '#EC4899', emoji: '🖼️' },
  jpeg: { bg: 'rgba(236,72,153,0.1)', color: '#EC4899', emoji: '🖼️' },
  png:  { bg: 'rgba(236,72,153,0.1)', color: '#EC4899', emoji: '🖼️' },
  gif:  { bg: 'rgba(236,72,153,0.1)', color: '#EC4899', emoji: '🎞️' },
  mp4:  { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED', emoji: '🎬' },
  mov:  { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED', emoji: '🎬' },
  mp3:  { bg: 'rgba(14,165,233,0.1)', color: '#0EA5E9', emoji: '🎵' },
  zip:  { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', emoji: '🗜️' },
  txt:  { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', emoji: '📃' },
  js:   { bg: 'rgba(234,179,8,0.1)',  color: '#CA8A04', emoji: '⚡' },
  ts:   { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', emoji: '⚡' },
  default: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', emoji: '📁' },
};

export function getFileType(filename) {
  const ext = filename?.split('.').pop().toLowerCase();
  return FILE_TYPE_MAP[ext] || FILE_TYPE_MAP.default;
}

export function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/* ── Context ───────────────────────────────────────────────────── */
const FileManagerContext = createContext(null);

export function FileManagerProvider({ children }) {
  const router = useRouter();

  const [user, setUser]         = useState(null);
  const [folders, setFolders]   = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  /* ── Bootstrap: fetch current user + folders on mount ─────── */
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }
        const { user: u } = await res.json();
        setUser(u);
        setIsLoggedIn(true);
        await refreshFolders();
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Helpers ─────────────────────────────────────────────────── */
  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function refreshFolders() {
    const { folders: f } = await apiFetch('/api/folders');
    setFolders(f);
    return f;
  }

  /* ── Auth ────────────────────────────────────────────────────── */
  async function login(email, password) {
    const { user: u } = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(u);
    setIsLoggedIn(true);
    await refreshFolders();
    return u;
  }

  async function signup(name, email, password) {
    const { user: u } = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setUser(u);
    setIsLoggedIn(true);
    setFolders([]);
    return u;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setFolders([]);
    setIsLoggedIn(false);
    router.push('/filemanager/login');
  }

  /* ── User Actions ────────────────────────────────────────────── */
  async function updateUser(updates) {
    const { user: u } = await apiFetch('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setUser(u);
    return u;
  }

  /* ── Folder Actions ──────────────────────────────────────────── */
  async function createFolder(data) {
    const colorObj = FOLDER_COLORS.find((c) => c.name === data.colorName) || FOLDER_COLORS[0];
    const { folder } = await apiFetch('/api/folders', {
      method: 'POST',
      body: JSON.stringify({
        name:        data.name,
        description: data.description || '',
        color:       colorObj,
        icon:        data.icon || '📁',
        isPrivate:   data.isPrivate || false,
      }),
    });
    setFolders((prev) => [folder, ...prev]);
    return folder;
  }

  async function deleteFolder(folderId) {
    await apiFetch(`/api/folders/${folderId}`, { method: 'DELETE' });
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  }

  async function renameFolder(folderId, newName) {
    const { folder } = await apiFetch(`/api/folders/${folderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName }),
    });
    setFolders((prev) => prev.map((f) => (f.id === folderId ? folder : f)));
  }

  async function toggleStarFolder(folderId) {
    const current = folders.find((f) => f.id === folderId);
    if (!current) return;
    const { folder } = await apiFetch(`/api/folders/${folderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ starred: !current.starred }),
    });
    setFolders((prev) => prev.map((f) => (f.id === folderId ? folder : f)));
  }

  function getFolderById(id) {
    return folders.find((f) => f.id === id) || null;
  }

  /* ── File Actions ────────────────────────────────────────────── */
  async function uploadFiles(folderId, rawFiles) {
    const formData = new FormData();
    formData.append('folderId', folderId);
    for (const f of rawFiles) {
      formData.append('files', f);
    }

    const res = await fetch('/api/files', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');

    // Merge new files into the folder state
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, files: [...data.files, ...f.files], updatedAt: new Date().toISOString() }
          : f
      )
    );

    // Refresh user storage stats
    const userRes = await fetch('/api/auth/me');
    if (userRes.ok) {
      const { user: u } = await userRes.json();
      setUser(u);
    }

    return data.files;
  }

  async function deleteFile(folderId, fileId) {
    await apiFetch(`/api/files/${fileId}`, { method: 'DELETE' });
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, files: f.files.filter((fi) => fi.id !== fileId) }
          : f
      )
    );

    // Refresh user storage stats
    const userRes = await fetch('/api/auth/me');
    if (userRes.ok) {
      const { user: u } = await userRes.json();
      setUser(u);
    }
  }

  async function renameFile(folderId, fileId, newName) {
    const { file } = await apiFetch(`/api/files/${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName }),
    });
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, files: f.files.map((fi) => (fi.id === fileId ? file : fi)) }
          : f
      )
    );
  }

  /* ── Computed ────────────────────────────────────────────────── */
  const totalFiles      = folders.reduce((acc, f) => acc + f.files.length, 0);
  const totalSizeBytes  = folders.reduce(
    (acc, f) => acc + f.files.reduce((a, fi) => a + fi.size, 0),
    0
  );
  const starredFolders  = folders.filter((f) => f.starred);

  // Derive recent uploads from all files across folders, sorted newest first
  const recentUploads = folders
    .flatMap((f) =>
      f.files.map((fi) => ({
        id:         fi.id,
        name:       fi.name,
        folderId:   f.id,
        folderName: f.name,
        size:       fi.size,
        uploadedAt: fi.uploadedAt,
      }))
    )
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 10);

  return (
    <FileManagerContext.Provider
      value={{
        // State
        user, isLoggedIn, loading, error,
        folders, recentUploads,
        // Auth
        login, signup, logout,
        // User
        updateUser,
        // Folders
        createFolder, deleteFolder, renameFolder, toggleStarFolder, getFolderById,
        refreshFolders,
        // Files
        uploadFiles, deleteFile, renameFile,
        // Computed
        totalFiles, totalSizeBytes, starredFolders,
        // Constants
        FOLDER_COLORS,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManager() {
  const ctx = useContext(FileManagerContext);
  if (!ctx) throw new Error('useFileManager must be used inside FileManagerProvider');
  return ctx;
}
