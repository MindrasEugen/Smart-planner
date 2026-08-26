/**
 * Preset di avatar selezionabili: simbolo zodiacale (carattere Unicode,
 * nessun font/icona da caricare) su un colore "container" del design
 * system, uguale per tutti e 12 — solo il simbolo cambia. Coppia
 * bg-primary-container/text-on-primary-container deliberatamente
 * self-contained: invariata tra tema chiaro e scuro (vedi PLAN.md,
 * sessione 2026-08-25 sul fix del contrasto in dark mode).
 * Material Symbols non ha icone zodiacali (verificato nel catalogo
 * ufficiale prima di scegliere questa strada): i simboli Unicode standard
 * (U+2648–U+2653) sono supportati ovunque senza dipendenze aggiuntive.
 * @typedef {Object} AvatarOption
 * @property {string} id
 * @property {string} symbol - Carattere Unicode del segno zodiacale
 * @property {string} label - Nome del segno, in italiano (usato per l'aria-label)
 * @property {string} bg - Classe Tailwind di sfondo
 * @property {string} text - Classe Tailwind del colore del simbolo
 */

const AVATAR_BG = 'bg-primary-container';
const AVATAR_TEXT = 'text-on-primary-container';

/** @type {AvatarOption[]} */
export const AVATAR_OPTIONS = [
  { id: 'ariete', symbol: '♈', label: 'Ariete', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'toro', symbol: '♉', label: 'Toro', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'gemelli', symbol: '♊', label: 'Gemelli', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'cancro', symbol: '♋', label: 'Cancro', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'leone', symbol: '♌', label: 'Leone', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'vergine', symbol: '♍', label: 'Vergine', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'bilancia', symbol: '♎', label: 'Bilancia', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'scorpione', symbol: '♏', label: 'Scorpione', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'sagittario', symbol: '♐', label: 'Sagittario', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'capricorno', symbol: '♑', label: 'Capricorno', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'acquario', symbol: '♒', label: 'Acquario', bg: AVATAR_BG, text: AVATAR_TEXT },
  { id: 'pesci', symbol: '♓', label: 'Pesci', bg: AVATAR_BG, text: AVATAR_TEXT },
];

/**
 * @param {string | null | undefined} id
 * @returns {AvatarOption | null} L'opzione corrispondente, o null se non trovata/non impostata
 */
export function getAvatarOption(id) {
  if (!id) return null;
  return AVATAR_OPTIONS.find((option) => option.id === id) || null;
}
