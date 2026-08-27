/**
 * Preset di avatar selezionabili: 12 segni zodiacali, disegnati dall'utente
 * (linea nera su sfondo trasparente, `public/avatars/*.png`), applicati come
 * CSS mask cosi' il colore resta gestibile via Tailwind (bg-*-container/
 * text-on-*-container) come il resto del design system — stesso principio
 * dei preset a icona di prima, ma con un'immagine al posto di un'icona
 * Material Symbols (che non copre i segni zodiacali).
 * Uguale per tutti e 12: solo il simbolo cambia.
 * @typedef {Object} AvatarOption
 * @property {string} id
 * @property {string} image - Percorso dell'immagine (PNG, linea nera su trasparente)
 * @property {string} label - Nome del segno, in italiano (usato per l'aria-label)
 * @property {string} bg - Classe Tailwind di sfondo
 * @property {string} text - Classe Tailwind del colore del simbolo (letta come background-color della mask)
 */

const AVATAR_BG = 'bg-primary-container';
const AVATAR_TEXT = 'text-on-primary-container';

/** @type {AvatarOption[]} */
export const AVATAR_OPTIONS = [
  { id: 'ariete', image: '/avatars/ariete.png', label: 'Ariete', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'toro', image: '/avatars/toro.png', label: 'Toro', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'gemelli', image: '/avatars/gemelli.png', label: 'Gemelli', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'cancro', image: '/avatars/cancro.png', label: 'Cancro', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'leone', image: '/avatars/leone.png', label: 'Leone', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'vergine', image: '/avatars/vergine.png', label: 'Vergine', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'bilancia', image: '/avatars/bilancia.png', label: 'Bilancia', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'scorpione', image: '/avatars/scorpione.png', label: 'Scorpione', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'sagittario', image: '/avatars/sagittario.png', label: 'Sagittario', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'capricorno', image: '/avatars/capricorno.png', label: 'Capricorno', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'acquario', image: '/avatars/acquario.png', label: 'Acquario', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'pesci', image: '/avatars/pesci.png', label: 'Pesci', bg: AVATAR_BG, text: AVATAR_TEXT },
];

/**
 * @param {string | null | undefined} id
 * @returns {AvatarOption | null} L'opzione corrispondente, o null se non trovata/non impostata
 */
export function getAvatarOption(id) {
  if (!id) return null;
  return AVATAR_OPTIONS.find((option) => option.id === id) || null;
}
