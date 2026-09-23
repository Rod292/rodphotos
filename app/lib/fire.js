'use client';

// Sources de « chaleur » pour l'effet de feu (FireCanvas). Une source expose :
// - sample(dt) : intensité de 0 à 1 à cette image (0 = pas d'émission)
// - spawn(p, kind) : place la particule (x, y, vx, vy) ; renvoie false pour l'ignorer
// - density (optionnel) : multiplicateur du nombre de particules émises
// - heatTime (optionnel) : secondes de mouvement à pleine vitesse pour chauffer au maximum
// Une source qui s'active appelle wakeFire() : le canvas ne tourne pas au repos.

const sources = new Set();
let wake = null;

export function registerFireSource(source) {
  sources.add(source);
  return () => sources.delete(source);
}

export function getFireSources() {
  return sources;
}

export function wakeFire() {
  wake?.();
}

export function bindFireWake(fn) {
  wake = fn;
  return () => {
    if (wake === fn) wake = null;
  };
}

export function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
