/*
 * Engineering — Class 01 — Welcome
 *
 * Rebuilds the deck from the images in assets/class01-welcome/ and
 * guides/unit01/images/.  Edit this file, not the .pptx.
 *
 *     cd slides && npm install && node build-class01-welcome.js
 *
 * ---------------------------------------------------------------------------
 * ASPECT RATIO — read this before adding a picture.
 *
 * Never use pptxgenjs's `sizing: { type: "contain" | "cover" }`.  It writes an
 * all-zero <a:srcRect> and stretches the picture to fill the box.  Every image
 * in the first build of this deck was distorted, some by more than 100%, and
 * nothing in the file or the validator complains.  `sizing: { type: "crop" }`
 * is broken in a different way — it emits a negative `r` value.
 *
 * So the geometry is computed here instead:
 *
 *   place(slide, file, frame, "contain")  fits the picture inside the frame at
 *                                         its true ratio and centres it.
 *   place(slide, file, frame, "cover")    centre-crops a copy of the picture to
 *                                         the frame's ratio with sharp, writes
 *                                         it to .build/, and places that.
 *
 * Both hand pptxgenjs a plain x/y/w/h whose ratio already matches the picture,
 * so there is nothing left for it to stretch.  check-aspect.js re-measures the
 * finished file and fails if anything is off by more than 1%.
 * ---------------------------------------------------------------------------
 */

const pptxgen = require("pptxgenjs");
const sharp   = require("sharp");
const path    = require("path");
const fs      = require("fs");
const { imageSize } = require("image-size");

const ROOT  = path.join(__dirname, "..");
const A     = path.join(ROOT, "assets", "class01-welcome") + path.sep;
const E     = path.join(ROOT, "guides", "unit01", "images") + path.sep;
const BUILD = path.join(__dirname, ".build");
const OUT   = path.join(ROOT, "Engineering _ Class 01 _ Welcome (2026).pptx");

fs.mkdirSync(BUILD, { recursive: true });

const INK   = "2B2D31";
const PAPER = "F5F6F7";
const AMBER = "E8871E";
const MUTED = "6B7280";
const GREY  = "9CA3AF";
const WHITE = "FFFFFF";
const CARD  = "FFFFFF";

const HEAD = "Arial";
const BODY = "Calibri";

const W = 13.333, H = 7.5;
const DPI = 150;                       // resolution for cropped derivatives

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Ray Salemi";
pres.title  = "Themes in Engineering - Class 01 Welcome";

/* -------------------------------------------------------------- helpers */

function natural(file) {
  const d = imageSize(fs.readFileSync(file));
  return { w: d.width, h: d.height, ar: d.width / d.height };
}

// Fit inside the frame at true ratio, centred. Returns the placement rect.
function containRect(file, f) {
  const ar = natural(file).ar;
  let w = f.w, h = w / ar;
  if (h > f.h) { h = f.h; w = h * ar; }
  return { x: f.x + (f.w - w) / 2, y: f.y + (f.h - h) / 2, w, h };
}

// Centre-crop a copy to exactly the frame's ratio. Never upscales.
async function coverFile(file, f) {
  const n   = natural(file);
  const tag = path.basename(file).replace(/\.[^.]+$/, "");
  const out = path.join(BUILD, `${tag}_${f.w.toFixed(2)}x${f.h.toFixed(2)}.png`);
  if (!fs.existsSync(out)) {
    const frameAr = f.w / f.h;
    // largest centred region of the source with the frame's ratio
    let cw = n.w, ch = Math.round(n.w / frameAr);
    if (ch > n.h) { ch = n.h; cw = Math.round(n.h * frameAr); }
    const px = Math.min(cw, Math.round(f.w * DPI));
    await sharp(file)
      .extract({ left: Math.round((n.w - cw) / 2), top: Math.round((n.h - ch) / 2),
                 width: cw, height: ch })
      .resize({ width: px })
      .png()
      .toFile(out);
  }
  return out;
}

async function place(slide, file, f, mode = "contain") {
  if (mode === "cover") {
    slide.addImage({ path: await coverFile(file, f), x: f.x, y: f.y, w: f.w, h: f.h });
  } else {
    slide.addImage(Object.assign({ path: file }, containRect(file, f)));
  }
}

