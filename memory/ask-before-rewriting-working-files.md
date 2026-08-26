---
name: ask-before-rewriting-working-files
description: "Diagnosing a failure is not authorization to rewrite the thing that failed. Offer, then wait."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 073387ce-67f7-4eda-8e0c-3e9fc069c9b2
  modified: 2026-08-19T23:29:33.183Z
---

When Ray reports a failure — a screenshot, an error, "that was a fail" — he
is reporting it, not commissioning the fix. Diagnose, propose, and wait for
a yes before replacing a file he depends on.

**Why:** Twice in one session I read a symptom as a go-ahead. He had to stop
and ask "wait, what did you just do?" and later "why did you modify
install-lab-software.sh?" — both times after I had already replaced a
working file wholesale. He was fine with the changes in the end, which is
not the same as having chosen them.

**How to apply:**

- Small in-place fix to something already agreed: just do it.
- Replacing a file, renaming it, or changing its structure: say what and
  why in one or two lines, then stop.
- If I already offered and he didn't answer, that is not a yes. Ask again
  or leave it.
- Never let a destructive change ride along with a diagnostic. The Dock
  automation wiped pinned apps on six accounts because I rebuilt an array
  wholesale instead of appending, in code he had not asked for.
- Related: [[write-decisions-without-asking]] covers the log, not the
  files. Writing DECISIONS.md myself is wanted; rewriting his scripts
  unprompted is not.
