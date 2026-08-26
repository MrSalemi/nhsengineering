---
name: file-screenshots-without-asking
description: Standing rule — move stray screenshots into the correct images folder without asking first.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dc0e0e3a-7c48-454f-a030-f2b799451e76
  modified: 2026-08-13T15:13:09.081Z
---

When screenshots land somewhere wrong (CleanShot drops at a repo root, unfiled
captures), move and rename them into the correct images folder and fix the
references. Do not ask first.

**Why:** Ray drags screenshots straight out of CleanShot into whatever folder is
open. Filing them is mechanical, has one right answer, and asking about it
spends a turn on a decision he does not consider a decision.

**How to apply:** In `nhsengineering`, guide pictures live in
`guide_builder/images/` and are named for the guide that uses them
(`e00_01.png`, `e00_ide_01.png`). `build.js` resolves Obsidian's `![[name]]`
against `images/` only, so a picture left anywhere else silently fails to build.
Rename on the move, update the wikilinks, then rebuild to confirm.
`/CleanShot*.png` is gitignored at the repo root so an unfiled capture cannot be
committed by accident.
