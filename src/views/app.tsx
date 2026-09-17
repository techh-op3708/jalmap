import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/navbar.tsx';
import { WaterDataProvider } from '../data/liveWaterData';
import IndiaOverview from './IndiaOverview.tsx';
import StateDetail from './StateDetail.tsx';
import Dashboard from './Dashboard.tsx';
import About from './About.tsx';

export default function App() {
  return (
    <WaterDataProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-transparent text-slate-900">
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/overview" element={<IndiaOverview />} />
              <Route path="/map/:stateId" element={<IndiaOverview />} />
              <Route path="/state/:stateId" element={<StateDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <footer className="border-t border-white/40 bg-white/60 py-6 text-center text-xs text-slate-600 backdrop-blur">
            JalMap — Water Quality Mapping Platform · Data sourced from CPCB,
            CGWB &amp; State Pollution Control Board reports
          </footer>
        </div>
      </BrowserRouter>
    </WaterDataProvider>
  );
}
