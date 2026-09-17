import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RISK_BG, SOURCE_LABEL } from '../data/types';
import { useWaterData } from '../data/liveWaterData';

export default function StateDetail() {
  const { stateId } = useParams();
  const { states } = useWaterData();
  const state = useMemo(() => states.find((s) => s.id === stateId), [states, stateId]);

  if (!state) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">State not found</h1>
          <p className="mt-3 text-sm text-slate-600">Please choose a valid state from the navigation.</p>
          <Link to="/" className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700">
            Back to overview
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{state.name}</h1>
            <p className="mt-2 text-sm text-slate-600">City-level water quality risk data and recent parameter readings.</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${RISK_BG[state.overallRisk]}`}>
            {state.overallRisk}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {state.cities.map((city) => (
          <section key={city.name} className="card-hover rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{city.name}, {city.district}</h2>
                <p className="mt-2 text-sm text-slate-600">Source: {SOURCE_LABEL[city.source]}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${RISK_BG[city.risk]} ${city.risk === 'Contaminated' || city.risk === 'Critical' ? 'badge-pulse' : ''}`}>
                {city.risk}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">TDS</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.tds} mg/L</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">pH</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.ph.toFixed(1)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Turbidity</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.turbidity} NTU</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Fluoride</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.fluoride} mg/L</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Nitrate</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.nitrate} mg/L</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Arsenic</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{city.arsenic} mg/L</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Primary concern</p>
              <p className="mt-2 text-slate-700">{city.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {city.contaminants.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
