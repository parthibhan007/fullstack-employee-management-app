import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Employee = {
  id: string;
  user_id: string | null;
  name: string;
  role: string;
  department: string;
  salary: number;
  attendance: number;
  performance_rating: number;
  date_of_joining: string;
  experience: number | null;
  created_at: string;
  updated_at: string;
};

export type EmployeeInsert = Omit<Employee, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type AttritionRisk = 'High' | 'Medium' | 'Low';

export function getAttritionRisk(attendance: number, rating: number): AttritionRisk {
  if (attendance < 50 && rating < 2) return 'High';
  if (attendance < 70 && rating < 3) return 'Medium';
  return 'Low';
}

export function getRiskColor(risk: AttritionRisk): string {
  if (risk === 'High') return 'text-red-600';
  if (risk === 'Medium') return 'text-orange-500';
  return 'text-green-600';
}

export function getRiskBg(risk: AttritionRisk): string {
  if (risk === 'High') return 'bg-red-100 text-red-700 border-red-200';
  if (risk === 'Medium') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-green-100 text-green-700 border-green-200';
}
