import { useState, useEffect } from 'react';
import { getAvatar, subscribeToAvatarChanges } from '../../../logic/preferences.js';
import { getAvatarOption } from './avatarOptions.js';

const SIZE_CLASSES = {
  sm: { circle: 'w-8 h-8', icon: 'w-6 h-6', personIcon: 'text-base' },
  md: { circle: 'w-10 h-10', icon: 'w-7 h-7', personIcon: 'text-lg' },
  lg: { circle: 'w-16 h-16', icon: 'w-12 h-12', personIcon: 'text-2xl' },
};

/**
 * Stile inline per applicare l'immagine come CSS mask: il colore visibile
 * non e' quello dell'immagine (linea nera su trasparente) ma il
 * background-color dell'elemento — qui `currentColor` (via `bg-current`
 * sulla classe), risolto dal `color` impostato da `option.text` (Tailwind).
 * @param {string} imagePath
 * @returns {Object} Stile React per la mask
 */
export function maskStyle(imagePath) {
  const url = `url(${imagePath})`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  };
}

/**
 * Avatar profilo: mostra l'icona scelta dall'utente (Settings → Immagine
 * profilo) o un placeholder generico se non ancora scelta. Reattivo ai
 * cambi via subscribeToAvatarChanges: TopAppBar e DesktopTopAppBar possono
 * essere entrambi montati insieme (nascosti solo via CSS in base al
 * breakpoint), quindi serve un aggiornamento live, non solo al mount.
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function Avatar({ size = 'md', className = '' }) {
  const [avatarId, setAvatarId] = useState(() => getAvatar());

  useEffect(() => subscribeToAvatarChanges(setAvatarId), []);

  const option = getAvatarOption(avatarId);
  const { circle, icon, personIcon } = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!option) {
    return (
      <div
        className={`${circle} rounded-full bg-surface-variant dark:bg-surface-container-highest border border-outline-variant flex items-center justify-center shrink-0 ${className}`}
      >
        <span className={`material-symbols-outlined text-on-surface-variant dark:text-on-surface ${personIcon}`}>
          person
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${circle} rounded-full ${option.bg} flex items-center justify-center shrink-0 ${className}`}
      aria-label={`Avatar: ${option.label}`}
    >
      <div
        className={`${icon} ${option.text} bg-current`}
        style={maskStyle(option.image)}
        aria-hidden="true"
      />
    </div>
  );
}
