import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Edit2, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function HalaqohManager() {
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

  const fetchHalaqohs = () => {
    const data = storage.getHalaqoh();
    setHalaqohs(data);
  };

  useEffect(() => { fetchHalaqohs(); }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    storage.addHalaqoh(newName);
    setNewName('');
    fetchHalaqohs();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus halaqoh ini? Siswa yang terdaftar di halaqoh ini akan dipindahkan ke kategori "Tanpa Halaqoh".')) return;
    storage.deleteHalaqoh(id);
    fetchHalaqohs();
  };

  const handleUpdate = (id: string) => {
    if (!editName) return;
    storage.updateHalaqoh(id, editName);
    setEditingId(null);
    fetchHalaqohs();
  };

  const startEditing = (h: any) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-600' :
          themeColor === 'blue' ? 'text-blue-600' :
          themeColor === 'amber' ? 'text-amber-600' :
          themeColor === 'indigo' ? 'text-indigo-600' :
          themeColor === 'purple' ? 'text-purple-600' :
          themeColor === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    hover: themeColor === 'emerald' ? 'hover:bg-emerald-500' :
           themeColor === 'blue' ? 'hover:bg-blue-500' :
           themeColor === 'amber' ? 'hover:bg-amber-500' :
           themeColor === 'indigo' ? 'hover:bg-indigo-500' :
           themeColor === 'purple' ? 'hover:bg-purple-500' :
           themeColor === 'rose' ? 'hover:bg-rose-500' :
           'hover:bg-slate-500',
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/50' :
          themeColor === 'blue' ? 'focus:ring-blue-500/50' :
          themeColor === 'amber' ? 'focus:ring-amber-500/50' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/50' :
          themeColor === 'purple' ? 'focus:ring-purple-500/50' :
          themeColor === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/10' :
            themeColor === 'blue' ? 'shadow-blue-500/10' :
            themeColor === 'amber' ? 'shadow-amber-500/10' :
            themeColor === 'indigo' ? 'shadow-indigo-500/10' :
            themeColor === 'purple' ? 'shadow-purple-500/10' :
            themeColor === 'rose' ? 'shadow-rose-500/10' :
            'shadow-slate-500/10',
    border: themeColor === 'emerald' ? 'border-emerald-200' :
            themeColor === 'blue' ? 'border-blue-200' :
            themeColor === 'amber' ? 'border-amber-200' :
            themeColor === 'indigo' ? 'border-indigo-200' :
            themeColor === 'purple' ? 'border-purple-200' :
            themeColor === 'rose' ? 'border-rose-200' :
            'border-slate-200',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <Users className={theme.text} />
          Manajemen Halaqoh
        </h2>
        
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input 
            type="text"
            className={cn("flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2", theme.ring)}
            placeholder="Nama Halaqoh Baru (Contoh: Halaqoh Abu Bakar)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button 
            type="submit"
            className={cn("text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2", theme.bg, theme.hover)}
          >
            <Plus size={20} />
            Tambah
          </button>
        </form>

        <div className="grid gap-4">
          {halaqohs.map(h => (
            <div key={h.id} className={cn("flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 transition-colors", `hover:${theme.border.replace('border-', 'border-')}`)}>
              {editingId === h.id ? (
                <div className="flex-1 flex gap-2 mr-4">
                  <input 
                    type="text"
                    className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button 
                    onClick={() => handleUpdate(h.id)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-stone-800">{h.name}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEditing(h)}
                      className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(h.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {halaqohs.length === 0 && (
            <div className="text-center py-12 text-stone-400 italic">
              Belum ada data halaqoh.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
