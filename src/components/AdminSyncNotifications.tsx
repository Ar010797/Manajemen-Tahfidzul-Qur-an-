import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudDownload, X } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function AdminSyncNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, 'syncs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return; // Ignore initial load
      }
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          const data = change.doc.data();
          const username = data.username || change.doc.id;
          
          const newNotif = {
            id: Date.now() + Math.random(),
            message: `Guru "${username}" baru saja mengirim / memperbarui data ke server.`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          };

          setNotifications(prev => [newNotif, ...prev]);

          // Auto remove after 6 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
          }, 6000);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 w-80 pointer-events-auto flex items-start gap-4"
          >
            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl shrink-0">
              <CloudDownload size={20} className="text-indigo-600" />
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-sm font-bold text-stone-900 leading-tight">Data Baru Diterima</h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{notif.message}</p>
              <p className="text-[10px] text-stone-400 mt-2 font-medium">{notif.time}</p>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
              className="text-stone-300 hover:text-stone-500 shrink-0 p-1 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
