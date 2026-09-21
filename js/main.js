document.addEventListener('DOMContentLoaded', () => {
  const searchModal = document.getElementById('search-modal');
  const searchTriggerBtn = document.getElementById('nav-search-trigger');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const gamesData = [
    { name: 'ARC RAIDERS', category: 'Shooter', status: 'Undetected', link: 'arc.html', img: 'assets/images/games/arc_raiders.webp' },
    { name: 'APEX LEGENDS', category: 'Battle Royale', status: 'Undetected', link: 'apex.html', img: 'assets/images/games/apex.png' },
    { name: 'CALL OF DUTY: WARZONE / BO6', category: 'FPS', status: 'Undetected', link: 'cod.html', img: 'assets/images/games/cod.png' },
    { name: 'FORTNITE', category: 'Battle Royale', status: 'Undetected', link: 'fortnite.html', img: 'assets/images/games/fortnite.webp' }
  ];

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add('open');
    renderSearchResults('');
    setTimeout(() => searchInput && searchInput.focus(), 50);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('open');
    if (searchInput) searchInput.value = '';
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const cleanQuery = query.toLowerCase().trim();
    const filtered = gamesData.filter(g => g.name.toLowerCase().includes(cleanQuery) || g.category.toLowerCase().includes(cleanQuery));

    if (filtered.length === 0) {
      searchResults.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b;">No software found for "${query}"</div>`;
      return;
    }

    searchResults.innerHTML = filtered.map(g => `
      <a href="${g.link}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('open');">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${g.img}" alt="${g.name}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(0, 166, 255, 0.2);">
          <div>
            <div style="font-weight: 700; font-size: 0.92rem;">${g.name}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">${g.category}</div>
          </div>
        </div>
        <span style="font-size: 0.72rem; color: #34d399; background: rgba(16, 185, 129, 0.12); padding: 3px 8px; border-radius: 9999px; font-weight: 600;">
          ${g.status}
        </span>
      </a>
    `).join('');
  }

  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener('click', openSearch);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
      closeCurrency();
    }
  });

  const currencyBtn = document.getElementById('currency-btn');
  const currencyDropdown = document.getElementById('currency-dropdown');
  const currencyLabel = document.getElementById('currency-label');

  function toggleCurrency() {
    if (!currencyDropdown) return;
    currencyDropdown.classList.toggle('show');
  }

  function closeCurrency() {
    if (currencyDropdown) currencyDropdown.classList.remove('show');
  }

  if (currencyBtn) {
    currencyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCurrency();
    });
  }

  document.querySelectorAll('.currency-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const code = opt.getAttribute('data-currency') || 'USD';
      const symbol = opt.getAttribute('data-symbol') || '$';
      if (currencyLabel) {
        currencyLabel.textContent = `${symbol} ${code}`;
      }
      document.querySelectorAll('.currency-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      closeCurrency();
    });
  });

  document.addEventListener('click', (e) => {
    if (currencyDropdown && !currencyDropdown.contains(e.target) && e.target !== currencyBtn) {
      closeCurrency();
    }
  });

  const fovSlider = document.getElementById('fov-slider');
  const fovVal = document.getElementById('fov-slider-val');

  if (fovSlider && fovVal) {
    fovSlider.addEventListener('input', () => {
      fovVal.textContent = `${fovSlider.value}°`;
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-menu-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = '';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '20px';
        navLinks.style.right = '20px';
        navLinks.style.marginTop = '10px';
        navLinks.style.background = '#0b0d14';
        navLinks.style.border = '1px solid rgba(0, 166, 255, 0.25)';
        navLinks.style.borderRadius = '16px';
        navLinks.style.padding = '16px';
        navLinks.style.gap = '14px';
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
