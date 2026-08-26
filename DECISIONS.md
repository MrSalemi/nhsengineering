# NHS Engineering — Decision Log

Numbers are permanent. A reversal is struck with its reason, not deleted.

This log covers Engineering only. Robotics keeps its own in `nhsrobotics`, and
each class keeps its own for the same reason: a shared log would mix courses and
a thread about one would open by reading the state of another.

1. **Every resistor in Unit 01 is 1 kΩ, and the bin holds nothing else.** The
   guides were written for 220Ω. They now say 1000Ω (1k) in E01, E02, E03 and
   E09. Stocking only one value means a student cannot pick the wrong one, and
   it removes the need to read colour bands before the course has taught them.
   — 2026-08-12

2. **The 220Ω resistor photographs stay wrong, and that is deliberate.** The
   parts-table pictures came from the old documents and show a 220Ω part. They
   are not being corrected to match, because the two systems disagree anyway:
   **Tinkercad draws three colour bands and the real resistors have four**, so no
   single picture can teach a student to identify the part in both places. The
   bin does that job instead — see #1.

   Anyone who later notices that the text says 1k and the picture does not: this
   is known. Leave it. — 2026-08-12

3. **The resistor row in a parts table has no picture.** Following from #2, the
   misleading photo is removed from E01, E02 and E03 rather than left in place.
   The row keeps the part name and an empty cell, so a correct 1 kΩ picture can
   drop straight in when there is one. The other parts — Arduino, LED, switch,
   breadboard — keep their photos, because a picture is how a beginner finds the
   thing in a bin. — 2026-08-12

4. **Engineering guides are built from markdown to PDF, in this repo.** The
   eleven Google Docs of Unit 01 were imported with `tools/docx_to_md.py`, which
   carries the words and the pictures across and nothing else. The originals are
   still in Drive and nothing was deleted. Word is not in the chain: a `.docx` is
   an intermediate written to a temp folder and thrown away, so no office suite
   is needed to make a guide or to print one. Guides deploy to
   `Class Development/Engineering/Projects/Unit 01—Electronics`. — 2026-08-12

5. ~~**The builder is a separate copy of the robotics one, not a shared
   library.** Same code today, and it may drift. Engineering is its own course
   and its guides answer to nothing in Robotics.~~ — 2026-08-12

   **Reversed by #11.** The freedom to drift was never used. What happened
   instead was three bugs found in Engineering that all had to be carried to
   Robotics by hand. — 2026-08-13

6. ~~**What a flex is worth in electronics is NOT decided.** Two guides already
   gesture at one — E00 asks for Morse code S-O-S, E04 asks for a light show of
   your own design — but no rule says what a flex is or what it scores. Until
   this is settled, `{{GRADING}}` in `guide_builder/build.js` is a marked TODO
   and no guide uses it.~~ — 2026-08-12

   **Settled by #12: electronics has no flex at all.** — 2026-08-13

7. **The builder rules came across with the copy, and they are not
   engineering's to re-decide.** Links print as their label, a bare link to
   another guide is refused, pictures are capped at 6.5 × 4.5 inches and do not
   chain across a page break, and `build-all.sh` only rebuilds what is stale.
   These are `nhsrobotics` DECISIONS #38, #39 and #40; the reasoning lives
   there, and [REFERENCE.md](REFERENCE.md) records what they mean in practice.
   Two of them — the picture caps and the chaining — were found *here*, in the
   imported guides, and fixed in both builders. — 2026-08-12

8. **Built guides are not committed, and neither is the import zip.** The
   markdown and the pictures in `guide_builder/images/` are the source; the PDFs
   are reproducible from them. Deployed copies live in
   `Class Development/Engineering/Projects/Unit 01—Electronics`. — 2026-08-12

9. **This repo is the Obsidian vault, with `third_party/` excluded.** Same
   arrangement as `nhsrobotics`: vault root is the repo, so there is no second
   copy of anything, and `.obsidian/workspace.json` is gitignored because it is
   per-machine layout. — 2026-08-12

10. **Engineering threads read these three files, not Robotics'.** `PROJECT.md`,
    `DECISIONS.md` and `REFERENCE.md` now exist here. Both repos have a
    `PROJECT.md`, and `start-thread` orients on whichever it finds, so an
    Engineering thread should mount this folder alone. — 2026-08-12

11. **The builder is one shared repository, `rsalemiTeaches/guide-builder`, a
    submodule of both courses.** This reverses #5, which kept a separate copy so
    the two were free to drift. They never did. Of 586 lines, everything but two
    string constants is course-neutral, and three defects found while working on
    Engineering — the picture size caps, pictures chaining across a page break,
    and a picture keeping with the heading below it — each had to be carried to
    Robotics by hand. #7 had already conceded the substance of this by ruling
    that the builder's rules were not Engineering's to re-decide: that is a
    shared library with no mechanism, which is the worst arrangement available.

    Each course pins its own commit, so a change arrives when its pin moves and
    not before. **Bumping a pin means rebuilding and eyeballing the guides in
    both courses** — pagination is the shared failure mode, and it fails
    quietly.

    The layout changed with it. `guide_builder/` is gone: guides, `images/` and
    the checkoff sheet are in `guides/unit01/`, the builder is in `builder/`,
    and the build runs from the guides' folder because the builder no longer
    assumes it sits beside them. Anything in an earlier entry that says
    `guide_builder/` means `guides/unit01/`. — 2026-08-13

12. **Electronics has no flex. A lab is 20 points on time and 18 late, a redo
    comes back until it is right and then scores 18, and the only zero is a lab
    never finished.** This settles #6. Going further is Robotics' idea, where a
    flex scores 20 against 19 for all the work; Electronics comes first and its
    job is getting a circuit to work at all.

    Three guides used to offer a flex for an A+ — E00's Morse code, E04's light
    show, E06's LED layout. Each now simply requires the thing, because a reward
    the gradebook does not pay is one a student notices. The Morse code exercise
    was kept rather than deleted: it is the only place in E00 that asks a
    student to work something out.

    Every guide prints this rule from `{{GRADING}}`, so there is one copy of it
    and it cannot drift between guides. That text started in `builder/build.js`
    and moved to `guides/unit01/course.js` when the builder became shared — see
    #16. — 2026-08-13

13. **The student checkoff sheet is generated, not written.**
    `guides/unit01/tracker.js` holds the project list and writes *Completed
    Electronics Projects.pdf*; it is gitignored like the guides and never edited
    by hand, for the same reason no guide has an editable copy. It was briefly
    deployed as a `.docx` — the format it was imported in — which was wrong on
    this repo's own rules: a Word file invites a hand-fix the next build throws
    away, and a form is where reflow between Word versions hurts most. The
    old `tracker.md` is deleted — it was a second copy of the same grid.

    The builder does not make this one. The reason first given here was that
    `parse.js` had no tables; that stopped being true the same day — see #14 —
    and it was the wrong reason anyway. The real one is that the sheet is a
    form, not a guide: write-on lines, a name block, and checkbox glyphs sized
    by hand, none of which the guide grammar expresses. It borrows the builder's
    `docx` package and its `topdf.js` rather than keeping a second copy of either.

    Students write the due date in themselves, and a ◇ beside it is the
    teacher's mark for late. The diamond is deliberately not a square, so it
    cannot be misread as one more box to complete. — 2026-08-13

14. **The builder renders markdown tables, and a table's first row is its
    header.** The parts tables in E01, E02 and E03 had been printing as raw
    markdown since the import — `| Arduino UNO | ![[e01_05.png]] |` and a row of
    dashes, on the page, for a student to read. `parse.js` had no table rule at
    all, so a `|` line fell through to an ordinary paragraph. Nobody had seen it
    because nothing has been taught from yet.

    Three things this settles:

    - **The first row is the header**, shaded and bold, as markdown says. The
      importer cannot know that and leaves a parts table with its first *data*
      row above the separator, so the three tables were given real
      `| Part | What it looks like |` headers by hand.
    - **A cell holding only a picture becomes that picture**, capped at 1.56
      inches tall. Width alone was tried first and gave three-inch rows that
      pushed E02 from six sheets to eight. A parts list wants a thumbnail to
      match against a bin, not a portrait.
    - **An empty cell stays empty**, which #3 depends on: the resistor row keeps
      its name and an empty cell so a correct 1 kΩ picture can drop in later.

    This is the first change made to the builder since it became shared, so it
    is also the first test of #11's rule: `nhsrobotics` gets it when its pin
    moves, and moving that pin means rebuilding and looking at its guides.
    — 2026-08-13

