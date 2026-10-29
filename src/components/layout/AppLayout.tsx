import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  CalendarDays,
  Utensils,
  CheckSquare,
  Clock,
  Sparkles,
  TrendingUp,
  Trophy,
  Moon,
  Settings as SettingsIcon,
  Menu,
  X,
  Flame,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, userProfile, habits } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Time-of-day greeting
  const hour = new Date().getHours();
  let greetingTime = 'Guten Tag';
  if (hour < 11) greetingTime = 'Guten Morgen';
  else if (hour < 18) greetingTime = 'Guten Tag';
  else greetingTime = 'Guten Abend';

  // Count habits done today
  const today = new Date().toISOString().split('T')[0];
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(today)).length;

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'plan', label: 'Trainingsplan', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'nutrition', label: 'Nutrition AI', icon: <Utensils className="w-5 h-5" /> },
    {
      id: 'habits',
      label: 'Habits',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: `${habitsDoneToday}/${habits.length}`,
    },
    { id: 'schedule', label: 'Tagesplaner', icon: <Clock className="w-5 h-5" /> },
    { id: 'coach', label: 'AI Coach', icon: <Sparkles className="w-5 h-5 text-[#66D9FF]" /> },
    { id: 'progress', label: 'Fortschritt', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-5 h-5" /> },
    { id: 'recovery', label: 'Recovery & Schlaf', icon: <Moon className="w-5 h-5" /> },
    { id: 'settings', label: 'Einstellungen', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col md:flex-row antialiased selection:bg-[#66D9FF]/20 selection:text-[#66D9FF]">
      {/* Top Background Ambient Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#66D9FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-[#8B7CFF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800/80 bg-[#141B2A]/90 backdrop-blur-md transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#66D9FF]/20 group-hover:scale-105 transition-transform">
              ❄️
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-extrabold text-base tracking-wider text-white block">
                  WINTER ARC <span className="text-[#66D9FF]">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                  Habits • Train • Grow
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors hidden lg:block"
            title={sidebarCollapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
          >
            <ChevronRight
              className={`w-4 h-4 transform transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* User Card in Sidebar */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-slate-800/50 bg-[#182131]/40 mx-2 my-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#182131] border border-[#66D9FF]/30 flex items-center justify-center text-xs font-bold text-[#66D9FF] shrink-0">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'W'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{userProfile.name || 'Athlete'}</p>
                <p className="text-[10px] text-[#66D9FF] font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#66D9FF]" /> Winter Arc Aktiv
                </p>
              </div>
            </div>
            {userProfile.isDemoUser && (
              <span className="text-[9px] bg-sky-950/80 text-sky-300 border border-sky-600/30 px-1.5 py-0.5 rounded font-mono">
                Demo
              </span>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#182131] to-[#1E293B] text-white border border-[#66D9FF]/30 shadow-sm shadow-[#66D9FF]/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div
                  className={`transition-colors ${
                    isActive ? 'text-[#66D9FF]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </div>
                {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#66D9FF]/20 text-[#66D9FF]'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in Sidebar */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Winter Arc AI v2.0</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="hover:text-slate-300 transition-colors"
            >
              Hilfe & Info
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#141B2A]/70 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <span>{greetingTime}, {userProfile.name?.split(' ')[0] || 'Athlete'}</span>
                <span className="hidden sm:inline-block text-xs font-normal text-slate-400">
                  • {currentDateFormatted}
                </span>
              </h2>
              <p className="text-xs text-[#66D9FF] hidden sm:block font-medium">
                “Dein Winter. Deine Entwicklung. Dein Fortschritt.”
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('coach')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#182131] hover:bg-[#1E293B] border border-[#66D9FF]/20 text-[#66D9FF] text-xs font-semibold shadow-sm hover:border-[#66D9FF]/50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            <button
              onClick={() => setActiveTab('workouts')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-bold hover:opacity-90 shadow-md shadow-[#66D9FF]/15 transition-all"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Workout</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#141B2A] h-full shadow-2xl flex flex-col p-4 z-10 border-r border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-slate-950 font-black">
                  ❄️
                </div>
                <span className="font-bold text-white text-sm">Winter Arc AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-[#182131] text-[#66D9FF] border border-[#66D9FF]/20'
                      : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
              <span>{userProfile.name}</span>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className="text-[#66D9FF] underline"
              >
                Einstellungen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#141B2A]/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around px-2 z-40">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeTab === 'dashboard' ? 'text-[#66D9FF]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeTab === 'workouts' ? 'text-[#66D9FF]' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Workouts</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeTab === 'plan' ? 'text-[#66D9FF]' : 'text-slate-400'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('coach')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeTab === 'coach' ? 'text-[#66D9FF]' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Coach</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Menü</span>
        </button>
      </nav>
    </div>
  );
};
