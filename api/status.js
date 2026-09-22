/**
 * HiddenCheats - Real-Time Status API Endpoint
 * Vercel Serverless Function: GET & POST /api/status
 * Supports Dual-Sync Architecture (Push via x-sync-secret + Pull Fallback)
 */

// Default shared secret for Discord bot push authentication
const SYNC_SECRET = process.env.SYNC_SECRET || 'hc_sync_secret_2026';
const BOT_API_URL = process.env.BOT_API_URL || '';

// In-memory products store (persists across warm serverless invocations)
let productsStore = [
  // ARC RAIDERS
  {
    id: 'arc-raiders',
    name: 'Arc Raiders',
    game: 'arc-raiders',
    category: 'ARC RAIDERS',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Kernel bypass fully undetected. All features safe.',
    image: 'boxes/arc.png',
    storeUrl: 'arc.html',
    last_updated: new Date().toISOString()
  },
  {
    id: 'krush-arc-raiders',
    name: 'Krush - Arc Raiders',
    game: 'arc-raiders',
    category: 'ARC RAIDERS',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Silent aim & ESP operational without detection issues.',
    image: 'boxes/arc.png',
    storeUrl: 'arc.html',
    last_updated: new Date().toISOString()
  },

  // SIEGE X
  {
    id: 'inferno-r6-full',
    name: 'Inferno - R6 Full',
    game: 'siege-x',
    category: 'SIEGE X',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'BattlEye bypass clear. Recoil control & visual glow stable.',
    image: 'boxes/r6.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'ancient-r6-external',
    name: 'Ancient - R6 External',
    game: 'siege-x',
    category: 'SIEGE X',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Stream-proof external overlay active.',
    image: 'boxes/r6.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'r6-lite',
    name: 'R6 Lite',
    game: 'siege-x',
    category: 'SIEGE X',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Lightweight closet ESP working seamlessly.',
    image: 'boxes/r6.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'sapphire-unlock-all-r6s',
    name: 'Sapphire Unlock All - R6S',
    game: 'siege-x',
    category: 'SIEGE X',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Instant unlock for all weapon skins, elites & attachments.',
    image: 'boxes/r6.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },

  // APEX LEGENDS
  {
    id: 'ancient-apex-legends',
    name: 'Ancient - Apex Legends',
    game: 'apex-legends',
    category: 'APEX LEGENDS',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'EAC bypass fully validated on latest patch.',
    image: 'boxes/apex.png',
    storeUrl: 'apex.html',
    last_updated: new Date().toISOString()
  },
  {
    id: 'apex-pro-external',
    name: 'Apex Pro External',
    game: 'apex-legends',
    category: 'APEX LEGENDS',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Smooth aimbot and glow ESP fully functional.',
    image: 'boxes/apex.png',
    storeUrl: 'apex.html',
    last_updated: new Date().toISOString()
  },

  // CALL OF DUTY
  {
    id: 'phantom-mw-warzone',
    name: 'Phantom - Modern Warfare / Warzone',
    game: 'call-of-duty',
    category: 'CALL OF DUTY',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'RICOCHET kernel bypass clear on Warzone & MW3.',
    image: 'boxes/cod.png',
    storeUrl: 'cod.html',
    last_updated: new Date().toISOString()
  },
  {
    id: 'cod-dma',
    name: 'Call of Duty DMA Cheat',
    game: 'call-of-duty',
    category: 'CALL OF DUTY',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: '2-PC hardware DMA firmware undetected.',
    image: 'boxes/cod.png',
    storeUrl: 'cod.html',
    last_updated: new Date().toISOString()
  },
  {
    id: 'bo7-wz-unlock-all',
    name: 'BO7 / WZ UNLOCK ALL',
    game: 'call-of-duty',
    category: 'CALL OF DUTY',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Safe camo & blueprint synchronizer active.',
    image: 'boxes/cod.png',
    storeUrl: 'cod.html',
    last_updated: new Date().toISOString()
  },

  // COUNTER STRIKE 2
  {
    id: 'prime-cs2-cheat',
    name: 'Prime - CS2 Cheat',
    game: 'counter-strike-2',
    category: 'COUNTER STRIKE 2',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'VAC live bypass operational. Clean ESP and legit RCS.',
    image: 'boxes/valorant.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'cs2-esp-aimbot-private',
    name: 'CS2 ESP & Aimbot Private',
    game: 'counter-strike-2',
    category: 'COUNTER STRIKE 2',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Premier and competitive ready.',
    image: 'boxes/valorant.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },

  // RUST
  {
    id: 'oxide-rust-cheat',
    name: 'Oxide - Rust Cheat',
    game: 'rust',
    category: 'RUST',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Cerberus & EAC bypass active. Debug cam and ore ESP operational.',
    image: 'boxes/rust.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'rust-external-esp',
    name: 'Rust External ESP',
    game: 'rust',
    category: 'RUST',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'External overlay zero injection signature.',
    image: 'boxes/rust.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },

  // FORTNITE
  {
    id: 'vanguard-fortnite',
    name: 'Vanguard - Fortnite Cheat',
    game: 'fortnite',
    category: 'FORTNITE',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Tournament & ranked safe. Dual EAC/BE hypervisor bypass.',
    image: 'boxes/fort.png',
    storeUrl: 'fortnite.html',
    last_updated: new Date().toISOString()
  },
  {
    id: 'fortnite-softaim-esp',
    name: 'Fortnite Softaim & ESP',
    game: 'fortnite',
    category: 'FORTNITE',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Humanized smoothing & weapon prediction stable.',
    image: 'boxes/fort.png',
    storeUrl: 'fortnite.html',
    last_updated: new Date().toISOString()
  },

  // MARVEL RIVALS
  {
    id: 'nova-marvel-rivals',
    name: 'Nova - Marvel Rivals',
    game: 'marvel-rivals',
    category: 'MARVEL RIVALS',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Hero ESP, hitbox expansion & projectile prediction running smoothly.',
    image: 'boxes/apex.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },

  // HWID SPOOFER
  {
    id: 'hidden-spoofer-permanent',
    name: 'Hidden Spoofer Permanent',
    game: 'hwid-spoofer',
    category: 'HWID SPOOFER',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Permanent kernel EFI serial spoofing. No Windows reinstall required.',
    image: 'favicon.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  },
  {
    id: 'hidden-spoofer-temp-cleaner',
    name: 'Hidden Spoofer Temp + Cleaner',
    game: 'hwid-spoofer',
    category: 'HWID SPOOFER',
    status: 'Undetected',
    previous_status: 'Undetected',
    notes: 'Session spoofer with deep registry & trace cleaning.',
    image: 'favicon.png',
    storeUrl: 'index.html#products',
    last_updated: new Date().toISOString()
  }
];

// Helper to normalize status strings with robust case-insensitive matching
function normalizeStatus(raw) {
  if (!raw) return 'Undetected';
  const s = String(raw).toLowerCase().trim();
  if (s.includes('updat') || s.includes('patch')) return 'Updating';
  if (s.includes('test')) return 'Testing';
  if (s.includes('maint')) return 'Maintenance';
  if (s.includes('off') || s.includes('down')) return 'Offline';
  if (s.includes('risk') || s.includes('warn')) return 'Use At Own Risk';
  if (s.includes('detect') && !s.includes('undetect')) return 'Detected';
  if (s.includes('undetect') || s.includes('working') || s.includes('online') || s.includes('safe')) return 'Undetected';
  return 'Undetected';
}

// Compute dynamic category counts
function computeCounts(products) {
  const counts = {
    total: products.length,
    undetected: 0,
    updating: 0,
    testing: 0,
    detected: 0,
    maintenance: 0,
    offline: 0,
    use_at_own_risk: 0
  };

  products.forEach(p => {
    const norm = normalizeStatus(p.status);
    switch (norm) {
      case 'Undetected':
        counts.undetected++;
        break;
      case 'Updating':
        counts.updating++;
        break;
      case 'Testing':
        counts.testing++;
        break;
      case 'Detected':
        counts.detected++;
        break;
      case 'Maintenance':
        counts.maintenance++;
        break;
      case 'Offline':
        counts.offline++;
        break;
      case 'Use At Own Risk':
        counts.use_at_own_risk++;
        break;
      default:
        counts.undetected++;
    }
  });

  return counts;
}

// Set global CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-sync-secret');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight CORS OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // --- POST /api/status (Authenticated Bot Push) ---
  if (req.method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const secretHeader = req.headers['x-sync-secret'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (secretHeader !== SYNC_SECRET && token !== SYNC_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid x-sync-secret or Bearer token'
      });
    }

    const body = req.body || {};
    let updatedCount = 0;

    // Batch update
    if (Array.isArray(body.products)) {
      body.products.forEach(update => {
        const target = productsStore.find(p => 
          (update.id && p.id.toLowerCase() === String(update.id).toLowerCase()) ||
          (update.name && p.name.toLowerCase() === String(update.name).toLowerCase())
        );
        if (target) {
          target.previous_status = target.status;
          if (update.status) target.status = normalizeStatus(update.status);
          if (typeof update.notes === 'string') target.notes = update.notes.trim();
          target.last_updated = new Date().toISOString();
          updatedCount++;
        }
      });
    } 
    let singleUpdatedProduct = null;
    // Single product update
    if (body.id || body.name) {
      const target = productsStore.find(p => 
        (body.id && p.id.toLowerCase() === String(body.id).toLowerCase()) ||
        (body.name && p.name.toLowerCase() === String(body.name).toLowerCase())
      );
      if (target) {
        target.previous_status = target.status;
        if (body.status) target.status = normalizeStatus(body.status);
        if (typeof body.notes === 'string') target.notes = body.notes.trim();
        target.last_updated = new Date().toISOString();
        updatedCount++;
        singleUpdatedProduct = target;
      } else {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${body.id || body.name}`
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Bad Request: Missing product id/name or products array in payload'
      });
    }

    const counts = computeCounts(productsStore);

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      updated_count: updatedCount,
      product: singleUpdatedProduct,
      counts: counts,
      products: productsStore
    });
  }

  // --- GET /api/status (Client Poller + Bot Pull Fallback) ---
  if (req.method === 'GET') {
    // Server Pull Fallback: If BOT_API_URL is configured, attempt query
    if (BOT_API_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const botRes = await fetch(`${BOT_API_URL.replace(/\/$/, '')}/api/status`, {
          signal: controller.signal,
          headers: {
            'x-sync-secret': SYNC_SECRET
          }
        });
        clearTimeout(timeoutId);

        if (botRes.ok) {
          const botData = await botRes.json();
          if (Array.isArray(botData.products)) {
            botData.products.forEach(bp => {
              const local = productsStore.find(p => p.id.toLowerCase() === String(bp.id).toLowerCase());
              if (local && bp.status) {
                local.previous_status = local.status;
                local.status = normalizeStatus(bp.status);
                if (typeof bp.notes === 'string') local.notes = bp.notes;
                local.last_updated = bp.last_updated || new Date().toISOString();
              }
            });
          }
        }
      } catch (err) {
        // Quiet fallback to cached in-memory store
      }
    }

    // Set cache headers for fast edge delivery with SWR
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');

    const counts = computeCounts(productsStore);

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: counts,
      products: productsStore
    });
  }

  // Fallback method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method Not Allowed'
  });
};
