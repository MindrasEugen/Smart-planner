/**
 * Componente ScaleIn per animazioni di ingresso con zoom/subtle scale
 * @typedef {Object} ScaleInProps
 * @property {React.ReactNode} children - Contenuto da animare
 * @property {number} [delay=0] - Ritardo in ms prima dell'animazione
 */

import { useEffect, useRef } from 'react';

export default function ScaleIn({ children, delay = 0 }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      const el = elementRef.current;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.98)';
      
      const timer = setTimeout(() => {
        el.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return <div ref={elementRef}>{children}</div>;
}
