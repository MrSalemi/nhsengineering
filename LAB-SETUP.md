# Lab Deployment — Thumb Drive Install

Everything Unit 02 needs on a lab Mac: **Ollama** (with the model already
pulled) and **CotEditor** (the editor the guides use). For 20 lab Macs
(Apple Silicon, 16GB RAM), 8 local accounts each. No network pull on any lab
machine — everything comes off the drive. Model: **qwen2.5-coder:7b** (fits
comfortably in 16GB unified memory, leaves headroom for pygame running
alongside it; the larger MoE options need more RAM than these machines have).

## 1. Prepare the thumb drive (on your Mac, with internet)

```bash
# Install Ollama if you haven't already: https://ollama.com/download

# Pull the model once
ollama pull qwen2.5-coder:7b

# Quit Ollama fully (menu bar icon → Quit) before copying —
# don't copy while a blob might still be writing
```

Get CotEditor from **<https://coteditor.com>** — the direct download, not the
Mac App Store listing. An App Store copy needs an Apple ID signed in on each
lab Mac, which is the per-machine manual step this whole drive exists to
avoid. Same for the Arduino IDE, from <https://arduino.cc>.

### Format the drive Mac OS Extended (Journaled) first

**This is not optional and it is the first thing to get right.** A FAT32 or
exFAT drive cannot store the symlinks, permissions, or extended attributes
an `.app` bundle is made of. Drag `Ollama.app` onto one and what arrives has
a broken code signature; macOS then refuses to launch it with *"You can't
open the application because it may be damaged or incomplete."* Not a
warning you can click through, and not fixed by stripping quarantine. FAT32
additionally caps one file at 4GB, and the model's largest blob is 4.7GB, so
the model cannot copy intact either.

In Disk Utility, erase the drive as **Mac OS Extended (Journaled)**. APFS
works too. Then everything below is a plain copy.

```bash
D=/Volumes/<drive>
mkdir -p "$D/apps"
ditto /Applications/Ollama.app        "$D/apps/Ollama.app"
ditto /Applications/CotEditor.app     "$D/apps/CotEditor.app"
ditto "/Applications/Arduino IDE.app" "$D/apps/Arduino IDE.app"
```

`ditto`, not `cp -R`, because it carries the permissions and symlinks a
bundle needs even between two filesystems that can hold them.

If you are ever stuck on a FAT drive, the script also accepts each bundle
wrapped as a zip — `ditto -c -k --sequesterRsrc --keepParent App.app
apps/App.app.zip`. `--keepParent` is mandatory there: without it the archive
holds the bundle's *contents* rather than the bundle, and extracts as loose
folders that install nothing. `--check` catches both mistakes, and will tell
you if you have bare bundles sitting on a FAT volume.

### Stage one model, not your whole collection

**`cp -R ~/.ollama/models` is the wrong command**, and it is the one that
looks right. It copies every model you have ever pulled. On 2026-08-19 that
put 22.7GB on the drive — an 18GB model nobody in the class uses, sitting
beside the 4.7GB one they do — and every one of 20 machines would have paid
for the difference. About four minutes per Mac, wasted, twenty times.

Blobs are content-addressed and shared between models, so you cannot pick a
model's worth by eye: delete the wrong digest and Ollama lists a model it
cannot run. `tools/stage-model.sh` reads the manifest and copies exactly the
blobs it names.

```bash
# start clean if the drive already has a mixed models/ folder
rm -rf /Volumes/<drive>/models

tools/stage-model.sh qwen2.5-coder:7b /Volumes/<drive>/models
```

It prints each blob and a total, and refuses to stage a model whose blobs
are not all on disk. Run it with no arguments to list what you have.

### The rest of the payload

