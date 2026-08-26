---
name: lab-macs-are-non-admin
description: "20 lab Macs, 8 student accounts each, no admin rights — anything needing install goes in the drive script, never a guide step."
metadata: 
  node_type: memory
  type: project
  originSessionId: 073387ce-67f7-4eda-8e0c-3e9fc069c9b2
  modified: 2026-08-19T23:48:42.613Z
---

Ray's classroom is 20 Apple Silicon Macs, 16GB each, with 8 local accounts
per machine (one per class period, `blue01`–`blue04`, `red01`–`red04`).
**Student accounts are not admins.** An admin account, `labadmin`, exists
separately and is not one of the eight.

**Why it matters:** any guide step that installs something cannot work.
`brew install uv` sat in Project 01 for days as a live bug for exactly this
reason. Anything requiring root belongs in `tools/install-lab-software.sh`,
run once per machine off a USB drive.

**How to apply:**

- Writing a student guide: assume the tool is already there and verify it
  (`uv --version`), don't install it.
- Adding a dependency: it goes on the drive and in the script, not in a
  guide.
- A tool that fetches on first use is the same problem one layer down —
  `uv` pulling a pygame wheel, the Arduino IDE pulling board packages. Seed
  it from the drive into `/Users/Shared` and point the accounts at it.
- Checking shared state on a lab Mac: ask from a *student* account. An
  admin account has its own private stores and will answer differently.
- Related: [[automate-worthwhile-steps]], [[test-on-hardware-not-in-theory]].
