/**
 * Preset di avatar selezionabili: icona Material Symbols su un colore
 * "container" del design system. Usate deliberatamente solo coppie
 * bg-*-container/text-on-*-container (mai token di superficie): sono
 * self-contained, invariate tra tema chiaro e scuro (vedi PLAN.md,
 * sessione 2026-08-25 sul fix del contrasto in dark mode).
 * @typedef {Object} AvatarOption
 * @property {string} id
 * @property {string} icon - Nome icona Material Symbols
 * @property {string} bg - Classe Tailwind di sfondo
 * @property {string} text - Classe Tailwind del colore icona
 */

/** @type {AvatarOption[]} */
export const AVATAR_OPTIONS = [
  { id: 'person-primary', icon: 'person', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { id: 'pets-secondary', icon: 'pets', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { id: 'star-tertiary', icon: 'star', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { id: 'rocket-primary', icon: 'rocket_launch', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { id: 'favorite-secondary', icon: 'favorite', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { id: 'eco-tertiary', icon: 'eco', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { id: 'bolt-primary', icon: 'bolt', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { id: 'emoji-secondary', icon: 'emoji_emotions', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { id: 'sports-tertiary', icon: 'sports_esports', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
];

/**
 * @param {string | null | undefined} id
 * @returns {AvatarOption | null} L'opzione corrispondente, o null se non trovata/non impostata
 */
export function getAvatarOption(id) {
  if (!id) return null;
  return AVATAR_OPTIONS.find((option) => option.id === id) || null;
}
