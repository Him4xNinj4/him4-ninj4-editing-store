(() => {
  const pointerMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  for (const cover of document.querySelectorAll('.v4-scene,.v4-access,.welcome-card')) {
    cover.addEventListener('pointermove', event => {
      if (!pointerMotion.matches) return;
      const bounds = cover.getBoundingClientRect();
      const position = (event.clientX - bounds.left) / bounds.width;
      cover.style.setProperty('--pan', (position - 0.5) * 22 + 'px');
    }, { passive: true });
    cover.addEventListener('pointerleave', () => cover.style.removeProperty('--pan'));
  }
})();
