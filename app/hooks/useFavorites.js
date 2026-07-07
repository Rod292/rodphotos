'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'rodphotos-favorites';
const CHANGE_EVENT = 'rodphotos-favorites-changed';
const EMPTY = [];

let cachedRaw = null;
let cachedFavorites = EMPTY;

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedFavorites = raw ? JSON.parse(raw) : EMPTY;
    } catch {
      cachedFavorites = EMPTY;
    }
  }
  return cachedFavorites;
}

function getServerSnapshot() {
  return EMPTY;
}

function subscribe(callback) {
  // 'storage' couvre les autres onglets, l'événement custom couvre l'onglet courant
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((photoId) => {
    const current = readFavorites();
    const next = current.includes(photoId)
      ? current.filter((id) => id !== photoId)
      : [...current, photoId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isFavorite = useCallback(
    (photoId) => favorites.includes(photoId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