function light() { const s = pres.addSlide(); s.background = { color: PAPER }; return s; }
function dark()  { const s = pres.addSlide(); s.background = { color: INK   }; return s; }

function title(s, text, o = {}) {
  s.addText(text, {
    x: 0.7, y: o.y || 0.55, w: o.w || 11.9, h: o.h || 1.0,
    fontFace: HEAD, fontSize: o.size || 38, bold: true, color: o.color || INK,
    align: "left", valign: "middle", margin: 0, isTextBox: true,
  });
}

function card(s, x, y, w, h) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: CARD }, line: { color: "E3E5E8", width: 1 },
    shadow: { type: "outer", angle: 90, offset: 2, blur: 8, color: "000000", opacity: 0.08 },
  });
}

/* ------------------------------------------------------------------ deck */

async function build() {

/* 1 — find your seat -------------------------------------------------- */
{
  const s = light();
  title(s, "Please find your seat");
  await place(s, A + "s03-seating-chart.png", { x: 1.4, y: 1.75, w: 10.5, h: 5.0 });
}

/* 2 — title ----------------------------------------------------------- */
{
  const s = dark();
  await place(s, A + "s28-breadboard-prototype.jpg", { x: 6.9, y: 0, w: 6.433, h: H }, "cover");
  s.addText("Themes in\nEngineering", {
    x: 0.85, y: 2.15, w: 5.6, h: 2.3, fontFace: HEAD, fontSize: 48, bold: true,
    color: WHITE, lineSpacing: 50, margin: 0, isTextBox: true,
  });
  s.addText("Welcome", {
    x: 0.85, y: 4.55, w: 5.6, h: 0.5, fontFace: BODY, fontSize: 22,
    color: AMBER, margin: 0, isTextBox: true,
  });
  s.addText("Mr. Salemi  ·  Natick High School", {
    x: 0.85, y: 5.15, w: 5.6, h: 0.4, fontFace: BODY, fontSize: 15,
    color: GREY, margin: 0, isTextBox: true,
  });
}

/* 3 — the hook -------------------------------------------------------- */
{
  const s = light();
  title(s, "By December, you will have built this.");
  const items = [
    { img: E + "e09_01.png", cap: "The Simon game" },
    { img: E + "e08_07.png", cap: "A screen that says hello" },
    { img: E + "e07_01.png", cap: "A synthesizer" },
  ];
  const cw = 3.75, gap = 0.42, x0 = 0.75;
  for (let i = 0; i < items.length; i++) {
    const x = x0 + i * (cw + gap);
    card(s, x, 1.85, cw, 4.15);
    await place(s, items[i].img, { x: x + 0.25, y: 2.1, w: cw - 0.5, h: 3.1 });
    s.addText(items[i].cap, {
      x: x + 0.25, y: 5.32, w: cw - 0.5, h: 0.45, fontFace: HEAD, fontSize: 15,
      bold: true, color: INK, align: "center", margin: 0, isTextBox: true,
    });
  }
  s.addText("Not a model of one. A working one, on your bench, running code you wrote.", {
    x: 0.75, y: 6.25, w: 11.8, h: 0.5, fontFace: BODY, fontSize: 17, italic: true,
    color: MUTED, margin: 0, isTextBox: true,
  });
}

/* 4 — bio ------------------------------------------------------------- */
{
  const s = light();
  title(s, "Mr. Salemi (and Mae)");
  s.addText([
    { text: "Engineer, 1985–2022", options: { bold: true, breakLine: true } },
    { text: "37 years designing hardware and software", options: { breakLine: true, color: MUTED, fontSize: 16 } },
    { text: "\n", options: { breakLine: true, fontSize: 8 } },
    { text: "UMass Amherst — Computer Engineering", options: { breakLine: true } },
    { text: "Babson College — MBA", options: { breakLine: true } },
    { text: "\n", options: { breakLine: true, fontSize: 8 } },
    { text: "Published author", options: { bold: true, breakLine: true } },
    { text: "The Tucker Mysteries, and books on engineering", options: { color: MUTED, fontSize: 16 } },
  ], {
    x: 0.75, y: 2.0, w: 6.4, h: 3.6, fontFace: BODY, fontSize: 19, color: INK,
    lineSpacing: 30, valign: "top", margin: 0, isTextBox: true,
  });
  card(s, 7.75, 1.85, 4.85, 4.3);
  await place(s, A + "s04-salemi-and-mae.jpg", { x: 8.0, y: 2.1, w: 4.35, h: 3.8 }, "cover");
}

/* 5 — two facts ------------------------------------------------------- */
{
  const s = dark();
  s.addText("Two facts", {
    x: 0.7, y: 0.5, w: 11.9, h: 0.8, fontFace: HEAD, fontSize: 34, bold: true,
    color: GREY, margin: 0, isTextBox: true,
  });
  const panes = [
    { img: A + "s21-engineering-is-fun.png",      big: "Engineering is fun.",      color: AMBER },
    { img: A + "s21-engineering-is-not-easy.png", big: "Engineering is not easy.", color: WHITE },
  ];
  for (let i = 0; i < panes.length; i++) {
    const x = 0.75 + i * 6.1;
    await place(s, panes[i].img, { x, y: 1.6, w: 5.7, h: 3.2 }, "cover");
    s.addText(panes[i].big, {
      x, y: 5.0, w: 5.7, h: 1.0, fontFace: HEAD, fontSize: 28, bold: true,
      color: panes[i].color, margin: 0, isTextBox: true,
    });
  }
  s.addText("Both are true at the same time. That is the whole class.", {
    x: 0.75, y: 6.3, w: 11.8, h: 0.5, fontFace: BODY, fontSize: 17, italic: true,
    color: GREY, margin: 0, isTextBox: true,
  });
}

/* 6 — this is not how most classes work ------------------------------- */
{
  const s = light();
  title(s, "This is not how most classes work.");
  await place(s, A + "s20-problem-fail-poster.png", { x: 0.75, y: 1.8, w: 4.6, h: 4.5 });
  const blocks = [
    { h: "What you are used to", c: MUTED, body: [
        "Get a problem you already know how to solve.",
        "Solve it.",
        "Success." ] },
    { h: "What this is", c: AMBER, body: [
        "Try it. It does not work.",
        "Find out why. Fix it. It still does not work.",
        "Fix it again. Now it works — and you know why." ] },
  ];
  blocks.forEach((b, i) => {
    const y = 1.85 + i * 2.35;
    card(s, 5.85, y, 6.7, 2.05);
    s.addText(b.h, {
      x: 6.15, y: y + 0.18, w: 6.1, h: 0.42, fontFace: HEAD, fontSize: 17, bold: true,
      color: b.c, margin: 0, isTextBox: true,
    });
    s.addText(b.body.map((t, j) => ({
      text: t, options: { bullet: true, breakLine: j < b.body.length - 1 },
    })), {
      x: 6.15, y: y + 0.66, w: 6.1, h: 1.25, fontFace: BODY, fontSize: 15,
      color: INK, paraSpaceAfter: 6, valign: "top", margin: 0, isTextBox: true,
    });
  });
}

/* 7 — three projects -------------------------------------------------- */
{
  const s = light();
  title(s, "Three projects. Three kinds of engineering.");
  const units = [
    { n: "01", name: "Electronics", sub: "Simulate it. Build it. Make it blink, buzz, and play.", img: A + "s22-discipline-electronics.png" },
    { n: "02", name: "Software",    sub: "Write the spec. Make an AI build it. Test what it gives you.", img: A + "s22-discipline-software-pm.png" },
    { n: "03", name: "Robotics",    sub: "Make something move on purpose.", img: A + "s22-discipline-robotics.png" },
  ];
  const cw = 3.75, gap = 0.42, x0 = 0.75;
  for (let i = 0; i < units.length; i++) {
    const u = units[i], x = x0 + i * (cw + gap);
    card(s, x, 1.85, cw, 4.4);
    await place(s, u.img, { x: x + 0.25, y: 2.1, w: cw - 0.5, h: 1.85 }, "cover");
    s.addText(u.n, {
      x: x + 0.25, y: 4.05, w: 1.0, h: 0.6, fontFace: HEAD, fontSize: 30, bold: true,
      color: AMBER, margin: 0, isTextBox: true,
    });
    s.addText(u.name, {
      x: x + 0.25, y: 4.62, w: cw - 0.5, h: 0.45, fontFace: HEAD, fontSize: 20, bold: true,
      color: INK, margin: 0, isTextBox: true,
    });
    s.addText(u.sub, {
      x: x + 0.25, y: 5.1, w: cw - 0.5, h: 1.0, fontFace: BODY, fontSize: 14,
      color: MUTED, valign: "top", margin: 0, isTextBox: true,
    });
  }
}

/* 8 — this class is for you if --------------------------------------- */
{
  const s = light();
  title(s, "This class is for you if…");
  const pts = [
    "You are curious whether engineering is a career you want.",
    "You like the moment something finally works.",
    "You are willing to be stuck for twenty minutes and keep going.",
  ];
  pts.forEach((t, i) => {
    const y = 2.05 + i * 1.35;
    s.addShape(pres.ShapeType.ellipse, { x: 0.78, y: y + 0.02, w: 0.62, h: 0.62, fill: { color: AMBER } });
    s.addText(String(i + 1), {
      x: 0.78, y: y + 0.02, w: 0.62, h: 0.62, fontFace: HEAD, fontSize: 20, bold: true,
      color: WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(t, {
      x: 1.65, y, w: 5.5, h: 1.0, fontFace: BODY, fontSize: 20, color: INK,
      valign: "middle", margin: 0, isTextBox: true,
    });
  });
  card(s, 7.4, 1.9, 5.2, 4.3);
  await place(s, E + "e06_01.png", { x: 7.65, y: 2.15, w: 4.7, h: 3.8 });
}

/* 9 — the off-ramp ---------------------------------------------------- */
{
  const s = dark();
  s.addText("And it is not for everyone.", {
    x: 0.85, y: 0.85, w: 11.6, h: 1.0, fontFace: HEAD, fontSize: 40, bold: true,
    color: WHITE, margin: 0, isTextBox: true,
  });
  const facts = [
    "Your phone is in the holder every period.",
    "You will be stuck, and being stuck is the job — not a sign you are failing.",
    "A project is graded on whether it works.",
  ];
  s.addText(facts.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < facts.length - 1 } })), {
    x: 1.0, y: 2.3, w: 11.2, h: 2.4, fontFace: BODY, fontSize: 26, color: "E5E7EB",
    paraSpaceAfter: 20, valign: "top", margin: 0, isTextBox: true,
  });
  s.addText("If that is not the class you were hoping for, there is still time to switch.", {
    x: 0.85, y: 5.15, w: 11.8, h: 0.7, fontFace: HEAD, fontSize: 23, bold: true,
    color: AMBER, margin: 0, isTextBox: true,
  });
  s.addText("No hard feelings. I would rather you find the right room than spend a term in the wrong one.", {
    x: 0.85, y: 5.95, w: 11.6, h: 0.6, fontFace: BODY, fontSize: 19,
    color: GREY, margin: 0, isTextBox: true,
  });
}

