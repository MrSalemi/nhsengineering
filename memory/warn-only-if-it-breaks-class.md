---
name: warn-only-if-it-breaks-class
description: Raise a risk only if it breaks a student in class or breaks the deliverable; fix or drop everything else.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d5318635-edc8-4864-89e6-e2da51be9315
  modified: 2026-08-20T14:26:45.614Z
---

Only warn Ray about something if it would break a student in class or break
the thing being shipped. Fix anything smaller silently, or leave it alone.
Never volunteer speculation about systems he did not ask about.

**Why:** In one session I flagged a shadowed `uv` (his own admin account,
irrelevant), `~blue01` permissions (normal macOS), `munki`/`ARD` accounts
(unsolicited speculation), and a Thonny/Unit-02 conflict (Thonny was for
robotics). Four of six warnings cost him attention for nothing. His words:
"We could be here for fucking ever." A stream of caveats makes a project
feel fragile when it is nearly done, and it buries the one warning that
mattered.

**How to apply:** Before writing a caveat, ask what actually breaks and for
whom. Student in class, or the drive/deliverable — say it. Anything else —
act on it or drop it. Do not list what I *could* have checked. Do not
re-litigate a warning once he says it is out of scope; he says "that is
robotics" or "that is my account" and the topic is closed.

A warning is not a place to show thoroughness. Ray reads every word I write
and pays for it in tokens and time; a caveat he did not need is a cost with
no benefit, not evidence of care. Same for the checks behind it — do not
narrate what I verified.

Related: [[terse-answers-only]], [[ask-before-rewriting-working-files]],
[[test-on-hardware-not-in-theory]].
