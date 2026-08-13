/**
 * Componente FadeIn usando @mindraseugen/utility-kit
 * Applica animazione fade-in agli elementi figli
 */

import { useEffect, useRef } from 'react';
import { fadeIn } from '@mindraseugen/utility-kit/dom';

/**
 * Componente che applica fadeIn all'elemento quando viene montato
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elemento figlio da animare
 * @param {Object} props.options - Opzioni per fadeIn
 * @returns {JSX.Element}
 */
export default function FadeIn({ children, options = {} }) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      fadeIn(elementRef.current, options);
    }
  }, [options]);

  return (
    <div ref={elementRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
