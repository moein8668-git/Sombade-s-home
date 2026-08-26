(() => {
  const darkTheme = 'dark';
  const blackTheme = 'black';
  const storageKey = 'sombade-theme';

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // The theme still works when browser storage is unavailable.
  }

  // The former charcoal theme is now the default lighter-dark mode.
  if (savedTheme === blackTheme || savedTheme === 'night') {
    document.documentElement.dataset.theme = blackTheme;
  } else {
    document.documentElement.dataset.theme = darkTheme;
  }

  const updateButton = (button, isBlack) => {
    const icon = button.querySelector('.theme-toggle__icon');
    const label = button.querySelector('.theme-toggle__label');

    button.setAttribute('aria-pressed', String(isBlack));
    button.setAttribute(
      'aria-label',
      isBlack ? 'فعال کردن تم یکم روشن' : 'فعال کردن تم کاملاً تاریک'
    );

    icon.textContent = isBlack ? '🌗' : '●';
    label.textContent = isBlack ? 'تم یکم روشن' : 'تم کاملاً تاریک';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');

    if (!button) {
      return;
    }

    updateButton(button, document.documentElement.dataset.theme === blackTheme);

    button.addEventListener('click', () => {
      const isBlack = document.documentElement.dataset.theme === blackTheme;
      document.documentElement.dataset.theme = isBlack ? darkTheme : blackTheme;

      try {
        localStorage.setItem(storageKey, isBlack ? darkTheme : blackTheme);
      } catch {
        // Ignore storage failures; the current page still changes theme.
      }

      updateButton(button, !isBlack);
      document.dispatchEvent(new CustomEvent('themechange'));
    });

    // ========================================
    // Display settings: accent palette, dark mode, and page width
    // ========================================
    const initDisplaySettings = () => {
      const palettes = {
        Rust: {
          accent: '#d87b52', soft: '#513127',
          dark: { bg: '#20211f', bgSoft: '#292a27', surface: '#282925', strong: '#30312c', muted: '#b7b2a8', border: '#4a4a43', borderStrong: '#77766c' },
          black: { bg: '#000000', bgSoft: '#0b0b0b', surface: '#111111', strong: '#181818', muted: '#a9a9a3', border: '#303030', borderStrong: '#5a5a5a' },
        },
        Emerald: {
          accent: '#55b889', soft: '#1e4636',
          dark: { bg: '#18221f', bgSoft: '#20302a', surface: '#1e2924', strong: '#27362f', muted: '#afc2b8', border: '#40554a', borderStrong: '#708d7d' },
          black: { bg: '#000000', bgSoft: '#07110d', surface: '#0d1914', strong: '#14241c', muted: '#a5b9ae', border: '#244335', borderStrong: '#4d8065' },
        },
        Cobalt: {
          accent: '#70a9e8', soft: '#203d61',
          dark: { bg: '#1b2028', bgSoft: '#252e3b', surface: '#232b36', strong: '#2e3948', muted: '#b2bdcb', border: '#455466', borderStrong: '#778da8' },
          black: { bg: '#000000', bgSoft: '#080d14', surface: '#101923', strong: '#172431', muted: '#a7b5c5', border: '#253b52', borderStrong: '#4b7198' },
        },
        Pink: {
          accent: '#ed70b8', soft: '#542442',
          dark: { bg: '#241d24', bgSoft: '#332631', surface: '#2e222c', strong: '#3b2a38', muted: '#c0afbb', border: '#594050', borderStrong: '#936a83' },
          black: { bg: '#000000', bgSoft: '#120812', surface: '#1c0e1b', strong: '#281329', muted: '#c2aabd', border: '#482340', borderStrong: '#8c4777' },
        },
        Amber: {
          accent: '#d8a34e', soft: '#55401d',
          dark: { bg: '#24221d', bgSoft: '#332e22', surface: '#2e2a21', strong: '#3d3627', muted: '#c2b9a6', border: '#5b513e', borderStrong: '#927f5c' },
          black: { bg: '#000000', bgSoft: '#110c03', surface: '#1b1407', strong: '#291e0b', muted: '#c5b79b', border: '#4b3816', borderStrong: '#8a6b2d' },
        },
        Slate: {
          accent: '#9ca9bd', soft: '#354052',
          dark: { bg: '#1e2025', bgSoft: '#292d35', surface: '#272b32', strong: '#323842', muted: '#b4bac4', border: '#454d5b', borderStrong: '#747f91' },
          black: { bg: '#000000', bgSoft: '#090b0f', surface: '#11151b', strong: '#181e27', muted: '#adb6c3', border: '#293544', borderStrong: '#50647a' },
        },
        Violet: {
          accent: '#a98ee8', soft: '#3e315e',
          dark: { bg: '#211f27', bgSoft: '#2c2937', surface: '#292633', strong: '#373145', muted: '#bcb4ca', border: '#4d455f', borderStrong: '#817698' },
          black: { bg: '#000000', bgSoft: '#0b0712', surface: '#130d1d', strong: '#1d142c', muted: '#bcb1cc', border: '#38254f', borderStrong: '#694a8e' },
        },
        Minimal: {
          accent: '#d8d8d2', soft: '#42423d',
          dark: { bg: '#202020', bgSoft: '#2a2a2a', surface: '#282828', strong: '#303030', muted: '#b6b6b1', border: '#4b4b4b', borderStrong: '#777777' },
          black: { bg: '#000000', bgSoft: '#080808', surface: '#101010', strong: '#181818', muted: '#aaaaa5', border: '#2f2f2f', borderStrong: '#5a5a5a' },
        },
      };
      const defaultWidth = 56;
      const savedPalette = localStorage.getItem('sombade-accent') || 'Rust';
      const savedWidth = Number(localStorage.getItem('sombade-width')) || defaultWidth;
      const root = document.documentElement;
      let currentPalette = palettes[savedPalette] ? savedPalette : 'Rust';

      root.style.setProperty('--content-width', `${savedWidth}rem`);
      const applyPalette = (name) => {
        const palette = palettes[name] || palettes.Rust;
        const tones = palette[root.dataset.theme === blackTheme ? 'black' : 'dark'];
        const variables = {
          '--accent': palette.accent,
          '--accent-soft': palette.soft,
          '--bg': tones.bg,
          '--bg-soft': tones.bgSoft,
          '--surface': tones.surface,
          '--surface-strong': tones.strong,
          '--text-muted': tones.muted,
          '--border': tones.border,
          '--border-strong': tones.borderStrong,
        };
        Object.entries(variables).forEach(([property, value]) => root.style.setProperty(property, value));
      };
      applyPalette(currentPalette);

      const settingsToggle = document.createElement('button');
      settingsToggle.className = 'settings-toggle';
      settingsToggle.type = 'button';
      settingsToggle.setAttribute('aria-label', 'Open display settings');
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsToggle.textContent = '⚙';

      const settings = document.createElement('aside');
      settings.className = 'display-settings';
      settings.setAttribute('aria-label', 'Display settings');
      settings.innerHTML = `
        <div class="display-settings__header">
          <h2 class="display-settings__title">Display settings</h2>
          <button class="display-settings__close" type="button" aria-label="Close display settings">×</button>
        </div>
        <span class="display-settings__label">Theme color</span>
        <div class="display-settings__themes"></div>
        <button class="display-settings__mode" type="button">Toggle color mode</button>
        <span class="display-settings__label">Page width</span>
        <div class="display-settings__width-row"><span>Reading width</span><output class="display-settings__width-value"></output></div>
        <input class="display-settings__range" type="range" min="40" max="80" step="1" value="${savedWidth}" aria-label="Page width">
        <div class="display-settings__range-labels"><span>40rem</span><span>80rem</span></div>
        <button class="display-settings__restore" type="button">↶ Restore default page width <b>${defaultWidth}rem</b></button>
      `;

      const themes = settings.querySelector('.display-settings__themes');
      Object.entries(palettes).forEach(([name, colors]) => {
        const paletteButton = document.createElement('button');
        paletteButton.className = 'display-settings__theme';
        paletteButton.type = 'button';
        paletteButton.dataset.palette = name;
        paletteButton.textContent = name;
        paletteButton.style.setProperty('--swatch', colors.accent);
        paletteButton.addEventListener('click', () => {
          currentPalette = name;
          localStorage.setItem('sombade-accent', name);
          applyPalette(currentPalette);
          updatePaletteSelection();
        });
        themes.appendChild(paletteButton);
      });

      document.body.append(settingsToggle, settings);
      const widthRange = settings.querySelector('.display-settings__range');
      const widthValue = settings.querySelector('.display-settings__width-value');
      const modeButton = settings.querySelector('.display-settings__mode');
      const updatePaletteSelection = () => {
        settings.querySelectorAll('.display-settings__theme').forEach((item) => {
          item.classList.toggle('is-selected', item.dataset.palette === (localStorage.getItem('sombade-accent') || 'Rust'));
        });
      };
      const updateThemeState = () => {
        modeButton.textContent = document.documentElement.dataset.theme === blackTheme
          ? 'Toggle color mode · A bit lighter'
          : 'Toggle color mode · True dark';
      };
      const setWidth = (width) => {
        root.style.setProperty('--content-width', `${width}rem`);
        widthRange.value = width;
        widthValue.textContent = `${width}rem`;
        localStorage.setItem('sombade-width', width);
      };

      settingsToggle.addEventListener('click', () => {
        const open = settings.classList.toggle('is-open');
        settingsToggle.setAttribute('aria-expanded', String(open));
      });
      settings.querySelector('.display-settings__close').addEventListener('click', () => {
        settings.classList.remove('is-open');
        settingsToggle.setAttribute('aria-expanded', 'false');
      });
      modeButton.addEventListener('click', () => button.click());
      widthRange.addEventListener('input', () => setWidth(widthRange.value));
      settings.querySelector('.display-settings__restore').addEventListener('click', () => setWidth(defaultWidth));
      document.addEventListener('themechange', () => {
        applyPalette(currentPalette);
        updateThemeState();
      });
      document.addEventListener('click', (event) => {
        if (settings.classList.contains('is-open') && !settings.contains(event.target) && event.target !== settingsToggle) {
          settings.classList.remove('is-open');
          settingsToggle.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          settings.classList.remove('is-open');
          settingsToggle.setAttribute('aria-expanded', 'false');
        }
      });

      widthValue.textContent = `${savedWidth}rem`;
      updatePaletteSelection();
      updateThemeState();
    };

    initDisplaySettings();

    // ========================================
    // Code Copy Button & Code Block LTR Wrapping
    // ========================================
    const initCodeBlocks = () => {
      const preElements = document.querySelectorAll('pre');
      preElements.forEach((pre) => {
        if (pre.parentElement && !pre.parentElement.classList.contains('code-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'code-wrapper';
          pre.parentNode.insertBefore(wrapper, pre);

          const codeEl = pre.querySelector('code');
          const langMatch = codeEl ? codeEl.className.match(/language-([\w-]+)/) : null;
          const langLabels = { bash: 'shell', sh: 'shell', shell: 'shell', ini: 'config', json: 'json' };
          const lang = langMatch ? (langLabels[langMatch[1]] || langMatch[1]) : 'code';

          const head = document.createElement('div');
          head.className = 'code-head';
          head.innerHTML = `<span class="code-lang">${lang}</span>`;
          wrapper.appendChild(head);
          wrapper.appendChild(pre);

          const copyBtn = document.createElement('button');
          copyBtn.className = 'code-copy-btn';
          copyBtn.setAttribute('type', 'button');
          copyBtn.setAttribute('aria-label', 'کپی کردن کد');
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>کپی</span>
          `;

          copyBtn.addEventListener('click', async () => {
            const codeText = pre.innerText || pre.textContent;
            try {
              await navigator.clipboard.writeText(codeText.trim());
              copyBtn.classList.add('copied');
              copyBtn.querySelector('span').textContent = 'کپی شد! ✓';
              setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('span').textContent = 'کپی';
              }, 2000);
            } catch (err) {
              const textarea = document.createElement('textarea');
              textarea.value = codeText.trim();
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);

              copyBtn.classList.add('copied');
              copyBtn.querySelector('span').textContent = 'کپی شد! ✓';
              setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('span').textContent = 'کپی';
              }, 2000);
            }
          });

          head.appendChild(copyBtn);
        }
      });
    };

    // ========================================
    // Image Fullscreen / Lightbox Feature
    // ========================================
    const initImageLightbox = () => {
      const figures = document.querySelectorAll('.tutorial-figure');
      if (figures.length === 0) return;

      let lightbox = document.querySelector('.lightbox-modal');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
          <div class="lightbox-bar">
            <div class="lightbox-title"></div>
            <div class="lightbox-controls">
              <div class="lightbox-zoom-group">
                <button class="lightbox-zoom-btn zoom-out-btn" type="button" title="کاهش زوم">➖</button>
                <input type="range" class="lightbox-zoom-slider" min="100" max="400" value="100" step="5" aria-label="اسلایدر زوم" />
                <button class="lightbox-zoom-btn zoom-in-btn" type="button" title="افزایش زوم">➕</button>
                <span class="lightbox-zoom-val">100%</span>
              </div>
              <button class="lightbox-btn zoom-toggle-btn" type="button" aria-label="زوم سریع ۲۵۰ درصد">250%</button>
              <button class="lightbox-btn close-btn" type="button" aria-label="بستن">✕</button>
            </div>
          </div>
          <div class="lightbox-img-wrapper">
            <img src="" alt="" class="lightbox-img" />
          </div>
        `;
        document.body.appendChild(lightbox);
      }

      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const wrapper = lightbox.querySelector('.lightbox-img-wrapper');
      const lightboxTitle = lightbox.querySelector('.lightbox-title');
      const closeBtn = lightbox.querySelector('.close-btn');
      const zoomToggleBtn = lightbox.querySelector('.zoom-toggle-btn');
      const zoomSlider = lightbox.querySelector('.lightbox-zoom-slider');
      const zoomVal = lightbox.querySelector('.lightbox-zoom-val');
      const zoomInBtn = lightbox.querySelector('.zoom-in-btn');
      const zoomOutBtn = lightbox.querySelector('.zoom-out-btn');

      const minScale = 100;
      const maxScale = 400;
      let currentScale = minScale;
      let fitSize = { width: 0, height: 0 };
      let isDragging = false;
      let activePointerId = null;
      let startX = 0;
      let startY = 0;
      let scrollLeft = 0;
      let scrollTop = 0;
      let suppressNextClick = false;
      const touchPointers = new Map();
      let isPinching = false;
      let pinchStartDistance = 0;
      let pinchStartScale = minScale;
      let lightboxHistoryOpen = false;

      const clampScale = (scale) => Math.max(minScale, Math.min(maxScale, scale));

      const updateZoomUi = () => {
        zoomSlider.value = currentScale;
        zoomVal.textContent = Math.round(currentScale) + '%';
        zoomToggleBtn.textContent = currentScale === minScale ? '250%' : '100%';
        zoomToggleBtn.setAttribute(
          'aria-label',
          currentScale === minScale ? 'زوم سریع ۲۵۰ درصد' : 'بازنشانی زوم به ۱۰۰ درصد'
        );
        zoomOutBtn.disabled = currentScale === minScale;
        zoomInBtn.disabled = currentScale === maxScale;
      };

      const captureFitSize = () => {
        const rect = lightboxImg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          fitSize = { width: rect.width, height: rect.height };
        }
      };

      const resetImageToFit = () => {
        wrapper.classList.remove('is-zoomed');
        lightboxImg.style.width = '';
        lightboxImg.style.height = '';
        lightboxImg.style.maxWidth = '90vw';
        lightboxImg.style.maxHeight = '80vh';
        lightboxImg.style.cursor = 'zoom-in';
        wrapper.scrollLeft = 0;
        wrapper.scrollTop = 0;

        requestAnimationFrame(captureFitSize);
      };

      const getFitSize = () => {
        if (fitSize.width > 0 && fitSize.height > 0) {
          return fitSize;
        }

        captureFitSize();

        if (fitSize.width > 0 && fitSize.height > 0) {
          return fitSize;
        }

        const availableWidth = Math.max(240, Math.min(window.innerWidth * 0.9, wrapper.clientWidth - 48));
        const availableHeight = Math.max(180, Math.min(window.innerHeight * 0.8, wrapper.clientHeight - 48));
        const naturalWidth = lightboxImg.naturalWidth || availableWidth;
        const naturalHeight = lightboxImg.naturalHeight || availableHeight;
        const fitRatio = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight, 1);

        fitSize = {
          width: naturalWidth * fitRatio,
          height: naturalHeight * fitRatio,
        };

        return fitSize;
      };

      const applyScale = (scale, focalPoint = null) => {
        const nextScale = clampScale(scale);
        const previousScale = currentScale;
        const wrapperRect = wrapper.getBoundingClientRect();
        const focalX = focalPoint ? focalPoint.clientX - wrapperRect.left : wrapper.clientWidth / 2;
        const focalY = focalPoint ? focalPoint.clientY - wrapperRect.top : wrapper.clientHeight / 2;
        let relativeX = 0.5;
        let relativeY = 0.5;

        if (previousScale > minScale) {
          relativeX = (wrapper.scrollLeft + focalX - lightboxImg.offsetLeft) / lightboxImg.offsetWidth;
          relativeY = (wrapper.scrollTop + focalY - lightboxImg.offsetTop) / lightboxImg.offsetHeight;
        } else if (focalPoint) {
          const imgRect = lightboxImg.getBoundingClientRect();
          relativeX = (focalPoint.clientX - imgRect.left) / imgRect.width;
          relativeY = (focalPoint.clientY - imgRect.top) / imgRect.height;
        }

        relativeX = Math.max(0, Math.min(1, relativeX || 0.5));
        relativeY = Math.max(0, Math.min(1, relativeY || 0.5));
        currentScale = nextScale;
        updateZoomUi();

        if (currentScale === minScale) {
          resetImageToFit();
          return;
        }

        const baseSize = getFitSize();
        const zoomRatio = currentScale / 100;

        wrapper.classList.add('is-zoomed');
        lightboxImg.style.maxWidth = 'none';
        lightboxImg.style.maxHeight = 'none';
        lightboxImg.style.width = `${baseSize.width * zoomRatio}px`;
        lightboxImg.style.height = `${baseSize.height * zoomRatio}px`;
        lightboxImg.style.cursor = 'grab';

        requestAnimationFrame(() => {
          wrapper.scrollLeft = lightboxImg.offsetLeft + (lightboxImg.offsetWidth * relativeX) - focalX;
          wrapper.scrollTop = lightboxImg.offsetTop + (lightboxImg.offsetHeight * relativeY) - focalY;
        });
      };

      const getTouchPoints = () => Array.from(touchPointers.values());

      const getTouchDistance = (points) => Math.hypot(
        points[0].clientX - points[1].clientX,
        points[0].clientY - points[1].clientY
      );

      const getTouchMidpoint = (points) => ({
        clientX: (points[0].clientX + points[1].clientX) / 2,
        clientY: (points[0].clientY + points[1].clientY) / 2,
      });

      const beginPinchZoom = () => {
        const points = getTouchPoints();
        if (points.length < 2) return;

        isPinching = true;
        isDragging = false;
        activePointerId = null;
        pinchStartDistance = getTouchDistance(points);
        pinchStartScale = currentScale;
        wrapper.classList.remove('is-dragging');
        wrapper.classList.add('is-pinching');
      };

      const pushLightboxHistory = () => {
        if (lightboxHistoryOpen) return;

        try {
          const currentState = history.state && typeof history.state === 'object' ? history.state : {};
          history.pushState({ ...currentState, lightboxOpen: true }, '', window.location.href);
          lightboxHistoryOpen = true;
        } catch {
          // The lightbox still works in browsers that block history updates.
        }
      };

      const closeLightbox = ({ fromHistory = false } = {}) => {
        if (!lightbox.classList.contains('active')) return;

        const shouldStepBack = lightboxHistoryOpen && !fromHistory;
        lightboxHistoryOpen = false;
        lightbox.classList.remove('active');
        applyScale(100);
        document.body.style.overflow = '';

        if (shouldStepBack) {
          try {
            history.back();
          } catch {
            // Ignore history failures; the modal is already closed.
          }
        }
      };

      const openLightbox = (imgSrc, imgAlt) => {
        fitSize = { width: 0, height: 0 };
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt || 'تصویر آموزش';
        lightboxTitle.textContent = imgAlt || '';
        currentScale = minScale;
        updateZoomUi();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        pushLightboxHistory();

        const prepareImage = () => {
          resetImageToFit();
        };

        if (lightboxImg.complete) {
          requestAnimationFrame(prepareImage);
        } else {
          lightboxImg.onload = () => requestAnimationFrame(prepareImage);
        }
      };

      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || (e.target.classList.contains('lightbox-img-wrapper') && currentScale === minScale)) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });

      window.addEventListener('popstate', () => {
        if (lightbox.classList.contains('active')) {
          closeLightbox({ fromHistory: true });
        }
      });

      zoomSlider.addEventListener('input', (e) => {
        applyScale(parseFloat(e.target.value));
      });

      zoomInBtn.addEventListener('click', () => {
        applyScale(currentScale + 25);
      });

      zoomOutBtn.addEventListener('click', () => {
        applyScale(currentScale - 25);
      });

      zoomToggleBtn.addEventListener('click', () => {
        if (currentScale > 100) {
          applyScale(100);
        } else {
          applyScale(250);
        }
      });

      lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }

        if (currentScale > 100) {
          applyScale(100);
        } else {
          applyScale(250, e);
        }
      });

      // Mouse Wheel Zoom
      wrapper.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('active')) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 20 : -20;
        applyScale(currentScale + delta, e);
      }, { passive: false });

      // Drag to Pan when Zoomed
      wrapper.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        if (e.pointerType === 'touch') {
          touchPointers.set(e.pointerId, {
            pointerId: e.pointerId,
            clientX: e.clientX,
            clientY: e.clientY,
          });
          wrapper.setPointerCapture(e.pointerId);

          if (touchPointers.size >= 2) {
            e.preventDefault();
            beginPinchZoom();
            return;
          }
        }

        if (currentScale <= 100) return;

        e.preventDefault();
        isDragging = true;
        activePointerId = e.pointerId;
        wrapper.classList.add('is-dragging');
        if (!wrapper.hasPointerCapture(activePointerId)) {
          wrapper.setPointerCapture(activePointerId);
        }
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;
      });

      const stopPointerInteraction = (e) => {
        if (e.pointerType === 'touch') {
          touchPointers.delete(e.pointerId);
        }

        if (isDragging && e.pointerId === activePointerId) {
          const moved = Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4;
          suppressNextClick = moved;
          isDragging = false;
          activePointerId = null;
          wrapper.classList.remove('is-dragging');
        }

        if (isPinching && touchPointers.size < 2) {
          isPinching = false;
          suppressNextClick = true;
          wrapper.classList.remove('is-pinching');

          if (touchPointers.size === 1 && currentScale > minScale) {
            const remainingTouch = getTouchPoints()[0];
            isDragging = true;
            activePointerId = remainingTouch.pointerId;
            startX = remainingTouch.clientX;
            startY = remainingTouch.clientY;
            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;
            wrapper.classList.add('is-dragging');
          }
        }

        if (wrapper.hasPointerCapture(e.pointerId)) {
          wrapper.releasePointerCapture(e.pointerId);
        }
      };

      wrapper.addEventListener('pointerup', stopPointerInteraction);
      wrapper.addEventListener('pointercancel', stopPointerInteraction);

      wrapper.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' && touchPointers.has(e.pointerId)) {
          touchPointers.set(e.pointerId, {
            pointerId: e.pointerId,
            clientX: e.clientX,
            clientY: e.clientY,
          });
        }

        if (isPinching && touchPointers.size >= 2) {
          const points = getTouchPoints();
          const distance = getTouchDistance(points);
          const zoomRatio = pinchStartDistance > 0 ? distance / pinchStartDistance : 1;

          e.preventDefault();
          suppressNextClick = true;
          applyScale(pinchStartScale * zoomRatio, getTouchMidpoint(points));
          return;
        }

        if (!isDragging || e.pointerId !== activePointerId) return;
        e.preventDefault();
        wrapper.scrollLeft = scrollLeft - (e.clientX - startX);
        wrapper.scrollTop = scrollTop - (e.clientY - startY);
      });

      figures.forEach((fig) => {
        const img = fig.querySelector('img');
        if (!img) return;

        if (!fig.querySelector('.fig-fullscreen-btn')) {
          const fullBtn = document.createElement('button');
          fullBtn.className = 'fig-fullscreen-btn';
          fullBtn.setAttribute('type', 'button');
          fullBtn.setAttribute('aria-label', 'بزرگ‌نمایی عکس');
          fullBtn.setAttribute('title', 'فول اسکرین');
          fullBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M16 3h3a2 2 0 0 1 2 2v3"></path>
              <path d="M21 16v3a2 2 0 0 1-2 2h-3"></path>
              <path d="M8 21H5a2 2 0 0 1-2-2v-3"></path>
            </svg>
          `;

          fullBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src, img.alt);
          });

          img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
          });

          fig.appendChild(fullBtn);
        }
      });
    };

    initCodeBlocks();
    initImageLightbox();
  });
})();
