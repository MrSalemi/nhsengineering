---
name: build-pdfs-on-rays-mac
description: Never put emoji in anything that becomes a PDF. Render and look at the page instead of caveating the font.
metadata: 
  node_type: memory
  type: project
  originSessionId: 3a6b60b3-2a68-41e5-87fd-661a6fd87c47
  modified: 2026-08-20T17:01:26.403Z
---

**Do not use emoji in guides, worksheets, checkoff sheets, or any file that
becomes a PDF.** Use a plain character or a word. The sandbox has no emoji
font, LibreOffice embeds whatever the building machine has, and a placeholder
box gets baked into the file — the robotics worksheet's 🤖 did exactly that.

**Ray is tired of the caveat, and he is right.** Warning him that a PDF might
have a bad glyph is not a substitute for knowing. Two rules replace it:

1. Do not introduce a character I cannot verify. If a plain one works, use it.
2. If an unusual character is already there, **look at the page**, do not
   caveat it. Render and read the image:
   `pdftoppm -png -r 80 -f 1 -l 1 FILE.pdf /tmp/x`, copy it into the outputs
   folder, and Read it. That is how the `☐` in the Unit 02 checkoff sheet was
   confirmed as a real box and not tofu before deploying, on 2026-08-20.

Geometric shapes like `☐` and `◇` are in the sandbox's fonts and render fine.
Emoji do not. Either way the answer is to check, not to hedge.

Recorded in `nhsengineering/DECISIONS.md` #15.

Related: [[warn-only-if-it-breaks-class]], [[test-on-hardware-not-in-theory]].
