// src/services/storage.ts

let CURRENT_USER = localStorage.getItem('current_username') || 'default';
const getStorageKey = () => `tahfidz_data_${CURRENT_USER}`;

export const setCurrentUser = (username: string) => {
  CURRENT_USER = username;
  localStorage.setItem('current_username', username);
};

export interface DataSchema {
  institution: {
    name: string;
    address: string;
    principal_name: string;
    coordinator_name: string;
    halaqoh_teacher_name: string;
    academic_year: string;
    report_date?: string;
    logo?: string;
    watermark?: string;
    principal_signature?: string;
    coordinator_signature?: string;
  };
  halaqoh: Array<{ id: string; name: string }>;
  students: Array<{ id: string; name: string; halaqoh_id: string | null; order_index: number }>;
  daily_deposits: Array<{ student_id: string; type: string; date: string; details: any }>;
  exams_ummi: Array<{ id: string; student_id: string; level: number; scores: any; date: string; semester: string; target?: string }>;
  exams_hafalan: Array<{ id: string; student_id: string; surahs: any; note: string; date: string; days_progress: any; status: string; semester: string; target?: string }>;
  monthly_recaps: Array<{ student_id: string; month: string; total_hafalan: string; notes: string }>;
}

const defaultData: DataSchema = {
  institution: {
    name: "Sekolah Islam Miftahussalam",
    address: "",
    principal_name: "",
    coordinator_name: "",
    halaqoh_teacher_name: "",
    academic_year: "2025/2026"
  },
  halaqoh: [],
  students: [],
  daily_deposits: [],
  exams_ummi: [],
  exams_hafalan: [],
  monthly_recaps: []
};

const getRawData = (): DataSchema => {
  const data = localStorage.getItem(getStorageKey());
  if (!data) return JSON.parse(JSON.stringify(defaultData));
  try {
    return JSON.parse(data);
  } catch (e) {
    return JSON.parse(JSON.stringify(defaultData));
  }
};

const saveRawData = (data: DataSchema) => {
  localStorage.setItem(getStorageKey(), JSON.stringify(data));
};

