/**
 * Hook di pnpm: Vitest 4 richiede Vite 6+, mentre l'app usa Vite 5 (vincolata da
 * vite-plugin-pwa 0.17). Vitest dichiara Vite sia come dipendenza sia come peer, e
 * pnpm risolve il peer con il Vite 5 dell'app: i test non partono
 * (ERR_PACKAGE_PATH_NOT_EXPORTED su 'vite/module-runner').
 *
 * npm dava a vitest una sua copia annidata di Vite 8.2.1: qui si replica lo stesso
 * comportamento togliendo il peer, cosi' vale la dipendenza propria (fissata a
 * 8.2.1). Il Vite usato da `pnpm dev`/`pnpm build` resta il 5.
 * Da rimuovere quando l'app passera' a Vite 6+.
 */
const VITEST_VITE = '8.2.1';

function readPackage(pkg) {
  if (pkg.name === 'vitest' || pkg.name === '@vitest/mocker') {
    if (pkg.peerDependencies) delete pkg.peerDependencies.vite;
    if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.vite;
    pkg.dependencies = { ...pkg.dependencies, vite: VITEST_VITE };
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
