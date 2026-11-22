(() => {
  const squads = [
    ['morse', 'kairos'], ['suzy', 'orion'], ['nero', 'sonia'],
    ['ryden', 'ignis'], ['oscar', 'kassie'], ['rin', 'ray']
  ];
  const stage = document.querySelector('.fighters .duo');
  const controls = document.querySelector('.squad-switch');
  const label = controls.querySelector('span');
  let selected = 0;
  let revision = 0;
  async function change(step) {
    selected = (selected + step + squads.length) % squads.length;
    const request = ++revision;
    const names = squads[selected];
    const images = names.map((name, slot) => {
      const image = new Image();
      image.className = slot === 0 ? 'rin' : 'ray';
      image.alt = '';
      image.dataset.fighter = name;
      image.src = 'art/' + name + '.webp';
      return image;
    });
    try {
      await Promise.all(images.map(image => image.decode()));
      if (request !== revision) return;
      stage.replaceChildren(...images);
      label.textContent = names.map(n => n[0].toUpperCase() + n.slice(1)).join(' + ');
    } catch {
      if (request === revision) label.textContent = 'Try another squad';
    }
  }
  const [previous, next] = controls.querySelectorAll('button');
  previous.addEventListener('click', () => change(-1));
  next.addEventListener('click', () => change(1));
  controls.hidden = false;
})();
