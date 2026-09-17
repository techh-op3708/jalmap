import { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { RISK_BG, RISK_COLORS } from '../data/types';
import { useWaterData } from '../data/liveWaterData';

export default function Dashboard() {
  const { states } = useWaterData();
  const summary = useMemo(() => {
    const counts = states.reduce(
      (acc, state) => {
        acc[state.overallRisk] = (acc[state.overallRisk] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return counts;
  }, [states]);

  const citySeries = useMemo(() => {
    return states.flatMap((state) =>
      state.cities.map((city) => ({
        state: state.name,
        city: city.name,
        tds: city.tds,
        turbidity: city.turbidity,
        risk: city.risk,
      }))
    );
  }, [states]);

  const pieData = useMemo(() => {
    const counts = states.flatMap((state) => state.cities).reduce((acc, city) => {
      acc[city.risk] = (acc[city.risk] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [states]);

  const stateBars = useMemo(() => {
    return states.map((state) => ({
      name: state.name,
      cities: state.cities.length,
      riskScore: ['Safe', 'Moderate', 'Contaminated', 'Critical'].indexOf(state.overallRisk) + 1,
    }));
  }, [states]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-3 text-sm text-slate-600">
          High-level state risk distribution and quick metrics for India water quality.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {(['Safe', 'Moderate', 'Contaminated', 'Critical'] as const).map((level) => (
          <div key={level} className="card-hover rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{level}</h2>
            <p className={`mt-4 rounded-full px-4 py-2 text-lg font-semibold ${RISK_BG[level]} ${level === 'Contaminated' || level === 'Critical' ? 'badge-pulse' : ''}`}>
              {summary[level] ?? 0} states
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Interactive risk overview</h2>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-semibold text-slate-900">City TDS and turbidity trend</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={citySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tds" stroke="#0f766e" strokeWidth={2} name="TDS" />
                  <Line type="monotone" dataKey="turbidity" stroke="#f59e0b" strokeWidth={2} name="Turbidity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Risk distribution across cities</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                    {pieData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] ?? '#334155'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">State monitoring coverage</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cities" fill="#2563eb" name="Cities monitored" />
                <Bar dataKey="riskScore" fill="#14b8a6" name="Risk score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-700">
          {states.map((state) => (
            <div key={state.id} className="card-hover flex items-center justify-between rounded-3xl border border-slate-100 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{state.name}</p>
                <p className="text-xs text-slate-500">{state.cities.length} cities monitored</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[state.overallRisk]} ${state.overallRisk === 'Contaminated' || state.overallRisk === 'Critical' ? 'badge-pulse' : ''}`}>
                {state.overallRisk}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
