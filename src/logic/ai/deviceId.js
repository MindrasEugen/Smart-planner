/**
 * Gestisce un identificativo univoco del dispositivo, memorizzato in localStorage.
 * Se assente, genera un nuovo UUID.
 */

/**
 * Legge o genera un ID univoco del dispositivo da localStorage
 * @returns {string} UUID del dispositivo
 */
export function getDeviceId() {
  const storageKey = 'agenda-device-id';
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}
