import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import IndiaMap from '../components/IndiaMap';
import { RISK_BG, RISK_COLORS } from '../data/types';
import { useWaterData } from '../data/liveWaterData';

export default function IndiaOverview() {
  const { states } = useWaterData();
  const { stateId } = useParams();

  const selectedState = useMemo(() => states.find((state) => state.id === stateId) ?? null, [states, stateId]);

  const stateTrendData = useMemo(() => {
    if (!selectedState) return [];
    return selectedState.cities.map((city, index) => ({
      name: city.name,
      tds: city.tds,
      turbidity: city.turbidity,
      index: index + 1,
    }));
  }, [selectedState]);

  const riskPieData = useMemo(() => {
    if (!selectedState) return [];
    const counts = selectedState.cities.reduce((acc, city) => {
      acc[city.risk] = (acc[city.risk] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [selectedState]);
  return (
    <main className="mx-auto max-w-7xl px-0 py-8 animate-fade-in sm:px-2">
      <div className="mb-8 rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_-28px_rgba(2,12,24,0.45)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Water intelligence</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">India Water Risk Overview</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Explore state water quality risk summaries for major Indian states and navigate to detailed city-level reports.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 px-4 py-3 text-sm text-cyan-800">
            <div className="font-semibold">Live focus</div>
            <div className="mt-1">Click a state on the map or use the search bar to dive in.</div>
          </div>
        </div>
      </div>

      <IndiaMap />

      {selectedState ? (
        <section className="mb-8 mt-6 rounded-[32px] border border-white/40 bg-white/75 p-6 shadow-[0_18px_45px_-24px_rgba(2,12,24,0.4)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">Focused state view</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedState.name}</h2>
              <p className="mt-2 text-sm text-slate-600">City-wise water quality detail for the selected state.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[selectedState.overallRisk]} ${selectedState.overallRisk === 'Contaminated' || selectedState.overallRisk === 'Critical' ? 'badge-pulse' : ''}`}>
              {selectedState.overallRisk}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Cities monitored</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{selectedState.cities.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Highest concern</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{selectedState.cities.find((city) => city.risk === 'Critical')?.name ?? selectedState.cities[0]?.name}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Updated</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{selectedState.cities[0]?.updated ?? 'Live data'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-semibold text-slate-900">TDS and turbidity trend</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stateTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
              <h3 className="text-lg font-semibold text-slate-900">Risk split</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskPieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                      {riskPieData.map((entry, index) => (
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

          <div className="mt-8 grid gap-4">
            {selectedState.cities.map((city) => (
              <div key={city.name} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{city.name}</h4>
                    <p className="mt-1 text-sm text-slate-600">{city.district} · {city.source}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[city.risk]} ${city.risk === 'Contaminated' || city.risk === 'Critical' ? 'badge-pulse' : ''}`}>
                    {city.risk}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{city.reason}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-8 mt-6 rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0_18px_45px_-24px_rgba(2,12,24,0.4)] backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-900">Select a state to inspect it</h2>
          <p className="mt-2 text-sm text-slate-600">Use the map or the state picker to reveal city-level water quality detail beneath the map.</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {states.map((state) => (
          <Link
            key={state.id}
            to={`/map/${state.id}`}
            className="card-hover rounded-[24px] border border-white/40 bg-white/75 p-6 shadow-[0_18px_45px_-24px_rgba(2,12,24,0.4)] backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{state.name}</h2>
                <p className="mt-2 text-sm text-slate-600">Overall risk level for major water sources.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[state.overallRisk]} ${state.overallRisk === 'Contaminated' || state.overallRisk === 'Critical' ? 'badge-pulse' : ''}`}>
                {state.overallRisk}
              </span>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-700">
              <div>Major cities: {state.cities.slice(0, 3).map((city) => city.name).join(', ')}</div>
              <div>City count: {state.cities.length}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
