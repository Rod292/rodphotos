'use client';

// Dernier type d'interaction : clavier ou pointeur (souris, doigt, stylet).
// Sert à ne rendre le focus que lorsqu'il est utile, sans afficher d'indicateur
// de focus clavier après une interaction à la souris.
let lastInputWasKeyboard = false;

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', () => { lastInputWasKeyboard = true; }, true);
  window.addEventListener('pointerdown', () => { lastInputWasKeyboard = false; }, true);
}

export function isKeyboardInput() {
  return lastInputWasKeyboard;
}
