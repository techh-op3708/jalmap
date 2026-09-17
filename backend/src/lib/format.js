export function mapStateRow(row, cities = []) {
  return {
    id: row.id,
    name: row.name,
    lat: Number(row.lat),
    lng: Number(row.lng),
    overallRisk: row.overall_risk,
    cities: cities.map((city) => ({
      name: city.city_name,
      district: city.district,
      lat: Number(city.lat),
      lng: Number(city.lng),
      source: city.source,
      tds: Number(city.tds),
      ph: Number(city.ph),
      turbidity: Number(city.turbidity),
      fluoride: Number(city.fluoride),
      nitrate: Number(city.nitrate),
      arsenic: Number(city.arsenic),
      risk: city.risk,
      reason: city.reason,
      contaminants: Array.isArray(city.contaminants) ? city.contaminants : [],
      updated: city.updated_at,
    })),
  };
}

export function mapCityRow(row) {
  return {
    name: row.city_name,
    district: row.district,
    lat: Number(row.lat),
    lng: Number(row.lng),
    source: row.source,
    tds: Number(row.tds),
    ph: Number(row.ph),
    turbidity: Number(row.turbidity),
    fluoride: Number(row.fluoride),
    nitrate: Number(row.nitrate),
    arsenic: Number(row.arsenic),
    risk: row.risk,
    reason: row.reason,
    contaminants: Array.isArray(row.contaminants) ? row.contaminants : [],
    updated: row.updated_at,
  };
}