/* 10 — meet an engineer ----------------------------------------------- */
{
  const s = light();
  title(s, "Meet an engineer");
  s.addText([
    { text: "Someone who does this for a living.", options: { bold: true, breakLine: true } },
    { text: "\n", options: { breakLine: true, fontSize: 8 } },
    { text: "Watch, then tell me one thing about the job that surprised you.", options: {} },
  ], {
    x: 0.75, y: 2.3, w: 4.3, h: 2.4, fontFace: BODY, fontSize: 20, color: INK,
    lineSpacing: 30, valign: "top", margin: 0, isTextBox: true,
  });
  card(s, 5.5, 1.85, 7.1, 4.4);
  await place(s, A + "s13-meet-an-engineer-video.png", { x: 5.75, y: 2.1, w: 6.6, h: 3.9 });
}

/* 11 — the big rule --------------------------------------------------- */
{
  const s = dark();
  await place(s, A + "s07-classroom-working.png", { x: 0, y: 0, w: W, h: H }, "cover");
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H, fill: { color: INK, transparency: 45 }, line: { type: "none" },
  });
  s.addText("The Big Rule", {
    x: 1.0, y: 2.4, w: 11.3, h: 0.8, fontFace: HEAD, fontSize: 26, bold: true,
    color: AMBER, align: "center", charSpacing: 2, margin: 0, isTextBox: true,
  });
  s.addText("Maintain a productive\nlearning environment.", {
    x: 1.0, y: 3.3, w: 11.3, h: 2.0, fontFace: HEAD, fontSize: 42, bold: true,
    color: WHITE, align: "center", lineSpacing: 46, margin: 0, isTextBox: true,
  });
}

