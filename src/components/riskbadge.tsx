import type { RiskLevel } from '../data/types';
import { RISK_BG } from '../data/types';

export default function RiskBadge({
  risk,
  size = 'sm',
}: {
  risk: RiskLevel;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${RISK_BG[risk]} ${
        size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {risk}
    </span>
  );
}