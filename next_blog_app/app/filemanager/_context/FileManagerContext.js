'use client';
import { createContext, useContext, useState } from 'react';

/* ── Mock Data ─────────────────────────────────────────────── */
const FOLDER_COLORS = [
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
  zip:  { bg: 'rgba(107,114,128,0.1)',color: '#6B7280', emoji: '🗜️' },
  txt:  { bg: 'rgba(107,114,128,0.1)',color: '#6B7280', emoji: '📃' },
  js:   { bg: 'rgba(234,179,8,0.1)',  color: '#CA8A04', emoji: '⚡' },
  ts:   { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', emoji: '⚡' },
  default: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', emoji: '📁' },
};

export function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return FILE_TYPE_MAP[ext] || FILE_TYPE_MAP.default;
}

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export { FOLDER_COLORS };

/* ── Initial Mock State ────────────────────────────────────── */
const INITIAL_USER = {
  name: 'Sarah Johnson',
  email: 'sarah@stitchcloud.io',
  role: 'Pro Plan',
  initials: 'SJ',
  storageUsed: 18.7,
  storageTotal: 100,
  bio: 'Product designer and creative director. Love organizing ideas and assets.',
  language: 'English',
  notifications: { email: true, uploads: true, shared: false },
};

const INITIAL_FOLDERS = [
  {
    id: 'f1',
    name: 'Marketing Assets',
    description: 'Brand kits, banners, and campaign materials',
    color: FOLDER_COLORS[0],
    icon: '🎨',
    isPrivate: false,
    starred: true,
    createdAt: '2025-12-01',
    updatedAt: '2026-07-18',
    files: [
      { id: 'file-1', name: 'Brand_Guidelines_2026.pdf', size: 4200000, uploadedAt: '2026-07-18', starred: false },
      { id: 'file-2', name: 'Banner_Homepage.png', size: 1800000, uploadedAt: '2026-07-17', starred: true },
      { id: 'file-3', name: 'Campaign_Q3_Deck.pptx', size: 8500000, uploadedAt: '2026-07-15', starred: false },
      { id: 'file-4', name: 'Logo_Pack.zip', size: 12000000, uploadedAt: '2026-07-10', starred: false },
    ],
  },
  {
    id: 'f2',
    name: 'Product Designs',
    description: 'Figma exports, wireframes, and prototypes',
    color: FOLDER_COLORS[1],
    icon: '💎',
    isPrivate: false,
    starred: false,
    createdAt: '2025-11-20',
    updatedAt: '2026-07-20',
    files: [
      { id: 'file-5', name: 'Dashboard_v3.fig', size: 22000000, uploadedAt: '2026-07-20', starred: false },
      { id: 'file-6', name: 'Mobile_Wireframes.pdf', size: 3100000, uploadedAt: '2026-07-19', starred: false },
      { id: 'file-7', name: 'Component_Library.zip', size: 45000000, uploadedAt: '2026-07-14', starred: true },
    ],
  },
  {
    id: 'f3',
    name: 'Client Invoices',
    description: 'Monthly billing documents and contracts',
    color: FOLDER_COLORS[3],
    icon: '💼',
    isPrivate: true,
    starred: false,
    createdAt: '2025-10-01',
    updatedAt: '2026-07-01',
    files: [
      { id: 'file-8', name: 'Invoice_July_2026.pdf', size: 280000, uploadedAt: '2026-07-01', starred: false },
      { id: 'file-9', name: 'Contract_Acme_Corp.docx', size: 540000, uploadedAt: '2026-06-15', starred: false },
      { id: 'file-10', name: 'Invoice_June_2026.pdf', size: 265000, uploadedAt: '2026-06-01', starred: false },
    ],
  },
  {
    id: 'f4',
    name: 'Development',
    description: 'Source code archives, build files, and changelogs',
    color: FOLDER_COLORS[4],
    icon: '⚡',
    isPrivate: false,
    starred: false,
    createdAt: '2026-01-10',
    updatedAt: '2026-07-21',
    files: [
      { id: 'file-11', name: 'app_v2.4.0.zip', size: 87000000, uploadedAt: '2026-07-21', starred: false },
      { id: 'file-12', name: 'CHANGELOG.txt', size: 42000, uploadedAt: '2026-07-21', starred: false },
      { id: 'file-13', name: 'db_schema.sql', size: 130000, uploadedAt: '2026-07-20', starred: false },
      { id: 'file-14', name: 'deployment_notes.docx', size: 340000, uploadedAt: '2026-07-19', starred: false },
      { id: 'file-15', name: 'coverage_report.pdf', size: 2100000, uploadedAt: '2026-07-15', starred: false },
    ],
  },
  {
    id: 'f5',
    name: 'Team Photos',
    description: 'Events, offsites, and team gatherings',
    color: FOLDER_COLORS[5],
    icon: '📷',
    isPrivate: false,
    starred: true,
    createdAt: '2026-02-14',
    updatedAt: '2026-06-30',
    files: [
      { id: 'file-16', name: 'offsite_day1.jpg', size: 6200000, uploadedAt: '2026-06-30', starred: false },
      { id: 'file-17', name: 'offsite_day2.jpg', size: 5800000, uploadedAt: '2026-06-30', starred: true },
      { id: 'file-18', name: 'team_photo_final.png', size: 7400000, uploadedAt: '2026-06-29', starred: false },
    ],
  },
  {
    id: 'f6',
    name: 'Video Assets',
    description: 'Product demos, tutorials, and marketing videos',
    color: FOLDER_COLORS[2],
    icon: '🎬',
    isPrivate: false,
    starred: false,
    createdAt: '2026-03-05',
    updatedAt: '2026-07-12',
    files: [
      { id: 'file-19', name: 'product_demo_v2.mp4', size: 340000000, uploadedAt: '2026-07-12', starred: false },
      { id: 'file-20', name: 'onboarding_tutorial.mp4', size: 210000000, uploadedAt: '2026-06-20', starred: false },
    ],
  },
];

