'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Target, Rocket, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Clients', icon: Users },
    { href: '/opportunities', label: 'Pipeline', icon: Target },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-blue-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white flex flex-col h-full shrink-0 transition-transform duration-500 lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">I</div>
            <h2 className="text-xl font-black tracking-tighter text-white uppercase group cursor-default">
              IGNITERA <span className="text-blue-500">OS</span>
            </h2>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-2xl font-black transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon size={20} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                <span className="tracking-tight">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 mx-6 mb-8 rounded-3xl bg-blue-600/10 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
             <Rocket size={18} className="text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Version Alpha</span>
          </div>
          <p className="text-xs text-blue-100/60 font-bold leading-relaxed">
            Sprint 1: Core Flow complete. AI features enabled.
          </p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500" 
        />
      )}
    </>
  );
}
