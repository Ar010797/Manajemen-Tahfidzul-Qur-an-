import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Edit2, Check, X } from 'lucide-react';
import { storage } from '../services/storage';

export default function HalaqohManager() {
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
          <Users className="text-emerald-600" />
          Manajemen Halaqoh
        </h2>
        
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input 
            type="text"
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Nama Halaqoh Baru (Contoh: Halaqoh Abu Bakar)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah
          </button>
        </form>

        <div className="grid gap-4">
          {halaqohs.map(h => (
            <div key={h.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 transition-colors">
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