const INITIAL_RECENT_UPLOADS = [
  { id: 'ru-1', name: 'Dashboard_v3.fig', folderId: 'f2', folderName: 'Product Designs', size: 22000000, uploadedAt: '2026-07-20' },
  { id: 'ru-2', name: 'app_v2.4.0.zip', folderId: 'f4', folderName: 'Development', size: 87000000, uploadedAt: '2026-07-21' },
  { id: 'ru-3', name: 'Banner_Homepage.png', folderId: 'f1', folderName: 'Marketing Assets', size: 1800000, uploadedAt: '2026-07-17' },
  { id: 'ru-4', name: 'team_photo_final.png', folderId: 'f5', folderName: 'Team Photos', size: 7400000, uploadedAt: '2026-06-29' },
  { id: 'ru-5', name: 'product_demo_v2.mp4', folderId: 'f6', folderName: 'Video Assets', size: 340000000, uploadedAt: '2026-07-12' },
];

/* ── Context ───────────────────────────────────────────────── */
const FileManagerContext = createContext(null);

export function FileManagerProvider({ children }) {
  const [user, setUser]             = useState(INITIAL_USER);
  const [folders, setFolders]       = useState(INITIAL_FOLDERS);
  const [recentUploads, setRecentUploads] = useState(INITIAL_RECENT_UPLOADS);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // mock: always logged in

  /* ── Folder Actions ───────────────────────────────────────── */
  function createFolder(data) {
    const newFolder = {
      id: `f${Date.now()}`,
      name: data.name,
      description: data.description || '',
      color: FOLDER_COLORS.find(c => c.name === data.colorName) || FOLDER_COLORS[0],
      icon: data.icon || '📁',
      isPrivate: data.isPrivate || false,
      starred: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      files: [],
    };
    setFolders(prev => [newFolder, ...prev]);
    return newFolder;
  }

  function deleteFolder(folderId) {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setRecentUploads(prev => prev.filter(u => u.folderId !== folderId));
  }

  function renameFolder(folderId, newName) {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, name: newName, updatedAt: new Date().toISOString().split('T')[0] } : f
    ));
  }

  function toggleStarFolder(folderId) {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, starred: !f.starred } : f
    ));
  }

  function getFolderById(id) {
    return folders.find(f => f.id === id) || null;
  }

  /* ── File Actions ─────────────────────────────────────────── */
  function uploadFiles(folderId, newFiles) {
    const folder = folders.find(f => f.id === folderId);
    const fileObjects = newFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString().split('T')[0],
      starred: false,
    }));

    setFolders(prev => prev.map(f =>
      f.id === folderId
        ? { ...f, files: [...fileObjects, ...f.files], updatedAt: new Date().toISOString().split('T')[0] }
        : f
    ));

    const newRecent = fileObjects.map(fo => ({
      id: `ru-${fo.id}`,
      name: fo.name,
      folderId,
      folderName: folder?.name || 'Unknown',
      size: fo.size,
      uploadedAt: fo.uploadedAt,
    }));

    setRecentUploads(prev => [...newRecent, ...prev].slice(0, 10));
  }

  function deleteFile(folderId, fileId) {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, files: f.files.filter(fi => fi.id !== fileId) } : f
    ));
  }

  function renameFile(folderId, fileId, newName) {
    setFolders(prev => prev.map(f =>
      f.id === folderId
        ? { ...f, files: f.files.map(fi => fi.id === fileId ? { ...fi, name: newName } : fi) }
        : f
    ));
  }

  /* ── User Actions ─────────────────────────────────────────── */
  function updateUser(updates) {
    setUser(prev => ({ ...prev, ...updates }));
  }

  function login()  { setIsLoggedIn(true); }
  function logout() { setIsLoggedIn(false); }

  /* ── Computed Stats ───────────────────────────────────────── */
  const totalFiles = folders.reduce((acc, f) => acc + f.files.length, 0);
  const totalSizeBytes = folders.reduce((acc, f) => acc + f.files.reduce((a, fi) => a + fi.size, 0), 0);
  const starredFolders = folders.filter(f => f.starred);

  return (
    <FileManagerContext.Provider value={{
      user, updateUser,
      folders, createFolder, deleteFolder, renameFolder, toggleStarFolder, getFolderById,
      uploadFiles, deleteFile, renameFile,
      recentUploads,
      isLoggedIn, login, logout,
      totalFiles,
      totalSizeBytes,
      starredFolders,
      FOLDER_COLORS,
    }}>
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManager() {
  const ctx = useContext(FileManagerContext);
  if (!ctx) throw new Error('useFileManager must be used inside FileManagerProvider');
  return ctx;
}
