import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Download, Users, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../services/storage';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const AdminDashboard: React.FC = () => {
  const [globalData, setGlobalData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle'|'syncing'|'success'>('idle');

  const fetchGlobalData = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'syncs'));
      const newData: Record<string, any> = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username && data.data) {
           newData[data.username] = JSON.parse(data.data);
        }
      });
      
      setGlobalData(newData);
    } catch (e: any) {
      console.error('Failed to fetch data', e);
      alert(`Gagal mengambil data dari server: ${e.message || e.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleDownloadAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globalData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `tahfidz_all_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSyncMyData = async () => {
    setSyncStatus('syncing');
    try {
      const username = localStorage.getItem('current_username') || 'admin';
      const myData = storage.exportData();
      
      await setDoc(doc(db, 'syncs', username.replace(/\s+/g, '_').toLowerCase()), {
        username,
        data: myData,
        updatedAt: new Date().toISOString()
      });
      
      setSyncStatus('success');
      fetchGlobalData();
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e: any) {
      console.error(e);
      setSyncStatus('idle');
      alert(`Gagal melakukan sinkronisasi: ${e.message || e.toString()}`);
    }
  };

  const gurus = Object.keys(globalData);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-stone-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Panel Khusus Admin
          </h1>
          <p className="text-stone-500 mt-1">Pantau & sinkronisasi semua data guru Miftahussalam.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchGlobalData}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleDownloadAll}
            disabled={gurus.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download Backup Global
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total Guru / Akun</p>
            <p className="text-3xl font-black text-stone-900">{gurus.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800">Sinkronisasi Data Anda</h3>
                <p className="text-xs text-stone-500 mt-1">Sebagai admin, Anda juga bisa push data lokal ke server.</p>
              </div>
              <button 
                onClick={handleSyncMyData}
                disabled={syncStatus === 'syncing'}
                className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors"
              >
                {syncStatus === 'syncing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 
                 syncStatus === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : 'Push Data Lokal'}
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h2 className="font-bold text-stone-800 text-lg">Daftar Data Guru</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {isLoading ? (
            <div className="p-8 text-center text-stone-400 font-medium animate-pulse">Memuat data dari server...</div>
          ) : gurus.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium">Belum ada data guru yang tersinkronisasi.</div>
          ) : (
            gurus.map(guru => {
              const d = globalData[guru];
              const studentCount = d.students?.length || 0;
              const halaqohCount = d.halaqoh?.length || 0;
              
              return (
                <div key={guru} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg uppercase">
                       {guru.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">{guru}</h3>
                      <p className="text-sm text-stone-500 flex gap-4 mt-1">
                        <span><FileText className="w-3 h-3 inline mr-1" /> {halaqohCount} Halaqoh</span>
                        <span><Users className="w-3 h-3 inline mr-1" /> {studentCount} Santri</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(d, null, 2));
                      const a = document.createElement('a');
                      a.setAttribute("href", dataStr);
                      a.setAttribute("download", `data_guru_${guru}.json`);
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Backup Spesifik
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};
