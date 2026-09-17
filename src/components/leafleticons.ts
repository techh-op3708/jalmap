import L from 'leaflet';
import type { RiskLevel } from '../data/types';
import { RISK_COLORS } from '../data/types';

export function makeMarkerIcon(risk: RiskLevel): L.DivIcon {
  const color = RISK_COLORS[risk];
  return L.divIcon({
    className: 'jalmap-marker',
    html: `<span style="
      display:block;
      width:18px;height:18px;
      background:${color};
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}
