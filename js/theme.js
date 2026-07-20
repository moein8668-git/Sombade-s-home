(() => {
  const lightTheme = 'light';
  const storageKey = 'sombade-theme';

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // The theme still works when browser storage is unavailable.
  }

  // "default" was the old name for what is now the light theme.
  if (savedTheme === lightTheme || savedTheme === 'default') {
    document.documentElement.dataset.theme = lightTheme;
  }

  const updateButton = (button, isLight) => {
    const icon = button.querySelector('.theme-toggle__icon');
    const label = button.querySelector('.theme-toggle__label');

    button.setAttribute('aria-pressed', String(isLight));
    button.setAttribute(
      'aria-label',
      isLight ? 'فعال کردن تم شب' : 'فعال کردن تم روشن'
    );

    icon.textContent = isLight ? '🌌' : '☀️';
    label.textContent = isLight ? 'تم شب' : 'تم روشن';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');

    if (!button) {
      return;
    }

    updateButton(button, document.documentElement.dataset.theme === lightTheme);

    button.addEventListener('click', () => {
      const isLight = document.documentElement.dataset.theme !== lightTheme;

      if (isLight) {
        document.documentElement.dataset.theme = lightTheme;
      } else {
        delete document.documentElement.dataset.theme;
      }

      try {
        localStorage.setItem(storageKey, isLight ? lightTheme : 'night');
      } catch {
        // Ignore storage failures; the current page still changes theme.
      }

      updateButton(button, isLight);
    });
  });
})();
