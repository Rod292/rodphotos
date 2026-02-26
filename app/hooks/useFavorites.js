'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rodphotos-favorites';

function readFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const toggle = useCallback((photoId) => {
    setFavorites((prev) => {
      const next = prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (photoId) => favorites.includes(photoId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
