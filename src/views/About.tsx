import { Activity, Building2, Database, Droplets, FileCheck2, Map, Scale } from 'lucide-react';

const governmentSources = [
  {
    icon: Activity,
    title: 'CPCB',
    subtitle: 'Central Pollution Control Board',
    text: 'National water-quality monitoring reports and pollution indicators provide context for rivers, surface water, and affected locations.',
  },
  {
    icon: Building2,
    title: 'CGWB',
    subtitle: 'Central Ground Water Board',
    text: 'Groundwater quality assessments help represent measurements such as fluoride, nitrate, arsenic, TDS, and other aquifer indicators.',
  },
  {
    icon: Droplets,
    title: 'State water boards',
    subtitle: 'State Pollution Control Boards and departments',
    text: 'State-level monitoring reports add local context, district coverage, and water-source information for city-level views.',
  },
  {
    icon: Scale,
    title: 'BIS 10500',
    subtitle: 'Drinking water specification',
    text: 'JalMap uses BIS reference limits as a comparison framework for readings such as pH, turbidity, TDS, fluoride, nitrate, and arsenic.',
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
        <div className="card-hover rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Map className="h-7 w-7 text-brand-teal" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">What the dashboard shows</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The dashboard summarizes state risk, city coverage, trends, and risk distribution. The map and state views provide geographic context, while detail pages expose the measurements and reasons behind a city risk label.
          </p>
        </div>
        <div className="card-hover rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Database className="h-7 w-7 text-brand-teal" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Built for continued development</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The project is intentionally modular: the React frontend, Supabase snapshot tables, and Express/PostgreSQL API can evolve independently as data sources and validation workflows become more complete.
          </p>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-7 sm:px-8">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-7 w-7 text-brand-teal" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Official reference network</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Where the water-quality context comes from</h2>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            JalMap is designed to bring together public reports from India's water and environmental authorities. These sources cover different parts of the water story: pollution monitoring, groundwater chemistry, local conditions, and the standards used to interpret readings.
          </p>
        </div>
        <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
          {governmentSources.map(({ icon: Icon, title, subtitle, text }) => (
            <article key={title} className="bg-white p-6 transition hover:bg-teal-50/60 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-teal-50 p-3 text-brand-teal">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-slate-400">Government reference</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-brand-teal">{subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-teal-100 bg-teal-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Current data status</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            The current public build uses a bundled sample dataset and can read curated snapshots from Supabase. An automated pipeline that fetches and verifies new government reports is still a future step, so each displayed reading should be treated as an informative snapshot rather than a live official alert.
          </p>
        </div>
        <div className="rounded-3xl bg-brand-deep p-6 text-white sm:p-8">
          <h2 className="text-xl font-semibold">Use it responsibly</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Risk labels help compare locations. They do not replace certified laboratory testing, local authority notices, or public-health guidance.
          </p>
        </div>
      </section>
    </main>
  );
}