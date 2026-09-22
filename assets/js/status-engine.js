/**
 * HiddenCheats - Real-Time Status Engine & Visual Normalizer
 * Provides 7-tier status normalization, color styling, and DOM badge generation.
 */

(function (window) {
  'use strict';

  const STATUS_CONFIGS = {
    'Undetected': {
      label: 'UNDETECTED',
      key: 'undetected',
      icon: 'fa-solid fa-circle-check',
      textColor: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.12)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      borderLeft: '#34d399',
      dotColor: '#34d399',
      pulseClass: 'pulse-green',
      canPurchase: true
    },
    'Updating': {
      label: 'UPDATING',
      key: 'updating',
      icon: 'fa-solid fa-arrows-rotate fa-spin',
      textColor: '#fb923c',
      bgColor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
      borderLeft: '#f97316',
      dotColor: '#fb923c',
      pulseClass: 'pulse-orange',
      canPurchase: false,
      cautionNote: 'Cheat is currently updating for the latest game patch. Purchases paused.'
    },
    'Testing': {
      label: 'TESTING',
      key: 'testing',
      icon: 'fa-solid fa-flask',
      textColor: '#60a5fa',
      bgColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderLeft: '#3b82f6',
      dotColor: '#60a5fa',
      pulseClass: 'pulse-blue',
      canPurchase: true,
      cautionNote: 'Build is undergoing internal QA testing.'
    },
    'Detected': {
      label: 'DETECTED',
      key: 'detected',
      icon: 'fa-solid fa-triangle-exclamation',
      textColor: '#f87171',
      bgColor: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      borderLeft: '#ef4444',
      dotColor: '#f87171',
      pulseClass: 'pulse-red',
      canPurchase: false,
      cautionNote: 'Detections reported. Do not inject. Developers are rewriting bypass.'
    },
    'Maintenance': {
      label: 'MAINTENANCE',
      key: 'maintenance',
      icon: 'fa-solid fa-screwdriver-wrench',
      textColor: '#fde047',
      bgColor: 'rgba(234, 179, 8, 0.12)',
      borderColor: 'rgba(234, 179, 8, 0.3)',
      borderLeft: '#eab308',
      dotColor: '#fde047',
      pulseClass: 'pulse-yellow',
      canPurchase: false,
      cautionNote: 'Server maintenance in progress. Key generation briefly paused.'
    },
    'Offline': {
      label: 'OFFLINE',
      key: 'offline',
      icon: 'fa-solid fa-power-off',
      textColor: '#cbd5e1',
      bgColor: 'rgba(148, 163, 184, 0.12)',
      borderColor: 'rgba(148, 163, 184, 0.3)',
      borderLeft: '#94a3b8',
      dotColor: '#cbd5e1',
      pulseClass: 'pulse-slate',
      canPurchase: false,
      cautionNote: 'Product server offline.'
    },
    'Use At Own Risk': {
      label: 'USE AT OWN RISK',
      key: 'use_at_own_risk',
      icon: 'fa-solid fa-shield-halved',
      textColor: '#fb7185',
      bgColor: 'rgba(244, 63, 94, 0.12)',
      borderColor: 'rgba(244, 63, 94, 0.3)',
      borderLeft: '#f43f5e',
      dotColor: '#fb7185',
      pulseClass: 'pulse-rose',
      canPurchase: true,
      cautionNote: 'Closet play strongly advised. High ban risk on aggressive settings.'
    }
  };

  /**
   * Normalizes raw status string to one of the 7 supported canonical statuses
   */
  function normalizeStatus(raw) {
    if (!raw) return 'Undetected';
    const s = String(raw).toLowerCase().trim();

    if (s.includes('updat') || s.includes('patch')) return 'Updating';
    if (s.includes('test')) return 'Testing';
    if (s.includes('maint')) return 'Maintenance';
    if (s.includes('off') || s.includes('down')) return 'Offline';
    if (s.includes('risk') || s.includes('warn') || s.includes('caution')) return 'Use At Own Risk';
    if (s.includes('detect') && !s.includes('undetect')) return 'Detected';
    if (s.includes('undetect') || s.includes('working') || s.includes('online') || s.includes('safe')) return 'Undetected';

    return 'Undetected';
  }

  function getStatusConfig(rawStatus) {
    const canonical = normalizeStatus(rawStatus);
    return STATUS_CONFIGS[canonical] || STATUS_CONFIGS['Undetected'];
  }

  /**
   * Generates badge HTML with pulsing status dot
   */
  function generateStatusBadgeHtml(rawStatus) {
    const cfg = getStatusConfig(rawStatus);
    return `
      <div class="status-badge" style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 6px;
        background: ${cfg.bgColor};
        border: 1px solid ${cfg.borderColor};
        border-left: 3px solid ${cfg.borderLeft};
        color: ${cfg.textColor};
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        height: 36px;
        position: relative;
        overflow: hidden;
      ">
        <span class="status-pulse-dot ${cfg.pulseClass}" style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${cfg.dotColor};
          display: inline-block;
          flex-shrink: 0;
        "></span>
        <i class="${cfg.icon}" style="font-size: 12px;"></i>
        <span>${cfg.label}</span>
      </div>
    `;
  }

  // Export to window
  window.HCStatusEngine = {
    normalizeStatus: normalizeStatus,
    getStatusConfig: getStatusConfig,
    generateStatusBadgeHtml: generateStatusBadgeHtml,
    STATUS_CONFIGS: STATUS_CONFIGS
  };

})(typeof window !== 'undefined' ? window : this);
