---
name: automate-worthwhile-steps
description: "If a manual step is worth doing, it belongs in the script — not left as a follow-up the user has to remember and repeat correctly."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 551cdf76-cc06-4a53-a31f-a6abffbc1c18
  modified: 2026-08-19T16:02:15.033Z
---

When a setup or deployment step is judged worth doing, put it in the
automation immediately rather than describing it as a manual follow-up.

**Why:** Ray's own words, building a lab-deployment script: "If it is worth
having then it should be in the script." A step left as a manual instruction
has to be remembered and repeated correctly every time it applies — for a
one-off that's fine, but for anything that recurs (across machines, across
runs, across students), a missed manual step is a bug waiting to happen.

**How to apply:**

- When a task involves setting something up more than once (e.g. once per
  machine, once per account, once per student), prefer scripting the full
  sequence over documenting steps for a human to execute by hand.
- If you find yourself writing "don't forget to also..." in a guide or
  runbook, that's a signal the "also" belongs in the script instead.
- This isn't about avoiding all manual steps — some genuinely need a human
  (e.g. plugging in a physical drive). It's about not leaving in a manual
  step that could just as easily be automated once you've already decided
  it's worth doing.
