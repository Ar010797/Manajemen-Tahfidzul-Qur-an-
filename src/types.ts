export interface User {
  id: number;
  username: string;
  role: 'admin' | 'guru';
}

export interface Institution {
  id: number;
  name: string;
  address: string;
  name_mts?: string;
  address_mts?: string;
  logo_mts?: string;
  principal_name: string;
  principal_name_mts?: string;
  coordinator_name: string;
  logo: string;
  watermark: string;
  principal_signature?: string;
  coordinator_signature?: string;
  principal_signature_mts?: string;
  coordinator_signature_mts?: string;
  principal_signature_size?: number;
  coordinator_signature_size?: number;
  principal_signature_size_mts?: number;
  coordinator_signature_size_mts?: number;
  theme_color?: 'emerald' | 'blue' | 'amber' | 'indigo' | 'purple' | 'rose' | 'slate';
  reminder_enabled?: boolean;
  reminder_time?: string; // HH:mm format
}

export interface Halaqoh {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  halaqoh_id: number;
  halaqoh_name?: string;
}

export interface DailyDeposit {
  id: number;
  student_id: number;
  student_name?: string;
  type: 'hafalan' | 'ummi' | 'tilawah';
  date: string;
  details: any;
}

export interface ExamUmmi {
  id: number;
  student_id: number;
  level: number;
  scores: Record<string, string>;
  date: string;
}

export interface ExamHafalan {
  id: number;
  student_id: number;
  surahs: { name: string; grade: string; predicate: string }[];
  note: string;
  date: string;
}