/* 12 — phones --------------------------------------------------------- */
{
  const s = light();
  title(s, "Your phone goes in the holder. Every class.");
  await place(s, A + "s11-phone-holder-grid.png",  { x: 0.75, y: 1.9, w: 4.3, h: 3.5 });
  await place(s, A + "s11-alphabetical-list.png",  { x: 5.35, y: 1.9, w: 2.0, h: 3.5 });
  s.addText("Find your number on the alphabetical list.", {
    x: 0.75, y: 5.6, w: 6.6, h: 0.5, fontFace: BODY, fontSize: 15, italic: true,
    color: MUTED, margin: 0, isTextBox: true,
  });
  const steps = [
    ["First time",  "I remind you."],
    ["Second time", "I notify Mr. Hinnenkamp, the department head."],
    ["After that",  "I write you up, without warning."],
  ];
  card(s, 7.75, 1.9, 4.85, 3.5);
  steps.forEach((st, i) => {
    const y = 2.15 + i * 1.02;
    s.addText(st[0], {
      x: 8.05, y, w: 4.3, h: 0.35, fontFace: HEAD, fontSize: 15, bold: true,
      color: AMBER, margin: 0, isTextBox: true,
    });
    s.addText(st[1], {
      x: 8.05, y: y + 0.36, w: 4.3, h: 0.6, fontFace: BODY, fontSize: 15,
      color: INK, valign: "top", margin: 0, isTextBox: true,
    });
  });
  s.addText("Your hands are going to be busy. That is the real reason.", {
    x: 7.75, y: 5.6, w: 4.85, h: 0.5, fontFace: BODY, fontSize: 15, italic: true,
    color: MUTED, margin: 0, isTextBox: true,
  });
}

