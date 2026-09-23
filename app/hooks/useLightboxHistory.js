'use client';

import { useCallback, useEffect, useRef } from 'react';

// Reflète la photo ouverte dans l'URL (/gallery/<id>) pour que le lien soit
// partageable et que le bouton « retour » ferme la visionneuse au lieu de
// quitter la page. Une seule entrée d'historique est ajoutée à l'ouverture ;
// la navigation précédente/suivante la remplace.
export function useLightboxHistory(photoId, onClose) {
  const pushedRef = useRef(false);
  const scrollYRef = useRef(0);

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
      // Le navigateur remettrait la page à sa position d'ouverture : on garde la
      // position actuelle, où la grille a pu défiler pour suivre la photo affichée
      const y = scrollYRef.current;
      window.scrollTo(0, y);
      requestAnimationFrame(() => window.scrollTo(0, y));
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  // Position de défilement à conserver à la fermeture. La page est figée pendant que la
  // visionneuse est ouverte : seul le suivi de la photo affichée la fait défiler, on la
  // relève donc après chaque changement de photo (une fois ce défilement appliqué)
  useEffect(() => {
    if (!photoId) return;
    const frame = requestAnimationFrame(() => { scrollYRef.current = window.scrollY; });
    return () => cancelAnimationFrame(frame);
  }, [photoId]);

  // À utiliser pour toute fermeture déclenchée par l'UI (bouton, Échap, swipe)
  return useCallback(() => {
    if (pushedRef.current) {
      scrollYRef.current = window.scrollY;
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);
}
