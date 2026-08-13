/**
 * Componente SlideUp per animazioni di ingresso con slide verso l'alto
 * @typedef {Object} SlideUpProps
 * @property {React.ReactNode} children - Contenuto da animare
 * @property {number} [delay=0] - Ritardo in ms prima dell'animazione
 */

import { useEffect, useRef } from 'react';

export default function SlideUp({ children, delay = 0 }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      const el = elementRef.current;
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      
      const timer = setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return <div ref={elementRef}>{children}</div>;
}