/* 13 — no phones ------------------------------------------------------ */
// The gif is portrait. It is placed, not cropped, so it keeps its ratio and
// keeps animating — a sharp round-trip would flatten it to one frame.
{
  const s = dark();
  await place(s, A + "s12-no-phones-barad-dur.gif", { x: 7.0, y: 0.6, w: 5.6, h: 6.3 });
  s.addText("No phones.", {
    x: 0.9, y: 3.0, w: 5.6, h: 1.4, fontFace: HEAD, fontSize: 54, bold: true,
    color: AMBER, margin: 0, isTextBox: true,
  });
  s.addText("The eye is always watching.", {
    x: 0.9, y: 4.4, w: 5.6, h: 0.6, fontFace: BODY, fontSize: 20,
    color: GREY, margin: 0, isTextBox: true,
  });
}

/* 14 — stay to the end ------------------------------------------------ */
{
  const s = light();
  title(s, "Stay to the end.");
  s.addText([
    { text: "During relaxation time, stay at your table and relax.", options: { breakLine: true } },
    { text: "\n", options: { breakLine: true, fontSize: 8 } },
    { text: "No hanging by the door.", options: { bold: true } },
  ], {
    x: 0.75, y: 2.3, w: 5.6, h: 2.0, fontFace: BODY, fontSize: 22, color: INK,
    lineSpacing: 34, valign: "top", margin: 0, isTextBox: true,
  });
  card(s, 6.9, 1.85, 5.7, 4.3);
  await place(s, A + "s08-patience-quote.jpg", { x: 7.15, y: 2.1, w: 5.2, h: 3.8 });
}

