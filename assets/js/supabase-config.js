/**
 * HiddenCheats - Supabase Public Configuration & Client Helper
 */

window.SUPABASE_CONFIG = {
  url: 'https://gdzsfblrklpqmqanwmwd.supabase.co',
  anonKey: 'sb_publishable_p6uoGFtx-5U6DgwEI3lRJQ_iMfH7ISo'
};

window.setSupabaseConfig = function(url, anonKey) {
  if (!url || !anonKey) {
    console.error('[Supabase] Missing url or anonKey parameters.');
    return false;
  }
  localStorage.setItem('hc_supabase_url', url.trim());
  localStorage.setItem('hc_supabase_anon_key', anonKey.trim());
  window.SUPABASE_CONFIG.url = url.trim();
  window.SUPABASE_CONFIG.anonKey = anonKey.trim();
  console.log('[Supabase] Configuration saved to localStorage. Reloading page...');
  window.location.reload();
  return true;
};
