import { useState, useEffect } from 'react';
import { getAvatar, subscribeToAvatarChanges } from '../../../logic/preferences.js';
import { getAvatarOption } from './avatarOptions.js';

const SIZE_CLASSES = {
  sm: { circle: 'w-8 h-8', icon: 'text-base' },
  md: { circle: 'w-10 h-10', icon: 'text-lg' },
  lg: { circle: 'w-16 h-16', icon: 'text-2xl' },
};

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
  const { circle, icon } = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!option) {
    return (
      <div
        className={`${circle} rounded-full bg-surface-variant dark:bg-surface-container-highest border border-outline-variant flex items-center justify-center shrink-0 ${className}`}
      >
        <span className={`material-symbols-outlined text-on-surface-variant dark:text-on-surface ${icon}`}>
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
      <span className={`${option.text} ${icon}`} aria-hidden="true">{option.symbol}</span>
    </div>
  );
}
