'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { bindFireWake, getFireSources, smoothstep } from '../lib/fire';

// Vitesse de défilement (px/s) à partir de laquelle la page commence à fumer,
// et à laquelle le feu est à pleine intensité
const SCROLL_MIN = 1400;
const SCROLL_MAX = 6500;
// Au-delà, c'est un saut programmatique (changement de page, retour en haut instantané)
const SCROLL_JUMP = 25000;

// Chaleur accumulée : l'effet ne démarre qu'après un mouvement rapide soutenu, et
// retombe dès qu'on ralentit. heatTime (par source) = durée à pleine vitesse pour
// atteindre la chaleur maximale.
const DEFAULT_HEAT_TIME = 2.5;
const COOL_TIME = 1.2;
const HEAT_START = 0.35; // chaleur à partir de laquelle la fumée apparaît

// Surtout de la fumée ; quelques braises seulement tout en haut de l'échelle
const SMOKE_RATE = 90;
const FLAME_RATE = 90;
const FLAME_THRESHOLD = 0.75;
const SPARK_RATE = 30;
const SPARK_THRESHOLD = 0.9;

// Les flammes sont dessinées en mélange additif sur un calque à demi-résolution :
// là où elles se superposent, l'orange monte vers le jaune puis le blanc (cœur du foyer),
// et la basse résolution adoucit les contours. Le calque est ensuite posé sur la page.
const FIRE_LAYER_SCALE = 0.5;

// Dégradé radial doux pré-rendu : une particule = un drawImage
function makeSprite(size, stops) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function createSprites() {
  return {
    // Couleurs peu opaques : c'est leur accumulation additive qui fait le feu
    core: makeSprite(64, [[0, 'rgba(255,200,60,1)'], [0.4, 'rgba(255,140,20,0.7)'], [1, 'rgba(255,90,10,0)']]),
    flame: makeSprite(64, [[0, 'rgba(255,110,15,0.9)'], [0.45, 'rgba(235,60,10,0.5)'], [1, 'rgba(200,30,0,0)']]),
    ember: makeSprite(64, [[0, 'rgba(200,40,10,0.7)'], [0.5, 'rgba(150,25,10,0.3)'], [1, 'rgba(120,20,10,0)']]),
    smoke: makeSprite(64, [[0, 'rgba(95,95,102,0.22)'], [0.5, 'rgba(120,120,126,0.1)'], [1, 'rgba(140,140,146,0)']]),
    spark: makeSprite(16, [[0, 'rgba(255,248,200,1)'], [0.4, 'rgba(255,180,60,0.9)'], [1, 'rgba(255,120,20,0)']]),
  };
}

