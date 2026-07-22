'use client';

export default function StatCard({ icon, label, value, change, changeDir = 'up', color = '#4F46E5', bg = 'rgba(79,70,229,0.08)' }) {
  return (
    <div className="fm-stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
      <div className="fm-stat-icon">{icon}</div>
      <div className="fm-stat-info">
        <div className="fm-stat-value">{value}</div>
        <div className="fm-stat-label">{label}</div>
        {change !== undefined && (
          <div className={`fm-stat-change ${changeDir}`}>
            {changeDir === 'up' ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