```bash
D=/Volumes/<drive>

# the model — ONE model, staged by name. Never `cp -R ~/.ollama/models`,
# which copies every model you have ever pulled; see the warning below.
~/repos/sch_repo/nhsengineering/tools/stage-model.sh qwen2.5-coder:7b "$D/models"

# uv, a single static binary. `which uv` says where brew put it.
mkdir -p "$D/bin" && cp "$(which uv)" "$D/bin/"

# the script itself
cp ~/repos/sch_repo/nhsengineering/tools/install-lab-software.sh "$D/"

# which in-bundle tools get a symlink on the lab Macs
cat > "$D/clitools.txt" <<'EOF'
ollama :: Ollama.app/Contents/Resources/ollama
cot    :: CotEditor.app/Contents/SharedSupport/bin/cot
EOF
```

Then seed the uv caches, so no student ever downloads pygame in class. On a
Mac OS Extended drive you can build them straight onto it:

```bash
mkdir -p /tmp/uvseed && cd /tmp/uvseed && touch seed.py
UV_CACHE_DIR="$D/uv-cache" UV_PYTHON_INSTALL_DIR="$D/uv-python" uv add --script seed.py pygame
UV_CACHE_DIR="$D/uv-cache" UV_PYTHON_INSTALL_DIR="$D/uv-python" uv run seed.py
```

Both variables are needed: `UV_CACHE_DIR` holds the wheels, and
`UV_PYTHON_INSTALL_DIR` holds the interpreter, which the cache variable does
not cover. A uv-managed Python contains symlinks (`bin/python3` →
`python3.13`), which is the other reason the drive cannot be FAT — on one of
those, build these locally and `tar -cf "$D/uv-python.tar" -C <local> .`
instead. The script accepts either form.

Optionally, add Arduino board packages. Launch the IDE once on your Mac,
then:

```bash
ditto ~/Library/Arduino15 "$D/arduino15"
```

That is the whole step. If the folder is on the drive, the script seeds it
into all eight accounts; if it is not, the seeding is skipped.

### Check the drive before you carry it anywhere

```bash
cd /Volumes/<drive name>
./install-lab-software.sh --check
```

No sudo, changes nothing, takes a second. It lists every problem at once —
a missing folder, a zip made without `--keepParent`, a malformed
`clitools.txt`. Finding a bad payload at your desk costs a minute; finding
it on the twentieth Mac costs the afternoon.

## 2. Install on each lab Mac (offline, no network needed)

One command per machine, run as admin from the drive:

```bash
cd /Volumes/<drive name>
sudo ./install-lab-software.sh
```

