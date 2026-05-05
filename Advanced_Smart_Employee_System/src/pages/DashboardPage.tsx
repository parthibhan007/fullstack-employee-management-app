import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Employee, getAttritionRisk, getRiskBg } from '../lib/supabase';
import { Users, AlertTriangle, TrendingDown, ShieldCheck, Star, UserPlus } from 'lucide-react';

type RiskCounts = { high: number; medium: number; low: number };

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('employees').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setEmployees(data ?? []);
      setLoading(false);
    });
  }, []);

  const counts: RiskCounts = employees.reduce(
    (acc, e) => {
      const r = getAttritionRisk(e.attendance, e.performance_rating);
      acc[r.toLowerCase() as 'high' | 'medium' | 'low']++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const topPerformers = [...employees]
    .sort((a, b) => b.performance_rating - a.performance_rating)
    .slice(0, 5);

  const recent = employees.slice(0, 5);

  const departments = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxDept = Math.max(...Object.values(departments), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Workforce overview and attrition insights</p>
        </div>
        <button
          onClick={() => navigate('/employees/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Employees" value={employees.length} color="text-blue-600" sub="Active workforce" />
        <StatCard icon={AlertTriangle} label="High Risk" value={counts.high} color="text-red-600" sub="Attrition risk" />
        <StatCard icon={TrendingDown} label="Medium Risk" value={counts.medium} color="text-orange-500" sub="Attrition risk" />
        <StatCard icon={ShieldCheck} label="Low Risk" value={counts.low} color="text-green-600" sub="Attrition risk" />
      </div>

      {/* Risk Bar */}
      {employees.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Attrition Risk Distribution</h2>
          <div className="flex rounded-full overflow-hidden h-4">
            {counts.high > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${(counts.high / employees.length) * 100}%` }}
                title={`High: ${counts.high}`}
              />
            )}
            {counts.medium > 0 && (
              <div
                className="bg-orange-400 transition-all"
                style={{ width: `${(counts.medium / employees.length) * 100}%` }}
                title={`Medium: ${counts.medium}`}
              />
            )}
            {counts.low > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${(counts.low / employees.length) * 100}%` }}
                title={`Low: ${counts.low}`}
              />
            )}
          </div>
          <div className="flex gap-6 mt-3">
            {[
              { label: 'High Risk', count: counts.high, color: 'bg-red-500' },
              { label: 'Medium Risk', count: counts.medium, color: 'bg-orange-400' },
              { label: 'Low Risk', count: counts.low, color: 'bg-green-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-xs text-slate-500">{label}: <strong className="text-slate-700">{count}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Department Headcount</h2>
          {Object.keys(departments).length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(departments)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{dept}</span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(count / maxDept) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Top Performers</h2>
          {topPerformers.length === 0 ? (
            <p className="text-slate-400 text-sm">No employees yet.</p>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{e.name}</p>
                    <p className="text-xs text-slate-400 truncate">{e.role}</p>
                  </div>
                  <RatingStars rating={e.performance_rating} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Additions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Additions</h2>
          {recent.length === 0 ? (
            <p className="text-slate-400 text-sm">No employees yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map(e => {
                const risk = getAttritionRisk(e.attendance, e.performance_rating);
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-slate-500 uppercase">{e.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{e.name}</p>
                      <p className="text-xs text-slate-400 truncate">{e.department}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getRiskBg(risk)}`}>
                      {risk}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
