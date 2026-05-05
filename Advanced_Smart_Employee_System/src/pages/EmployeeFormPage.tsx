import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, EmployeeInsert, getAttritionRisk, getRiskBg } from '../lib/supabase';
import { ArrowLeft, Save, AlertCircle, User } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'Design', 'Product'];
const ROLES = ['Developer', 'Manager', 'Designer', 'Analyst', 'HR Specialist', 'Sales Rep', 'Product Manager', 'DevOps Engineer', 'QA Engineer', 'Data Scientist', 'Marketing Specialist', 'Finance Analyst'];

type FormData = {
  name: string;
  role: string;
  department: string;
  salary: string;
  attendance: string;
  performance_rating: string;
  date_of_joining: string;
  experience: string;
};

const defaultForm: FormData = {
  name: '',
  role: '',
  department: '',
  salary: '',
  attendance: '100',
  performance_rating: '3',
  date_of_joining: new Date().toISOString().split('T')[0],
  experience: '',
};

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    supabase.from('employees').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name,
          role: data.role,
          department: data.department,
          salary: String(data.salary),
          attendance: String(data.attendance),
          performance_rating: String(data.performance_rating),
          date_of_joining: data.date_of_joining,
          experience: data.experience != null ? String(data.experience) : '',
        });
      }
      setFetching(false);
    });
  }, [id, isEdit]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.role.trim()) errs.role = 'Role is required.';
    if (!form.department.trim()) errs.department = 'Department is required.';
    const salary = parseFloat(form.salary);
    if (isNaN(salary) || salary < 0) errs.salary = 'Enter a valid salary.';
    const att = parseFloat(form.attendance);
    if (isNaN(att) || att < 0 || att > 100) errs.attendance = 'Attendance must be 0–100.';
    const rating = parseFloat(form.performance_rating);
    if (isNaN(rating) || rating < 1 || rating > 5) errs.performance_rating = 'Rating must be 1–5.';
    if (!form.date_of_joining) errs.date_of_joining = 'Date of joining is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setLoading(true);
    const payload: EmployeeInsert = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department.trim(),
      salary: parseFloat(form.salary),
      attendance: parseFloat(form.attendance),
      performance_rating: parseFloat(form.performance_rating),
      date_of_joining: form.date_of_joining,
      experience: form.experience ? parseFloat(form.experience) : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('employees').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('employees').insert(payload));
    }

    if (error) {
      setSubmitError(error.message);
      setLoading(false);
    } else {
      navigate('/employees');
    }
  };

  const previewRisk = getAttritionRisk(
    parseFloat(form.attendance) || 100,
    parseFloat(form.performance_rating) || 3
  );

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isEdit ? 'Update employee information' : 'Add a new team member'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-700">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" required>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="John Smith"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </Field>

            <Field label="Role" required>
              <select
                value={form.role}
                onChange={set('role')}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.role ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              >
                <option value="">Select role...</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
            </Field>

            <Field label="Department" required>
              <select
                value={form.department}
                onChange={set('department')}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </Field>

            <Field label="Date of Joining" required>
              <input
                type="date"
                value={form.date_of_joining}
                onChange={set('date_of_joining')}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date_of_joining ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.date_of_joining && <p className="text-xs text-red-600 mt-1">{errors.date_of_joining}</p>}
            </Field>

            <Field label="Salary (USD)" required>
              <input
                type="number"
                value={form.salary}
                onChange={set('salary')}
                placeholder="75000"
                min="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.salary ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.salary && <p className="text-xs text-red-600 mt-1">{errors.salary}</p>}
            </Field>

            <Field label="Experience (years)">
              <input
                type="number"
                value={form.experience}
                onChange={set('experience')}
                placeholder="3"
                min="0"
                max="50"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </Field>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded text-blue-600 text-xs flex items-center justify-center font-bold">P</span>
              <h2 className="text-sm font-semibold text-slate-700">Performance Metrics</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Predicted Risk:</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskBg(previewRisk)}`}>
                {previewRisk}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Attendance (%)" required hint="Enter a value between 0 and 100">
              <input
                type="number"
                value={form.attendance}
                onChange={set('attendance')}
                min="0"
                max="100"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.attendance ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.attendance && <p className="text-xs text-red-600 mt-1">{errors.attendance}</p>}
            </Field>

            <Field label="Performance Rating" required hint="Score from 1 (poor) to 5 (excellent)">
              <div className="space-y-2">
                <input
                  type="range"
                  value={form.performance_rating}
                  onChange={set('performance_rating')}
                  min="1"
                  max="5"
                  step="1"
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 px-0.5">
                  {[1, 2, 3, 4, 5].map(v => (
                    <span key={v} className={Number(form.performance_rating) === v ? 'text-blue-600 font-semibold' : ''}>{v}</span>
                  ))}
                </div>
              </div>
              {errors.performance_rating && <p className="text-xs text-red-600 mt-1">{errors.performance_rating}</p>}
            </Field>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Attrition Risk Rules:</strong>
            <ul className="mt-1.5 space-y-1 list-none">
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />High: Attendance &lt; 50% AND Rating &lt; 2</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />Medium: Attendance &lt; 70% AND Rating &lt; 3</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />Low: All other cases</li>
            </ul>
          </div>
        </div>

        {submitError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Save size={16} />
            {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
