// Validatore: verifica firma, IHDR, CRC di ogni chunk e presenza di IEND.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

function validatePNG(buf, label) {
  const problems = [];
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(SIG)) problems.push('firma PNG errata');

  let off = 8;
  let width = 0, height = 0, colorType = -1, bitDepth = -1;
  let sawIEND = false;
  let idat = [];

  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.subarray(off + 4, off + 8).toString('ascii');
    const data = buf.subarray(off + 8, off + 8 + len);
    const declared = buf.readUInt32BE(off + 8 + len);
    const actual = crc32(buf.subarray(off + 4, off + 8 + len));
    if (declared !== actual) problems.push(`CRC non valido nel chunk ${type}`);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === 'IDAT') idat.push(data);
    if (type === 'IEND') sawIEND = true;
    off += 12 + len;
  }

  if (!sawIEND) problems.push('IEND mancante');
  if (off !== buf.length) problems.push('byte di troppo dopo IEND');

  // I dati compressi devono decomprimersi alla dimensione esatta attesa
  try {
    const raw = inflateSync(Buffer.concat(idat));
    const expected = height * (1 + width * 4);
    if (raw.length !== expected) problems.push(`dati scanline ${raw.length}, attesi ${expected}`);
    for (let y = 0; y < height; y++) {
      if (raw[y * (1 + width * 4)] !== 0) { problems.push(`filtro non valido alla riga ${y}`); break; }
    }
  } catch (e) {
    problems.push(`zlib non decomprimibile: ${e.message}`);
  }

  const desc = `${width}x${height}, bitDepth ${bitDepth}, colorType ${colorType}`;
  console.log(`${problems.length ? 'FALLITO' : 'OK     '} ${label.padEnd(34)} ${desc}`);
  problems.forEach((p) => console.log(`        → ${p}`));
  return problems.length === 0;
}

let allOk = true;
const base = process.argv[2];

for (const f of ['icons/icon-192x192.png', 'icons/icon-512x512.png', 'icons/apple-touch-icon.png']) {
  allOk = validatePNG(readFileSync(`${base}/${f}`), f) && allOk;
}

// ICO: header + directory + PNG incorporati
const ico = readFileSync(`${base}/favicon.ico`);
const reserved = ico.readUInt16LE(0);
const type = ico.readUInt16LE(2);
const count = ico.readUInt16LE(4);
console.log(`\nfavicon.ico: reserved=${reserved} type=${type} immagini=${count}`);
if (reserved !== 0 || type !== 1 || count === 0) {
  console.log('FALLITO  header ICO non valido');
  allOk = false;
}
for (let i = 0; i < count; i++) {
  const e = 6 + i * 16;
  const w = ico[e] === 0 ? 256 : ico[e];
  const size = ico.readUInt32LE(e + 8);
  const offset = ico.readUInt32LE(e + 12);
  if (offset + size > ico.length) {
    console.log(`FALLITO  voce ${i}: offset/size fuori dal file`);
    allOk = false;
    continue;
  }
  allOk = validatePNG(ico.subarray(offset, offset + size), `  ico[${i}] dichiarata ${w}x${w}`) && allOk;
}

console.log(`\n${allOk ? 'TUTTI I FILE SONO VALIDI' : 'CI SONO ERRORI'}`);
process.exit(allOk ? 0 : 1);