15. **The checkoff sheet and the worksheet are PDFs, not Word files.** Both were
    briefly deployed as `.docx` — the format the worksheet had always been in,
    and the format Engineering's sheet was first written to. That was wrong on
    this repo's own rules. A Word file invites a hand-fix that the next build
    throws away, and a form is exactly where reflow between Word versions hurts:
    ruled lines and box widths move. Both now reach PDF through the builder's
    `topdf.js`, which packs to a `.docx` in a temp folder, converts it, and
    deletes it — the same temp-and-discard chain a guide uses, so no editable
    copy exists anywhere.

    The superseded `.docx` files were removed from
    `Class Development/Engineering/Projects/Unit 01—Electronics` and
    `Class Development/Robotics/Project Guides`.

    **A consequence worth knowing: the machine that builds a PDF decides its
    fonts.** The worksheet's 🤖 renders on Ray's Mac and comes out a placeholder
    box built anywhere without an emoji font. This was invisible while the
    deliverable was a `.docx`, because the font was chosen when the file was
    opened. Affects both repos. — 2026-08-13

16. **The course's own text, deploy target and guide naming live with the
    guides, not in the builder.** #11 made the builder shared but left
    Engineering's `SIMREAL` and `GRADING` as constants inside `build.js`, its
    Drive path hardcoded in `build-all.sh`, and its `e*.md` glob assumed. None of
    that survived contact with Robotics, whose guides are `pNN.md` and whose
    placeholders are `SAVE`, `PARTA` and `GRADING` — one of them built from the
    guide's own project number.

    So three things moved out of the builder and into `guides/unit01/`:

    - **`course.js`** exports a function of the guide's frontmatter returning
      what each `{{PLACEHOLDER}}` says. Taking the frontmatter is what lets
      Robotics build `/workspace/p02.py` from the guide's `number` and
      `scaffold` without the builder knowing either field exists. A guides folder
      with no `course.js` is refused rather than guessed at, and a test covers
      that.
    - **`deploy.txt`** names the deploy folder relative to `Class Development`.
    - **A guide is a letter and two digits.** Never `*.md`, which would sweep up
      a README.

    This is the seam that makes one builder honest for two courses: the text a
    student reads about grading is the one thing that genuinely differs, and it
    is now the only thing. Affects both repos — `nhsrobotics` DECISIONS #43 is
    the same call from that side. — 2026-08-13

