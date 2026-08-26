/*
 * check-aspect.js — fail if any picture in a .pptx is stretched.
 *
 *     node check-aspect.js "../Engineering _ Class 01 _ Welcome (2026).pptx"
 *
 * For every <p:pic>, compares the shape's on-slide ratio against the ratio of
 * the embedded image file, adjusted for any <a:srcRect> crop.  More than 1%
 * apart means the picture is being stretched to fit its box, which is a defect
 * no other check catches: the file opens, the XSD passes, and the validator is
 * happy.  It only looks wrong.
 *
 * This exists because pptxgenjs's `sizing: {type:"contain"|"cover"}` writes an
 * all-zero <a:srcRect> and stretches the image, and its `{type:"crop"}` emits a
 * negative `r`.  Both produced silently distorted slides.
 */

const fs = require("fs");
const path = require("path");
const { imageSize } = require("image-size");
const AdmZip = require("adm-zip");

const TOLERANCE = 0.01;   // 1%

const file = process.argv[2];
if (!file) { console.error("usage: node check-aspect.js <deck.pptx>"); process.exit(2); }

const zip = new AdmZip(file);
const read = n => { const e = zip.getEntry(n); return e ? e.getData() : null; };
const text = n => { const b = read(n); return b ? b.toString("utf8") : null; };

let checked = 0;
const bad = [];

const slides = zip.getEntries()
  .map(e => e.entryName)
  .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
  .sort((a, b) => (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]));

for (const sn of slides) {
  const xml  = text(sn);
  const rels = text(sn.replace(/slides\//, "slides/_rels/") + ".rels") || "";
  const map  = {};
  for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) map[m[1]] = m[2];

  for (const pic of xml.matchAll(/<p:pic>[\s\S]*?<\/p:pic>/g)) {
    const blob = pic[0];
    const rid  = (blob.match(/r:embed="([^"]+)"/) || [])[1];
    const ext  = blob.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!rid || !ext || !map[rid]) continue;

    const media = path.posix.normalize("ppt/slides/" + map[rid]).replace(/^\.\.\//, "");
    const data  = read(media.startsWith("ppt/") ? media : "ppt/" + media);
    if (!data) continue;

    const shown = +ext[1] / +ext[2];
    const nat   = imageSize(data);
    let srcAr   = nat.width / nat.height;

    const sr = blob.match(/<a:srcRect([^/]*)\/>/);
    if (sr) {
      const g = a => (+((sr[1].match(new RegExp(a + '="(-?\\d+)"')) || [0, 0])[1])) / 100000;
      const keptW = 1 - g("l") - g("r"), keptH = 1 - g("t") - g("b");
      if (keptW > 0 && keptH > 0) srcAr = srcAr * keptW / keptH;
      if (g("l") < 0 || g("r") < 0 || g("t") < 0 || g("b") < 0) {
        bad.push(`${sn}  ${path.basename(media)}  negative srcRect — pptxgenjs crop bug`);
        continue;
      }
    }

    checked++;
    const err = Math.abs(shown - srcAr) / srcAr;
    if (err > TOLERANCE) {
      bad.push(`${path.basename(sn).padEnd(12)} ${path.basename(media).padEnd(18)} ` +
               `shown ${shown.toFixed(3)}  source ${srcAr.toFixed(3)}  off by ${(err * 100).toFixed(1)}%`);
    }
  }
}

if (bad.length) {
  console.error(`ASPECT RATIO FAILURES (${bad.length} of ${checked} pictures):\n`);
  bad.forEach(b => console.error("  " + b));
  console.error("\nFix: place pictures through place() in build-class01-welcome.js.");
  console.error("Never use pptxgenjs `sizing` — it stretches images silently.");
  process.exit(1);
}

console.log(`All ${checked} pictures keep their aspect ratio (within ${TOLERANCE * 100}%).`);