/* 15 — grading -------------------------------------------------------- */
{
  const s = light();
  title(s, "Grading");
  const nums = [
    { n: "20", t: "On time, and it works.", c: AMBER },
    { n: "18", t: "Late — or a redo that comes back right.", c: INK },
    { n: "0",  t: "Only if you never finish it.", c: MUTED },
  ];
  const cw = 3.75, gap = 0.42, x0 = 0.75;
  nums.forEach((u, i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, 1.9, cw, 2.6);
    s.addText(u.n, {
      x: x + 0.25, y: 2.15, w: cw - 0.5, h: 1.35, fontFace: HEAD, fontSize: 66, bold: true,
      color: u.c, align: "center", valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(u.t, {
      x: x + 0.25, y: 3.55, w: cw - 0.5, h: 0.8, fontFace: BODY, fontSize: 15,
      color: MUTED, align: "center", valign: "top", margin: 0, isTextBox: true,
    });
  });
  s.addText(
    "A lab that is not working yet comes back to you as a redo, as many times as it takes, " +
    "and is worth 18 once it is right. Show both halves — the simulation and the real circuit — " +
    "to get it checked off.", {
      x: 0.75, y: 4.95, w: 11.8, h: 1.3, fontFace: BODY, fontSize: 17,
      color: INK, lineSpacing: 26, valign: "top", margin: 0, isTextBox: true,
    });
}

/* 16 — submission document -------------------------------------------- */
{
  const s = light();
  title(s, "Every project has a submission document.");
  s.addText([
    { text: "Answer the questions in it.", options: { bold: true, breakLine: true } },
    { text: "\n", options: { breakLine: true, fontSize: 8 } },
    { text: "Submit the document to get credit. A project that is built but not submitted is not finished.", options: {} },
  ], {
    x: 0.75, y: 2.2, w: 5.3, h: 2.6, fontFace: BODY, fontSize: 20, color: INK,
    lineSpacing: 32, valign: "top", margin: 0, isTextBox: true,
  });
  card(s, 6.6, 1.85, 6.0, 4.4);
  await place(s, A + "s02-submission-document.png", { x: 6.85, y: 2.1, w: 5.5, h: 3.9 });
}

/* 17 — google classroom ----------------------------------------------- */
{
  const s = dark();
  s.addText("Join the Google Classroom", {
    x: 0.7, y: 1.9, w: 11.9, h: 0.9, fontFace: HEAD, fontSize: 32, bold: true,
    color: GREY, align: "center", margin: 0, isTextBox: true,
  });
  s.addText("3kicjrxy", {
    x: 0.7, y: 2.9, w: 11.9, h: 2.0, fontFace: HEAD, fontSize: 96, bold: true,
    color: AMBER, align: "center", valign: "middle", charSpacing: 4, margin: 0, isTextBox: true,
  });
}

/* 18 — tinkercad ------------------------------------------------------ */
{
  const s = light();
  title(s, "Tinkercad");
  s.addText("Set up your account.", {
    x: 0.75, y: 1.6, w: 11.8, h: 0.6, fontFace: BODY, fontSize: 24,
    color: AMBER, margin: 0, isTextBox: true,
  });
  card(s, 1.9, 2.4, 9.5, 3.9);
  await place(s, A + "s30-tinkercad-classroom.png", { x: 2.15, y: 2.6, w: 9.0, h: 3.5 });
}

/* 19 — project 00 ----------------------------------------------------- */
{
  const s = light();
  title(s, "Project 00: Set up your Arduino IDE");
  s.addText("Make the Arduino blink.", {
    x: 0.75, y: 1.6, w: 11.8, h: 0.6, fontFace: BODY, fontSize: 24,
    color: AMBER, margin: 0, isTextBox: true,
  });
  card(s, 1.9, 2.4, 9.5, 3.9);
  await place(s, A + "s31-project00-classroom.png", { x: 2.15, y: 2.6, w: 9.0, h: 3.5 });
}

/* 20 — close ---------------------------------------------------------- */
{
  const s = dark();
  s.addText("Engineering is fun.", {
    x: 1.0, y: 2.5, w: 11.3, h: 1.0, fontFace: HEAD, fontSize: 44, bold: true,
    color: AMBER, align: "center", margin: 0, isTextBox: true,
  });
  s.addText("Engineering is not easy.", {
    x: 1.0, y: 3.5, w: 11.3, h: 1.0, fontFace: HEAD, fontSize: 44, bold: true,
    color: WHITE, align: "center", margin: 0, isTextBox: true,
  });
  s.addText("Hands on keyboards.", {
    x: 1.0, y: 5.0, w: 11.3, h: 0.6, fontFace: BODY, fontSize: 20,
    color: GREY, align: "center", margin: 0, isTextBox: true,
  });
}

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
}

build().catch(e => { console.error(e); process.exit(1); });
