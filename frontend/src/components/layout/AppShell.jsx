import { Outlet } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';

/**
 * AppShell – wraps all authenticated pages with Sidebar + TopBar.
 */
export function AppShell() {
  return (
    <div className="min-h-screen bg-dark-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-56 min-h-screen max-w-full overflow-hidden">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 animate-fade-in w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