export const storage = {
  // Institution
  getInstitution: () => getRawData().institution,
  updateInstitution: (updates: Partial<DataSchema['institution']>) => {
    const data = getRawData();
    data.institution = { ...data.institution, ...updates };
    saveRawData(data);
  },

  // Halaqoh
  getHalaqoh: () => getRawData().halaqoh,
  addHalaqoh: (name: string) => {
    const data = getRawData();
    const newHalaqoh = { id: Date.now().toString(), name };
    data.halaqoh.push(newHalaqoh);
    saveRawData(data);
    return newHalaqoh;
  },
  updateHalaqoh: (id: string, name: string) => {
    const data = getRawData();
    const index = data.halaqoh.findIndex(h => h.id === id);
    if (index !== -1) {
      data.halaqoh[index].name = name;
      saveRawData(data);
    }
  },
  deleteHalaqoh: (id: string) => {
    const data = getRawData();
    data.halaqoh = data.halaqoh.filter(h => h.id !== id);
    data.students = data.students.map(s => s.halaqoh_id === id ? { ...s, halaqoh_id: null } : s);
    saveRawData(data);
  },

  // Students
  getStudents: () => {
    const data = getRawData();
    return data.students.map(s => ({
      ...s,
      halaqoh_name: data.halaqoh.find(h => h.id === s.halaqoh_id)?.name || null
    })).sort((a, b) => (a.order_index - b.order_index) || a.name.localeCompare(b.name));
  },
  addStudent: (name: string, halaqoh_id: string | null) => {
    const data = getRawData();
    const newStudent = { id: Date.now().toString(), name, halaqoh_id, order_index: data.students.length };
    data.students.push(newStudent);
    saveRawData(data);
    return newStudent;
  },
  updateStudent: (id: string, name: string, halaqoh_id: string | null) => {
    const data = getRawData();
    const index = data.students.findIndex(s => s.id === id);
    if (index !== -1) {
      data.students[index] = { ...data.students[index], name, halaqoh_id };
      saveRawData(data);
    }
  },
  deleteStudent: (id: string) => {
    const data = getRawData();
    data.students = data.students.filter(s => s.id !== id);
    data.daily_deposits = data.daily_deposits.filter(d => d.student_id !== id);
    data.exams_ummi = data.exams_ummi.filter(e => e.student_id !== id);
    data.exams_hafalan = data.exams_hafalan.filter(e => e.student_id !== id);
    data.monthly_recaps = data.monthly_recaps.filter(r => r.student_id !== id);
    saveRawData(data);
  },
  reorderStudents: (orders: Array<{ id: string; order_index: number }>) => {
    const data = getRawData();
    orders.forEach(order => {
      const index = data.students.findIndex(s => s.id === order.id);
      if (index !== -1) data.students[index].order_index = order.order_index;
    });
    saveRawData(data);
  },

  // Deposits
  getDeposit: (student_id: string, type: string, date: string) => {
    const data = getRawData();
    return data.daily_deposits.find(d => d.student_id === student_id && d.type === type && d.date === date) || null;
  },
  saveDeposit: (student_id: string, type: string, date: string, details: any) => {
    const data = getRawData();
    const index = data.daily_deposits.findIndex(d => d.student_id === student_id && d.type === type && d.date === date);
    if (index !== -1) {
      data.daily_deposits[index].details = details;
    } else {
      data.daily_deposits.push({ student_id, type, date, details });
    }
    saveRawData(data);
  },
  getMonthlyRecapData: (month: string, halaqoh_id: string) => {
    const data = getRawData();
    const studentIds = data.students.filter(s => s.halaqoh_id === halaqoh_id).map(s => s.id);
    return data.daily_deposits
      .filter(d => d.date.startsWith(month) && studentIds.includes(d.student_id))
      .map(d => ({
        ...d,
        student_name: data.students.find(s => s.id === d.student_id)?.name
      }));
  },

  // Recap Settings
  getRecapSettings: (student_id: string, month: string) => {
    const data = getRawData();
    return data.monthly_recaps.find(r => r.student_id === student_id && r.month === month) || { total_hafalan: "", notes: "" };
  },
  saveRecapSettings: (student_id: string, month: string, total_hafalan: string, notes: string) => {
    const data = getRawData();
    const index = data.monthly_recaps.findIndex(r => r.student_id === student_id && r.month === month);
    if (index !== -1) {
      data.monthly_recaps[index] = { student_id, month, total_hafalan, notes };
    } else {
      data.monthly_recaps.push({ student_id, month, total_hafalan, notes });
    }
    saveRawData(data);
  },

  // Exams
  addUmmiExam: (exam: Omit<DataSchema['exams_ummi'][0], 'id'>) => {
    const data = getRawData();
    const newExam = { ...exam, id: Date.now().toString() };
    data.exams_ummi.push(newExam);
    saveRawData(data);
    return newExam;
  },
  updateUmmiExam: (id: string, updates: Partial<DataSchema['exams_ummi'][0]>) => {
    const data = getRawData();
    const index = data.exams_ummi.findIndex(e => e.id === id);
    if (index !== -1) {
      data.exams_ummi[index] = { ...data.exams_ummi[index], ...updates };
      saveRawData(data);
    }
  },
  deleteUmmiExam: (id: string) => {
    const data = getRawData();
    data.exams_ummi = data.exams_ummi.filter(e => e.id !== id);
    saveRawData(data);
  },
  addHafalanExam: (exam: Omit<DataSchema['exams_hafalan'][0], 'id'>) => {
    const data = getRawData();
    const newExam = { ...exam, id: Date.now().toString() };
    data.exams_hafalan.push(newExam);
    saveRawData(data);
    return newExam;
  },
  updateHafalanExam: (id: string, updates: Partial<DataSchema['exams_hafalan'][0]>) => {
    const data = getRawData();
    const index = data.exams_hafalan.findIndex(e => e.id === id);
    if (index !== -1) {
      data.exams_hafalan[index] = { ...data.exams_hafalan[index], ...updates };
      saveRawData(data);
    }
  },
  deleteHafalanExam: (id: string) => {
    const data = getRawData();
    data.exams_hafalan = data.exams_hafalan.filter(e => e.id !== id);
    saveRawData(data);
  },
  getStudentExams: (student_id: string) => {
    const data = getRawData();
    return {
      ummi: data.exams_ummi.filter(e => e.student_id === student_id).sort((a, b) => b.date.localeCompare(a.date)),
      hafalan: data.exams_hafalan.filter(e => e.student_id === student_id).sort((a, b) => b.date.localeCompare(a.date))
    };
  },

  getDailyDepositsCount: (date: string) => {
    const data = getRawData();
    return data.daily_deposits.filter(d => d.date === date).length;
  },

  getLastDeposit: (student_id: string, type: string) => {
    const data = getRawData();
    const deposits = data.daily_deposits
      .filter(d => d.student_id === student_id && d.type === type)
      .sort((a, b) => b.date.localeCompare(a.date));
    return deposits.length > 0 ? deposits[0] : null;
  },

  getExamsCount: () => {
    const data = getRawData();
    return data.exams_ummi.length + data.exams_hafalan.length;
  },

  deleteExam: (type: 'ummi' | 'hafalan', id: string) => {
    const data = getRawData();
    if (type === 'ummi') {
      data.exams_ummi = data.exams_ummi.filter(e => e.id !== id);
    } else {
      data.exams_hafalan = data.exams_hafalan.filter(e => e.id !== id);
    }
    saveRawData(data);
  },

  // Maintenance
  resetData: () => {
    const currentData = getRawData();
    // Keep institution but clear everything else
    const reset = {
      ...JSON.parse(JSON.stringify(defaultData)),
      institution: currentData.institution
    };
    saveRawData(reset);
  },
  factoryReset: () => {
    localStorage.clear();
  },
  exportData: () => {
    return JSON.stringify(getRawData());
  },
  importData: (json: string) => {
    try {
      const data = JSON.parse(json);
      saveRawData(data);
      return true;
    } catch (e) {
      return false;
    }
  }
};
