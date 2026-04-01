import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  Printer,
  Settings
} from 'lucide-react';
import { cn } from './lib/utils';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DailyInput from './components/DailyInput';
import ExamUmmi from './components/ExamUmmi';
import ExamHafalan from './components/ExamHafalan';
import ReportCard from './components/ReportCard';
import MonthlyRecap from './components/MonthlyRecap';
import SettingsHub from './components/SettingsHub';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('dashboard');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'indigo' },
    { id: 'daily', label: 'Setoran Harian', icon: ClipboardCheck, color: 'emerald' },
    { id: 'exam-ummi', label: 'Ujian Ummi', icon: BookOpen, color: 'amber' },
    { id: 'exam-hafalan', label: 'Ujian Hafalan', icon: GraduationCap, color: 'blue' },
    { id: 'recap', label: 'Rekap Bulanan', icon: FileText, color: 'purple' },
    { id: 'report', label: 'Rapor Siswa', icon: Printer, color: 'rose' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, color: 'slate' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) return "text-stone-500 hover:bg-stone-50 hover:text-stone-900";
    
    switch (color) {
      case 'indigo': return "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100";
      case 'emerald': return "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100";
      case 'amber': return "bg-amber-50 text-amber-700 shadow-sm shadow-amber-100";
      case 'blue': return "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100";
      case 'purple': return "bg-purple-50 text-purple-700 shadow-sm shadow-purple-100";
      case 'rose': return "bg-rose-50 text-rose-700 shadow-sm shadow-rose-100";
      default: return "bg-slate-50 text-slate-700 shadow-sm shadow-slate-100";
    }
  };

  const getIconColor = (color: string, isActive: boolean) => {
    if (!isActive) return "text-stone-400";
    
    switch (color) {
      case 'indigo': return "text-indigo-600";
      case 'emerald': return "text-emerald-600";
      case 'amber': return "text-amber-600";
      case 'blue': return "text-blue-600";
      case 'purple': return "text-purple-600";
      case 'rose': return "text-rose-600";
      default: return "text-slate-600";
    }
  };

  const getPillColor = (color: string) => {
    switch (color) {
      case 'indigo': return "bg-indigo-600";
      case 'emerald': return "bg-emerald-600";
      case 'amber': return "bg-amber-600";
      case 'blue': return "bg-blue-600";
      case 'purple': return "bg-purple-600";
      case 'rose': return "bg-rose-600";
      default: return "bg-slate-600";
    }
  };

  if (isLoading) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : !user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Login onLogin={(u: any) => setUser(u)} />
          </motion.div>
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-screen bg-[#FDFCFB] text-stone-800 font-sans overflow-hidden relative"
          >
            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <motion.aside 
              initial={false}
              animate={{ 
                width: isSidebarOpen ? 280 : 80,
                x: isSidebarOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
              }}
              className={cn(
                "bg-white border-r border-stone-200 flex flex-col z-30 shadow-xl lg:shadow-none h-full fixed lg:relative transition-all duration-300",
                !isSidebarOpen && "lg:w-20"
              )}
            >
              <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-10">
                {(isSidebarOpen || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                    className={cn("flex items-center gap-3", !isSidebarOpen && "hidden")}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-stone-900 leading-tight tracking-tight">Tracking</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black">Tahfidz 2026</span>
                    </div>
                  </motion.div>
                )}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-500"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative",
                      getColorClasses(item.color, activeTab === item.id)
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeTab === item.id ? "bg-white shadow-sm" : "bg-transparent"
                    )}>
                      <item.icon size={20} className={cn(
                        "transition-transform group-hover:scale-110",
                        getIconColor(item.color, activeTab === item.id)
                      )} />
                    </div>
                    {isSidebarOpen && (
                      <span className={cn(
                        "font-bold text-sm whitespace-nowrap tracking-tight transition-colors",
                        activeTab === item.id ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                      )}>
                        {item.label}
                      </span>
                    )}
                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="active-pill"
                        className={cn("absolute left-0 w-1.5 h-8 rounded-r-full", getPillColor(item.color))}
                      />
                    )}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-stone-100 bg-white sticky bottom-0">
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100",
                  !isSidebarOpen && "justify-center"
                )}>
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-100">
                    {user.username[0].toUpperCase()}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate tracking-tight">{user.username}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{user.role}</p>
                    </div>
                  )}
                  {isSidebarOpen && (
                    <button 
                      onClick={handleLogout}
                      className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative w-full">
              <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-500"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                    <span className="hidden sm:inline">Aplikasi</span>
                    <ChevronRight size={12} className="hidden sm:inline opacity-50" />
                    <span className="text-emerald-600 font-black">
                      {activeTab.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm shadow-amber-50">
                    Local Storage Mode
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#FDFCFB]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-7xl mx-auto"
                  >
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'daily' && <DailyInput />}
                    {activeTab === 'exam-ummi' && <ExamUmmi />}
                    {activeTab === 'exam-hafalan' && <ExamHafalan />}
                    {activeTab === 'recap' && <MonthlyRecap />}
                    {activeTab === 'report' && <ReportCard />}
                    {activeTab === 'settings' && <SettingsHub />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
