import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { STATES as fallbackStates } from './waterdata';
import type { CityWaterData, RiskLevel, StateData, WaterSource } from './types';

type WaterDataSource = 'loading' | 'supabase' | 'fallback';

type WaterDataContextValue = {
  states: StateData[];
  source: WaterDataSource;
};

const WaterDataContext = createContext<WaterDataContextValue>({
  states: fallbackStates,
  source: 'loading',
});

function normalizeRisk(value: unknown): RiskLevel {
  if (value === 'Safe' || value === 'Moderate' || value === 'Contaminated' || value === 'Critical') {
    return value;
  }
  return 'Moderate';
}

function normalizeSource(value: unknown): WaterSource {
  if (value === 'River' || value === 'Groundwater' || value === 'Municipal Supply' || value === 'Mixed') {
    return value;
  }
  return 'Mixed';
}

function createSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

function normalizeStateRows(stateRows: Array<Record<string, unknown>>, cityRows: Array<Record<string, unknown>>): StateData[] {
  const citiesByState = new Map<string, CityWaterData[]>();

  for (const row of cityRows) {
    const stateId = String(row.state_id ?? '');
    if (!stateId) continue;

    const city: CityWaterData = {
      name: String(row.city_name ?? ''),
      district: String(row.district ?? ''),
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
      source: normalizeSource(row.source),
      tds: Number(row.tds ?? 0),
      ph: Number(row.ph ?? 0),
      turbidity: Number(row.turbidity ?? 0),
      fluoride: Number(row.fluoride ?? 0),
      nitrate: Number(row.nitrate ?? 0),
      arsenic: Number(row.arsenic ?? 0),
      risk: normalizeRisk(row.risk),
      reason: String(row.reason ?? ''),
      contaminants: Array.isArray(row.contaminants) ? row.contaminants.map((item) => String(item)) : [],
      updated: String(row.updated_at ?? ''),
    };

    const existing = citiesByState.get(stateId) ?? [];
    existing.push(city);
    citiesByState.set(stateId, existing);
  }

  return stateRows.map((row) => {
    const stateId = String(row.state_id ?? '');
    const cities = citiesByState.get(stateId) ?? [];

    return {
      id: stateId,
      name: String(row.state_name ?? stateId),
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
      overallRisk: normalizeRisk(row.overall_risk),
      cities,
    } satisfies StateData;
  });
}

async function fetchFromSupabase(supabase: SupabaseClient): Promise<StateData[]> {
  const [{ data: stateRows, error: stateError }, { data: cityRows, error: cityError }] = await Promise.all([
    supabase.from('water_state_snapshots').select('*').order('state_name', { ascending: true }),
    supabase.from('water_city_snapshots').select('*').order('state_id', { ascending: true }),
  ]);

  if (stateError || cityError) {
    throw new Error(stateError?.message ?? cityError?.message ?? 'Unable to load Supabase data');
  }

  return normalizeStateRows((stateRows ?? []) as Array<Record<string, unknown>>, (cityRows ?? []) as Array<Record<string, unknown>>);
}

export function WaterDataProvider({ children }: { children: React.ReactNode }) {
  const [states, setStates] = useState<StateData[]>(fallbackStates);
  const [source, setSource] = useState<WaterDataSource>('loading');

  useEffect(() => {
    const supabase = createSupabaseClient();

    let isMounted = true;
    let channel: ReturnType<SupabaseClient['channel']> | null = null;

    const load = async () => {
      if (!supabase) {
        if (isMounted) {
          setStates(fallbackStates);
          setSource('fallback');
        }
        return;
      }

      try {
        const data = await fetchFromSupabase(supabase);
        if (!isMounted) return;

        if (data.length > 0) {
          setStates(data);
          setSource('supabase');
        } else {
          setStates(fallbackStates);
          setSource('fallback');
        }
      } catch {
        if (isMounted) {
          setStates(fallbackStates);
          setSource('fallback');
        }
      }
    };

    void load();

    if (supabase) {
      channel = supabase
        .channel('jalmap-water-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'water_state_snapshots' }, () => {
          void load();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'water_city_snapshots' }, () => {
          void load();
        })
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
  }, []);

  const value = useMemo(() => ({ states, source }), [states, source]);

  return <WaterDataContext.Provider value={value}>{children}</WaterDataContext.Provider>;
}

export function useWaterData() {
  return useContext(WaterDataContext);
}
