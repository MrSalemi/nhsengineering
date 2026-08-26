---
name: no-arbitrary-scope-limits
description: "Don't narrow who or what gets a resource to save cost; push the step to the user instead."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3da2c94e-57cf-4f5f-9891-0fbedaf233b1
  modified: 2026-08-26T22:35:56.659Z
---

Never solve "this might be expensive" by restricting scope — a list of which
accounts, which machines, which students get a thing. Install to everyone, and
if the cost is real, make loading it a step the person does themselves.

**Why:** Ray's reaction to `ARDUINO_ACCOUNTS` in `install-lab-software.sh`,
which seeded Arduino board packages into only the one class period that used
them: "Why would you make an arbitrary limitation like this? The correct
solution was that if it is expensive then let the student load the board
library." The carve-out shipped empty, added a `--check` rule, added a manual
edit step to LAB-SETUP.md, and made every thread re-ask which account it was —
all to skip a folder copy on seven accounts.

**How to apply:** Default to uniform. Same payload, same accounts, same
machines. If something genuinely costs too much to give everyone, the fix is a
user-run step, not a hardcoded list of who qualifies. See
[[automate-worthwhile-steps]] — the same instinct, from the other side: a step
worth doing belongs in the script, but the script shouldn't decide who deserves
it.