export default function FireCanvas() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sprites = createSprites();
    const fireLayer = document.createElement('canvas');
    const fireCtx = fireLayer.getContext('2d');

    let width = 0;
    let height = 0;
    let maxParticles = 800;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fireLayer.width = Math.max(1, Math.round(width * FIRE_LAYER_SCALE));
      fireLayer.height = Math.max(1, Math.round(height * FIRE_LAYER_SCALE));
      fireCtx.setTransform(FIRE_LAYER_SCALE, 0, 0, FIRE_LAYER_SCALE, 0, 0);
      maxParticles = width < 768 ? 450 : 1600;
      // Densité du foyer proportionnelle à sa largeur : même aspect sur mobile et desktop
      pageSource.density = Math.min(4.5, Math.max(1, width / 330));
    };

    const particles = [];
    const accumulators = new WeakMap();
    let raf = null;
    let lastTime = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // Source intégrée : le défilement de la page, flammes montant du bas de l'écran
    const pageSource = {
      density: 1,
      heatTime: 0.8,
      sample: () => smoothstep(SCROLL_MIN, SCROLL_MAX, Math.abs(scrollVelocity)),
      spawn: (p, kind) => {
        p.x = Math.random() * width;
        p.y = height + 12;
        // En descendant, le contenu monte : les flammes sont aspirées vers le haut
        const pull = Math.max(0, scrollVelocity) * 0.05;
        p.vx = (Math.random() - 0.5) * 50;
        p.vy = kind === 'spark' ? -(500 + Math.random() * 500) - pull : -(120 + Math.random() * 180) - pull;
        return true;
      },
    };

    resize();
    window.addEventListener('resize', resize);

    const spawn = (source, kind, intensity) => {
      if (particles.length >= maxParticles) return;
      const p = { x: 0, y: 0, vx: 0, vy: 0, life: 0, kind, seed: Math.random() * 100 };
      // Quelques essais : une source peut refuser les positions hors écran
      let placed = false;
      for (let attempt = 0; attempt < 3 && !placed; attempt++) placed = source.spawn(p, kind) !== false;
      if (!placed) return;
      if (kind === 'flame') {
        // Petites braises, pas des flammes
        p.max = 0.3 + Math.random() * 0.35;
        p.size = (10 + Math.random() * 14) * (0.8 + 0.4 * intensity);
      } else if (kind === 'smoke') {
        p.max = 1.6 + Math.random() * 1.2;
        p.size = (50 + Math.random() * 60) * (0.7 + 0.5 * intensity);
        p.vx *= 0.4;
        p.vy = p.vy * 0.4 - 30;
      } else {
        p.max = 0.5 + Math.random() * 0.6;
        p.size = 4 + Math.random() * 5;
      }
      particles.push(p);
    };

    const emit = (source, kind, rate, dt, intensity) => {
      let acc = accumulators.get(source);
      if (!acc) accumulators.set(source, (acc = { flame: 0, smoke: 0, spark: 0 }));
      acc[kind] += rate * dt;
      while (acc[kind] >= 1) {
        acc[kind] -= 1;
        spawn(source, kind, intensity);
      }
    };

    const frame = (time) => {
      const dt = Math.min(0.05, lastTime ? (time - lastTime) / 1000 : 1 / 60);
      lastTime = time;

      // Vitesse de défilement lissée (les sauts programmatiques sont ignorés)
      const scrollY = window.scrollY;
      let velocity = (scrollY - lastScrollY) / dt;
      lastScrollY = scrollY;
      if (Math.abs(velocity) > SCROLL_JUMP) velocity = 0;
      scrollVelocity += (velocity - scrollVelocity) * Math.min(1, dt * 10);

      let active = false;
      for (const source of [pageSource, ...getFireSources()]) {
        // speed : vitesse instantanée (0-1) ; heat : chaleur accumulée dans le temps
        const speed = source.sample(dt);
        const heat = source.heat || 0;
        source.heat = speed > 0.05
          ? Math.min(1, heat + (speed * dt) / (source.heatTime || DEFAULT_HEAT_TIME))
          : Math.max(0, heat - dt / COOL_TIME);
        if (source.heat > 0) active = true;
        const intensity = speed * smoothstep(HEAT_START, 1, source.heat);
        if (intensity <= 0) continue;
        const density = source.density || 1;
        emit(source, 'smoke', SMOKE_RATE * density * intensity, dt, intensity);
        if (intensity > FLAME_THRESHOLD) {
          emit(source, 'flame', FLAME_RATE * density * (intensity - FLAME_THRESHOLD) / (1 - FLAME_THRESHOLD), dt, intensity);
        }
        if (intensity > SPARK_THRESHOLD) {
          emit(source, 'spark', SPARK_RATE * density * (intensity - SPARK_THRESHOLD) / (1 - SPARK_THRESHOLD), dt, intensity);
        }
      }

      // Physique : flammes aspirées vers le haut avec turbulence, fumée lente, étincelles balistiques
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          // Une flamme qui meurt laisse parfois de la fumée derrière elle
          if (p.kind === 'flame' && Math.random() < 0.18 && particles.length < maxParticles) {
            particles.push({ x: p.x, y: p.y, vx: p.vx * 0.3, vy: -40, life: 0, max: 1.2 + Math.random(), size: p.size * 1.1, kind: 'smoke', seed: p.seed });
          }
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }
        if (p.kind === 'flame') {
          p.vy -= 280 * dt;
          p.vx += Math.sin(p.life * 9 + p.seed) * 140 * dt;
          p.vx *= 1 - 1.8 * dt;
        } else if (p.kind === 'smoke') {
          p.vy -= 25 * dt;
          p.vx += Math.sin(p.life * 2 + p.seed) * 25 * dt;
          p.vx *= 1 - 0.8 * dt;
          p.vy *= 1 - 0.6 * dt;
        } else {
          p.vy += 520 * dt;
          p.vx *= 1 - 0.6 * dt;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      ctx.clearRect(0, 0, width, height);
      fireCtx.globalCompositeOperation = 'source-over';
      fireCtx.clearRect(0, 0, width, height);

      // Fumée : grandes volutes douces qui grossissent et se dissipent
      for (const p of particles) {
        if (p.kind !== 'smoke') continue;
        const t = p.life / p.max;
        const size = p.size * (1 + 1.8 * t);
        fireCtx.globalAlpha = Math.sin(Math.PI * t) * 0.6;
        fireCtx.drawImage(sprites.smoke, p.x - size / 2, p.y - size / 2, size, size);
      }

      // Braises et étincelles : mélange additif par-dessus la fumée
      fireCtx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        if (p.kind === 'smoke') continue;
        const t = p.life / p.max;
        if (p.kind === 'flame') {
          const size = p.size * (1 - 0.55 * t);
          const w = size * 0.75;
          const h = size * 1.7;
          fireCtx.globalAlpha = Math.pow(1 - t, 1.2);
          const sprite = t < 0.3 ? sprites.core : t < 0.7 ? sprites.flame : sprites.ember;
          fireCtx.drawImage(sprite, p.x - w / 2, p.y - h / 2, w, h);
        } else {
          const size = p.size * (1 - 0.5 * t) * 2;
          fireCtx.globalAlpha = 1 - t;
          fireCtx.drawImage(sprites.spark, p.x - size / 2, p.y - size / 2, size, size);
        }
      }
      fireCtx.globalAlpha = 1;
      if (particles.length > 0) ctx.drawImage(fireLayer, 0, 0, width, height);

      // La boucle continue tant que la page défile : la vitesse lissée doit pouvoir
      // monter jusqu'au seuil sur plusieurs images
      if (active || particles.length > 0 || Math.abs(scrollVelocity) > 30) {
        raf = requestAnimationFrame(frame);
      } else {
        // Au repos : plus aucune boucle d'animation
        raf = null;
        scrollVelocity = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const wake = () => {
      if (raf !== null) return;
      lastTime = 0;
      lastScrollY = window.scrollY;
      raf = requestAnimationFrame(frame);
    };

    const unbind = bindFireWake(wake);
    window.addEventListener('scroll', wake, { passive: true });

    return () => {
      unbind();
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', resize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[45]"
    />
  );
}
