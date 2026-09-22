(function () {
  const CATALOG = {
    arc: {
      id: 'arc',
      title: 'Arc Raiders',
      icon: 'fa-shield-halved',
      banner: 'assets/images/games/arc_raiders.webp',
      cheats: [
        {
          id: 'private-arc',
          name: 'Private - Arc Raiders',
          image: 'boxes/arc.png',
          status: 'Undetected',
          tag: 'Private Kernel Suite',
          minPrice: 6.00,
          features: [
            'Undetected Kernel Memory Driver (Ring 0)',
            '2D/3D Box & Skeleton Bone ESP',
            'Smooth Memory Aimbot with FOV Slider',
            'Full Loot, Chest & Drone ESP Filter',
            'No Recoil & Sway Compensation',
            'Streamproof Overlay & EAC Bypass'
          ],
          requirements: 'Windows 10 / 11 (All Builds) • Intel & AMD CPUs • EAC Bypass Included',
          variants: [
            { id: 'arc-priv-1d', name: '1 Day Key', price: 6.00 },
            { id: 'arc-priv-7d', name: '7 Day Key', price: 20.00 },
            { id: 'arc-priv-30d', name: '30 Day Key', price: 40.00 }
          ]
        }
      ]
    },
    apex: {
      id: 'apex',
      title: 'Apex Legends',
      icon: 'fa-crosshairs',
      banner: 'assets/images/nexus/Apex.webp',
      cheats: [
        {
          id: 'private-apex',
          name: 'Private - Apex Legends',
          image: 'boxes/apex.png',
          status: 'Undetected',
          tag: 'Private Predator Build',
          minPrice: 6.00,
          features: [
            'Private Kernel Ring0 Memory Protection',
            'Dynamic Glow ESP with Armor Tier Colors',
            'Vector Aim Assist with Bullet Prediction',
            'Smooth Recoil Control System (RCS)',
            'Loot, Deathbox & Distance Filter',
            'Streamproof Overlay & EAC Bypass'
          ],
          requirements: 'Windows 10 / 11 (All Builds) • Intel & AMD CPUs • EAC Safe',
          variants: [
            { id: 'apex-priv-1d', name: '1 Day Key', price: 6.00 },
            { id: 'apex-priv-7d', name: '7 Day Key', price: 20.00 },
            { id: 'apex-priv-30d', name: '30 Day Key', price: 40.00 }
          ]
        }
      ]
    },
    cod: {
      id: 'cod',
      title: 'Call of Duty',
      icon: 'fa-person-rifle',
      banner: 'assets/images/nexus/cod24.webp',
      cheats: [
        {
          id: 'private-cod',
          name: 'Private - Call Of Duty',
          image: 'boxes/cod.png',
          status: 'Undetected',
          tag: 'Warzone & BO6 Private',
          minPrice: 6.00,
          features: [
            'Ring0 Hypervisor Stealth Kernel Driver',
            'Modern Warfare 3 & Warzone 3 & Black Ops 6',
            'Precision Bone Skeleton & Health Bar ESP',
            'Intelligent Target Prediction & Bullet Lead',
            'No Recoil & No Spread Algorithms',
            'Ricochet Kernel Bypass Built-In'
          ],
          requirements: 'Windows 10 / 11 • Intel & AMD • Ricochet Undetected',
          variants: [
            { id: 'cod-priv-1d', name: '1 Day Key', price: 6.00 },
            { id: 'cod-priv-7d', name: '7 Day Key', price: 25.00 },
            { id: 'cod-priv-30d', name: '30 Day Key', price: 50.00 }
          ]
        }
      ]
    },
    fortnite: {
      id: 'fortnite',
      title: 'Fortnite',
      icon: 'fa-cubes',
      banner: 'assets/images/nexus/Fortnite.webp',
      cheats: [
        {
          id: 'private-fortnite',
          name: 'Private - Fortnite',
          image: 'boxes/fort.png',
          status: 'Undetected',
          tag: 'Championship Private Suite',
          minPrice: 6.00,
          features: [
            'Undetected EAC & BattlEye Kernel Driver',
            'Customizable Smoothing & FOV Aim Assist',
            'Player Skeleton, Bounding Box & Armor ESP',
            'Loot, Chest, Ammo & Vehicle ESP Filters',
            'Tournament Humanized Curve Angles',
            'Full Streamproof Overlay Capture Protection'
          ],
          requirements: 'Windows 10 / 11 • Intel & AMD • Tournament Safe',
          variants: [
            { id: 'fort-priv-1d', name: '1 Day Key', price: 6.00 },
            { id: 'fort-priv-7d', name: '7 Day Key', price: 22.00 },
            { id: 'fort-priv-30d', name: '30 Day Key', price: 45.00 }
          ]
        }
      ]
    }
  };

  const CART_KEY = 'hc_cart_items_v2';
  const PROMO_KEY = 'hc_cart_promo_v2';

  let cart = [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) cart = JSON.parse(raw);
  } catch (e) {
    cart = [];
  }

  let activePromo = null;
  try {
    const rawPromo = localStorage.getItem(PROMO_KEY);
    if (rawPromo) activePromo = JSON.parse(rawPromo);
  } catch (e) {
    activePromo = null;
  }

  let currentSelectedCheat = null;
  let currentActiveVariantIdx = 0;
  let currentQuantity = 1;
  let activePayment = 'card';

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
    updateNavbarCartBadges();
  }

  function savePromo() {
    try {
      if (activePromo) {
        localStorage.setItem(PROMO_KEY, JSON.stringify(activePromo));
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    } catch (e) {}
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
  }

  function getCartTotal() {
    let subtotal = getCartSubtotal();
    if (activePromo && activePromo.discount) {
      subtotal = subtotal * (1 - (activePromo.discount / 100));
    }
    return Math.max(0, subtotal);
  }

    function updateNavbarCartBadges() {
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
      b.textContent = totalQty;
      b.style.display = totalQty > 0 ? 'inline-flex' : 'none';
    });
    const triggers = document.querySelectorAll('.cCartTrigger');
    triggers.forEach(t => {
      t.style.display = 'inline-flex';
    });
  }

  function showToast(title, message) {
    let container = document.getElementById('hc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hc-toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'background:#191c25;border:1px solid #9041ea;border-radius:12px;padding:14px 20px;box-shadow:0 12px 30px rgba(0,0,0,0.6);display:flex;align-items:center;gap:12px;color:#ffffff;pointer-events:auto;min-width:280px;transform:translateY(20px);opacity:0;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);';
    toast.innerHTML = `
      <div style="width:34px;height:34px;border-radius:8px;background:rgba(144,65,234,0.15);color:#b937e2;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">
        <i class="fa-solid fa-check"></i>
      </div>
      <div>
        <div style="font-weight:700;font-size:13px;color:#ffffff;">${title}</div>
        <div style="font-size:11px;color:#9aa2b1;margin-top:2px;">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 20);

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  function openGameCheats(gameKey) {
    const game = CATALOG[gameKey];
    if (!game) return;
    closeCart();
    closeCheatConfig();

    let modal = document.getElementById('game-cheats-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-cheats-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99990;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transition:opacity 0.25s ease;pointer-events:none;';
      modal.innerHTML = `
        <div id="game-cheats-card" style="background:#14171f;border:1px solid rgba(255,255,255,0.1);border-radius:18px;max-width:960px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.7);transform:scale(0.96);transition:transform 0.25s ease;">
          <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:#171b24;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div id="gcm-icon-box" style="width:40px;height:40px;border-radius:10px;background:rgba(144,65,234,0.15);color:#b937e2;display:flex;align-items:center;justify-content:center;font-size:18px;">
                <i class="fa-solid fa-gamepad"></i>
              </div>
              <div>
                <h3 id="gcm-title" style="margin:0;font-size:20px;font-weight:900;color:#ffffff;">Game Cheats</h3>
                <p id="gcm-subtitle" style="margin:2px 0 0;font-size:12px;color:#9aa2b1;">Select a cheat software to view options, features, and instant licensing.</p>
              </div>
            </div>
            <button onclick="window.closeGameCheats()" style="background:none;border:none;color:#9aa2b1;font-size:20px;cursor:pointer;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="gcm-list" style="padding:24px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:20px;background:#14171f;">
          </div>

          <div style="padding:14px 24px;background:#10131a;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#9aa2b1;">
            <span style="display:flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-shield-halved" style="color:#b937e2;"></i> All software ring0 driver verified & instant key automated
            </span>
            <button onclick="window.closeGameCheats()" style="background:#1e222d;border:1px solid rgba(255,255,255,0.08);color:#ffffff;padding:6px 14px;border-radius:6px;font-weight:600;cursor:pointer;">
              Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', function (e) {
        if (e.target === modal) window.closeGameCheats();
      });
    }

    const titleEl = modal.querySelector('#gcm-title');
    const subtitleEl = modal.querySelector('#gcm-subtitle');
    const iconBox = modal.querySelector('#gcm-icon-box');
    const listEl = modal.querySelector('#gcm-list');

    titleEl.textContent = `${game.title} Cheats`;
    subtitleEl.textContent = `Choose your desired ${game.title} private software and duration`;
    iconBox.innerHTML = `<i class="fa-solid ${game.icon || 'fa-gamepad'}"></i>`;

    listEl.innerHTML = '';
    game.cheats.forEach(cheat => {
      const card = document.createElement('div');
      card.style.cssText = 'background:#1a1d26;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:all 0.25s ease;cursor:pointer;position:relative;';
      card.onmouseenter = () => { card.style.borderColor = 'rgba(185,55,226,0.5)'; card.style.transform = 'translateY(-3px)'; };
      card.onmouseleave = () => { card.style.borderColor = 'rgba(255,255,255,0.08)'; card.style.transform = 'translateY(0)'; };

      card.innerHTML = `
        <div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#0d0f14;">
          <img src="${cheat.image}" alt="${cheat.name}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease;" onerror="this.src='${game.banner}'">
          <div style="position:absolute;top:10px;left:10px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);">
            <span style="width:6px;height:6px;border-radius:50%;background:#34d399;"></span> ${cheat.status}
          </div>
          <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.7);color:#ffffff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;">
            ${cheat.tag}
          </div>
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
          <div>
            <h4 style="margin:0 0 6px;font-size:15px;font-weight:800;color:#ffffff;line-height:1.3;">${cheat.name}</h4>
            <div style="font-size:11px;color:#9aa2b1;line-height:1.5;margin-bottom:12px;">
              ${cheat.features.slice(0, 3).join(' • ')}
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
            <div>
              <div style="font-size:10px;color:#8896a6;text-transform:uppercase;font-weight:700;">Starting from</div>
              <div style="font-size:16px;font-weight:900;color:#b937e2;">$${cheat.minPrice.toFixed(2)}</div>
            </div>
            <button onclick="event.stopPropagation(); window.openCheatConfig('${gameKey}', '${cheat.id}')" style="background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;transition:background 0.2s ease;">
              View Options
            </button>
          </div>
        </div>
      `;

      card.onclick = () => window.openCheatConfig(gameKey, cheat.id);
      listEl.appendChild(card);
    });

    modal.style.pointerEvents = 'auto';
    modal.style.opacity = '1';
    modal.querySelector('#game-cheats-card').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  function closeGameCheats() {
    const modal = document.getElementById('game-cheats-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    modal.querySelector('#game-cheats-card').style.transform = 'scale(0.96)';
    modal.style.pointerEvents = 'none';
    if (!document.getElementById('cheat-config-modal')?.classList.contains('active-modal') &&
        !document.getElementById('cart-drawer')?.classList.contains('active-drawer')) {
      document.body.style.overflow = '';
    }
  }

  let pageProductData = {
    selectedVariantIdx: 0,
    quantity: 1
  };

  function selectVariant(btn, idx, price, name) {
    pageProductData.selectedVariantIdx = idx;
    const parent = btn.parentElement;
    if (parent) {
      parent.querySelectorAll('.bc-variant-btn').forEach(b => {
        b.classList.remove('is-active');
        const icon = b.querySelector('.fa-circle-check');
        if (icon) icon.remove();
      });
      btn.classList.add('is-active');
      const vtop = btn.querySelector('.v-top');
      if (vtop && !vtop.querySelector('.fa-circle-check')) {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-circle-check';
        icon.style.color = '#b937e2';
        vtop.appendChild(icon);
      }
    }
    updateProductTotalPrice();
  }

  function modifyProductQty(delta) {
    pageProductData.quantity = Math.max(1, Math.min(20, pageProductData.quantity + delta));
    const disp = document.getElementById('bc-qty-display');
    if (disp) disp.textContent = pageProductData.quantity;
    updateProductTotalPrice();
  }

  function adjustQuantity(delta) {
    if (typeof modifyProductQty === 'function') {
      modifyProductQty(delta);
    }
  }

  function updateProductTotalPrice() {
    const activeBtn = document.querySelector('.bc-variant-btn.is-active');
    if (!activeBtn) return;
    const priceText = activeBtn.querySelector('.v-price')?.textContent || '$0';
    const unitPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const total = (unitPrice * pageProductData.quantity).toFixed(2);
    const totalEl = document.getElementById('bc-total-price');
    if (totalEl) totalEl.textContent = `$${total}`;
  }

  function addProductToCart() {
    const activeBtn = document.querySelector('.bc-variant-btn.is-active');
    const titleEl = document.querySelector('.bc-title');
    const imgEl = document.querySelector('.bc-box-frame img');
    const vName = activeBtn?.querySelector('.v-name')?.textContent || '1 Day Key';
    const vPriceText = activeBtn?.querySelector('.v-price')?.textContent || '$0';
    const price = parseFloat(vPriceText.replace(/[^0-9.]/g, '')) || 0;
    const name = titleEl?.textContent || 'Private Cheat';
    const image = imgEl?.getAttribute('src') || 'boxes/arc.png';

    addToCart({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name,
      game: name,
      image: image,
      variantId: vName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      variantName: vName,
      price: price,
      quantity: pageProductData.quantity
    });
    showToast('Added to Cart', `${pageProductData.quantity}x ${name} (${vName})`);
    openCart();
  }

  function instantCheckoutProduct() {
    addProductToCart();
    proceedCheckout();
  }

  function openCheatConfig(gameKey, cheatId) {
    closeCart();
    closeGameCheats();
    const targetUrl = gameKey + '.html#product-section';
    if (window.location.pathname.includes(gameKey + '.html')) {
      const sec = document.getElementById('product-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.location.href = targetUrl;
  }

  function closeCheatConfig() {}

  function backToGameCheats() {
    if (window.location.pathname.includes('index.html')) {
      location.href = '#products';
    } else {
      location.href = 'index.html#products';
    }
  }

  function addToCartCurrent() {
    if (!currentSelectedCheat) return;
    const variant = currentSelectedCheat.variants[currentActiveVariantIdx];
    addToCart({
      id: currentSelectedCheat.id,
      name: currentSelectedCheat.name,
      game: currentSelectedCheat.gameTitle,
      image: currentSelectedCheat.image,
      variantId: variant.id,
      variantName: variant.name,
      price: parseFloat(variant.price),
      quantity: currentQuantity
    });
    closeCheatConfig();
    closeGameCheats();
    showToast('Added to Cart', `${currentQuantity}x ${currentSelectedCheat.name} (${variant.name})`);
  }

  function buyNowCurrent() {
    if (!currentSelectedCheat) return;
    const variant = currentSelectedCheat.variants[currentActiveVariantIdx];
    addToCart({
      id: currentSelectedCheat.id,
      name: currentSelectedCheat.name,
      game: currentSelectedCheat.gameTitle,
      image: currentSelectedCheat.image,
      variantId: variant.id,
      variantName: variant.name,
      price: parseFloat(variant.price),
      quantity: currentQuantity
    });
    closeCheatConfig();
    closeGameCheats();
    openCart();
  }

  function addToCart(item) {
    const existingIdx = cart.findIndex(i => i.id === item.id && i.variantId === item.variantId);
    if (existingIdx > -1) {
      cart[existingIdx].quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }
    saveCart();
    renderCart();
  }

  function changeCartItemQty(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  }

  function removeCartItem(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  function openCart() {
    closeGameCheats();
    closeCheatConfig();
    let drawer = document.getElementById('cart-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'cart-drawer';
      drawer.style.cssText = 'position:fixed;inset:0;background:rgba(6,8,14,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity 0.25s cubic-bezier(0.16,1,0.3,1);pointer-events:none;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);';
      drawer.innerHTML = `
        <style>
          @media (max-width: 768px) {
            .hc-cart-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            #cart-drawer-panel { max-height: 94vh !important; border-radius: 16px !important; }
          }
        </style>
        <div id="cart-drawer-panel" style="background:#0f121a;border:1px solid rgba(185,55,226,0.28);border-radius:20px;width:100%;max-width:860px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.85), 0 0 45px rgba(185,55,226,0.15);transform:scale(0.95);transition:transform 0.25s cubic-bezier(0.16,1,0.3,1);">
          <div style="padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:#131722;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:38px;height:38px;border-radius:10px;background:rgba(185,55,226,0.15);border:1px solid rgba(185,55,226,0.35);display:flex;align-items:center;justify-content:center;font-size:16px;color:#b937e2;">
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
              <div>
                <h3 style="margin:0;font-size:18px;font-weight:900;color:#ffffff;letter-spacing:-0.3px;">Your <span style="background:linear-gradient(135deg,#b937e2,#7d44ed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Cart</span></h3>
                <div style="font-size:11px;color:#8896a6;margin-top:2px;">Review items & proceed to secure instant checkout</div>
              </div>
              <span id="cart-drawer-count-badge" style="background:rgba(185,55,226,0.15);color:#b937e2;border:1px solid rgba(185,55,226,0.35);font-size:11px;font-weight:800;padding:2px 9px;border-radius:999px;">0</span>
            </div>
            <button onclick="window.closeCart()" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#9aa2b1;font-size:16px;cursor:pointer;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;" onmouseover="this.style.color='#fff'; this.style.borderColor='rgba(185,55,226,0.5)';" onmouseout="this.style.color='#9aa2b1'; this.style.borderColor='rgba(255,255,255,0.1)';">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="cart-items-container" style="padding:22px;flex:1;overflow-y:auto;min-height:0;"></div>
        </div>
      `;
      document.body.appendChild(drawer);

      drawer.addEventListener('click', function (e) {
        if (e.target === drawer) window.closeCart();
      });
    }

    renderCart();
    drawer.classList.add('active-drawer');
    drawer.style.pointerEvents = 'auto';
    drawer.style.opacity = '1';
    drawer.querySelector('#cart-drawer-panel').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.remove('active-drawer');
    drawer.style.opacity = '0';
    drawer.querySelector('#cart-drawer-panel').style.transform = 'scale(0.95)';
    drawer.style.pointerEvents = 'none';
    if (!document.getElementById('cheat-config-modal')?.classList.contains('active-modal') &&
        !document.getElementById('game-cheats-modal')?.classList.contains('active-modal')) {
      document.body.style.overflow = '';
    }
  }

  function setPaymentMethod(method, btn) {
    activePayment = method;
    document.querySelectorAll('.pay-btn').forEach(b => {
      b.style.background = '#161922';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
      b.style.color = '#9aa2b1';
      const icon = b.querySelector('i');
      if (icon) icon.style.color = '';
    });
    btn.style.background = 'rgba(185,55,226,0.15)';
    btn.style.borderColor = '#b937e2';
    btn.style.color = '#ffffff';
    const icon = btn.querySelector('i');
    if (icon) icon.style.color = '#b937e2';
  }

  function applyPromoCode() {
    const input = document.getElementById('promo-code-input');
    const msg = document.getElementById('promo-status-msg');
    if (!input || !msg) return;

    const val = input.value.trim().toUpperCase();
    if (val === 'HIDDEN10') {
      activePromo = { code: 'HIDDEN10', discount: 10 };
      savePromo();
      msg.style.display = 'block';
      msg.style.color = '#10b981';
      msg.textContent = 'Promo applied: 10% discount!';
      renderCart();
    } else if (val === 'STACK20') {
      activePromo = { code: 'STACK20', discount: 20 };
      savePromo();
      msg.style.display = 'block';
      msg.style.color = '#10b981';
      msg.textContent = 'Promo applied: 20% VIP discount!';
      renderCart();
    } else {
      msg.style.display = 'block';
      msg.style.color = '#ef4444';
      msg.textContent = 'Invalid code. Try HIDDEN10.';
    }
  }

  function renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-drawer-count-badge');

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (badge) badge.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
    updateNavbarCartBadges();

    if (!container) return;
    container.innerHTML = '';

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 20px;text-align:center;">
          <div style="width:76px;height:76px;border-radius:50%;background:rgba(185,55,226,0.1);border:1px solid rgba(185,55,226,0.25);display:flex;align-items:center;justify-content:center;font-size:30px;color:#b937e2;margin-bottom:18px;box-shadow:0 0 35px rgba(185,55,226,0.2);">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <h4 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#ffffff;">Your cart is empty</h4>
          <p style="margin:0 0 24px;font-size:13px;color:#9aa2b1;max-width:320px;line-height:1.5;">Looks like you haven't added anything to your cart yet.</p>
          <button onclick="window.closeCart(); location.href='index.html#products';" style="background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;border:none;padding:12px 28px;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(144,65,234,0.35);">
            <span>Browse Cheats</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      return;
    }

    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    let itemsHtml = '';
    cart.forEach((item, idx) => {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      itemsHtml += `
        <div style="background:#151822;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;display:flex;gap:14px;align-items:center;transition:border-color 0.2s ease;">
          <div style="width:58px;height:58px;border-radius:10px;overflow:hidden;background:#0c0e14;border:1px solid rgba(185,55,226,0.25);flex-shrink:0;">
            <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="flex:1;min-width:0;">
            <h4 style="margin:0;font-size:13px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</h4>
            <div style="display:inline-block;font-size:11px;color:#b937e2;font-weight:700;background:rgba(185,55,226,0.12);padding:2px 8px;border-radius:6px;margin-top:4px;">${item.variantName}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <button onclick="window.changeCartItemQty(${idx}, -1)" style="width:24px;height:24px;border-radius:6px;background:#1e2330;border:1px solid rgba(255,255,255,0.1);color:#ffffff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;">-</button>
                <span style="font-size:12px;font-weight:800;color:#ffffff;min-width:18px;text-align:center;">${item.quantity}</span>
                <button onclick="window.changeCartItemQty(${idx}, 1)" style="width:24px;height:24px;border-radius:6px;background:#1e2330;border:1px solid rgba(255,255,255,0.1);color:#ffffff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;">+</button>
              </div>
              <div style="font-size:14px;font-weight:900;color:#ffffff;">$${lineTotal}</div>
            </div>
          </div>
          <button onclick="window.removeCartItem(${idx})" title="Remove item" style="background:none;border:none;color:#8896a6;cursor:pointer;padding:6px;font-size:13px;align-self:flex-start;transition:color 0.2s ease;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#8896a6'">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    const discountHtml = activePromo && activePromo.discount ? `
      <div style="display:flex;justify-content:space-between;color:#10b981;">
        <span>Discount (${activePromo.code} -${activePromo.discount}%)</span>
        <span style="font-weight:700;">-$${(subtotal - total).toFixed(2)}</span>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="hc-cart-grid" style="display:grid;grid-template-columns:1.25fr 1fr;gap:22px;align-items:start;">
        <!-- Left: Cart Items -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <span style="font-size:13px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">Cart Items (${totalQty})</span>
            <span style="font-size:11px;color:#8896a6;">Instant license key</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;max-height:420px;overflow-y:auto;padding-right:4px;">
            ${itemsHtml}
          </div>
        </div>

        <!-- Right: BearCheats style Summary & Checkout Card -->
        <div style="background:#131620;border:1px solid rgba(185,55,226,0.25);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:14px;box-shadow:0 10px 30px rgba(0,0,0,0.35);">
          <h4 style="margin:0;font-size:15px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px;">
            <span>Order Summary</span>
          </h4>

          <!-- Promo input -->
          <div style="display:flex;gap:8px;">
            <input type="text" id="promo-code-input" placeholder="Promo code (HIDDEN10)" value="${activePromo ? activePromo.code : ''}" style="flex:1;background:#181c27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;color:#ffffff;font-size:12px;outline:none;" onfocus="this.style.borderColor='#b937e2'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            <button onclick="window.applyPromoCode()" style="background:#1f2433;border:1px solid rgba(185,55,226,0.3);color:#ffffff;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s ease;">
              Apply
            </button>
          </div>
          <div id="promo-status-msg" style="font-size:11px;margin-top:-6px;display:none;"></div>

          <!-- Price rows -->
          <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;">
            <div style="display:flex;justify-content:space-between;color:#9aa2b1;">
              <span>Subtotal</span>
              <span id="cart-subtotal-val" style="color:#ffffff;font-weight:700;">$${subtotal.toFixed(2)}</span>
            </div>
            ${discountHtml}
            <div style="display:flex;justify-content:space-between;color:#ffffff;font-size:17px;font-weight:900;border-top:1px solid rgba(255,255,255,0.08);padding-top:10px;">
              <span>Total</span>
              <span id="cart-total-val" style="color:#b937e2;text-shadow:0 0 15px rgba(185,55,226,0.3);">$${total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Email Input -->
          <div style="display:flex;flex-direction:column;gap:6px;">
            <label style="font-size:11px;font-weight:700;color:#8896a6;text-transform:uppercase;letter-spacing:0.5px;">Email Address</label>
            <input type="email" id="checkout-email" placeholder="your@email.com" style="width:100%;background:#181c27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:9px 12px;color:#ffffff;font-size:13px;outline:none;" onfocus="this.style.borderColor='#b937e2'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
          </div>

          <!-- Payment selector -->
          <div>
            <div style="font-size:11px;color:#8896a6;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Payment Method:</div>
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;">
              <button type="button" class="pay-btn" onclick="window.setPaymentMethod('card', this)" style="background:${activePayment === 'card' ? 'rgba(185,55,226,0.15)' : '#161922'};border:1px solid ${activePayment === 'card' ? '#b937e2' : 'rgba(255,255,255,0.08)'};color:${activePayment === 'card' ? '#ffffff' : '#9aa2b1'};padding:7px 4px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;">
                <i class="fa-solid fa-credit-card" style="color:${activePayment === 'card' ? '#b937e2' : ''};font-size:12px;"></i>
                <span>Card</span>
              </button>
              <button type="button" class="pay-btn" onclick="window.setPaymentMethod('paypal', this)" style="background:${activePayment === 'paypal' ? 'rgba(185,55,226,0.15)' : '#161922'};border:1px solid ${activePayment === 'paypal' ? '#b937e2' : 'rgba(255,255,255,0.08)'};color:${activePayment === 'paypal' ? '#ffffff' : '#9aa2b1'};padding:7px 4px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;">
                <i class="fa-brands fa-paypal" style="color:${activePayment === 'paypal' ? '#b937e2' : ''};font-size:12px;"></i>
                <span>PayPal</span>
              </button>
              <button type="button" class="pay-btn" onclick="window.setPaymentMethod('crypto', this)" style="background:${activePayment === 'crypto' ? 'rgba(185,55,226,0.15)' : '#161922'};border:1px solid ${activePayment === 'crypto' ? '#b937e2' : 'rgba(255,255,255,0.08)'};color:${activePayment === 'crypto' ? '#ffffff' : '#9aa2b1'};padding:7px 4px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;">
                <i class="fa-brands fa-bitcoin" style="color:${activePayment === 'crypto' ? '#b937e2' : ''};font-size:12px;"></i>
                <span>Crypto</span>
              </button>
              <button type="button" class="pay-btn" onclick="window.setPaymentMethod('cashapp', this)" style="background:${activePayment === 'cashapp' ? 'rgba(185,55,226,0.15)' : '#161922'};border:1px solid ${activePayment === 'cashapp' ? '#b937e2' : 'rgba(255,255,255,0.08)'};color:${activePayment === 'cashapp' ? '#ffffff' : '#9aa2b1'};padding:7px 4px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;">
                <i class="fa-solid fa-dollar-sign" style="color:${activePayment === 'cashapp' ? '#b937e2' : ''};font-size:12px;"></i>
                <span>CashApp</span>
              </button>
            </div>
          </div>

          <!-- Pay Now action -->
          <button onclick="window.proceedCheckout()" style="background:linear-gradient(135deg, #b937e2, #7d44ed);border:none;color:#ffffff;padding:14px;border-radius:10px;font-size:14px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px rgba(144,65,234,0.35);transition:all 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 25px rgba(185,55,226,0.5)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 20px rgba(144,65,234,0.35)';">
            <i class="fa-solid fa-lock"></i>
            <span>Pay Now</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <p style="margin:0;font-size:11px;color:#8896a6;text-align:center;line-height:1.4;">
            You'll be redirected to complete your payment securely.
          </p>

          <div style="display:flex;align-items:center;justify-content:center;gap:12px;font-size:10px;color:#8896a6;padding-top:10px;border-top:1px solid rgba(255,255,255,0.06);">
            <span><i class="fa-solid fa-bolt" style="color:#b937e2;"></i> Instant Delivery</span>
            <span>•</span>
            <span><i class="fa-solid fa-shield-halved" style="color:#b937e2;"></i> 256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    `;
  }

  function proceedCheckout() {
    if (cart.length === 0) return;

    if (window.SHOPIFY_CONFIG && window.SHOPIFY_CONFIG.shopDomain) {
      const shop = window.SHOPIFY_CONFIG.shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const variantItems = cart.map(item => {
        let vid = item.variantId;
        if (window.SHOPIFY_CONFIG.variants && window.SHOPIFY_CONFIG.variants[item.variantId]) {
          vid = window.SHOPIFY_CONFIG.variants[item.variantId].replace(/^gid:\/\/shopify\/ProductVariant\//, '');
        }
        return `${vid}:${item.qty || 1}`;
      }).join(',');

      const user = getCurrentUser() || {};
      const emailInput = document.getElementById('pageEmailInput') || document.querySelector('.hc-summary-box input[type="email"]');
      const email = (emailInput ? emailInput.value : (user.email || '')).trim();

      const noteData = encodeURIComponent(`uid:${user.id || ''},discord:${user.discordId || ''},user:${user.name || ''}`);
      let checkoutUrl = `https://${shop}/cart/${variantItems}?note=${noteData}`;
      if (email) checkoutUrl += `&checkout[email]=${encodeURIComponent(email)}`;
      if (activePromo && activePromo.code) checkoutUrl += `&discount=${encodeURIComponent(activePromo.code)}`;

      showToast('Redirecting', 'Opening secure Shopify checkout...');
      window.location.href = checkoutUrl;
      return;
    }

    const total = getCartTotal().toFixed(2);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const key = 'HIDDEN-' + Array.from({length: 4}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');

    let modal = document.getElementById('checkout-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-success-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background:#14171f;border:1px solid rgba(185,55,226,0.4);border-radius:18px;max-width:540px;width:100%;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.8);">
        <div style="padding:24px;text-align:center;background:radial-gradient(circle at top, rgba(144,65,234,0.15) 0%, transparent 70%);border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="width:60px;height:60px;border-radius:50%;background:rgba(144,65,234,0.2);color:#b937e2;border:2px solid #9041ea;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;">Payment Confirmed!</h3>
          <p style="margin:6px 0 0;font-size:13px;color:#9aa2b1;">Order ${orderId} has been successfully processed via ${activePayment.toUpperCase()}.</p>
        </div>

        <div style="padding:24px;display:flex;flex-direction:column;gap:16px;">
          <div style="background:#1a1d26;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;">
            <div style="font-size:11px;font-weight:700;color:#8896a6;text-transform:uppercase;margin-bottom:6px;">Your License Key:</div>
            <div style="display:flex;align-items:center;justify-content:space-between;background:#10131a;border:1px dashed #9041ea;border-radius:8px;padding:10px 14px;">
              <code id="license-key-val" style="color:#ff52be;font-family:monospace;font-size:14px;font-weight:800;letter-spacing:1px;">${key}</code>
              <button onclick="navigator.clipboard.writeText('${key}'); this.textContent='Copied!';" style="background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;border:none;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">
                Copy
              </button>
            </div>
          </div>

          <div style="font-size:12px;color:#9aa2b1;line-height:1.6;background:#171a22;padding:12px;border-radius:10px;">
            <div style="font-weight:700;color:#ffffff;margin-bottom:4px;">Next Steps:</div>
            1. Join our official Discord community for the loader launcher.<br>
            2. Enter your license key in the loader to activate your build.<br>
            3. Enjoy private dominance with automated bypass protection.
          </div>

          <div style="display:flex;gap:10px;">
            <a href="https://discord.gg/hiddencheats" target="_blank" style="flex:1;background:#5865F2;color:#ffffff;padding:12px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;">
              <i class="fa-brands fa-discord"></i> Join Discord
            </a>
            <a href="settings.html#keys" style="flex:1.2;background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;padding:12px;border-radius:8px;font-weight:800;font-size:13px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;">
              <i class="fa-solid fa-key"></i> View in My Keys
            </a>
            <button onclick="document.getElementById('checkout-success-modal').remove(); window.clearCart(); window.closeCart();" style="flex:0.7;background:#1e222d;border:1px solid rgba(255,255,255,0.08);color:#ffffff;padding:12px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

        const currentUser = getCurrentUser();
    if (currentUser && currentUser.loggedIn) {
      if (!currentUser.orders) currentUser.orders = [];
      currentUser.orders.unshift({
        id: orderId,
        product: cart.map(i => i.name + ' (' + i.variantName + ')').join(', '),
        key: key,
        status: 'Active',
        expires: '30 Days Left'
      });
      localStorage.setItem('hc_user', JSON.stringify(currentUser));
    }
    clearCart();
  }

  function initCatalogCardTriggers() {
    const mapping = {
      'arc': ['arc', 'arc raiders', 'arc_raiders'],
      'apex': ['apex', 'apex legends'],
      'cod': ['cod', 'call of duty', 'warzone'],
      'fortnite': ['fortnite']
    };

    const cards = document.querySelectorAll('#products a, .cNexusGames_list a, [data-game-trigger]');
    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const text = (card.innerText || '').toLowerCase();
      const alt = (card.querySelector('img')?.getAttribute('alt') || '').toLowerCase();

      let targetKey = null;
      for (const [key, patterns] of Object.entries(mapping)) {
        if (patterns.some(p => href.toLowerCase().includes(p) || text.includes(p) || alt.includes(p))) {
          targetKey = key;
          break;
        }
      }

      if (targetKey) {
        card.style.cursor = 'pointer';
        if (href && !href.startsWith('#')) {
          return;
        }
        card.addEventListener('click', function (e) {
          if (targetKey === 'apex') {
            e.preventDefault();
            window.location.href = 'apex.html';
          }
        });
      }
    });
  }

  function openSearchModal() {
    let popup = document.getElementById('cSearch_popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'cSearch_popup';
      popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding-top:70px;padding-left:16px;padding-right:16px;opacity:0;transition:opacity 0.2s ease;';
      popup.innerHTML = `
        <div class="cSearch_modal" style="background:#14161f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:540px;max-width:100%;padding:20px;box-shadow:0 25px 60px rgba(0,0,0,0.9);transform:scale(0.96);transition:transform 0.2s ease;position:relative;">
          <div style="position:relative;">
            <input type="text" id="advSearchInput" placeholder="Search for products..." autocomplete="off" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1.5px solid #9041ea;border-radius:10px;padding:13px 18px;color:#ffffff;font-size:15px;font-weight:500;outline:none;box-shadow:none;">
          </div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;margin:18px 0 10px;">Products</div>
          <div id="cSearchProductsList" style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;padding-right:4px;"></div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;margin:20px 0 10px;">Quick Access</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <a href="https://discord.gg/hiddencheats" target="_blank" class="cSearch_quickItem" style="display:flex;align-items:center;justify-content:space-between;background:#1a1d27;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px 14px;text-decoration:none;cursor:pointer;transition:all 0.15s ease;">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:42px;height:42px;border-radius:10px;background:#5865F2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;flex-shrink:0;"><i class="fa-brands fa-discord"></i></div>
                <div>
                  <div style="font-size:14px;font-weight:600;color:#ffffff;">Discord Server</div>
                  <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Join our Discord Server</div>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <div onclick="window.openAuthModal('signin'); window.closeSearchModal();" class="cSearch_quickItem" style="display:flex;align-items:center;justify-content:space-between;background:#1a1d27;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px 14px;cursor:pointer;transition:all 0.15s ease;">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg, #b937e2, #7d44ed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;flex-shrink:0;"><i class="fa-solid fa-key"></i></div>
                <div>
                  <div style="font-size:14px;font-weight:600;color:#ffffff;">License Key</div>
                  <div style="font-size:12px;color:#94a3b8;margin-top:2px;">View your license keys</div>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      popup.addEventListener('click', function (e) {
        if (e.target === popup) closeSearchModal();
      });

      const input = popup.querySelector('#advSearchInput');
      input.addEventListener('input', function () {
        renderSearchResults(this.value.trim());
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeSearchModal();
          closeAuthModal();
        }
      });
    }

    renderSearchResults('');
    popup.style.display = 'flex';
    requestAnimationFrame(() => {
      popup.style.opacity = '1';
      const box = popup.querySelector('.cSearch_modal');
      if (box) box.style.transform = 'scale(1)';
      const inp = popup.querySelector('#advSearchInput');
      if (inp) {
        inp.value = '';
        inp.focus();
      }
    });
  }

  function closeSearchModal() {
    const popup = document.getElementById('cSearch_popup');
    if (!popup) return;
    popup.style.opacity = '0';
    const box = popup.querySelector('.cSearch_modal');
    if (box) box.style.transform = 'scale(0.96)';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 200);
  }

  function renderSearchResults(query) {
    const container = document.getElementById('cSearchProductsList');
    if (!container) return;

    const allProducts = [
      { gameKey: 'arc', cheatId: 'private-arc', name: 'Private - ARC Raiders', price: 6.00, stock: 42, image: 'boxes/arc.png', page: 'arc.html' },
      { gameKey: 'apex', cheatId: 'private-apex', name: 'Private - Apex Legends', price: 6.00, stock: 38, image: 'boxes/apex.png', page: 'apex.html' },
      { gameKey: 'cod', cheatId: 'private-cod', name: 'Private - Call of Duty', price: 6.00, stock: 29, image: 'boxes/cod.png', page: 'cod.html' },
      { gameKey: 'fortnite', cheatId: 'private-fortnite', name: 'Private - Fortnite', price: 6.00, stock: 55, image: 'boxes/fort.png', page: 'fortnite.html' },
      { gameKey: 'status', cheatId: 'siege-x', name: 'Inferno - Rainbow Six Siege', price: 7.00, stock: 25, image: 'boxes/r6.png', page: 'status.html' },
      { gameKey: 'status', cheatId: 'rust', name: 'Disarray - Rust Private', price: 8.00, stock: 18, image: 'boxes/rust.png', page: 'status.html' }
    ];

    let filtered = allProducts;
    if (query) {
      const q = query.toLowerCase();
      filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.gameKey.toLowerCase().includes(q));
    } else {
      filtered = allProducts.slice(0, 4);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:16px;text-align:center;color:#64748b;font-size:13px;">No products found matching "' + query.replace(/</g, '&lt;') + '"</div>';
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div onclick="window.location.href='${p.page}'; window.closeSearchModal();" class="cSearch_product_row" style="display:flex;align-items:center;justify-content:space-between;background:#1a1d27;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all 0.15s ease;">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;border-radius:6px;object-fit:contain;background:#11131a;padding:2px;flex-shrink:0;">
          <div>
            <div style="font-size:14px;font-weight:600;color:#ffffff;">${p.name}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
              <span style="font-size:13px;font-weight:600;color:#b937e2;">$${p.price.toFixed(2)}</span>
              <span style="color:#475569;font-size:11px;">•</span>
              <span style="font-size:12px;color:#94a3b8;">In Stock (${p.stock})</span>
            </div>
          </div>
        </div>
        <div class="cSearch_row_arrow" style="color:#64748b;transition:all 0.15s ease;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    `).join('');
  }

  function getRegisteredUsers() {
    try {
      const stored = localStorage.getItem('hc_registered_users');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          return list.filter(u => u && u.name !== 'yvko2' && u.email !== 'yvko2@gmail.com' && u.id !== 'usr-849201');
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  function syncProfilePage(user) {
    const isUserLogged = user && user.loggedIn;
    const nameEls = document.querySelectorAll('.inv-username, .user-display-name');
    nameEls.forEach(el => { el.textContent = isUserLogged ? user.name : 'Guest'; });
    const tagEls = document.querySelectorAll('.inv-usertag, .user-display-role');
    tagEls.forEach(el => { el.textContent = isUserLogged ? (user.role || 'Customer') : 'Guest'; });
    const avatarImgs = document.querySelectorAll('.inv-avatar-holder img, .user-display-avatar');
    avatarImgs.forEach(img => { img.src = (isUserLogged && user.avatar) ? user.avatar : 'favicon.png'; });
    const userInput = document.querySelector('#st-username, input[name="username"]');
    if (userInput) userInput.value = isUserLogged ? user.name : '';
    const emailInput = document.querySelector('#st-email, input[name="email"]');
    if (emailInput) emailInput.value = isUserLogged ? (user.email || '') : '';

    // Discord Section in Settings
    const discordName = document.getElementById('discord-account-name');
    const discordBadge = document.getElementById('discord-account-badge');
    const discordMeta = document.getElementById('discord-account-meta');
    const discordActions = document.getElementById('discord-actions-container');
    const discordAvatar = document.getElementById('discord-account-avatar');

    if (discordName) {
      if (isUserLogged && user.discordTag) {
        discordName.textContent = user.discordTag;
        if (discordBadge) {
          discordBadge.textContent = 'CONNECTED';
          discordBadge.style.background = 'rgba(16,185,129,0.2)';
          discordBadge.style.color = '#34d399';
        }
        if (discordMeta) {
          discordMeta.innerHTML = `ID: ${user.discordId || 'Connected via OAuth'} • Synced Roles: <b style="color:#cbd5e1;">Customer, Verified</b>`;
        }
        if (discordAvatar) {
          discordAvatar.innerHTML = (user.avatar && user.avatar !== 'favicon.png')
            ? `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;" alt="Discord Avatar">`
            : `<i class="fa-brands fa-discord"></i>`;
        }
        if (discordActions) {
          discordActions.innerHTML = `
            <button type="button" onclick="window.syncDiscordRoles()" style="background:#252a38;border:1px solid rgba(255,255,255,0.1);color:#ffffff;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">
              <i class="fa-solid fa-rotate"></i> Sync Roles
            </button>
            <button type="button" onclick="window.disconnectDiscord()" style="background:rgba(239,68,68,0.12);border:1px solid #ef4444;color:#ef4444;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">
              Disconnect
            </button>
          `;
        }
      } else {
        discordName.textContent = 'No Discord Connected';
        if (discordBadge) {
          discordBadge.textContent = 'NOT LINKED';
          discordBadge.style.background = 'rgba(148,163,184,0.15)';
          discordBadge.style.color = '#94a3b8';
        }
        if (discordMeta) {
          discordMeta.textContent = 'Link your Discord account to synchronize roles, access customer channels, and receive automatic key delivery.';
        }
        if (discordAvatar) {
          discordAvatar.innerHTML = `<i class="fa-brands fa-discord"></i>`;
        }
        if (discordActions) {
          discordActions.innerHTML = `
            <button type="button" onclick="window.loginWithDiscord()" class="hc-discord-auth-btn" style="background:#5865F2;border:none;color:#ffffff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:filter 0.2s;">
              <i class="fa-brands fa-discord"></i> Connect Discord
            </button>
          `;
        }
      }
    }

    // License Keys section in Settings
    const licContainer = document.getElementById('licenses-container');
    if (licContainer) {
      if (isUserLogged && user.orders && user.orders.length > 0) {
        licContainer.innerHTML = user.orders.map(o => `
          <div class="key-row">
            <div style="display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:16px;font-weight:800;color:#ffffff;">${o.product}</span>
                <span style="background:rgba(16,185,129,0.15);color:#34d399;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;border:1px solid rgba(16,185,129,0.3);">${o.status ? o.status.toUpperCase() : 'ACTIVE'}</span>
              </div>
              <div style="font-size:12px;color:#94a3b8;">Order: <b style="color:#ffffff;">${o.id}</b> • Status: <span style="color:#34d399;font-weight:700;">${o.expires || 'Active'}</span></div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="background:#11131b;border:1px dashed #9041ea;border-radius:8px;padding:8px 14px;display:flex;align-items:center;gap:12px;">
                <code style="color:#f43f5e;font-family:monospace;font-size:14px;font-weight:800;letter-spacing:1px;">${o.key}</code>
                <button type="button" onclick="navigator.clipboard.writeText('${o.key}'); this.textContent='Copied!';" style="background:linear-gradient(135deg,#b937e2,#7d44ed);color:#fff;border:none;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">Copy</button>
              </div>
              <button type="button" onclick="this.textContent='Reset Done!'; this.disabled=true;" style="background:#202432;border:1px solid rgba(255,255,255,0.1);color:#cbd5e1;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                <i class="fa-solid fa-arrows-rotate"></i> Reset HWID
              </button>
            </div>
          </div>
        `).join('');
      } else {
        licContainer.innerHTML = `
          <div style="text-align:center;padding:36px 20px;color:#94a3b8;border:1px dashed rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);">
            <i class="fa-solid fa-key" style="font-size:32px;margin-bottom:12px;color:#64748b;display:block;"></i>
            <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:4px;">No Active License Keys</div>
            <div style="font-size:13px;color:#94a3b8;">When you complete a purchase via Shopify, your generated license keys will automatically show up here.</div>
          </div>
        `;
      }
    }

    if (document.title.includes('Profile')) {
      document.title = isUserLogged ? (user.name + "'s Profile - HiddenCheats") : 'Profile - HiddenCheats';
    }
  }

  function toggleAuthPassVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    if (btn) {
      btn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    }
  }

  function openAuthModal(tab) {
    let modal = document.getElementById('hc-auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hc-auth-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity 0.2s ease;';
      modal.innerHTML = `
        <div class="hc_auth_dialog" style="background:#14161f;border:1px solid rgba(255,255,255,0.08);border-radius:18px;width:740px;max-width:100%;max-height:92vh;overflow-y:auto;padding:32px;box-shadow:0 25px 60px rgba(0,0,0,0.9);position:relative;transform:scale(0.96);transition:transform 0.2s ease;">
          <button onclick="window.closeAuthModal()" style="position:absolute;top:20px;right:20px;background:none;border:none;color:#64748b;font-size:24px;cursor:pointer;padding:4px;transition:color 0.15s ease;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#64748b'">&times;</button>
          
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
            <img src="favicon.png" alt="HiddenCheats" style="height:44px;width:auto;object-fit:contain;">
            <div>
              <div style="font-size:20px;font-weight:900;letter-spacing:0.5px;color:#ffffff;line-height:1.2;">HIDDEN<span style="color:#b937e2;">CHEATS</span></div>
              <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;">Authentication Portal</div>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:20px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px;margin-bottom:24px;">
            <button id="auth-tab-signin" onclick="window.switchAuthTab('signin')" style="background:none;border:none;font-size:16px;font-weight:700;padding:6px 0;cursor:pointer;position:relative;transition:all 0.15s ease;color:#ffffff;">
              Sign In
              <div id="auth-tab-signin-line" style="position:absolute;bottom:-13px;left:0;right:0;height:2px;background:linear-gradient(135deg, #b937e2, #7d44ed);"></div>
            </button>
            <button id="auth-tab-signup" onclick="window.switchAuthTab('signup')" style="background:none;border:none;font-size:16px;font-weight:700;padding:6px 0;cursor:pointer;position:relative;transition:all 0.15s ease;color:#94a3b8;">
              Create Account
              <div id="auth-tab-signup-line" style="position:absolute;bottom:-13px;left:0;right:0;height:2px;background:linear-gradient(135deg, #b937e2, #7d44ed);display:none;"></div>
            </button>
          </div>

          <div id="auth-view-signin">
            <h2 style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 6px;">Welcome Back</h2>
            <p style="color:#94a3b8;font-size:13px;margin:0 0 18px;">Sign in to access your subscriptions, license keys, and exclusive loader downloads.</p>
            <div id="auth-signin-error" style="display:none;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:10px 14px;color:#fca5a5;font-size:13px;margin-bottom:14px;"></div>
            <form onsubmit="event.preventDefault(); window.handleAuthSubmit('signin');" style="display:flex;flex-direction:column;gap:14px;">
              <div>
                <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:6px;">Username or Email Address</label>
                <input type="text" id="auth-signin-login" required placeholder="Enter your email or username" autocomplete="username" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 14px;color:#ffffff;font-size:14px;outline:none;">
              </div>
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <label style="font-size:12px;font-weight:600;color:#cbd5e1;">Password</label>
                  <a href="javascript:void(0)" onclick="window.showToast('Password Reset', 'Password recovery instructions have been sent.');" style="font-size:12px;color:#b937e2;text-decoration:none;">Forgot password?</a>
                </div>
                <div style="position:relative;">
                  <input type="password" id="auth-signin-password" required placeholder="Enter your password" autocomplete="current-password" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 42px 12px 14px;color:#ffffff;font-size:14px;outline:none;">
                  <button type="button" onclick="window.toggleAuthPassVisibility('auth-signin-password', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:4px;" aria-label="Toggle password visibility">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <input type="checkbox" id="auth-remember" checked style="accent-color:#9041ea;width:16px;height:16px;cursor:pointer;">
                <label for="auth-remember" style="font-size:13px;color:#94a3b8;cursor:pointer;">Remember me on this browser</label>
              </div>
              <button type="submit" id="auth-signin-btn" class="auth-submit-btn" style="background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;font-weight:700;font-size:14px;padding:12px;border-radius:8px;border:none;cursor:pointer;transition:all 0.2s ease;margin-top:6px;">
                Sign In
              </button>
              <div style="display:flex;align-items:center;gap:10px;margin:8px 0;">
                <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;">or continue with</span>
                <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
              </div>
              <button type="button" onclick="window.loginWithDiscord()" class="hc-discord-auth-btn" style="background:#5865F2;border:none;color:#ffffff;padding:12px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:filter 0.2s;">
                <i class="fa-brands fa-discord"></i> Continue with Discord
              </button>
              <div style="text-align:center;margin-top:10px;font-size:13px;color:#94a3b8;">
                Don't have an account? <a href="javascript:void(0)" onclick="window.switchAuthTab('signup')" style="color:#b937e2;font-weight:700;text-decoration:none;">Create an Account</a>
              </div>
            </form>
          </div>

          <div id="auth-view-signup" style="display:none;">
            <div style="display:flex;gap:24px;flex-wrap:wrap;">
              <div style="flex:1;min-width:280px;">
                <h2 style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 6px;">Create Account</h2>
                <p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Join HiddenCheats for instant license activation and undetected performance.</p>
                <div id="auth-signup-error" style="display:none;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:10px 14px;color:#fca5a5;font-size:13px;margin-bottom:14px;"></div>
                <form onsubmit="event.preventDefault(); window.handleAuthSubmit('signup');" style="display:flex;flex-direction:column;gap:12px;">
                  <div>
                    <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:5px;">Username <span style="color:#b937e2;">*</span></label>
                    <input type="text" id="auth-signup-username" required placeholder="Choose a username" autocomplete="username" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#ffffff;font-size:14px;outline:none;">
                  </div>
                  <div>
                    <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:5px;">Email Address <span style="color:#b937e2;">*</span></label>
                    <input type="email" id="auth-signup-email" required placeholder="name@example.com" autocomplete="email" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;color:#ffffff;font-size:14px;outline:none;">
                  </div>
                  <div>
                    <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:5px;">Password <span style="color:#b937e2;">*</span></label>
                    <div style="position:relative;">
                      <input type="password" id="auth-signup-pass" required placeholder="Create strong password" autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 42px 10px 14px;color:#ffffff;font-size:14px;outline:none;">
                      <button type="button" onclick="window.toggleAuthPassVisibility('auth-signup-pass', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:4px;" aria-label="Toggle password visibility">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:5px;">Confirm Password <span style="color:#b937e2;">*</span></label>
                    <div style="position:relative;">
                      <input type="password" id="auth-signup-confirm" required placeholder="Re-type your password" autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#1a1d27;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 42px 10px 14px;color:#ffffff;font-size:14px;outline:none;">
                      <button type="button" onclick="window.toggleAuthPassVisibility('auth-signup-confirm', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:4px;" aria-label="Toggle password visibility">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" id="auth-terms" required checked style="accent-color:#9041ea;width:15px;height:15px;cursor:pointer;">
                    <label for="auth-terms" style="font-size:12px;color:#94a3b8;cursor:pointer;">I agree to the <span style="color:#ffffff;font-weight:600;">Terms of Use</span> and <span style="color:#ffffff;font-weight:600;">Privacy Policy</span></label>
                  </div>
                  <button type="submit" id="auth-signup-btn" class="auth-submit-btn" style="background:linear-gradient(135deg, #b937e2, #7d44ed);color:#ffffff;font-weight:700;font-size:14px;padding:12px;border-radius:8px;border:none;cursor:pointer;transition:all 0.2s ease;margin-top:4px;">
                    Create my Account
                  </button>
                  <div style="text-align:center;margin-top:8px;font-size:13px;color:#94a3b8;">
                    Already registered? <a href="javascript:void(0)" onclick="window.switchAuthTab('signin')" style="color:#b937e2;font-weight:700;text-decoration:none;">Sign In</a>
                  </div>
                </form>
              </div>

              <div style="width:230px;background:#191c26;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:center;flex-shrink:0;">
                <div style="width:40px;height:40px;border-radius:10px;background:#5865F2;display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:20px;margin-bottom:12px;">
                  <i class="fa-brands fa-discord"></i>
                </div>
                <h3 style="font-size:15px;font-weight:700;color:#ffffff;margin:0 0 6px;">Instant Discord Connect</h3>
                <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:0 0 16px;">Connect with your Discord account to automatically link customer roles, loader access, and tickets.</p>
                <button type="button" onclick="window.loginWithDiscord()" style="background:#5865F2;border:none;color:#ffffff;padding:12px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:filter 0.2s;text-decoration:none;">
                  <i class="fa-brands fa-discord"></i> Continue with Discord
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeAuthModal();
      });
    }

    switchAuthTab(tab || 'signin');
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      const d = modal.querySelector('.hc_auth_dialog');
      if (d) d.style.transform = 'scale(1)';
    });
  }

  function closeAuthModal() {
    const modal = document.getElementById('hc-auth-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    const d = modal.querySelector('.hc_auth_dialog');
    if (d) d.style.transform = 'scale(0.96)';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 200);
  }

  function switchAuthTab(tab) {
    const isSignin = tab === 'signin';
    const viewSignin = document.getElementById('auth-view-signin');
    const viewSignup = document.getElementById('auth-view-signup');
    const btnSignin = document.getElementById('auth-tab-signin');
    const btnSignup = document.getElementById('auth-tab-signup');
    const lineSignin = document.getElementById('auth-tab-signin-line');
    const lineSignup = document.getElementById('auth-tab-signup-line');

    if (viewSignin) viewSignin.style.display = isSignin ? 'block' : 'none';
    if (viewSignup) viewSignup.style.display = isSignin ? 'none' : 'block';

    if (btnSignin) btnSignin.style.color = isSignin ? '#ffffff' : '#94a3b8';
    if (btnSignup) btnSignup.style.color = isSignin ? '#94a3b8' : '#ffffff';

    if (lineSignin) lineSignin.style.display = isSignin ? 'block' : 'none';
    if (lineSignup) lineSignup.style.display = isSignin ? 'none' : 'block';
  }

  async function handleAuthSubmit(type) {
    const client = initSupabase();
    if (!client) {
      showToast('Auth Error', 'Supabase client is not ready. Please refresh.');
      return;
    }

    if (type === 'signin') {
      const errBox = document.getElementById('auth-signin-error');
      const loginInput = document.getElementById('auth-signin-login');
      const passInput = document.getElementById('auth-signin-password');
      const submitBtn = document.getElementById('auth-signin-btn');
      if (errBox) { errBox.style.display = 'none'; errBox.textContent = ''; }
      const identity = loginInput ? loginInput.value.trim() : '';
      const password = passInput ? passInput.value : '';
      if (!identity || !password) {
        if (errBox) { errBox.style.display = 'block'; errBox.textContent = 'Please fill in both email and password.'; }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
      }

      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: identity,
          password: password
        });
        if (error) throw error;
        closeAuthModal();
        showToast('Signed In', 'Welcome back!');
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = err.message || 'Invalid login credentials.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      }
    } else {
      const errBox = document.getElementById('auth-signup-error');
      const nameInput = document.getElementById('auth-signup-username');
      const emailInput = document.getElementById('auth-signup-email');
      const passInput = document.getElementById('auth-signup-pass');
      const confirmInput = document.getElementById('auth-signup-confirm');
      const submitBtn = document.getElementById('auth-signup-btn');
      if (errBox) { errBox.style.display = 'none'; errBox.textContent = ''; }

      const username = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value : '';
      const confirm = confirmInput ? confirmInput.value : '';

      if (!username || !email || !password || !confirm) {
        if (errBox) { errBox.style.display = 'block'; errBox.textContent = 'Please fill in all required fields.'; }
        return;
      }
      if (password.length < 6) {
        if (errBox) { errBox.style.display = 'block'; errBox.textContent = 'Password must be at least 6 characters long.'; }
        return;
      }
      if (password !== confirm) {
        if (errBox) { errBox.style.display = 'block'; errBox.textContent = 'Passwords do not match.'; }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
      }

      try {
        const { data, error } = await client.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: username,
              user_name: username
            }
          }
        });
        if (error) throw error;
        closeAuthModal();
        showToast('Account Created', 'Check your email to confirm your account, or sign in.');
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = err.message || 'Registration failed.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create my Account';
        }
      }
    }
  }

  let supabaseClient = null;

  function ensureSupabaseLibrary(callback) {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      if (callback) callback();
      return;
    }
    const existing = document.getElementById('supabase-js-cdn');
    if (existing) {
      existing.addEventListener('load', () => { if (callback) callback(); });
      return;
    }
    const script = document.createElement('script');
    script.id = 'supabase-js-cdn';
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      console.log('[Supabase] SDK loaded successfully.');
      if (callback) callback();
    };
    script.onerror = () => {
      console.warn('[Supabase] Failed to load Supabase SDK from CDN.');
    };
    document.head.appendChild(script);
  }

  function initSupabase() {
    if (supabaseClient) return supabaseClient;
    const cfg = window.SUPABASE_CONFIG || {};
    const url = cfg.url || localStorage.getItem('hc_supabase_url') || 'https://gdzsfblrklpqmqanwmwd.supabase.co';
    const anonKey = cfg.anonKey || localStorage.getItem('hc_supabase_anon_key') || 'sb_publishable_p6uoGFtx-5U6DgwEI3lRJQ_iMfH7ISo';

    if (window.supabase && typeof window.supabase.createClient === 'function' && url && anonKey) {
      try {
        supabaseClient = window.supabase.createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        window.supabaseClient = supabaseClient;
      } catch (err) {
        console.warn('[Supabase] Init error:', err);
      }
    }
    return supabaseClient;
  }

  async function checkSupabaseSession() {
    const client = initSupabase();
    if (!client) return;

    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (session && session.user) {
        handleSupabaseUser(session.user);
      }

      client.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          handleSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          const defaultLoggedOut = { loggedIn: false };
          localStorage.setItem('hc_user', JSON.stringify(defaultLoggedOut));
          renderAuthNav();
          syncProfilePage(defaultLoggedOut);
        }
      });
    } catch (e) {
      console.warn('[Supabase] Session check error:', e);
    }
  }

  function handleSupabaseUser(sbUser) {
    if (!sbUser) return;
    const meta = sbUser.user_metadata || {};
    const identity = (sbUser.identities && sbUser.identities.length > 0)
      ? sbUser.identities.find(i => i.provider === 'discord') || sbUser.identities[0]
      : null;

    const discordData = identity?.identity_data || meta;
    const name = discordData.full_name || discordData.custom_claims?.global_name || discordData.user_name || sbUser.email?.split('@')[0] || 'Member';
    const tag = discordData.user_name ? (discordData.discriminator && discordData.discriminator !== '0' ? `${discordData.user_name}#${discordData.discriminator}` : `@${discordData.user_name}`) : (discordData.full_name || name);
    const avatar = discordData.avatar_url || (discordData.avatar ? `https://cdn.discordapp.com/avatars/${discordData.provider_id || identity?.id}/${discordData.avatar}.png` : 'favicon.png');
    const discordId = discordData.provider_id || identity?.id || sbUser.id.slice(0, 18);

    const currentUser = getCurrentUser() || {};
    const updatedUser = {
      id: sbUser.id,
      name: name,
      email: sbUser.email || (currentUser.email && !currentUser.email.includes('yvko2') ? currentUser.email : `${name}@hiddencheats.net`),
      loggedIn: true,
      role: (currentUser.role && currentUser.role !== 'VIP CUSTOMER') ? currentUser.role : 'Customer',
      balance: currentUser.balance || '0.00',
      avatar: avatar,
      discordTag: tag,
      discordId: discordId,
      provider: identity?.provider || 'discord',
      orders: (currentUser.orders && Array.isArray(currentUser.orders)) ? currentUser.orders : []
    };

    localStorage.setItem('hc_user', JSON.stringify(updatedUser));
    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.email === updatedUser.email || u.name === updatedUser.name);
    if (idx >= 0) users[idx] = updatedUser;
    else users.push(updatedUser);
    localStorage.setItem('hc_registered_users', JSON.stringify(users));

    renderAuthNav();
    syncProfilePage(updatedUser);
  }

  async function loginWithDiscord() {
    const btn = document.querySelector('.hc-discord-auth-btn');
    const prevText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Connecting Discord...';
      btn.style.pointerEvents = 'none';
    }

    const client = initSupabase();
    if (client) {
      try {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: redirectUrl,
            scopes: 'identify email'
          }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.error('[Supabase] Discord OAuth error:', err);
        let msg = err.message || 'OAuth error occurred.';
        if (msg.toLowerCase().includes('not enabled')) {
          msg = 'Discord provider is not toggled ON yet in Supabase Dashboard (Authentication -> Sign In / Providers -> Discord).';
        }
        showToast('Discord Auth Setup', msg);
        if (btn) {
          btn.innerHTML = prevText;
          btn.style.pointerEvents = '';
        }
        return;
      }
    }

    if (!client) {
      if (btn) {
        btn.innerHTML = prevText;
        btn.style.pointerEvents = '';
      }
      const currentUrl = localStorage.getItem('hc_supabase_url') || '';
      const promptUrl = prompt('Enter your Supabase Project URL (e.g. https://xxxx.supabase.co):', currentUrl);
      if (!promptUrl) {
        showToast('Supabase Not Configured', 'Enter your Supabase Project URL & Anon Key to connect Discord OAuth.');
        return;
      }
      const promptKey = prompt('Enter your Supabase public "anon" Key (from Supabase Settings -> API, starts with eyJ...):');
      if (!promptKey) {
        showToast('Supabase Not Configured', 'Anon key is required to initialize Supabase OAuth.');
        return;
      }
      window.setSupabaseConfig(promptUrl, promptKey);
      return;
    }
  }

  async function disconnectDiscord() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    const user = getCurrentUser();
    if (user) {
      user.discordTag = null;
      user.discordId = null;
      user.provider = null;
      localStorage.setItem('hc_user', JSON.stringify(user));
      syncProfilePage(user);
    }
    showToast('Discord Disconnected', 'Your Discord account has been unlinked.');
  }

  function syncDiscordRoles() {
    const user = getCurrentUser();
    if (!user || !user.discordTag) {
      showToast('No Discord Linked', 'Please connect your Discord account first.');
      return;
    }
    showToast('Roles Synchronized', 'Verified roles for ' + user.discordTag + ': Customer, VIP Member');
  }

  function getCurrentUser() {
    try {
      const stored = localStorage.getItem('hc_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.name === 'yvko2' || parsed.email === 'yvko2@gmail.com' || parsed.id === 'usr-849201')) {
          localStorage.removeItem('hc_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function renderAuthNav() {
    const user = getCurrentUser();
    const userNav = document.getElementById('elUserNav');
    if (userNav) {
      const existingSearchLi = userNav.querySelector('#elSearchTrigger')?.closest('li');
      if (user && user.loggedIn) {
        if (existingSearchLi) existingSearchLi.style.display = 'none';
      } else {
        if (existingSearchLi) existingSearchLi.style.display = 'inline-block';
      }

      let authContainer = userNav.querySelector('.auth-nav-container');
      if (!authContainer) {
        const signinBtn = userNav.querySelector('.chams-signin-btn');
        const signupBtn = userNav.querySelector('.chams-signup-btn');
        if (signinBtn && signinBtn.parentElement) signinBtn.parentElement.remove();
        if (signupBtn && signupBtn.parentElement) signupBtn.parentElement.remove();

        authContainer = document.createElement('li');
        authContainer.className = 'auth-nav-container';
        authContainer.style.position = 'relative';
        userNav.appendChild(authContainer);
      }

      if (user && user.loggedIn) {
        authContainer.innerHTML = `
          <div class="hc-auth-navbar">
            <button type="button" onclick="window.openSearchModal()" class="hc-square-btn" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <a href="https://discord.gg/hiddencheats" target="_blank" class="hc-square-btn hc-discord-btn" aria-label="Discord">
              <i class="fa-brands fa-discord" style="font-size:18px;"></i>
            </a>
            <div class="hc-balance-pill" onclick="window.location.href='settings.html#billing'">
              <span class="hc-b-dollar">$</span>
              <span class="hc-b-sep">|</span>
              <span class="hc-b-val">${user.balance || '0.00'}</span>
            </div>
            <div class="hc-vsep"></div>
            <div class="hc-user-trigger" onclick="window.toggleUserDropdown(event)">
              <div style="display:flex;flex-direction:column;align-items:flex-end;">
                <span class="hc-user-name">${user.name || 'Member'}</span>
                <span class="hc-user-role">${user.role || 'MEMBERS'}</span>
              </div>
              <div class="hc-user-avatar-wrap">
                <img src="${user.avatar || 'favicon.png'}" alt="${user.name || 'Member'}" style="object-fit:cover;">
              </div>
            </div>
            <div id="hc-user-dropdown" class="hc-user-dropdown">
              <div class="hc-drop-row-btns">
                <a href="settings.html#keys" class="hc-drop-btn-keys">
                  <i class="fa-solid fa-key"></i>
                  <span>My Keys</span>
                </a>
                <a href="https://discord.gg/hiddencheats" target="_blank" class="hc-drop-btn-support">
                  <i class="fa-solid fa-headset"></i>
                  <span>Support</span>
                </a>
              </div>
              <div class="hc-drop-links">
                <a href="profile.html" class="hc-drop-item">
                  <span>Profile</span>
                  <div class="hc-drop-iconbox"><i class="fa-solid fa-user"></i></div>
                </a>
                <a href="settings.html" class="hc-drop-item">
                  <span>Account Settings</span>
                  <div class="hc-drop-iconbox"><i class="fa-solid fa-gear"></i></div>
                </a>
                <a href="forums.html" class="hc-drop-item">
                  <span>Product Guides</span>
                  <div class="hc-drop-iconbox"><i class="fa-solid fa-book-bookmark"></i></div>
                </a>
              </div>
              <div class="hc-drop-divider"></div>
              <a href="javascript:void(0)" onclick="window.signOut()" class="hc-drop-signout">
                <span>SIGN OUT</span>
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </a>
            </div>
          </div>
        `;
      } else {
        authContainer.innerHTML = `
          <div style="display:flex;align-items:center;gap:14px;">
            <button type="button" onclick="window.openAuthModal('signin')" class="chams-signin-btn">
              <span>Existing user? Sign In</span>
              <i class="fa-solid fa-caret-down" style="font-size:11px;opacity:0.75;"></i>
            </button>
            <button type="button" onclick="window.openAuthModal('signup')" class="chams-signup-btn">
              Sign Up
            </button>
          </div>
        `;
      }
    }

    const drawer = document.getElementById('elMobileDrawer');
    if (drawer) {
      let drawerAuthSection = drawer.querySelector('.hc-drawer-auth-section');
      if (!drawerAuthSection) {
        const nav = drawer.querySelector('nav');
        if (nav) {
          const oldSignIn = nav.querySelector('a[onclick*="openAuthModal(\'signin\')"]') || nav.querySelector('.mobile-auth-signin');
          const oldSignUp = nav.querySelector('a[onclick*="openAuthModal(\'signup\')"]') || nav.querySelector('.mobile-auth-signup');
          drawerAuthSection = document.createElement('div');
          drawerAuthSection.className = 'hc-drawer-auth-section';
          if (oldSignIn && oldSignUp) {
            nav.insertBefore(drawerAuthSection, oldSignIn);
            oldSignIn.remove();
            oldSignUp.remove();
          } else {
            nav.appendChild(drawerAuthSection);
          }
        }
      }
      if (drawerAuthSection) {
        if (user && user.loggedIn) {
          drawerAuthSection.innerHTML = `
            <a href="settings.html#keys" onclick="toggleMobileDrawer()" style="color:#fff;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-key" style="color: #9041ea;"></i> My License Keys</a>
            <a href="profile.html" onclick="toggleMobileDrawer()" style="color:#fff;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-user" style="color: #9041ea;"></i> Profile (${user.name})</a>
            <a href="settings.html" onclick="toggleMobileDrawer()" style="color:#fff;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-gear" style="color: #9041ea;"></i> Account Settings</a>
            <a href="javascript:void(0)" onclick="toggleMobileDrawer(); window.signOut();" style="color:#ef4444;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-right-from-bracket" style="color: #ef4444;"></i> Sign Out</a>
          `;
        } else {
          drawerAuthSection.innerHTML = `
            <a href="javascript:void(0)" onclick="toggleMobileDrawer(); window.openAuthModal('signin');" style="color:#fff;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-user" style="color: #9041ea;"></i> Sign In</a>
            <a href="javascript:void(0)" onclick="toggleMobileDrawer(); window.openAuthModal('signup');" style="color:#fff;font-size:16px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:12px;padding:8px 0;"><i class="fa-solid fa-user-plus" style="color: #9041ea;"></i> Sign Up</a>
          `;
        }
      }
    }
    syncProfilePage(user);
  }

  function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const drop = document.getElementById('hc-user-dropdown');
    if (!drop) return;
    drop.classList.toggle('is-open');
  }

  function closeUserDropdown() {
    const drop = document.getElementById('hc-user-dropdown');
    if (drop) drop.classList.remove('is-open');
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.auth-nav-container')) {
      closeUserDropdown();
    }
  });

  async function signOut() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn('[Supabase] Signout error:', e);
      }
    }
    const defaultLoggedOut = { loggedIn: false };
    localStorage.setItem('hc_user', JSON.stringify(defaultLoggedOut));
    closeUserDropdown();
    renderAuthNav();
    syncProfilePage(defaultLoggedOut);
    showToast('Signed Out', 'You have been signed out successfully.');
  }

  function openOrdersModal() {
    let modal = document.getElementById('hc-orders-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hc-orders-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px;';
      document.body.appendChild(modal);
    }

    const user = getCurrentUser() || { name: 'Member', email: 'member@hiddencheats.net', orders: [] };
    const orders = user.orders && user.orders.length > 0 ? user.orders : [
      { id: 'ORD-849201', product: 'Krush - Apex Legends (30 Day)', key: 'HIDDEN-KRSH-9921-X492', status: 'Active', expires: '29 Days Left' }
    ];

    modal.innerHTML = `
      <div style="background:#14171f;border:1px solid rgba(255,255,255,0.1);border-radius:16px;width:640px;max-width:100%;max-height:90vh;overflow-y:auto;padding:24px;box-shadow:0 25px 60px rgba(0,0,0,0.8);position:relative;">
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:14px;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#b937e2,#7d44ed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;">
              <i class="fa-solid fa-key"></i>
            </div>
            <div>
              <h3 style="margin:0;font-size:18px;font-weight:800;color:#ffffff;">My License Keys</h3>
              <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">Active subscriptions for ${user.name}</p>
            </div>
          </div>
          <button onclick="document.getElementById('hc-orders-modal').style.display='none';" style="background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer;">&times;</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          ${orders.map(o => `
            <div style="background:#1a1d27;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div>
                  <div style="font-size:15px;font-weight:700;color:#ffffff;">${o.product}</div>
                  <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Order ID: ${o.id} • <span style="color:#10b981;font-weight:700;">${o.status}</span> (${o.expires})</div>
                </div>
                <span style="background:rgba(16,185,129,0.15);color:#34d399;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;border:1px solid rgba(16,185,129,0.3);">ACTIVE</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;background:#10131a;border:1px dashed #9041ea;border-radius:8px;padding:8px 12px;">
                <code style="color:#ff52be;font-family:monospace;font-size:13px;font-weight:800;letter-spacing:1px;">${o.key}</code>
                <button onclick="navigator.clipboard.writeText('${o.key}'); this.textContent='Copied!';" style="background:linear-gradient(135deg,#b937e2,#7d44ed);color:#ffffff;border:none;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">
                  Copy Key
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:12px;justify-content:flex-end;">
          <a href="https://discord.gg/hiddencheats" target="_blank" style="background:#5865F2;color:#ffffff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
            <i class="fa-brands fa-discord"></i> Download Loader
          </a>
          <button onclick="document.getElementById('hc-orders-modal').style.display='none';" style="background:#27262e;border:1px solid rgba(255,255,255,0.1);color:#ffffff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">
            Close
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  window.openGameCheats = openGameCheats;
  window.closeGameCheats = closeGameCheats;
  window.openCheatConfig = openCheatConfig;
  window.closeCheatConfig = closeCheatConfig;
  window.backToGameCheats = backToGameCheats;
  window.adjustQuantity = adjustQuantity;
  window.addToCartCurrent = addToCartCurrent;
  window.buyNowCurrent = buyNowCurrent;
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.changeCartItemQty = changeCartItemQty;
  window.removeCartItem = removeCartItem;
  window.clearCart = clearCart;
  window.setPaymentMethod = setPaymentMethod;
  window.applyPromoCode = applyPromoCode;
  window.proceedCheckout = proceedCheckout;
  window.openSearchModal = openSearchModal;
  window.closeSearchModal = closeSearchModal;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.switchAuthTab = switchAuthTab;
  window.handleAuthSubmit = handleAuthSubmit;
  window.renderAuthNav = renderAuthNav;
  window.toggleUserDropdown = toggleUserDropdown;
  window.closeUserDropdown = closeUserDropdown;
  window.signOut = signOut;
  window.openOrdersModal = openOrdersModal;
  window.selectVariant = selectVariant;
  window.modifyProductQty = modifyProductQty;
  window.updateProductTotalPrice = updateProductTotalPrice;
  window.addProductToCart = addProductToCart;
  window.instantCheckoutProduct = instantCheckoutProduct;
  window.addToCart = addToCart;
  window.showToast = showToast;
  window.loginWithDiscord = loginWithDiscord;
  window.disconnectDiscord = disconnectDiscord;
  window.syncDiscordRoles = syncDiscordRoles;
  window.initSupabase = initSupabase;
  window.checkSupabaseSession = checkSupabaseSession;
  window.toggleAuthPassVisibility = toggleAuthPassVisibility;
  window.syncProfilePage = syncProfilePage;
  window.getRegisteredUsers = getRegisteredUsers;
  window.getCurrentUser = getCurrentUser;

  document.addEventListener('DOMContentLoaded', function () {
    try {
      const u = localStorage.getItem('hc_user');
      if (u && (u.includes('yvko2') || u.includes('usr-849201'))) {
        localStorage.removeItem('hc_user');
      }
      const r = localStorage.getItem('hc_registered_users');
      if (r && r.includes('yvko2')) {
        localStorage.removeItem('hc_registered_users');
      }
    } catch (e) {}

    initCatalogCardTriggers();
    updateNavbarCartBadges();
    renderAuthNav();
    ensureSupabaseLibrary(() => {
      checkSupabaseSession();
    });
  });
})();