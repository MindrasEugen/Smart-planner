// Generatore icone PWA per Agenda Intelligente.
// Nessuna dipendenza: rasterizza con supersampling 4x e codifica PNG a mano.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = process.argv[2];
if (!OUT_DIR) throw new Error('Uso: node gen-icons.mjs <cartella-public>');

// --- Palette dal design system (src/styles/global.css) ---
const BG = [0x00, 0x20, 0x45]; // --color-primary
const CARD = [0xff, 0xff, 0xff];
const BAND = [0xb5, 0x18, 0x22]; // --color-secondary
const MARK = [0x00, 0x20, 0x45]; // --color-primary

// --- CRC32 per i chunk PNG ---
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  // 10..12 = compression / filter / interlace = 0

  // Scanline con filtro 0 (None)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const dst = y * (1 + width * 4);
    raw[dst] = 0;
    rgba.copy(raw, dst + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Geometria (coordinate normalizzate 0..1) ---
function insideRoundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

// Calendario centrato nella safe zone maskable (contenuto entro il 60% centrale)
const CARD_X0 = 0.235, CARD_X1 = 0.765;
const CARD_Y0 = 0.275, CARD_Y1 = 0.775;
const CARD_R = 0.055;
const BAND_Y1 = 0.395;      // fine della fascia rossa
const RING_Y0 = 0.205, RING_Y1 = 0.315, RING_R = 0.022;
const RING1_X0 = 0.345, RING1_X1 = 0.405;
const RING2_X0 = 0.595, RING2_X1 = 0.655;
const CHECK_W = 0.038;      // semi-spessore del segno di spunta

/**
 * Colore del punto (x, y) in coordinate normalizzate
 * @returns {number[]} RGB
 */
function sample(x, y) {
  // Anelli sopra la fascia (disegnati per primi, il calendario li copre in parte)
  const onRing =
    insideRoundedRect(x, y, RING1_X0, RING_Y0, RING1_X1, RING_Y1, RING_R) ||
    insideRoundedRect(x, y, RING2_X0, RING_Y0, RING2_X1, RING_Y1, RING_R);

  if (insideRoundedRect(x, y, CARD_X0, CARD_Y0, CARD_X1, CARD_Y1, CARD_R)) {
    if (y <= BAND_Y1) return BAND;

    // Segno di spunta nel corpo del calendario
    const d = Math.min(
      distToSegment(x, y, 0.360, 0.585, 0.455, 0.680),
      distToSegment(x, y, 0.455, 0.680, 0.645, 0.475)
    );
    return d <= CHECK_W ? MARK : CARD;
  }

  if (onRing) return CARD;
  return BG;
}

/**
 * Genera i pixel RGBA di un'icona quadrata, con antialiasing 4x
 * @param {number} size - Lato in pixel
 * @returns {Buffer} Buffer RGBA
 */
function render(size) {
  const SS = 4;
  const out = Buffer.alloc(size * size * 4);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const c = sample((px + (sx + 0.5) / SS) / size, (py + (sy + 0.5) / SS) / size);
          r += c[0]; g += c[1]; b += c[2];
        }
      }
      const n = SS * SS;
      const i = (py * size + px) * 4;
      out[i] = Math.round(r / n);
      out[i + 1] = Math.round(g / n);
      out[i + 2] = Math.round(b / n);
      out[i + 3] = 255; // opaco: richiesto per le icone maskable
    }
  }
  return out;
}

// --- ICO con PNG incorporati (supportato da Windows Vista+ e da tutti i browser moderni) ---
function encodeICO(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);              // reserved
  header.writeUInt16LE(1, 2);              // type: icona
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0;                              // palette
    e[3] = 0;                              // reserved
    e.writeUInt16LE(1, 4);                 // color planes
    e.writeUInt16LE(32, 6);                // bit per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

// --- Output ---
mkdirSync(join(OUT_DIR, 'icons'), { recursive: true });

for (const size of [192, 512]) {
  const png = encodePNG(size, size, render(size));
  const path = join(OUT_DIR, 'icons', `icon-${size}x${size}.png`);
  writeFileSync(path, png);
  console.log(`${path}  ${png.length} byte`);
}

// Apple touch icon (180x180, senza trasparenza)
const apple = encodePNG(180, 180, render(180));
writeFileSync(join(OUT_DIR, 'icons', 'apple-touch-icon.png'), apple);
console.log(`${join(OUT_DIR, 'icons', 'apple-touch-icon.png')}  ${apple.length} byte`);

const ico = encodeICO([16, 32, 48].map((size) => ({ size, png: encodePNG(size, size, render(size)) })));
writeFileSync(join(OUT_DIR, 'favicon.ico'), ico);
console.log(`${join(OUT_DIR, 'favicon.ico')}  ${ico.length} byte (16/32/48)`);
