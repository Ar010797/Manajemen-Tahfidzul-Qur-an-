import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCircle, Search, Edit2, Check, X } from 'lucide-react';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';
import ConfirmModal from './ConfirmModal';

export default function StudentManager() {
  const [students, setStudents] = useState<any[]>([]);
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', halaqoh_id: '', parent_phone: '' });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', halaqoh_id: '', parent_phone: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [themeColor, setThemeColor] = useState('emerald');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

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
    storage.addStudent(formData.name, formData.halaqoh_id, formData.parent_phone);
    setFormData({ name: '', halaqoh_id: '', parent_phone: '' });
    fetchData();
  };

  const handleDeleteClick = (s: any) => {
    setStudentToDelete(s);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      storage.deleteStudent(studentToDelete.id);
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== studentToDelete.id));
      fetchData();
      setStudentToDelete(null);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = () => {
    selectedIds.forEach(id => {
      storage.deleteStudent(id);
    });
    
    setSelectedIds([]);
    fetchData();
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
    storage.updateStudent(id, editData.name, editData.halaqoh_id, editData.parent_phone);
    setEditingId(null);
    fetchData();
  };

  const startEditing = (s: any) => {
    setEditingId(s.id);
    setEditData({ name: s.name, halaqoh_id: s.halaqoh_id, parent_phone: s.parent_phone || '' });
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  // Group filtered students by halaqoh
  const groupedStudents = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredStudents.forEach(s => {
      const groupName = s.halaqoh_name || 'Tanpa Halaqoh';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(s);
    });
    return groups;
  }, [filteredStudents]);

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
    lightBg: themeColor === 'emerald' ? 'bg-emerald-50' :
             themeColor === 'blue' ? 'bg-blue-50' :
             themeColor === 'amber' ? 'bg-amber-50' :
             themeColor === 'indigo' ? 'bg-indigo-50' :
             themeColor === 'purple' ? 'bg-purple-50' :
             themeColor === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    lightText: themeColor === 'emerald' ? 'text-emerald-700' :
               themeColor === 'blue' ? 'text-blue-700' :
               themeColor === 'amber' ? 'text-amber-700' :
               themeColor === 'indigo' ? 'text-indigo-700' :
               themeColor === 'purple' ? 'text-purple-700' :
               themeColor === 'rose' ? 'text-rose-700' :
               'text-slate-700',
    border: themeColor === 'emerald' ? 'border-emerald-200' :
            themeColor === 'blue' ? 'border-blue-200' :
            themeColor === 'amber' ? 'border-amber-200' :
            themeColor === 'indigo' ? 'border-indigo-200' :
            themeColor === 'purple' ? 'border-purple-200' :
            themeColor === 'rose' ? 'border-rose-200' :
            'border-slate-200',
    lightBorder: themeColor === 'emerald' ? 'border-emerald-100' :
                 themeColor === 'blue' ? 'border-blue-100' :
                 themeColor === 'amber' ? 'border-amber-100' :
                 themeColor === 'indigo' ? 'border-indigo-100' :
                 themeColor === 'purple' ? 'border-purple-100' :
                 themeColor === 'rose' ? 'border-rose-100' :
                 'border-slate-100',
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
    accent: themeColor === 'emerald' ? 'text-emerald-600 focus:ring-emerald-500' :
            themeColor === 'blue' ? 'text-blue-600 focus:ring-blue-500' :
            themeColor === 'amber' ? 'text-amber-600 focus:ring-amber-500' :
            themeColor === 'indigo' ? 'text-indigo-600 focus:ring-indigo-500' :
            themeColor === 'purple' ? 'text-purple-600 focus:ring-purple-500' :
            themeColor === 'rose' ? 'text-rose-600 focus:ring-rose-500' :
            'text-slate-600 focus:ring-slate-500',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 lg:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
            <UserCircle className={cn("w-8 h-8", theme.text)} />
            Manajemen Siswa
          </h2>
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border", theme.lightBg, theme.lightText, theme.lightBorder)}>
            Total: {students.length} Siswa
          </div>
        </div>
        
        <div className="mb-10 p-6 bg-stone-50 rounded-3xl border border-stone-100 shadow-inner">
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plus size={16} className={theme.text} />
            Tambah Siswa Baru
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input 
                type="text"
                className={cn("w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all", theme.ring)}
                placeholder="Masukkan nama lengkap"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">Pilih Halaqoh</label>
              <select 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                value={formData.halaqoh_id || ''}
                onChange={e => setFormData({...formData, halaqoh_id: e.target.value})}
              >
                <option value="">Pilih Halaqoh</option>
                {halaqohs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">No. HP Orang Tua (WA)</label>
              <input 
                type="text"
                className={cn("w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all", theme.ring)}
                placeholder="Contoh: 08123456789"
                value={formData.parent_phone || ''}
                onChange={e => setFormData({...formData, parent_phone: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                disabled={!formData.name || !formData.halaqoh_id}
                className={cn("w-full bg-white text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95", theme.bg, theme.hover, theme.shadow.replace('10', '20'))}
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
                onClick={handleBulkDeleteClick}
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
              className={cn("w-full bg-stone-50 border border-stone-200 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 transition-all text-sm", theme.ring)}
              value={search || ''}
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
                        className={cn("w-4 h-4 rounded border-stone-300 cursor-pointer", theme.accent)}
                        checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nama Siswa</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest">Halaqoh</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest">No. HP Orang Tua</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-100">
                  {Object.entries(groupedStudents).map(([groupName, groupStudents]) => (
                    <React.Fragment key={groupName}>
                      {/* Group Header Row */}
                      <tr className="bg-stone-50/80">
                        <td colSpan={5} className="px-6 py-2">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", theme.text)}>
                              {groupName}
                            </span>
                            <div className="h-px flex-1 bg-stone-200" />
                            <span className="text-[10px] text-stone-400 font-bold">
                              {groupStudents.length} Siswa
                            </span>
                          </div>
                        </td>
                      </tr>
                      {groupStudents.map(s => (
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
                              className={cn("w-4 h-4 rounded border-stone-300 cursor-pointer", theme.accent)}
                              checked={selectedIds.includes(s.id)}
                              onChange={() => toggleSelect(s.id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            {editingId === s.id ? (
                              <input 
                                type="text"
                                className={cn("w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all", theme.ring)}
                                value={editData.name || ''}
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
                                className={cn("w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all", theme.ring)}
                                value={editData.halaqoh_id || ''}
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
                          <td className="px-6 py-4">
                            {editingId === s.id ? (
                              <input 
                                type="text"
                                className={cn("w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all", theme.ring)}
                                value={editData.parent_phone || ''}
                                onChange={e => setEditData({...editData, parent_phone: e.target.value})}
                                placeholder="No. HP WA"
                              />
                            ) : (
                              <span className="text-sm font-medium text-stone-500 whitespace-nowrap">
                                {s.parent_phone || '-'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {editingId === s.id ? (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleUpdate(s.id)}
                                  className={cn("p-2 rounded-xl transition-colors", theme.text, theme.lightBg)}
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
                                  className={cn("p-2 text-stone-400 transition-all rounded-xl", `hover:${theme.text}`, `hover:${theme.lightBg}`)}
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(s)}
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
                    </React.Fragment>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
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

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Siswa"
        message={`Apakah Anda yakin ingin menghapus siswa "${studentToDelete?.name}"? Seluruh data setoran dan ujian siswa ini juga akan terhapus.`}
        themeColor={themeColor}
      />

      <ConfirmModal 
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Hapus Banyak Siswa"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} siswa terpilih? Seluruh data setoran dan ujian mereka juga akan terhapus.`}
        themeColor={themeColor}
      />
    </div>
  );
}
