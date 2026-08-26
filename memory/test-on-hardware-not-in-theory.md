---
name: test-on-hardware-not-in-theory
description: "Ray settles questions by running them on a real Mac. Get him a measurement, not a prediction."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 073387ce-67f7-4eda-8e0c-3e9fc069c9b2
  modified: 2026-08-19T23:29:48.078Z
---

When something is checkable on real hardware, propose the check instead of
reasoning toward an answer. Ray reaches for the actual machine by default
and it repeatedly beat my analysis.

**Why:** In one session, hardware overturned four of my conclusions. I said
the USB drive read at 16 MB/s — it was 76, because the 20-minute figure was
a *write* and the copy was 22.7GB not 4.7GB. I said the drive was FAT32 from
a screenshot — it was exFAT. I warned that two app signatures were broken —
both apps launched fine. I claimed a cold student-account test had passed
when he had only said "everything worked." Each was avoidable by measuring
or asking rather than inferring.

**How to apply:**

- Give the command that produces the number, and ask for the output.
- Measure the direction that matters. Write speed does not predict read
  speed; they differed by 4x here.
- Never write a result into DECISIONS.md or STATUS.md that he did not
  actually report. "Everything worked" is not evidence for specific tests.
- A check that cries wolf is worse than none. `codesign --verify` warned on
  two healthy apps and got replaced with a structural check.
- Related: [[ask-before-rewriting-working-files]].
