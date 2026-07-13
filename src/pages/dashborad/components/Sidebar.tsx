
interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onToggle: () => void;
  onSectionChange: (section: string) => void;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'categories', label: 'Categories', icon: 'M4 6h16M4 12h16M4 18h16' },
  { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'description-builder', label: 'Description Builder', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'ai-questions', label: 'AI Questions', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function Sidebar({ isOpen, activeSection, onToggle, onSectionChange }: SidebarProps) {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-[#00342B] text-white transition-all duration-300 flex flex-col`}>
      <div className="p-6 flex items-center justify-between">
        <div className={`font-bold text-xl tracking-wide ${!isOpen && 'hidden'}`}>
          <span className="text-emerald-400">Admin</span>Panel
        </div>
        <button onClick={onToggle} className="p-1 rounded-lg hover:bg-emerald-800 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeSection === item.id ? 'bg-emerald-600 shadow-lg shadow-emerald-900/30' : 'hover:bg-emerald-800/50'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {isOpen && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className={`p-4 border-t border-emerald-800 ${!isOpen && 'hidden'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">AD</div>
          <div>
            <div className="text-sm font-semibold">Admin User</div>
            <div className="text-xs text-emerald-300">admin@project.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
