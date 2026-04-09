import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCircle, Search, Edit2, Check, X } from 'lucide-react';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';

export default function StudentManager() {
  const [students, setStudents] = useState<any[]>([]);
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', halaqoh_id: '' });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', halaqoh_id: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchData = () => {
    const sData = storage.getStudents();
    const hData = storage.getHalaqoh();
    
    setStudents(sData);
    setHalaqohs(hData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.halaqoh_id) return;
    storage.addStudent(formData.name, formData.halaqoh_id);
    setFormData({ name: '', halaqoh_id: '' });
    fetchData();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus siswa ini? Seluruh data setoran dan ujian siswa ini juga akan terhapus.')) return;
    storage.deleteStudent(id);
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    fetchData();
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Hapus ${selectedIds.length} siswa terpilih? Seluruh data setoran dan ujian mereka juga akan terhapus.`)) return;
    
    selectedIds.forEach(id => {
      storage.deleteStudent(id);
    });
    
    setSelectedIds([]);
    fetchData();
    alert(`${selectedIds.length} siswa berhasil dihapus.`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdate = (id: string) => {
    if (!editData.name || !editData.halaqoh_id) return;
    storage.updateStudent(id, editData.name, editData.halaqoh_id);
    setEditingId(null);
    fetchData();
  };

  const startEditing = (s: any) => {
    setEditingId(s.id);
    setEditData({ name: s.name, halaqoh_id: s.halaqoh_id });
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 lg:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
            <UserCircle className="text-emerald-600 w-8 h-8" />
            Manajemen Siswa
          </h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100">
            Total: {students.length} Siswa
          </div>
        </div>
        
        <div className="mb-10 p-6 bg-stone-50 rounded-3xl border border-stone-100 shadow-inner">
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plus size={16} className="text-emerald-600" />
            Tambah Siswa Baru
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input 
                type="text"
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">Pilih Halaqoh</label>
              <select 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                value={formData.halaqoh_id}
                onChange={e => setFormData({...formData, halaqoh_id: e.target.value})}
              >
                <option value="">Pilih Halaqoh</option>
                {halaqohs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                disabled={!formData.name || !formData.halaqoh_id}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Plus size={20} />
                Simpan Siswa
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <Search size={16} className="text-stone-400" />
              Daftar Siswa
            </h3>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Hapus {selectedIds.length} Terpilih
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Cari nama siswa..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar -mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 lg:px-8">
            <div className="overflow-hidden border border-stone-200 rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-left w-10">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nama Siswa</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest">Halaqoh</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-100">
                  {filteredStudents.map(s => (
                    <tr 
                      key={s.id} 
                      className={cn(
                        "hover:bg-stone-50/50 transition-colors group",
                        selectedIds.includes(s.id) && "bg-emerald-50/30"
                      )}
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {editingId === s.id ? (
                          <input 
                            type="text"
                            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            value={editData.name}
                            onChange={e => setEditData({...editData, name: e.target.value})}
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-semibold text-stone-800 tracking-tight">{s.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === s.id ? (
                          <select 
                            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            value={editData.halaqoh_id}
                            onChange={e => setEditData({...editData, halaqoh_id: e.target.value})}
                          >
                            <option value="">Pilih Halaqoh</option>
                            {halaqohs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            {s.halaqoh_name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === s.id ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUpdate(s.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="Simpan"
                            >
                              <Check size={20} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-2 text-stone-400 hover:bg-stone-100 rounded-xl transition-colors"
                              title="Batal"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 transition-opacity">
                            <button 
                              onClick={() => startEditing(s)}
                              className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(s.id)}
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-stone-400">
                          <Search size={40} className="mb-2 opacity-20" />
                          <p className="text-sm italic">Data siswa tidak ditemukan.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
