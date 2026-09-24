# NHS Engineering — Reference

Durable knowledge: how guides get made, what the unit teaches, and the things
that fail without saying so. Current state is in [PROJECT.md](PROJECT.md);
settled calls are in [DECISIONS.md](DECISIONS.md). Nothing here is a status
report.

## Guide production

Guides are **generated from the markdown in `nhsengineering/guides/<unit>/`**,
and the guide that gets printed is a **PDF**. Word is not in the chain: a
`.docx` is built in a temp folder, converted by LibreOffice, and deleted. There
is no editable copy of a guide anywhere, which is the point — an edit that is not
in the markdown cannot survive, so it cannot be made by accident.

**Content and builder are separate folders.** `guides/unit01/` holds the
markdown, `images/`, and the built PDFs. `shared/` is a symlink to
`~/vaults/shared` (the `vault-shared` repo), shared with every course, and holds
no guides and no pictures at all. Run the build **from the folder the guides are in** — the
builder takes the guide's own folder as the place to find everything.

```bash
cd guides/unit01
../../shared/build-all.sh e02.md -d   # build one guide and deploy it
../../shared/build-all.sh -d          # build everything that needs it, deploy
../../shared/build-all.sh -f          # rebuild everything, current or not
node ../../shared/test-build.js       # check the builder, no robot and no Word
```

**A guide is only rebuilt when it is stale**, the way make works: its markdown,
one of its pictures, or the builder itself is newer than the PDF. Staleness
reaches across into `shared/`, so any change to the builder marks every guide
stale. Pagination is measured by running the file through LibreOffice, which is
slow, so this is the difference between a minute and a second.

`shared/README.md` explains the markdown the builder understands. It is the
same builder `nhsrobotics` uses — one folder, reached by symlink from every
course, so there is no per-course pin.
See [DECISIONS #5](DECISIONS.md) and the entry that reverses it.

### Rules that bite

- **Pictures must be real PNGs.** The builder reads the PNG header and refuses
  anything else. The importer re-saves JPEGs for this reason.
- **A picture is capped at 6.5 × 4.5 inches**, proportions kept. Without the
  height cap a portrait screenshot renders seven inches tall and owns a sheet.
- **A picture carries `keepNext` only when the next block is neither a picture
  nor a heading.** Chaining a run of pictures makes one unbreakable block, and a
  block taller than a page shunts the whole run to the next sheet and leaves the
  current one empty. This was a real bug in E01: page one held three sentences
  and nothing else. Headings are the same bug the long way round — a heading
  always keeps with what follows, so picture → heading → picture → heading is
  one unbreakable chain of any length, which is the shape of every guide here.
  E00 was 10 pages with that chain and 8 without it.
- **Length costs sheets, not pages.** Printing is double-sided and odd counts
  are padded, so 3 and 4 pages are both 2 sheets. Only an even-to-odd crossing
  matters.
- **A link prints as its label and nothing else.** A bare `[[e03]]` is refused by
  the build, because it would print a filename at a student.
- **A table's first row is its header**, as markdown says — shaded and bold. The
  Google Docs importer cannot know that, so it leaves a parts table with its
  first *data* row above the separator; the three parts tables were given real
  `| Part | What it looks like |` headers by hand. A cell holding only a picture
  becomes that picture, capped at 1.56 inches tall so a portrait photo cannot
  make a three-inch row. An empty cell stays empty, which is what the resistor
  row depends on.
- **`***bold italic***` is not in the inline grammar.** Only `**bold**`,
  `*italic*` and `` `code` ``. Triple asterisks print as literal asterisks and
  run the emphasis to the end of the paragraph — it looked like a font bug in
  E00 and was eight stray markers from the import.

## Importing a Google Doc

```bash
python3 tools/docx_to_md.py "Some Doc.docx" guides/unit01 e05
```

Download the doc from Drive as `.docx` first — right-click the file or the
folder, then Download. The Drive connector returns **text only**, so every
picture is lost that way; these guides are mostly pictures, so the connector is
not a route for importing them.

The importer walks the document body in order rather than scraping it for text,
so pictures land where they sat, including inside table cells. Pictures are
named `<slug>_NN.png` in the unit's `images/`.

### What it handles, because each one was a real defect

- **Code.** Google Docs has no code block. It writes code as ordinary paragraphs
  in a monospace face, and that font is the only signal there is. A run of
  monospace paragraphs becomes one fenced block.
- **Private-use glyphs.** Docs sprinkles characters from the Unicode private-use
  area into syntax-highlighted text. They are invisible in Docs and garbage
  everywhere else.
- **1×1 spacer pixels.** Docs leaves them behind; they are not pictures.
- **JPEGs**, re-saved as PNG.

## Failures that don't announce themselves

- **Two different omega characters.** The source documents used both `Ω`
  U+03A9 GREEK CAPITAL LETTER OMEGA and `Ω` U+2126 OHM SIGN. They look
  identical and do not match each other, so a search-and-replace for one silently
  skips the other — which is exactly what happened when 220Ω became 1 kΩ, leaving
  E09 wrong. The markdown is NFC-normalised now, which folds U+2126 onto U+03A9.
  If a search for a value comes back suspiciously clean, suspect this first.
- **A `.gdoc` file is a 173-byte pointer**, not a document. `cat` on one that has
  not been downloaded fails with "Resource deadlock avoided", which means the
  file is cloud-only, not that it is broken.
- **Copying a Google Doc gives it a new ID.** The Unit 01 documents were copied
  to change ownership, so any Classroom assignment or link pointing at the old
  IDs still points at the old documents.
- **A rebuilt PDF always looks modified to git**, even when nothing moved on the
  page, because the file carries a creation time. Built guides are gitignored
  for this reason among others.

## The shape of the unit

Ten labs, 00 through 09, each with **two halves: simulate it in Tinkercad, then
build it for real.** The checkoff sheet — a Sim box and a Real box per lab — is
what a student's progress is read off. It is generated by
`guides/unit01/tracker.js`, which holds the project list. The builder does not
make it, because the sheet is not a guide: it is a form, with write-on lines, a name block, and checkbox glyphs sized by hand. Tables alone were never the obstacle.

The arc: light an LED from a pin, then switch it, then blink it in code, then
read a pin, then read an analog value, then drive several outputs from it, then
sound, then a display, then all of it at once in the Simon game.

**E09 The Simon Game is different in kind.** The student is the hardware
engineer and an AI is the software engineer — they write the specification, give
the pin numbers, and ask for a hardware test script before asking for the game.
It is the only guide that assumes a partner.
