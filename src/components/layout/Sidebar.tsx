import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">IGNITERA OS</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
          Dashboard
        </Link>
        <Link href="/leads" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
          Leads
        </Link>
        <Link href="/opportunities" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
          Opportunities
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
        Sprint 1 MVP
      </div>
    </div>
  );
}
