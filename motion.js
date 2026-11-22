const scene = document.querySelector('.hero');
const progress = document.querySelector('.reading');
const pointer = document.querySelector('.pointer');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const precise = matchMedia('(hover:hover) and (pointer:fine)');
let lastSpark = 0;
let requested = false;
let mouseX = 0;
let mouseY = 0;

function paint() {
  requested = false;
  const rect = scene.getBoundingClientRect();
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (distance > 0 ? scrollY / distance : 0) + ')';
  if (reduced.matches || rect.bottom <= 0) return;
  scene.style.setProperty('--scroll', Math.min(Math.max(-rect.top, 0), 480) + 'px');
  scene.style.setProperty('--mx', mouseX);
  scene.style.setProperty('--my', mouseY);
}
function schedule() {
  if (!requested) {
    requested = true;
    requestAnimationFrame(paint);
  }
}
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
scene.addEventListener('pointermove', event => {
  if (!precise.matches || reduced.matches) return;
  const bounds = scene.getBoundingClientRect();
  mouseX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  mouseY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
  schedule();
});
scene.addEventListener('pointerleave', () => { mouseX = mouseY = 0; schedule(); });
document.addEventListener('pointermove', event => {
  if (!precise.matches || reduced.matches) return;
  pointer.style.opacity = '1';
  pointer.style.transform = 'translate(' + (event.clientX + 68) + 'px,' + (event.clientY + 68) + 'px)';
  if (performance.now() - lastSpark < 50) return;
  lastSpark = performance.now();
  const spark = document.createElement('i');
  spark.className = 'spark';
  spark.style.left = event.clientX + 'px';
  spark.style.top = event.clientY + 'px';
  spark.style.setProperty('--dx', (Math.random() * 24 - 12) + 'px');
  document.body.append(spark);
  spark.addEventListener('animationend', () => spark.remove(), { once: true });
});
document.addEventListener('pointerleave', () => { pointer.style.opacity = '0'; });
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('enter');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.querySelectorAll('.card,.cathead,.feature div').forEach((element, index) => {
    element.style.setProperty('--delay', (index % 3 * .08) + 's');
    reveal.observe(element);
  });
}
const soundButton = document.querySelector('#sound');
let audio;
let soundOn = false;
function tone(hz) {
  if (!soundOn || !audio || audio.state !== 'running') return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime;
  oscillator.frequency.setValueAtTime(hz, now);
  gain.gain.setValueAtTime(.025, now);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .09);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + .1);
}
soundButton.addEventListener('click', async () => {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') await audio.resume();
    soundOn = !soundOn;
    soundButton.lastChild.textContent = soundOn ? ' Sound on' : ' Sound off';
    soundButton.setAttribute('aria-pressed', String(soundOn));
    tone(700);
  } catch { soundButton.hidden = true; }
});
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('pointerenter', () => tone(920));
  link.addEventListener('click', () => tone(550));
});
paint();
