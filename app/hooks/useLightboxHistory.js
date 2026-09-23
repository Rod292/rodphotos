'use client';

import { useCallback, useEffect, useRef } from 'react';

// Reflète la photo ouverte dans l'URL (/gallery/<id>) pour que le lien soit
// partageable et que le bouton « retour » ferme la visionneuse au lieu de
// quitter la page. Une seule entrée d'historique est ajoutée à l'ouverture ;
// la navigation précédente/suivante la remplace.
export function useLightboxHistory(photoId, onClose) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!photoId) return;
    const url = `/gallery/${photoId}`;
    if (pushedRef.current) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
      pushedRef.current = true;
    }
  }, [photoId]);

  useEffect(() => {
    const handlePopState = () => {
      if (!pushedRef.current) return;
      pushedRef.current = false;
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  // À utiliser pour toute fermeture déclenchée par l'UI (bouton, Échap, swipe)
  return useCallback(() => {
    if (pushedRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);
}
