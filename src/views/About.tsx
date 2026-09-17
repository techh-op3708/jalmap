import { Database, Droplets, Map, Radio, ShieldCheck } from 'lucide-react';

const dataFlow = [
  {
    icon: Database,
    title: 'Snapshot data',
    text: 'JalMap reads state and city water-quality snapshots from Supabase when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.',
  },
  {
    icon: Radio,
    title: 'Live refreshes',
    text: 'Supabase Realtime watches both snapshot tables. When a row is inserted, updated, or deleted, the dashboard reloads the latest data.',
  },
  {
    icon: ShieldCheck,
    title: 'Fallback mode',
    text: 'When Supabase is not configured, unavailable, or empty, the app uses the bundled sample dataset so the dashboard remains usable during development.',
  },
];

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 animate-fade-in sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-brand-deep p-8 text-white shadow-lg sm:p-10">
        <div className="flex items-center gap-3">
          <Droplets className="h-9 w-9 text-brand-teal" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">About JalMap</p>
        </div>
        <h1 className="mt-6 max-w-3xl text-3xl font-semibold sm:text-4xl">Making water-quality information easier to explore.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
          JalMap brings state and city-level water-quality indicators into one visual workspace. It helps people compare risk levels, inspect readings such as TDS, pH, turbidity, fluoride, nitrate, and arsenic, and move from an India-wide view into individual locations.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Map className="h-7 w-7 text-brand-teal" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">What the dashboard shows</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The dashboard summarizes state risk, city coverage, trends, and risk distribution. The map and state views provide geographic context, while detail pages expose the measurements and reasons behind a city risk label.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Database className="h-7 w-7 text-brand-teal" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Built for continued development</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The project is intentionally modular: the React frontend, Supabase snapshot tables, and Express/PostgreSQL API can evolve independently as data sources and validation workflows become more complete.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">How data reaches the dashboard</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {dataFlow.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-brand-teal" />
              <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Data responsibility</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Risk labels are an organizing aid, not a substitute for certified laboratory testing or public-health guidance. JalMap is designed to make available reports easier to compare and to show when a reading was last updated.
        </p>
      </section>
    </main>
  );
}