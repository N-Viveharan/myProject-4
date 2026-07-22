import { FileManagerProvider } from './_context/FileManagerContext';
import './_styles/filemanager.css';

export const metadata = {
  title: 'Stitch Cloud — File Manager',
  description: 'Manage your files and folders securely with Stitch Cloud.',
};

export default function FileManagerRootLayout({ children }) {
  return (
    <FileManagerProvider>
      <div className="fm-root">{children}</div>
    </FileManagerProvider>
  );
}
