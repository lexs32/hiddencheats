/**
 * HiddenCheats - Shopify Payment Processor Configuration
 * 
 * Instructions:
 * 1. Set your Shopify store domain (e.g. "hiddencheats.myshopify.com" or custom domain)
 * 2. Map your cheat variants to your Shopify Product Variant IDs
 * 3. Shopify webhook endpoint will automatically fulfill keys in Supabase
 */

window.SHOPIFY_CONFIG = {
  // Your myshopify.com domain or custom checkout domain
  shopDomain: localStorage.getItem('hc_shopify_domain') || '',
  
  // Optional Storefront API Access Token if using GraphQL checkout
  storefrontAccessToken: localStorage.getItem('hc_shopify_token') || '',

  // Product Variant Mapping: Internal ID -> Shopify Variant ID
  variants: {
    // Arc Raiders
    'arc-priv-1d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_1',
    'arc-priv-7d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_2',
    'arc-priv-30d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_3',

    // Apex Legends
    'apex-priv-1d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_4',
    'apex-priv-7d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_5',
    'apex-priv-30d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_6',

    // Call of Duty
    'cod-priv-1d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_7',
    'cod-priv-7d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_8',
    'cod-priv-30d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_9',

    // Fortnite
    'fort-priv-1d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_10',
    'fort-priv-7d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_11',
    'fort-priv-30d': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_12'
  }
};

window.setShopifyConfig = function(domain, token) {
  if (!domain) return false;
  localStorage.setItem('hc_shopify_domain', domain.trim());
  if (token) localStorage.setItem('hc_shopify_token', token.trim());
  window.SHOPIFY_CONFIG.shopDomain = domain.trim();
  if (token) window.SHOPIFY_CONFIG.storefrontAccessToken = token.trim();
  console.log('[Shopify] Config saved:', domain);
  return true;
};