17. **The guide content is classroom-tested; only the new PDF pipeline is
    not.** Ray has taught this class from these exact guides before, in their
    original Google Doc form, and they work. "Nothing here has been taught
    from" in STATUS.md refers narrowly to the PDFs produced by the new
    markdown-to-PDF pipeline — no student has held one of those yet — not to
    the guides' pedagogical content or per-guide structure. The lack of a
    shared skeleton (see What's open) is a maintenance and consistency gap, not
    evidence that any individual guide's structure has failed in a classroom.
    — 2026-08-17

18. ~~**The ten guides get one shared 6-part skeleton: finished project, new
    concept, parts, software spec, simulation, real circuit.** This settles
    the "no shared skeleton" gap in What's open.~~ — 2026-08-17

    **Withdrawn — this was logged as a decision too early.** Ray was sketching
    a list of section headers to critique, not settling a policy. No guide has
    been rewritten to this shape, and it never got confirmed as the standard.
    The actual approach: walk every guide E00–E09 guide-by-guide first, the way
    E01 already was, and only suggest a standard afterward if the walkthrough
    shows one is worth having. — 2026-08-17

19. **Unit 02 is a class on coding with AI — writing specs and testing what
    the AI produces — not software program management.** The Drive folder
    `Class Development/Unit 02—Software Engineering/` has leftover content
    from a different class Ray ran before: a `Software Change Request`
    bug-tracking form (coder name, bug title, description, severity, status)
    and a `Game Assignments.pdf` roster (14 students across Pong, Breakout,
    Snake, Space Invaders, Frogger). The change-request form does not carry
    over to this redesign — favor artifacts that serve the spec → generate →
    test → fix loop directly (the PRD itself, its revisions) over
    process/ticketing artifacts. The game roster may still be reused for
    assignment. Affects `nhsengineering` only. — 2026-08-19

20. **Unit 02 has no screenshots and no vision model.** A vision-capable
    Ollama model (`qwen2.5vl`) was considered so students could paste a
    screenshot alongside a fix request, but that would make the vision
    model — not the coder model — the one writing the fix, trading code
    quality for a capability this simple coursework doesn't need. Testing
    evidence is a written description of what's wrong, by hand; one coder
    model does all code generation, every step. Affects `nhsengineering`
    only. — 2026-08-19

21. **Unit 02 guides are printed. Students work from paper, not a screen.**
    Guides must read correctly as a handout: no reliance on clicking a link,
    no expectation a student can copy a command straight off the page.
    Affects `nhsengineering` only. — 2026-08-19

22. **Projects 01 and 02 are hand-typed, with no AI involved, deliberately.**
    Project 01 sets up the term's tools (terminal, one git repo at `swdev/`
    for every project this term, `uv`, `pico`). Project 02 hand-types a
    pygame square that bounces off all four walls, paced with
    `clock.tick(60)` — rehearsing, by hand, the exact "box bounces around
    the screen" shape every one of the five assigned games needs as its
    MVP, before an AI ever writes it. Having built it once, students should
    write a tighter PRD requirement and judge the AI's version more
    precisely later. Guides are `p01.md`/`p02.md` in `guides/unit02/` —
    Unit 02 uses the `p` prefix (matching "Project NN"), not `e`, which
    Unit 01 owns — each with its own `course.js` and `deploy.txt`.
    ~~Unit 02 deploys to `Class Development/Unit 02—Software Engineering/`,
    at that folder's root, unlike Unit 01's nested `Engineering/Projects/`
    path.~~ — 2026-08-20: **Unit 02 deploys to
    `Engineering/Projects/Unit 02—Software Engineering/`, beside Unit 01.**
    Both units are Engineering, so both belong under it. The root folder of
    the same name still holds the previous version of this class (#19), so
    deploying there put two versions of the unit side by side for a student
    to pick between.
    Affects `nhsengineering` only. — 2026-08-19

23. **Ollama is pre-installed on all 20 lab Macs ahead of class — not thumb
    drives handed to students, not a live pull during class.** A live pull
    risks the school network/content filter blocking a multi-gigabyte model
    download; thumb-drive installs move the same risk ~20 times over, live,
    in front of students. Each Mac has 8 local accounts, one per class
    period. The Ollama app installs once per machine (shared via
    `/Applications`); the model is pulled once per machine into a shared
    folder (`/Users/Shared/ollama-models`) and each of the 8 accounts'
    `~/.ollama/models` is symlinked to it, rather than duplicating a
    multi-gigabyte model 8 times per machine. Model weights are read-only
    during inference, so sharing one copy across accounts on the same
    machine is safe. Affects `nhsengineering` only. — 2026-08-19

24. **Unit 02 is Agile, not waterfall: a PRD defines an MVP, then backlog
    features get added one at a time — and that staging applies to the
    AI handoff too, not just the project schedule.** Feeding an AI the
    whole PRD at once and getting the whole game back, then testing at the
    end, is the same spec-everything-then-build-everything shape as
    waterfall. Prompting one requirement at a time keeps a broken result
    traceable to one recent change, which is what makes testing and
    correcting teachable skills rather than "read 200 lines and guess."
    Affects `nhsengineering` only. — 2026-08-19

25. **A thread has no fixed step count. Work in one Ollama thread as long as
    it stays fast; when it slows down, start a new thread and hand it a
    copy of the current code and an updated PRD.** This was chosen over a
    fixed 1-4-step-per-thread rule so the slowdown becomes something a
    student discovers for themselves rather than a rule imposed on them —
    the point is to teach the real cost of a long AI chat thread, not just
    assert it. The PRD, not the thread, is the record of what the project
    should do; thread resets are not tracked or graded. Affects
    `nhsengineering` only. — 2026-08-19

26. **Unit 02 grading is settled: 20 points on time, 18 late, a redo comes
    back until it is right and then scores 18, an unfinished project scores
    a zero.** This replaces `course.js`'s `{{GRADING}}` TODO with real text,
    for all of Unit 02's guides at once, since the placeholder is shared.
    The text names no other unit and no other project — it was first
    written as "the same grading as Unit 01," but that put a
    cross-reference into printed, per-guide text for no reason: the rule
    itself doesn't depend on Unit 01 existing, and a Unit 02 guide printed
    on its own shouldn't send a student looking for an "Unit 01" it never
    mentions otherwise. Affects `nhsengineering` only. — 2026-08-19

27. **Project 03 (`p03.md`) is written and builds clean: a teacher-given
    prompt asks Ollama for a bouncing circle, not a square**, deliberately
    different from P02's shape — 500×400 light gray window, 60-pixel
    radius, color changes to a random color on each wall bounce — so P03
    doesn't read as a reskin of P02 with the AI doing the typing. The
    prompt is supplied in the guide verbatim; students write their own
    starting Project 04. Affects `nhsengineering` only. — 2026-08-19

28. **Students prompt Ollama through its desktop app, never the `ollama`
    CLI, and no guide will mention the CLI at all.** The app's per-code-block
    Copy button copies only the code, not surrounding prose — with the CLI,
    a student would have to hand-select the code out of a paragraph in
    Terminal, exactly the kind of error a copy-paste-only workflow (see #29)
    can't afford. Leaving the CLI installed but never mentioned avoids
    steering students toward the wrong tool without needing to hide or
    remove it. Affects `nhsengineering` only. — 2026-08-19

29. **Unit 02 is Level 4 AI-assisted development: humans write the prompt
    and check the result; the AI writes all the code. Reading or writing
    code is not a goal of this unit, at any project, including the ones
    already written (P01, P02 predate this framing but don't conflict with
    it — they were hand-typed rehearsal, not AI output to inspect).**
    Verification is behavioral only: run the program, check what it does
    against the prompt, never open the code to look. This reframes #24's
    "traceable to one recent change" — traceable by re-running and
    re-observing behavior, not by reading a diff. A guide distinguishes two
    failure cases, taught separately (first in P03, Steps 7 and 9): a
    **crash** (an error instead of a window) is fixed by copying the error
    text back to Ollama with "this crashed, fix it" — treating the
    traceback as another piece of AI output to copy-paste, not something to
    interpret — while code that **runs but doesn't match the prompt** is
    fixed by resending the prompt. Affects `nhsengineering` only. — 2026-08-19

30. **Ollama reaches the 20 lab Macs via a USB thumb drive and one script,
    `tools/install-ollama.sh`, run once per machine.** This is the concrete
    mechanism for #23's shared-folder/symlink architecture, not a change to
    it: Ray builds the drive on his own Mac (pulls the model, copies
    `Ollama.app`), then the script — run as admin from the drive on each lab
    Mac — installs the app, strips its quarantine flag (it was downloaded on
    a different machine and never touched these Macs' network), copies the
    model to `/Users/Shared/ollama-models`, creates the `/usr/local/bin/ollama`
    CLI symlink the app's own first-launch flow would otherwise create, and
    symlinks each of the 8 local accounts to the shared model folder. The
    accounts are a hardcoded list — `blue01`–`blue04`, `red01`–`red04` — not
    a UID-based heuristic, so the script can't accidentally touch some other
    account that happens to share the UID range. One combined script rather
    than separate install/wire-up scripts, per the standing rule that a step
    worth doing belongs in the automation, not left as a manual follow-up to
    repeat correctly 20 times. Model: `qwen2.5-coder:7b`, sized for these
    Macs' 16GB of Apple Silicon unified memory — larger MoE coder models
    need more RAM than the lab has. Affects `nhsengineering` only. —
    2026-08-19

31. **A stray screenshot Ray drops at the repo root while drafting a guide
    gets moved into that guide's `images/` folder as part of the same work**,
    not left in place or flagged for him to move by hand. — 2026-08-19

32. **Unit 02 is ten projects, one class period each, and the MVP is finished
    at Project 07 — it is not a project of its own.** P01–P03 are the same for
    everyone (tools, hand-typed bouncing square, AI-written bouncing circle).
    From P04 on, every student is building their own assigned game one piece
    at a time: P04 the player moving, P05 the game's core mechanic, P06 score
    on screen, P07 win, lose and restart. P07 is where the game becomes
    playable start to finish, which is the MVP — a separate "confirm your MVP"
    period would spend a class on something the P07 checkoff already does.
    P08 is the visual reskin, P09 and P10 are one backlog feature each.

    Titles for P06–P10 are named in `guides/unit02/tracker.js`, which prints
    the full ten to the student's checkoff sheet. Only P01–P05 are written.
    — 2026-08-19

33. **The MVP is built one requirement at a time, like everything after it.
    There is no whole-MVP prompt.** The alternative considered was letting
    the student write one PRD covering the entire bare-bones game — controls,
    animation, scoring — and hand it to Ollama in a single prompt, saving
    incremental prompting for backlog features only. Rejected: a bare game
    still has three or four independent pieces, and #29 forbids reading the
    code, so a student who gets a whole game back that scores wrong has no
    way to tell which sentence of their PRD caused it. #24's whole argument —
    a broken result must be traceable to one recent change — applies hardest
    at the point where a student is writing a PRD for the first time, not
    least. Affects `nhsengineering` only. — 2026-08-19

34. **From Project 04 on, all work lives in one folder, `swdev/game/`, with
    one `game.py` and one `PRD.md`.** P01–P03 each got a throwaway `projNN/`
    folder. The game does not: every project after P03 edits the same program,
    and each one's prompt starts by pasting in the code the last one produced.

    `PRD.md` is markdown, sits beside the code, and is updated *before* the
    code every project. That ordering is the point — #25 already ruled that
    the PRD, not the chat thread, is the record of what the project should do,
    and a PRD written after the fact is a changelog, not a spec. It also gives
    the student something concrete to check the running program against, which
    is the only form of verification #29 allows. Affects `nhsengineering`
    only. — 2026-08-19

35. **Every project from 04 on ends with a commit and a git tag `pNN`, and
    going back means restoring one file, not checking out a branch.** The
    guide teaches `git checkout p04 -- game/game.py` — restore that file from
    that bookmark, leave everything else alone. Deliberately not
    `git checkout p04`, which detaches HEAD and needs a branch name to get
    back from; `git init` does not promise whether that name is `main` or
    `master`, and a printed guide (#21) cannot check. Restoring one file has
    no such trap and is what a student actually wants when a bad prompt
    wrecks a working game. Affects `nhsengineering` only. — 2026-08-19

36. **Unit 02's checkoff sheet has one Done column, and PowerSchool is the
    official record.** `guides/unit02/tracker.js` is a copy of Unit 01's
    shape, minus the Sim/Real split — software has no simulator half; a
    project either runs and matches its own PRD or it does not. The Due cell
    keeps the late diamond for the same reason it does in #13. The sheet
    lists all ten projects with descriptions, including ones not yet
    assigned, so it doubles as the student's map of the unit. The grade in
    PowerSchool, not this sheet, is the record of completion. Affects
    `nhsengineering` only. — 2026-08-19

37. **`build-all.sh` only looks for `Class Development` on a `-d` run.** It
    used to resolve `deploy.txt` before it had even parsed its arguments, so
    a machine without the Drive folder mounted could not build a guide at
    all — it exited 1 with a deploy error on a plain build. Building and
    deploying are separate jobs and only one of them needs the folder.
    `test-build.js` covers both halves: a plain run succeeds without ever
    naming Class Development, and a `-d` run still fails and still says which
    folder `deploy.txt` asked for. The test costs nothing to run because the
    scratch guide's PDF is already current, so the run reports "up to date"
    and never reaches LibreOffice. This is a `shared/` change, so **it affects
    `nhsrobotics` and `advrobotics` too, when their pins move** — see #11.
    — 2026-08-19

38. **A student attaches files to Ollama rather than pasting their contents,
    and from P05 on that means both `PRD.md` and `game.py`, every chat.**
    The Ollama desktop app reads a dragged `.md` or `.py`, so there is no
    reason to retype a PRD into a chat box: a pasted PRD is a copy, and
    copies drift from the file the student later checks their game against.

    P04 attaches `PRD.md` alone, because at that point the PRD is the whole
    ask and there is no code yet. **P05 onward attaches both.** The code is
    what the program does; the PRD is what it is supposed to do, and only
    one of those is a statement of intent. A fresh chat handed only
    `game.py` cannot tell a deliberate behavior from the bug it is being
    asked to fix. This is what #25 already said — "hand it a copy of the
    current code *and* an updated PRD" — and an earlier version of this
    entry contradicted it by sending code alone.

    The worry that drove that mistake was real but misplaced: attaching the
    whole PRD is not the same as *asking for* the whole game. #24's
    one-requirement-at-a-time rule is about the ask, and the ask is still
    one line plus "do not change anything else." The PRD's job in the
    prompt is to tell the AI what it must not break.

    Both ways of attaching are given — the paperclip button, or dragging
    from a Finder window opened with `open .`. Naming a button in an app is
    not what #21 rules out; that is about links and copyable commands, and
    P03 already says "click the Copy button." Affects `nhsengineering`
    only. — 2026-08-19

39. **The long-thread lesson lands in P04, not later.** #25 settled the
    mechanism — stay in one thread while it is fast, reset with the current
    code and an updated PRD when it is not — but left where to teach it
    open. P04 is where a student first goes several rounds with Ollama on a
    prompt they wrote themselves, so it is the first place the slowdown is
    something they have actually felt rather than been warned about. The
    guide explains the cause (the model re-reads the whole conversation
    every message), gives the reset steps, and explicitly refuses to give a
    message count — noticing the drag is the skill. P05 then relies on it
    rather than re-teaching it. Affects `nhsengineering` only. — 2026-08-19

40. **The editor is CotEditor, installed from the direct download, not
    `pico` and not the Mac App Store.** `pico`'s modal Control-O / Return /
    Control-X save dance costs a line of instruction in every guide and
    buys nothing, and it made replacing AI-written code into a `rm` and
    retype. CotEditor is free, native, open source, about twenty years old,
    and has no AI features of its own — which matters, because an editor
    that autocompletes code would quietly undercut #29's rule that the AI
    writes all the code and the student never reads it.

    **The direct download from coteditor.com, not the App Store listing.**
    An App Store install needs an Apple ID signed in on each lab Mac, which
    is exactly the per-machine manual step #23 and #30 exist to eliminate.
    Editorio was considered first and rejected on this alone: it is App
    Store only, with no DMG and no Homebrew tap, so it would have needed an
    MDM request to someone else and could not have gone on the drive.

    Consequences, all already made:

    - `tools/install-ollama.sh` is now `tools/install-lab-software.sh` and
      installs both apps, strips both quarantine flags, and symlinks both
      `ollama` and `cot` into `/usr/local/bin`. One script, per #30.
    - `OLLAMA-SETUP.md` is now `LAB-SETUP.md`, and the drive carries four
      things instead of three.
    - Every guide opens a file with `touch NAME` then `cot NAME`, and saves
      with Command-S. `touch` first, because `cot` is for opening a file
      that exists.
    - Replacing AI-written code is Command-A, Command-V, Command-S in the
      open tab. **This wipes the header `uv add --script` wrote at the top
      of the file**, so P04 and P05 both tell the student to re-run that
      command if pygame goes missing. That is the one cost of the change,
      and it is cheaper than the `rm`-and-retype it replaces.

    Affects `nhsengineering` only. — 2026-08-19

41. **The install script is manifest-driven, `.app` bundles travel as
    `ditto` zips, and everything a student needs is pre-installed by an
    admin — including `uv` and the pygame wheel.** Four findings forced
    this, all on 2026-08-19, all found by testing on real hardware rather
    than reasoning about it:

    - **An `.app` copied to the exFAT drive arrives broken.** exFAT cannot
      store the symlinks, POSIX permissions or extended attributes a bundle
      is made of, so the code signature fails and macOS refuses it:
      "damaged or incomplete." Observed with `Ollama.app`. Bundles now go on
      the drive as `ditto -c -k --sequesterRsrc --keepParent` archives and
      come off with `ditto -x -k`. `--keepParent` is mandatory and
      `--check` verifies it, because without it the archive holds the
      bundle's contents rather than the bundle and installs nothing.
      Reformatting the stick to APFS would also work but costs a 20-minute
      recopy and buys nothing the zip does not.

    - **The offline install stands; the "days" estimate was measured in the
      wrong direction.** Writing 4.7GB to the stick took 20 minutes, which
      is what made a network pull look necessary. Reading it back — what
      each lab Mac actually does — is about 16 MB/s: a full install measured
      **4m58s** on real hardware, so 20 Macs is ~1.7 hours serially, or
      under an hour with three sticks. #23 and #30 are unchanged. No
      network pull, no MDM request.

    - **`uv` was the real network hole, not the model.** `uv add --script`
      and `uv run` fetch the pygame wheel and possibly an interpreter from
      PyPI, cached *per account* in `~/Library/Caches/uv` — up to 160 live
      downloads across 8 accounts and 20 Macs, happening in class rather
      than at setup. Both caches are now seeded from the drive into
      `/Users/Shared` and every account is pointed at them via two
      variables written to `/etc/zshenv`: `UV_CACHE_DIR` for the wheels and
      `UV_PYTHON_INSTALL_DIR` for the interpreter. Two variables, not one,
      because the cache variable does not cover Python installs. The uv
      cache is read-write, unlike the model, so it is not `a+rX`.

    - **Copy what can be copied; Homebrew only for real dependencies.**
      `uv` is one static binary, so it rides on the drive in `bin/` and is
      installed to `/usr/local/bin`. Going through brew would need brew on
      each machine, a network round trip, and a `sudo -u` dance because
      brew refuses to run as root — all to place one file. Nothing on the
      list currently needs brew. `git` is already present (Apple Git 2.39.5
      via Xcode CLT), so it needs nothing.

    A consequence for the guides: **P01's `brew install uv` step is gone.**
    A non-admin lab account could never have run it, so it was a live bug,
    not just a redundancy. P01 now verifies `uv --version` and tells the
    student to stop and get the teacher if it fails.

    The script takes its payload from folders on the drive — `apps/*.zip`,
    `bin/*`, `clitools.txt`, `models/`, `uv-cache/`, `uv-python/`,
    `arduino15/` — so adding a tool means dropping it on the drive, not
    editing a script last read in August. `--check` validates the whole
    payload with no sudo and no writes, and is the only automated test this
    script can have: the install itself needs root and real hardware.

    Three things learned running it on real hardware, all now fixed:

    - **The signature check is structural, not `codesign`.** `codesign
      --verify` warned on both `Ollama.app` and `CotEditor.app` while both
      launched perfectly — it is strict about things Gatekeeper does not
      block. A warning that fires on healthy apps only teaches you to ignore
      warnings, and the corruption it was meant to catch is already
      prevented by #44's HFS+ requirement. It now checks that
      `Contents/MacOS` is non-empty and fails hard if not.
    - **The environment block goes in three files, not one.** `/etc/zshenv`
      alone assumes zsh. An account on the test Mac was still bash — macOS
      has defaulted to zsh since Catalina, but an older or
      script-created account keeps bash — and a student there would never
      see `UV_CACHE_DIR`, so uv would use its own empty cache and download
      in class. Now `/etc/zshenv`, `/etc/profile` and `/etc/bashrc`, and the
      install prints each account's actual shell so this cannot hide again.
    - **Shared data copies with `rsync --size-only`, not `cp -R`.** A
      re-run was recopying all 4.4GB every time. Re-running is normal, so it
      now skips what is already there at the right size — 70 seconds becomes
      under a second. **The model folder additionally mirrors with
      `--delete`**, because the drive is the source of truth for which
      models exist: without it, a manifest from an earlier install survived
      and the test Mac kept listing `gemma` after the drive had been
      restaged with only `qwen2.5-coder:7b`. The uv caches deliberately do
      *not* mirror — extra wheels there are harmless, and deleting what a
      student's uv cached locally would be gratuitous.

    **Verified end to end on 2026-08-19**, including from a cold `blue01`
    student account: `ollama list` sees the model through its symlink,
    `cot` and `ollama` resolve, and `uv add --script ... pygame` plus
    `uv run` complete with no network access. That last one is the whole
    point of the arrangement and is the only test that would have caught a
    bad uv seed.

    ~~**The script pins every installed app plus Terminal to all 8
    accounts' Docks.** Policy: pin everything pinnable.~~

    **Removed the same day, and it did damage on the way out.** Three
    reasons, in order of weight:

    - `defaults write` against *another* user's plist path while running as
      root does not reliably write there. On the test Mac it wiped
      `persistent-apps` for the lab accounts and reset labadmin's Dock to
      Apple's default. Because the code rebuilt the array wholesale instead
      of appending, a partial failure meant total loss rather than no
      change — either mistake alone would have been survivable.
    - An account that has never been logged into has no Dock plist at all,
      so it was skipped — 3 of 8 on the test Mac. Working around that meant
      either logging into 160 accounts by hand or installing a LaunchAgent
      on 20 machines, both of which cost more than the problem.
    - The Dock is cosmetic. P01 already teaches ⌘-Space, so a student with
      a default Dock loses convenience and nothing else.

    **Students pin their own apps**, in P01 Step 2 — Terminal, Ollama and
    CotEditor, via right-click → Options → Keep in Dock. One step in a
    guide replaces a destructive automation, which is the right trade for
    something no one needed automated.

    Arduino board packages are **copied, not symlinked**, and only into the
    accounts named in `ARDUINO_ACCOUNTS` — one class of eight uses the
    Arduino IDE, the IDE writes into that folder, and a shared writable copy
    across 8 accounts is a support call waiting to happen. Affects
    `nhsengineering` only. — 2026-08-19

42. ~~**Tinkercad is the one dependency that cannot live on the drive, and it
    is untested.** Unit 01's Sim half is a website, so it needs accounts and
    it needs to clear the school content filter. Everything else in either
    unit now installs offline. This is not a decision so much as the one
    remaining thing to verify before September, recorded here so it is not
    rediscovered in a classroom.~~ — 2026-08-19

    **Resolved — not actually a risk.** Tinkercad has worked at the school
    for years; the school filter was never in question. Affects
    `nhsengineering` only. — 2026-08-26

43. **The lab drive carries one model, staged by name with
    `tools/stage-model.sh`. Never `cp -R ~/.ollama/models`.** The obvious
    command copies every model ever pulled. Found on the real drive: 22.7GB
    where the class needs 4.7GB — an 18GB blob left orphaned by an earlier
    `ollama rm`, with no manifest on the drive referencing it at all.
    `ollama rm` prunes blobs in `~/.ollama`, but a drive made before that rm
    is a dumb copy and prunes nothing, so the orphan would have ridden to
    all 20 machines and cost about four minutes on each.

    Blobs are content-addressed and shared between models, so a model's
    worth cannot be picked by eye — delete the wrong digest and Ollama lists
    a model it cannot run. The script reads the manifest, copies exactly the
    digests it names, and refuses to stage a model whose blobs are not all
    present. Working forward from the manifest rather than copying a folder
    is what makes orphans on the source unable to travel.

    This also corrects the throughput figure in #41. The measured 4m58s was
    moving 22.7GB, not 4.7GB, so the stick reads at about **76 MB/s**, not
    16. A drive carrying one model installs in **1m17s**, measured on real
    hardware after the fix, putting all 20 at about 26 minutes — which
    removes any remaining argument for a network pull. Affects `nhsengineering` only. — 2026-08-19

44. **The lab drive is formatted Mac OS Extended (Journaled), and that
    replaces most of #41's zip and tar machinery.** The drive was exFAT when
    the first install was attempted. exFAT cannot store the symlinks,
    permissions or extended attributes an `.app` bundle is made of, and that
    alone broke `Ollama.app`.

    A note against a wrong claim made while working this out: the Disk
    Utility erase dialog was read as saying the drive was *FAT32*, and a
    second failure was inferred from FAT32's 4GB per-file cap against the
    model's 4.7GB blob. That was a misreading — the dialog had FAT32
    checked because it is the default for a new erase, not because it was
    the current format. The 18GB blob already sitting on the drive was
    proof enough, since FAT32 could not hold it. **There was one failure,
    not two, and the 4GB cap never applied.** The cap is real and is worth
    knowing if a FAT32 drive is ever used, which is why `--check` still
    warns about FAT volumes generally.

    Reformatting is the cheaper fix than working around it: on HFS+ the apps,
    the model and the uv caches all travel as themselves, copied with
    `ditto`. #41's zip and tar paths are kept as a supported fallback rather
    than deleted, because they cost nothing and a future drive might not be
    reformattable — but they are no longer the documented route.

    `--check` now detects the drive's filesystem with `diskutil` and fails
    if it finds a bare bundle or a `uv-python/` folder on a FAT volume,
    which is the specific pairing that looks fine and is already corrupt.
    On HFS+ the same payload passes. Both paths are tested.

    Drive is named `app_installer`. Affects `nhsengineering` only.
    — 2026-08-19

45. **The shared model folder is mirrored from the drive, not merely added
    to.** `rsync --size-only` alone made re-runs cheap but could never
    remove anything, so `gemma4:26b`'s manifest and its 17GB blob — copied
    over in the first install off the mixed exFAT drive — survived every
    subsequent run and `ollama list` kept advertising it on the lab Mac.
    The models copy now uses `--delete`, making the drive the source of
    truth for which models exist. The uv caches deliberately do not mirror:
    an extra wheel there is harmless, and deleting whatever a student's uv
    cached locally would be gratuitous.

    A diagnostic trap worth remembering, because it cost time twice: on a
    lab Mac, `ollama list` answers differently depending on which account
    asks. The 8 student accounts have `~/.ollama/models` symlinked to
    `/Users/Shared/ollama-models`; an admin account like `labadmin` does
    not, and shows its own private store. Checking the shared folder means
    checking from a student account, or following the symlink by hand.
    Affects `nhsengineering` only. — 2026-08-19

46. **The `--check` mode is the only automated test the install script can
    have, and it is worth more than it looks.** The install itself needs
    root and real hardware, so it cannot be unit-tested. `--check`
    validates the whole payload with no sudo and no writes, and every
    failure it detects is one that was actually hit this session: a zip
    made without `--keepParent`, a bare bundle on a FAT volume, a
    `uv-python` folder whose symlinks a FAT volume silently dropped, a
    missing `uv-python` entirely, a malformed `clitools.txt`, and
    `arduino15` present with no accounts named. Each one looks fine and
    fails later, which is exactly the class of problem worth a check.

    The rule this session kept re-teaching: **run `--check` on your own Mac
    before carrying the drive anywhere.** Finding a bad payload at the desk
    costs a minute; finding it on the twentieth machine costs the
    afternoon. Affects `nhsengineering` only. — 2026-08-19

47. **The lab drive is backed up as one opaque archive, kept beside
    `Class Development` rather than inside it, and a second physical drive
    is the working spare.** Google Drive rewrites the symlinks and
    permissions inside an `.app` bundle, so syncing the drive's contents as
    a folder would corrupt the apps exactly the way exFAT did. A single
    file — `ditto -c -k --sequesterRsrc --keepParent`, or an `hdiutil`
    `.dmg` — syncs byte for byte and restores intact.

    It goes in `Teaching/` under the `rdsalemi@gmail.com` Drive, not in
    `Class Development`: nothing would break there (`build-all.sh -d`
    copies named PDFs in, it does not sweep the folder) but a 6GB archive
    in the folder holding class documents is the wrong drawer.

    Worth knowing what the backup is actually for. Nearly everything on the
    drive is reproducible — the apps are free downloads, the model is one
    `ollama pull`, `uv` is one `brew install`, and the script and
    `clitools.txt` are in this repo. **The part that is not cheap to
    reproduce is the tested pairing**: this pygame wheel against this
    Python 3.13. Rebuilding from scratch means re-verifying that, not just
    re-downloading. That is the thing the archive preserves.

    A second USB drive was chosen over relying on the cloud alone, because
    it is the same 6GB, it is usable immediately if the first dies, and
    three drives turn half an hour of walking around into fifteen minutes.
    Affects `nhsengineering` only. — 2026-08-19

48. **Unit 01 is closed. It is not being worked on, and its open items are
    not work.** The guides build, they deploy, and Ray has taught this class
    from this content before (#17). What was listed as open — no shared
    skeleton across E00–E09, importer-fused diagram labels, no student
    holding a new-pipeline PDF — is polish nobody is waiting on, and #18 was
    already withdrawn rather than acted on. A thread that opens on this repo
    works on Unit 02 unless Ray says otherwise. Reopening Unit 01 is a
    deliberate call, not something a thread drifts into because STATUS.md
    still lists a gap. Affects `nhsengineering` only. — 2026-08-20

49. **A student picks the model from the Ollama app's Select Model pulldown
    every time they open it, and files attach with the + button — not a
    paperclip.** Both were found by working the guides on the real app, and
    both were wrong in print:

    - The guides said "check that the model at the bottom of the window
      says `qwen2.5-coder:7b`." Checking is not enough — the app does not
      reliably come up on that model, and a printed guide (#21) cannot
      tell a student what it will say. Selecting is an action, so it is
      written as one, in P03 (first use), P04 and P05.
    - **There is no paperclip button.** It is a plus sign. This corrects
      #38, which named the paperclip in both its own text and the guides'.
      #38's substance is unchanged — attach, do not paste; both files from
      P05 on — only the button's name was wrong.

    Also from the same hands-on pass: P04's prompt now names the file
    (`...implements the game in the PRD.md file`) instead of trailing off
    into "does the following," which read as though the requirements were
    about to be typed out; and Step 4 warns that generation can take a
    while and to let it finish before copying, because a half-written code
    block looks finished. Affects `nhsengineering` only. — 2026-08-20

50. **Students are given a git identity by the install script. They are not
    taught to configure one.** Without it, the first `git commit` in P04
    Step 12 stops with "Please tell me who you are," and a period meant for
    building a game goes on configuring git — which #29 already says is not
    what this unit teaches. Git here is a student's undo mechanism (#35),
    not a collaboration tool.

    Four exports join the uv variables in the block the script writes to
    `/etc/zshenv`, `/etc/profile` and `/etc/bashrc` (#41):
    `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`,
    `GIT_COMMITTER_EMAIL`, each set to `${USER:-$(id -un)}` — **written
    unexpanded, in single quotes.** That is the whole trick: the block is
    machine-wide but the value resolves when each account's shell sources
    it, so `blue01` commits as `blue01` from one line. Double-quoting them
    would expand `$USER` at install time and stamp the installer's own
    identity on all eight accounts, which is why `test-env-block.sh` checks
    the quoting and not just the presence.

    The address is `${USER}@nhs.invalid`. `.invalid` is reserved and can
    never route; nothing is pushed, the repo never leaves the machine, and
    PowerSchool is the record of completion (#36), so a real address would
    only invite mail nobody reads.

    **Rejected: teaching `git config --global` in P01.** The eight accounts
    are shared by class period, not by student, so period 1's real name and
    email would sit in a `~/.gitconfig` the next seven periods can read.
    That is a privacy cost paid for attribution that buys nothing here.

    **Environment variables rather than `git config --system`**, because
    Apple's git keeps its system config inside the Command Line Tools
    bundle, where a CLT update can erase it silently. The `/etc` block is
    already proven on this hardware.

    The same block now pins `init.defaultBranch=main` via
    `GIT_CONFIG_COUNT`/`KEY_0`/`VALUE_0`, which silences the hint paragraph
    `git init` prints in P01. A printed guide (#21) cannot explain output
    that varies by git version. This does not change #35 — restoring one
    file is still the right thing to teach, for its own reasons.

    **New test: `tools/test-env-block.sh`.** #46 said `--check` was the only
    automated test this script could have, and that was too pessimistic: the
    install needs root and hardware, but the *content* of the environment
    block is just shell, and what it must accomplish can be verified in a
    scratch directory with no privileges. Confirmed to fail on a mutated
    copy before being trusted on the real one. Affects `nhsengineering`
    only. — 2026-08-20

51. **Guides are written and typeset to be readable on paper by a dyslexic
    student. That is a requirement, not a preference.** Ray is dyslexic, and
    what he needs to read a page is what a student needs. #21 already ruled
    that these guides are printed handouts; this says what a printed handout
    has to look like and read like.

    **In `shared/build.js`, three settings, now named constants:**
    `BODY_SIZE = 24` (12pt), `LINE = 360` (1.5-line spacing), and
    `ALIGN_BODY = AlignmentType.LEFT` applied to every paragraph, bullet,
    numbered item, lead and note. This is the standard print guidance — the
    British Dyslexia Association's, and WCAG 1.4.8 for the same reasons.

    Left alignment changes nothing today, because Word's default is already
    left. It is set explicitly anyway: a justified guide would come from a
    style someone adds later, and nothing would fail. Justifying means
    stretching the spaces between words to straighten the right edge, which
    puts white channels down the page that pull the eye off the line, and
    removes the ragged edge a reader uses to find their place again.

    **In the five Unit 02 guides, the prose was rewritten.** Short sentences,
    one idea each. The action first in a step, with the explanation after it
    rather than in front of it. No paragraph longer than about three
    sentences. Not one decision, number, command or per-game requirement
    changed — this is the same content, differently shaped.

    One content change came with it: P02's aside comparing the pygame loop to
    `loop()` in "Project 00 of Unit 01" is gone. #26 already ruled that
    printed Unit 02 text should not send a student looking for another unit,
    and Unit 01 is closed (#48).

    **The cost is paper, and it is real.** Unit 02 went from 22 printed
    sheets to 30 across the five guides — P04 alone went 6 to 8. Unit 01
    grew the same way on rebuild, though nothing there was rewritten. That
    is the price of 12pt and 1.5 spacing, and it is worth paying.

    **`shared/test-build.js` pins all three** — 12pt runs, `w:line="360"`,
    an explicit `w:jc w:val="left"`, and nothing on the page justified.
    Confirmed to fail on a mutated copy first. This is a `shared/` change,
    so per #11 **`nhsrobotics` and `advrobotics` get it when their pins
    move, and moving a pin means rebuilding and eyeballing their guides** —
    their page counts will grow too. Affects `nhsengineering` now, both
    robotics repos on their next pin bump. — 2026-08-20

52. **`build-all.sh` checks for LibreOffice when it has something to convert,
    not at startup.** `vault-shared`'s own GitHub Action has been failing
    since #37 added the test that runs `build-all.sh`. The runner has node
    and no LibreOffice, and the script checked `node`, `soffice` and
    `pdftoppm` before it looked at whether any guide was stale — so a run
    that converts nothing still exited 1.

    This is #37's bug in a different costume. That entry ruled that a plain
    build must not demand `Class Development`, because building and deploying
    are separate jobs and only one needs the folder. The same is true of
    LibreOffice: a run where every PDF is current does no conversion, so
    requiring the converter fails a job that was never going to use it.
    #37's own test comment said as much — "the run reports up to date and
    never reaches LibreOffice" — and was wrong about the code.

    The check is now `require_tools`, called at the top of the stale branch
    for a guide and before an extra's recipe runs. It is checked once per
    run, not once per guide, so a long build cannot print the same complaint
    ten times. **Deferring is not skipping**: a run that must convert still
    exits 1 and still names what is missing.

    `test-build.js` covers both halves, and the second half is the one worth
    having: it builds a `PATH` with node and no LibreOffice — the runner's
    shape — makes the guide stale, and asserts the script still refuses and
    still names `soffice`. Both halves pass with LibreOffice present and
    absent.

    Worth recording that this was not caused by the typography change in
    #51. Checked by running the previous commit's tests against a PATH
    without LibreOffice: they fail the same way. CI has been red since #37
    and nobody had looked. This is a `shared/` change, so it reaches
    `nhsrobotics` and `advrobotics` when their pins move — see #11.
    — 2026-08-20

53. **P04's PRD template says what is out of scope, and its last section is
    "The player at the edges," not "The edges."** Ray worked P04 himself and
    wrote a Pong PRD whose edge section read "when the ball goes off the left
    or right edge the opposite player gets a point" — a ball and a score, at
    the project that adds neither.

    That is not a misreading. For Pong, "the edges" plainly means scoring.
    The template asked a question about the whole game and the guide never
    said the PRD covers only today's piece.

    Two changes. The template now opens with what is not in it yet — "No
    ball. No score. No enemies. Those get added later, in the projects that
    add them" — and the section is renamed and its prompt made explicit
    about the player.

    This matters more than a wording nit because of #33. The MVP is built
    one requirement at a time precisely so a wrong result is traceable to
    one ask. A student whose first PRD describes the finished game hands
    Ollama the whole thing at P04, gets a whole game back, and #29 forbids
    reading the code to work out which part went wrong. The template is
    what holds that line, so it has to state the scope rather than imply
    it. Affects `nhsengineering` only. — 2026-08-20

54. **Unit 02 is five projects, not ten. P04 builds the base game from a
    one-line PRD and P05 turns it into the student's own version. Both take
    two periods.** This reverses #32's ten-project map and #33's ban on a
    whole-MVP prompt, and it is Ray's own hardware test that killed them.

    He typed one paragraph — "Write me a simple pong game. Two paddles, one
    controlled by the human with the arrow keys. Score on top. 600 pixels
    wide 400 pixels tall use pygame" — and `qwen2.5-coder:7b` wrote a
    complete, playable Pong. Not a fragment. Paddles, ball, collision,
    scoring, an opponent that tracks the ball.

    So building a well-understood game one sprite at a time was solving a
    problem that does not exist. #33's argument was that a whole-game prompt
    gives a student no way to tell which sentence caused a wrong result. What
    actually went wrong in the test was `UnboundLocalError` — a crash, fixed
    by the paste-the-error loop, which is the same loop at any size. Increment
    size never entered into it.

    **The new shape:**

    - **P01–P03 unchanged.**
    - **P04, two periods** — the PRD starts as one line: "This is Pong."
      Prompt, crash loop until it runs, then *play it* and write down what is
      wrong, add a PRD section for each, prompt again. Ends with a demo to
      Ray. This is the MVP.
    - **P05, two periods** — new name, new look, new rules. One change at a
      time, PRD updated first each time, commit after each one that works.

    **The one-line PRD is the pedagogy, not a shortcut.** "This is Pong" gets
    a working game because the model has read thousands of them. What it
    cannot know is *which* Pong. The student discovers that by playing: the
    score climbs forever, the computer paddle moves 5 pixels a frame against
    a 3-pixel ball and cannot be beaten, the window is whatever size it felt
    like. Every one of those is a decision they now have to write down. A spec
    is what you write when the default is not what you want, and they meet
    that fact by hitting it rather than being told.

    Both of those defects were in Ray's actual output and neither was
    specified. That is the lesson, already generated.

    **Rejected: a seven-section PRD template.** Drafted and thrown out. With
    "This is Pong" at the top, a section reading "your sprite is a paddle" is
    telling the model something it already knows. After the base-game line,
    the only thing worth writing is what the base game leaves open — sizes,
    speeds, colors, keys, what ends it. If you would get it anyway from the
    genre name, it does not go in the PRD.

    **The word "mechanic" is gone**, undefined jargon. So is the search for
    one noun covering everything a game adds: a sprite is anything that moves
    against the background, which makes Breakout's bricks not sprites. Name
    the thing instead.

    **Realistic scope: the term reaches P05.** That is why nothing past it is
    written and why `tracker.js` prints five rows, marking P04 as the MVP and
    both P04 and P05 as two periods. #36's "the sheet doubles as the map of
    the unit" still holds — the map is just five projects long now.

    Affects `nhsengineering` only. — 2026-08-20

55. **P05 has a six-line rubric on the checkoff sheet. P01 through P04 keep
    one box each.** The first four projects are done or not done — the game
    runs in front of Ray, or it does not. P05 is not that kind of task. "Make
    it your own" is a judgement call, and a student who recolors the
    background and stops has done something, which is exactly the case a
    single box cannot express.

    So P05 gets six boxes, one per required change: a new name, a theme, a
    color scheme, a new look for the student's sprite, a new look for the
    other sprites, and a rule the base game did not have. All six, or the
    project comes back — which is #26's redo rule, now with something
    concrete to check it against.

    The theme is on the list for a reason that is not decoration: it is what
    makes the other five choices cohere. Six unrelated changes are noise; six
    changes in service of "this is a sport now" is a design.

    `tracker.js` grew a fifth field, `parts`. A project with parts keeps its
    own row for the number and the due date, then gives each part a row and a
    box of its own. Nothing else in the sheet changed. The same six are
    printed in P05's Step 1, in the same order and the same words, so the
    guide and the sheet cannot drift.

    **P05's worked example is Virus Hunter, built on Asteroids — a game
    nobody is assigned.** It was Pickleball on Pong first, which was wrong:
    an example built on one of the five assigned games hands that game's
    students their answer and leaves the other four with an example about
    a game they are not building. Asteroids belongs to nobody, so the
    example teaches the shape without doing anyone's work.

    **P05's six are named identically in three places** — the guide's
    opening, its Step 1, and `tracker.js`. Same order, same words. A rubric
    that is checked off against a sheet cannot afford a synonym.

    **No period counts in printed text.** P04 and P05 briefly said "two
    periods," on the sheet and in the guides. Removed: Ray's own estimate is
    that P05 runs three, and a number printed on a handout is wrong the first
    time a class runs long. The Due column already governs, and the count is
    scheduling information a student does not need.

    Virus Hunter is Asteroids with the six decided on purpose: a hypodermic
    needle for the ship, green viruses for the rocks, yellow antibodies for
    the bullets, a pale blue microscope-slide background, and big viruses
    that split into medium then small, with the small ones fastest and worth
    most. The guide points out what the example demonstrates — the theme is
    what makes the other five agree with each other. Affects
    `nhsengineering` only. — 2026-08-20

56. **No emoji in anything that becomes a PDF, and an unusual character gets
    looked at rather than caveated.** #15 recorded that the machine building
    a PDF decides its fonts, and every thread since has repeated the warning
    to Ray instead of resolving it. He is tired of the caveat and he is
    right: telling him a glyph *might* be wrong is not worth reading.

    Two rules replace it. Do not introduce a character that cannot be
    verified — a plain one almost always works. And where an unusual
    character already exists, render the page and look at it:
    `pdftoppm -png -r 80 -f 1 -l 1 FILE.pdf /tmp/x`, then open the image.

    That is how the `☐` in the Unit 02 checkoff sheet was confirmed as a real
    box before deploying, which also answers the standing question:
    **geometric characters like `☐` and `◇` are in the sandbox's fonts and
    render correctly; emoji do not.** So the checkoff sheets are safe to
    build anywhere. Only emoji ever forced a build onto Ray's Mac, and the
    only one left is the robotics worksheet's `🤖`.

    Affects `nhsengineering`, and `nhsrobotics` for that worksheet.
    — 2026-08-20

57. **`qwen2.5-coder:7b` generates a working first draft of all five assigned
    games, not just Pong.** Following #54's Pong test, the same one-paragraph
    shape — genre name, core objects and controls, screen size, "using
    pygame" — was tried against Breakout, Snake, Space Invaders and Frogger.
    All four came back as running code, same as Pong did. The output is
    rough, same as Pong's was: that is expected and is the point of P04's
    Step 7 (play it, write down what's wrong) and Step 8 (put it in the
    PRD), not a defect to fix in the prompt.

    "using pygame" must be stated explicitly, or the prompt doesn't reliably
    ask for it. Adding "and uv" was tried and found to do nothing: `uv` is a
    CLI step the student runs separately (`uv add --script`, `uv run`),
    never something the generated code itself does, so the model has
    nothing to act on and ignores it. Affects `nhsengineering` only.
    — 2026-08-20

58. **Slide decks are generated from a script in `slides/`, and pptxgenjs's
    `sizing` option is never used — it silently distorts every picture.**
    The Class 01 welcome deck was rebuilt from 31 slides to 20. The rebuild is
    `slides/build-class01-welcome.js`; the `.pptx` is an output, like a guide
    PDF, and hand-editing it loses the next build.

    Every image in the first build was stretched. `sizing: { type: "contain" }`
    and `{ type: "cover" }` write an all-zero `<a:srcRect>` and leave the
    picture scaled to its box — 22 of 22 pictures wrong, the worst by 137%.
    `sizing: { type: "crop" }` is broken differently: it emitted `r="-53632"`,
    a negative crop. Ray spotted it on the slides; nothing in the toolchain
    did. The XSD passes, `validate.py` reports "All validations PASSED", and
    LibreOffice renders the distortion faithfully, so a visual QA pass sees a
    stretched photo and has nothing to compare it against.

    The geometry is computed in the generator instead. `place()` either fits
    the picture inside its frame at true ratio and centres it, or centre-crops
    a derivative with `sharp` to the frame's exact ratio; either way pptxgenjs
    receives an x/y/w/h that already matches, with nothing left to stretch.
    Cropped derivatives go to `slides/.build/`, gitignored — reproducible from
    `assets/`, same rule as #8.

    **New test: `slides/check-aspect.js`.** It re-measures the finished file,
    comparing each shape's on-slide ratio against the embedded image's own,
    adjusted for any crop, and fails past 1%. Confirmed to fail on the previous
    build — 22 of 22 — before being trusted on the new one. `npm run all`
    builds and checks.

    The images themselves were extracted from the original deck into
    `assets/class01-welcome/`, renamed by slide and subject, with a README
    mapping each one, so a future deck does not have to unzip a `.pptx` to
    reuse a picture. Affects `nhsengineering` only. — 2026-08-26

59. **The Class 01 welcome deck is a filter, and it filters on interest, not
    on difficulty.** Guidance places students in this class who belong in the
    other Engineering class at Natick — where a student can sit on a phone,
    hand in an arts-and-crafts project late, and take an A. The goal for day
    one is that every one of them switches out, voluntarily. This is also why
    the units are ordered electronics, then software engineering, then
    robotics: a student who does not find this kind of work fun meets that
    fact immediately.

    **The mechanism matters more than the intent.** A deck built on "this
    class is hard" selects on confidence: the anxious student who would
    thrive leaves, and the coaster — who has heard "this class is hard" from
    every teacher since sixth grade — stays. So the deck shows the work
    instead. What you will have built by December, on real photographs.
    Engineering is fun and engineering is not easy, both at once. Then an
    exit that is explicit, warm and unashamed, placed *after* the student has
    seen what they would be giving up.

    Three calls inside that:

    - **The exit names no mechanism.** No deadline, no guidance office, no
      procedure — just "there is still time to switch." Ray's call: they know
      how, and printing the steps turns an invitation into an eviction
      notice.
    - **The other class is never named or alluded to.** It would reach that
      teacher, it makes Ray the colleague who trashes colleagues, and it
      hands a coasting student a target to defend instead of a choice to
      make.
    - **The real filter is the last twenty minutes of the period**, not the
      deck. A student who leaves having wired something in Tinkercad that did
      not work first try knows. That caps the deck at about twenty minutes,
      which is what forced 31 slides down to 20.

    The deck also stopped disagreeing with the guides: its grading slide is
    `guides/unit01/course.js` verbatim (20 / 18 / 0), replacing "late gets a
    0, then 90% credit." Arguably the same policy, but not the same words,
    and a student meets both.

    **Cut: the two administration policy slides.** They were the department's
    memo *to teachers* — "please write them up," "so deans/VPs can use
    progressive discipline" — projected at students, nine bullets deep, in
    red, unreadable from the back row and addressed to the wrong audience.
    The holder photo and a three-line ladder say it. Affects
    `nhsengineering` only. — 2026-08-26

60. **"Unit 01 is closed" (#48) means closed to development, not closed to
    teaching.** Misread once this session, badly enough to produce a wrong
    claim that the welcome deck pointed at last year's course. Unit 01 is the
    **first** unit students take; its guides build, deploy, and are
    classroom-tested (#17). A deck that ends on Tinkercad and Project 00 is
    correct, not stale. What #48 rules is that a thread opening on this repo
    does not pick up Unit 01 polish unless Ray says so. Affects
    `nhsengineering` only. — 2026-08-26

61. **`start-thread` verifies STATUS.md's open items before reporting them.**
    The skill used to say, in its own text, that it must not check any claim
    against the repo. Following that, this session opened by reciting three
    dead items as live work — the lab Macs (all 20 done), Tinkercad (working
    at the school for years), and a stray `game.py` (gone for days). Ray:
    "You need to start checking things before you waste my time with them."

    Nothing in this log ever asked for that rule; it came from an earlier
    session's edit to the skill. The skill is now V06: a read-only pass —
    `ls`, `grep`, `git status` — over what STATUS.md lists as open, reporting
    anything that died on contact, and saying so plainly rather than reciting
    it as current. What cannot be checked from a sandbox — hardware, hand
    testing, anything needing a network — is still reported as written,
    without hedging language layered on top.

    **Checking is still not fixing.** The skill keeps its ban on editing
    files, fixing what it finds, and starting the next job. Affects every
    project that uses `start-thread`, not just this one. — 2026-08-26

58. **Everything on the drive installs to all eight accounts. There is no
    per-account list.** This reverses the Arduino carve-out in #41, which
    seeded board packages only into the accounts named in
    `ARDUINO_ACCOUNTS` on the reasoning that one class period of eight uses
    the Arduino IDE.

    The carve-out cost more than it saved. The array shipped empty, so the
    seeding never ran; `--check` grew a rule that failed the drive when
    `arduino15/` was present and the list was not filled in; `LAB-SETUP.md`
    grew a step telling Ray to edit the script; and every thread that read
    STATUS.md re-raised "which account is it?" as an open question. All of
    that to avoid copying a board-package folder into seven accounts that
    will not open the IDE — disk space nobody is short of.

    `ARDUINO_ACCOUNTS` is deleted. The seeding loop runs over `ACCOUNTS`,
    the same eight every other step uses. `--check`'s empty-list rule is
    deleted with it, because the condition it detected can no longer
    happen. `arduino15/` on the drive means seeded; absent means skipped.
    Copied, not symlinked, is unchanged from #41 — the IDE writes into that
    folder, so eight accounts sharing one writable copy is still a support
    call waiting to happen.

    Tinkercad's entry (#42) was resolved the same day: it has worked at the
    school for years and the content filter was never in question.

    Affects `nhsengineering` only. — 2026-08-26
