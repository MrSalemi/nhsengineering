---
name: write-for-the-reader-not-my-reasoning
description: "In anything written for someone else, give the reader what they must do — never the reasoning behind the design."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d5318635-edc8-4864-89e6-e2da51be9315
  modified: 2026-08-20T15:01:51.524Z
---

When writing for a reader who is not Ray — a student guide, a handout, any
instructions — give only what that reader needs to act. Cut the reasoning
that led to the design. Cut the failure modes nobody asked them to try.

**Why:** Ray's diagnosis, and he named it as a standing Opus failure: "You
were sharing your own revelations with the student as if they are important
to the student. It does not put itself in the mind of the reader and only
give the reader what they need." In P05 I wrote paragraphs on what happens
if you send Ollama only the code, or only the PRD — nobody had asked the
student to do either. The result read as vague and directionless, because
explaining a design is not the same as directing someone through a task.

**The test that catches it:** for each paragraph, ask what the reader is
supposed to *do* with it. No answer means cut it. Ray's other question is
sharper still — at P05 Step 2 he asked "What should I write here? There is
no section called ball." I had told the student to "add a new section" and
never said which section, what to call it, or what to say in it.

**How to apply:** name the exact thing — the section heading, the file, the
button, the number. Give a template or a table when there are five variants.
When tempted to explain why a rule exists, give it only if the reader needs
it to do the step right (e.g. "type this line or the AI rewrites parts you
did not ask about"). Otherwise the reasoning belongs in DECISIONS.md, which
is where Ray already keeps it.

Related: [[terse-answers-only]], [[warn-only-if-it-breaks-class]].