It extracts every app in `apps/` with `ditto`, strips quarantine flags,
verifies each signature, installs `bin/*` to `/usr/local/bin`, symlinks the
in-bundle tools named in `clitools.txt`, copies the model and the uv caches
to `/Users/Shared` (one copy per machine, not one per account — DECISIONS
#23), symlinks all 8 accounts' `~/.ollama/models` to the shared model, seeds
Arduino board packages for the accounts you named, and writes the machine-wide
environment block to `/etc/zshenv`, `/etc/profile` and `/etc/bashrc` so
every account gets it whichever shell it uses. Safe to re-run. No need to
log into any of the 8 accounts by hand.

That block holds the two `uv` variables and a **git identity**. Without an
identity, the first `git commit` in Project 04 stops with *"Please tell me who
you are"* and the period goes on configuring git instead of building a game.
`GIT_AUTHOR_NAME` is written as `${USER:-$(id -un)}`, unexpanded, so it
resolves when each account's shell sources the file — `blue01` commits as
`blue01` from one machine-wide line. The address uses `.invalid`, which can
never route anywhere; nothing is pushed, and PowerSchool is the record of
completion. The block also pins `init.defaultBranch=main`, which silences the
hint paragraph `git init` would otherwise print in P01 — a printed guide
cannot explain output that varies.

Teaching `git config --global` in P01 was the alternative and is worse: the
eight accounts are shared by class period, so period 1's real name and email
would sit in a `~/.gitconfig` the next seven periods can read.

**Budget about 1m20s per machine** — measured at 1m17s, most of it the model
copy. That is roughly half an hour for 20 Macs, serially. If you want it
faster, clone the payload onto two more drives and do three machines at
once; nothing in the script changes.

A re-run on a machine already done takes seconds: the model, the wheel cache
and the Python are skipped if they are already there at the right size. The
apps re-extract every time, deliberately, so a damaged one heals itself.

## Adding a tool later

Nothing in the script is hardcoded to a particular app. Adding one is a copy
onto the drive and a re-run — no editing.

**A GUI app.** One command, then re-run the installer on each Mac:

```bash
ditto /Applications/Foo.app /Volumes/app_installer/apps/Foo.app
```

Everything in `apps/` gets installed. Use `ditto` rather than `cp -R` so the
bundle's permissions and symlinks come across intact.

**A command-line tool that lives inside an app bundle.** Add a line to
`clitools.txt` and the script symlinks it into `/usr/local/bin`:

```
foo :: Foo.app/Contents/SharedSupport/bin/foo
```

The path is relative to `/Applications`. This is how `ollama` and `cot` get
onto the PATH.

**A standalone single-file binary**, like `uv`. Drop it in `bin/`:

```bash
cp "$(which foo)" /Volumes/app_installer/bin/
```

**Something with per-account data**, the way the Arduino IDE has board
packages. That needs a code change — `arduino15/` is wired up by name, not
by convention, because which accounts get it is a decision and not something
the script can infer.

Then, always:

```bash
cd /Volumes/app_installer && ./install-lab-software.sh --check
```

before you carry the drive anywhere.

## 3. Verify

In each account, launch Ollama once, then in Terminal:

```bash
ollama list
```

Should show `qwen2.5-coder:7b` immediately — no download. Then:

```bash
ollama run qwen2.5-coder:7b "print hello world in python"
```

confirms it actually runs. For the editor:

```bash
cot --help
```

should print CotEditor's usage. Every Unit 02 guide opens files with `cot`,
so if this fails the guides do not work.

Then the one that matters most, because it is the step that happens in class
rather than at setup:

```bash
mkdir -p /tmp/check && cd /tmp/check
touch t.py
uv add --script t.py pygame
uv run t.py
```

This must finish in seconds. **If it downloads anything, the uv seed is
incomplete** and every student in every period will hit the network the
first time they run a project — 160 downloads on the school network, live,
in front of a class. That is the failure #23 was written to prevent, and it
is the one that will not announce itself until September.

Last, that git commits without stopping to ask who the student is:

```bash
cd /tmp/check && git init g && cd g && touch f && git add f && git commit -m t
```

It should commit as this account's name — `blue01`, not yours — and `git
init` should print no hint paragraph. If it asks for a name and email, the
environment block did not reach this account's shell.

**Do all of this from a student account, never from an admin one.** An admin
account has its own PATH, its own `~/.ollama`, and possibly its own `uv`
installed under `~/.local/bin` that shadows the drive's copy in
`/usr/local/bin`. Checking from there tells you about that account and
nothing about a student's. This is the same trap as DECISIONS #45.

### Testing the block without a lab Mac

```bash
tools/test-env-block.sh
```

No sudo, no drive, a second to run. It confirms the git exports are in the
script and single-quoted — double quotes would expand `${USER}` at install
time and give every account on the machine the installer's identity — then
sources the extracted block in a bare environment and checks that a commit
succeeds, the author is the account name, and `git init` makes `main`
silently. The install itself still cannot be tested (it needs root and real
hardware, DECISIONS #46), but the block's content can be.

## Notes

- Model weights are read-only at inference time, so all 8 accounts sharing
  one copy via symlink is safe — no write conflicts.
- If a machine has less free disk than expected, `qwen2.5-coder:7b` is
  roughly 4.7GB on disk (Q4 quantization, Ollama's default pull).
- This whole process avoids the network/content-filter risk of pulling a
  multi-gigabyte model on the school network — see DECISIONS #23. The
  difference from #23's original plan is *how* the bits get onto each
  machine (thumb drive vs. whatever was assumed before); the shared-folder/
  symlink architecture for the 8 accounts is unchanged.
