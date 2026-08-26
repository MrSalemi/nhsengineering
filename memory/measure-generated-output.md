---
name: measure-generated-output
description: "A library option that claims to preserve geometry must be measured in the output file, not trusted."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3da2c94e-57cf-4f5f-9891-0fbedaf233b1
  modified: 2026-08-26T23:17:22.303Z
---

When a library offers an option that is supposed to preserve something visual —
aspect ratio, fit, alignment, page size — measure the generated file and confirm
it actually did. Do not treat the option's existence as evidence it works.

**Why:** pptxgenjs's `sizing: {type:"contain"|"cover"}` writes an all-zero
`<a:srcRect>` and stretches the image to its box. Every picture in a 20-slide
deck was distorted, one by 137%. Ray caught it by looking at the slides. Nothing
in the toolchain did: the XSD passed, `validate.py` said "All validations
PASSED", and the LibreOffice render reproduced the distortion faithfully, so
looking at the render proved nothing — a stretched photo looks like a photo
unless you have the original ratio to compare against. Its `{type:"crop"}` mode
was broken too, emitting a negative crop value.

**How to apply:** Extract the output and compute the number — for OOXML, compare
each `<a:ext>` ratio against the embedded image's real dimensions, adjusted for
`<a:srcRect>`. Then leave the measurement behind as a test that fails on the
broken version first. `slides/check-aspect.js` in `nhsengineering` is the worked
example. Related: [[test-on-hardware-not-in-theory]] — same lesson, and his
Mac keeps winning.
