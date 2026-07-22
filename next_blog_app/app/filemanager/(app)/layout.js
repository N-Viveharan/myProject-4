import Sidebar from '../_components/Sidebar';
import TopBar from '../_components/TopBar';

export default function AppLayout({ children }) {
  return (
    <div className="fm-shell">
      <Sidebar />
      <main className="fm-main">
        {children}
      </main>
    </div>
  );
}
