import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle } from 'lucide-react';
import { storage } from '../services/storage';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationSystem() {
  const [showNotification, setShowNotification] = useState(false);
  const [missingCount, setMissingCount] = useState(0);
  const [lastShownDate, setLastShownDate] = useState<string | null>(null);

  useEffect(() => {
    const checkReminders = () => {
      const institution = storage.getInstitution();
      if (!institution.reminder_enabled || !institution.reminder_time) return;

      const now = new Date();
      const todayStr = format(now, 'yyyy-MM-dd');
      
      // Don't show if already shown today
      if (lastShownDate === todayStr) return;

      const [remHour, remMin] = institution.reminder_time.split(':').map(Number);
      const reminderDate = new Date();
      reminderDate.setHours(remHour, remMin, 0, 0);

      if (now >= reminderDate) {
        const students = storage.getStudents();
        const deposits = storage.getDailyDepositsCount(todayStr);
        
        // This is a simple check: if total deposits < total students (assuming 1 deposit per student)
        // More accurately, we should check which students are missing deposits.
        // But getDailyDepositsCount returns total deposits across all types.
        // Let's do a more precise check.
        
        const allStudents = storage.getStudents();
        const todayDeposits = storage.getMonthlyRecapData(todayStr, ''); // Get all deposits for today
        const studentsWithDeposits = new Set(todayDeposits.map(d => d.student_id));
        
        const missing = allStudents.filter(s => !studentsWithDeposits.has(s.id));
        
        if (missing.length > 0) {
          setMissingCount(missing.length);
          setShowNotification(true);
          setLastShownDate(todayStr);
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [lastShownDate]);

  const themeColor = storage.getInstitution().theme_color || 'emerald';
  const theme = {
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
  };

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[100] flex justify-center pointer-events-none"
        >
          <div className="bg-white border border-stone-200 shadow-2xl rounded-2xl p-4 max-w-md w-full flex items-start gap-4 pointer-events-auto">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", theme.bg)}>
              <Bell className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-stone-900 flex items-center gap-2">
                Pengingat Input Harian
                <AlertCircle size={14} className="text-amber-500" />
              </h4>
              <p className="text-sm text-stone-600 mt-1">
                Ada <span className="font-bold text-stone-900">{missingCount} siswa</span> yang belum memiliki catatan setoran untuk hari ini.
              </p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-xs font-bold text-stone-400 hover:text-stone-600 px-2 py-1"
                >
                  Nanti Saja
                </button>
                <button 
                  onClick={() => {
                    setShowNotification(false);
                    // We could navigate to Daily Input here if we had a router
                    // For now, just closing is fine as the user can navigate themselves
                  }}
                  className={cn("text-xs font-bold text-white px-3 py-1.5 rounded-lg shadow-sm", theme.bg)}
                >
                  Input Sekarang
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-stone-300 hover:text-stone-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
