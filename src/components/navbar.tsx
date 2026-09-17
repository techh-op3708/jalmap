import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Droplets, ChevronDown, Info, LayoutDashboard, Map } from 'lucide-react';
import { STATES } from '../data/waterdata';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-[1000] bg-brand-deep text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 transition hover:opacity-90"
        >
          <Droplets className="h-7 w-7 text-brand-teal" />
          <div className="text-left">
            <div className="text-lg font-bold leading-none">JalMap</div>
            <div className="text-[11px] text-teal-200">
              Mapping India's Water, One Report at a Time
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* State selector */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              Select State
              <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 max-h-80 w-56 overflow-auto rounded-lg border border-gray-200 bg-white text-gray-800 shadow-xl">
                {STATES.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={() => {
                      try {
                        window.dispatchEvent(new CustomEvent('jalmap:focusState', { detail: { id: s.id } }));
                      } catch (e) {
                        // ignore if CustomEvent is unsupported
                      }
                      navigate(`/map/${s.id}`);
                      setOpen(false);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-teal-50"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <button
            onClick={() => navigate('/overview')}
            className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex ${
              location.pathname.startsWith('/overview') || location.pathname.startsWith('/map/') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Map className="h-4 w-4" />
            Map
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isDashboard ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex ${
              location.pathname === '/about' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Info className="h-4 w-4" />
            About
          </button>
        </div>
      </div>
    </header>
  );
}
