#!/bin/bash
# install-lab-software.sh
#
# The one admin-run install for a lab Mac. Everything both units need:
# the .app bundles, the command-line tools, the Ollama model, and the uv
# caches — from a USB drive, with no network. One command per machine.
# See LAB-SETUP.md and DECISIONS #23, #30, #40, #41, #43, #44 (nhsengineering).
#
# Was install-ollama.sh. One script, not several, for the reason #30 gave:
# a step worth doing belongs in the automation, not in a list of things to
# remember to do correctly twenty times.
#
# Nothing here is hardcoded to a particular app. Drop a new tool on the
# drive in the right folder and the next run installs it.
#
# Usage:
#   sudo ./install-lab-software.sh          install everything
#   ./install-lab-software.sh --check       validate the drive, change nothing
#
# Run --check on your own Mac before you carry the drive anywhere. It costs
# a second and it is the difference between finding a bad payload here and
# finding it on the twentieth machine.
#
# ---------------------------------------------------------------------------
# What the drive holds, beside this script:
#
#   apps/*.app      .app bundles, copied as themselves. This is the simple
#                   path and it needs the drive to be **Mac OS Extended
#                   (Journaled)** or APFS.
#   apps/*.zip      the same bundles wrapped with `ditto -c -k --keepParent`,
#                   for a FAT32 or exFAT drive, which cannot store the
#                   symlinks, permissions and extended attributes a bundle is
#                   made of. A bundle copied straight to FAT arrives with a
#                   broken signature and macOS refuses it: "damaged or
#                   incomplete." Either form works; --check tells you if you
#                   have the wrong one for the filesystem you are on.
#   bin/*           plain single-file executables, e.g. uv. Copied to
#                   /usr/local/bin as-is.
#   clitools.txt    tools that live inside an app bundle and need a symlink.
#                   One per line:   name :: path/inside/Applications
#   models/         ONE Ollama model, staged with tools/stage-model.sh. Not a
#                   copy of ~/.ollama/models, which carries every model you
#                   have ever pulled — DECISIONS #43.
#   uv-cache/       optional. Seeds UV_CACHE_DIR so pygame never downloads.
#   uv-python/      optional. Seeds UV_PYTHON_INSTALL_DIR, which UV_CACHE_DIR
#                   does not cover — separate variable, separate folder.
#   arduino15/      optional. Board packages for the Arduino IDE. Seeded
#                   into every account in ACCOUNTS.
#
# The last three may also be `.tar` instead of a folder, which is what a FAT
# drive needs: a uv-managed Python contains symlinks too.
#
# Anything optional that is missing is skipped with a note, not an error.
# ---------------------------------------------------------------------------

set -euo pipefail
shopt -s nullglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SHARED_MODELS="/Users/Shared/ollama-models"
SHARED_UV_CACHE="/Users/Shared/uv-cache"
SHARED_UV_PYTHON="/Users/Shared/uv-python"

# The 8 local per-period accounts on each lab Mac. A hardcoded list, not a
# UID range, so this cannot wander into some other account — DECISIONS #30.
ACCOUNTS=(blue01 blue02 blue03 blue04 red01 red02 red03 red04)

# The machine-wide files that give every account the uv environment.
#
# Both zsh and bash, because which one a lab account uses is not something
# this script gets to know. macOS has defaulted to zsh since Catalina, but an
# account created before that — or created by a script — keeps bash, and one
# on the test Mac did. A student in a bash account would never see these
# variables, uv would quietly use its own cache, and the first thing anyone
# would notice is a download in the middle of class.
#
#   /etc/zshenv   zsh reads it for every shell, login or not.
#   /etc/profile  bash reads it for login shells, which is what Terminal
#                 opens by default on macOS.
#   /etc/bashrc   bash reads it for interactive non-login shells.
#
# Three files per machine still beats eight dotfiles per machine.
ENV_FILES=(/etc/zshenv /etc/profile /etc/bashrc)
MARK_BEGIN="# >>> nhs lab software (managed by install-lab-software.sh) >>>"
MARK_END="# <<< nhs lab software <<<"

CHECK_ONLY=false
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=true

problems=0
note()  { printf '  %s\n' "$*"; }
bad()   { printf '  PROBLEM: %s\n' "$*"; problems=$((problems + 1)); }

# --- Validate the payload --------------------------------------------------
# Done first and in full, so a bad drive is reported completely rather than
# one item at a time across twenty trips to a lab.

echo "Checking the drive at $SCRIPT_DIR"

# What the drive is formatted as decides whether it can carry a bundle or a
# symlink at all. HFS+ and APFS can, so things travel as themselves. FAT32
# and exFAT cannot, so they have to travel wrapped in a zip or a tar — and a
# FAT32 volume additionally caps one file at 4GB, which the model's largest
# blob exceeds.
#
# `|| true` because pipefail is on: diskutil exits non-zero for a path it
# does not recognise as being on a mounted volume, and that must not end the
# run.
drive_fs=$( { diskutil info "$SCRIPT_DIR" 2>/dev/null || true; } \
           | awk -F': *' '/Type \(Bundle\)|File System Personality/ {print $2; exit}' || true)
fat_drive=false
if [[ -n "$drive_fs" ]]; then
  note "drive filesystem: $drive_fs"
  [[ "$drive_fs" =~ (msdos|exfat|ExFAT|FAT) ]] && fat_drive=true
else
  note "drive filesystem: could not determine, assuming it can hold bundles"
fi

apps=("$SCRIPT_DIR"/apps/*.zip "$SCRIPT_DIR"/apps/*.app)
if [[ ${#apps[@]} -eq 0 ]]; then
  bad "nothing in apps/ on the drive. See LAB-SETUP.md."
else
  for item in "${apps[@]}"; do
    if [[ "$item" == *.app ]]; then
      note "app: $(basename "$item") (bundle)"
      if [[ ! -d "$item/Contents" ]]; then
        bad "$(basename "$item") has no Contents/ — not a valid bundle"
      fi
      # A bundle on a FAT volume is already broken. Say so here rather than
      # installing it and letting Gatekeeper deliver the news on a lab Mac.
      if [[ "$fat_drive" == true ]]; then
        bad "$(basename "$item") is a bundle on a $drive_fs drive — already corrupt. Reformat as Mac OS Extended (Journaled), or ship a ditto zip."
      fi
    else
      app=$(basename "$item" .zip)
      note "app: $(basename "$item") (zip)"
      # The zip must contain the bundle folder itself, not its guts. A ditto
      # run without --keepParent produces the second kind, which extracts as
      # loose Contents/ into /Applications and installs nothing. Caught here
      # so it is a five-second fix at your desk, not a mystery on machine
      # twenty.
      if ! zipinfo -1 "$item" 2>/dev/null | grep -q "^${app}/"; then
        bad "$(basename "$item") has no top-level $app/ — remake it with ditto --keepParent"
      fi
    fi
  done
fi


bins=("$SCRIPT_DIR"/bin/*)
for b in "${bins[@]}"; do
  [[ -f "$b" ]] && note "bin: $(basename "$b")"
done
[[ ${#bins[@]} -eq 0 ]] && note "bin: none on the drive (uv goes here)"

if [[ -f "$SCRIPT_DIR/clitools.txt" ]]; then
  while IFS= read -r line; do
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    [[ "$line" == *"::"* ]] || bad "clitools.txt line has no '::': $line"
  done < "$SCRIPT_DIR/clitools.txt"
else
  note "clitools.txt: absent, no in-bundle tools will be linked"
fi

if [[ -d "$SCRIPT_DIR/models" ]]; then
  note "models: $(du -sh "$SCRIPT_DIR/models" 2>/dev/null | cut -f1)"
else
  bad "models/ not found — Ollama will have nothing to run."
fi

for opt in uv-cache uv-python arduino15; do
  if [[ -f "$SCRIPT_DIR/$opt.tar" ]]; then
    note "$opt: $(du -sh "$SCRIPT_DIR/$opt.tar" 2>/dev/null | cut -f1) (tar)"
  elif [[ -d "$SCRIPT_DIR/$opt" ]]; then
    note "$opt: $(du -sh "$SCRIPT_DIR/$opt" 2>/dev/null | cut -f1) (folder)"
    # A folder is right on HFS+ or APFS. On a FAT volume it silently loses the
    # symlinks a Python install is built from, and nothing complains until a
    # student runs uv in September.
    if [[ "$fat_drive" == true && "$opt" == "uv-python" ]]; then
      bad "uv-python/ is a folder on a $drive_fs drive — its symlinks are gone. Reformat, or ship uv-python.tar."
    fi
  else
    note "$opt: absent (optional, skipped)"
    # uv-python is nominally optional, but without it the lab Macs fall back
    # to Apple's /usr/bin/python3 (3.9) — a different version from the one
    # that built the cached pygame wheel — and go to PyPI for a matching one.
    # That is the download this drive exists to prevent, so it is a problem,
    # not a note.
    [[ "$opt" == "uv-python" ]] && \
      bad "uv-python is missing. Lab Macs will download a Python and a wheel on first run. See LAB-SETUP.md step 1."
  fi
done


if [[ $problems -ne 0 ]]; then
  echo ""
  echo "$problems problem(s). Fix the drive before installing."
  exit 1
fi

if [[ "$CHECK_ONLY" == true ]]; then
  echo ""
  echo "Drive looks complete. Run with sudo on a lab Mac to install."
  exit 0
fi

if [[ $EUID -ne 0 ]]; then
  echo ""
  echo "Run this with sudo: sudo $0"
  exit 1
fi

# --- 1. The .app bundles --------------------------------------------------

echo ""
echo "Installing applications..."
for item in "${apps[@]}"; do
  if [[ "$item" == *.app ]]; then
    app=$(basename "$item")
    echo "  $app"
    rm -rf "/Applications/$app"
    # ditto, not cp -R: it carries the permissions, symlinks and extended
    # attributes that make a bundle valid.
    ditto "$item" "/Applications/$app"
  else
    app=$(basename "$item" .zip)        # e.g. Ollama.app
    echo "  $app"
    rm -rf "/Applications/$app"
    # ditto, not unzip: same reason. unzip drops all three and you are back
    # to "damaged or incomplete."
    ditto -x -k "$item" /Applications
  fi
  if [[ ! -d "/Applications/$app" ]]; then
    echo "    ERROR: $app did not land in /Applications." >&2
    echo "    A zip made without --keepParent does this. See LAB-SETUP.md." >&2
    exit 1
  fi
  # The app was downloaded on the machine that built the drive and has never
  # touched this machine's network, so Gatekeeper has no reason to trust it
  # yet. Strip the flag rather than asking a teacher to click through it 20
  # times.
  xattr -dr com.apple.quarantine "/Applications/$app" 2>/dev/null || true
  # A structural check, not a signature one. `codesign --verify` was tried
  # here and warned on both Ollama.app and CotEditor.app even though each
  # launched perfectly — it is strict about things Gatekeeper does not block,
  # and a warning that fires on healthy apps just teaches you to ignore
  # warnings. What it was meant to catch — a bundle mangled in transit —
  # cannot happen now anyway: the drive has to be HFS+ or APFS, and --check
  # refuses a bare bundle on a FAT volume.
  #
  # So all that is worth confirming is that something executable arrived.
  if ! compgen -G "/Applications/$app/Contents/MacOS/*" > /dev/null; then
    echo "    ERROR: $app has nothing in Contents/MacOS — the copy is incomplete." >&2
    exit 1
  fi
done

# --- 2. Single-file command-line tools ------------------------------------

mkdir -p /usr/local/bin
if [[ ${#bins[@]} -gt 0 ]]; then
  echo ""
  echo "Installing command-line tools..."
  for b in "${bins[@]}"; do
    [[ -f "$b" ]] || continue
    name=$(basename "$b")
    echo "  $name"
    install -m 755 "$b" "/usr/local/bin/$name"
  done
fi

# --- 3. Tools that live inside an app bundle ------------------------------

if [[ -f "$SCRIPT_DIR/clitools.txt" ]]; then
  echo ""
  echo "Linking in-bundle tools..."
  while IFS= read -r line; do
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    name="${line%%::*}"; name="$(echo "$name" | xargs)"
    rel="${line#*::}";  rel="$(echo "$rel" | xargs)"
    target="/Applications/$rel"
    if [[ -e "$target" ]]; then
      echo "  $name"
      ln -sf "$target" "/usr/local/bin/$name"
    else
      echo "  skipping $name — $target not found on this machine"
    fi
  done < "$SCRIPT_DIR/clitools.txt"
fi

# --- 4. Shared data: the model and the uv caches --------------------------
# One copy per machine, not one per account. Model weights are read-only at
# inference time and a wheel cache is read-mostly, so sharing is safe and
# saves multiplying gigabytes by eight — DECISIONS #23.

copy_shared() {
  local src="$1" dest="$2" label="$3" mirror="${4:-add}"
  if [[ -f "$src.tar" ]]; then
    # Preferred. A uv-managed Python contains symlinks (bin/python3 ->
    # python3.13) and exFAT cannot store them, so a plain folder copy on the
    # drive arrives broken in the same way an .app does. A tar carries them
    # through.
    echo "  $label -> $dest (from $(basename "$src").tar)"
    mkdir -p "$dest"
    tar -xf "$src.tar" -C "$dest"
  elif [[ -d "$src" ]]; then
    # Skip anything already there at the same size rather than recopying it.
    # This is what makes a re-run cheap: the model is 4.4GB, a full recopy is
    # about 70 seconds, and re-running is normal — after adding a tool to the
    # drive, or after a fix. rsync ships with macOS; fall back to cp where it
    # does not.
    echo "  $label -> $dest (from folder)"
    mkdir -p "$dest"
    if command -v rsync >/dev/null 2>&1; then
      # --delete for the model, because the drive is the source of truth for
      # which models exist. Without it, a manifest left by an earlier install
      # stays and `ollama list` keeps advertising a model whose blobs are
      # gone — observed on the test Mac, which still listed gemma after the
      # drive was restaged with only qwen2.5-coder:7b.
      #
      # NOT for the uv caches: extra wheels there are harmless, and deleting
      # whatever a student's uv cached locally would be gratuitous.
      if [[ "$mirror" == "mirror" ]]; then
        rsync -a --size-only --delete "$src/" "$dest/"
      else
        rsync -a --size-only "$src/" "$dest/"
      fi
    else
      [[ "$mirror" == "mirror" ]] && rm -rf "$dest"
      mkdir -p "$dest"
      cp -R "$src/." "$dest/"
    fi
  else
    echo "  $label: nothing on the drive, skipping"
    return
  fi
  chmod -R a+rX "$dest"
}

echo ""
echo "Copying shared data..."
copy_shared "$SCRIPT_DIR/models"    "$SHARED_MODELS"    "ollama model" mirror
copy_shared "$SCRIPT_DIR/uv-cache"  "$SHARED_UV_CACHE"  "uv wheel cache"
copy_shared "$SCRIPT_DIR/uv-python" "$SHARED_UV_PYTHON" "uv python"

# uv writes to its cache as well as reading it, so unlike the model this one
# cannot be read-only to the accounts using it.
[[ -d "$SHARED_UV_CACHE" ]] && chmod -R a+rwX "$SHARED_UV_CACHE"

# --- 5. Point every account at the shared data ----------------------------

echo ""
echo "Wiring up accounts..."
for user in "${ACCOUNTS[@]}"; do
  home=$(dscl . -read "/Users/$user" NFSHomeDirectory 2>/dev/null | awk '{print $2}')

  if [[ -z "$home" || ! -d "$home" ]]; then
    echo "  skipping $user — account not found on this machine"
    continue
  fi

  echo "  $user ($home)"

  mkdir -p "$home/.ollama"
  # A fresh Ollama launch sometimes creates a real (empty) models folder.
  # Remove it, or any stale symlink, before relinking.
  if [[ -L "$home/.ollama/models" ]]; then
    rm -f "$home/.ollama/models"
  elif [[ -d "$home/.ollama/models" ]]; then
    rm -rf "$home/.ollama/models"
  fi
  ln -s "$SHARED_MODELS" "$home/.ollama/models"
  chown -R "$user":staff "$home/.ollama"
done

# Arduino board packages, seeded into every account. Copied rather than
# symlinked: the IDE writes into this folder, and a shared copy that eight
# accounts could write to is a support call waiting to happen. A copy per
# account costs little and removes the question of which period needs it.
if [[ -f "$SCRIPT_DIR/arduino15.tar" ]] || [[ -d "$SCRIPT_DIR/arduino15" ]]; then
  echo ""
  echo "Seeding Arduino board packages..."
  for user in "${ACCOUNTS[@]}"; do
    home=$(dscl . -read "/Users/$user" NFSHomeDirectory 2>/dev/null | awk '{print $2}')
    if [[ -z "$home" || ! -d "$home" ]]; then
      echo "  skipping $user — account not found on this machine"
      continue
    fi
    echo "  $user"
    mkdir -p "$home/Library/Arduino15"
    if [[ -f "$SCRIPT_DIR/arduino15.tar" ]]; then
      tar -xf "$SCRIPT_DIR/arduino15.tar" -C "$home/Library/Arduino15"
    else
      cp -R "$SCRIPT_DIR/arduino15/." "$home/Library/Arduino15/"
    fi
    chown -R "$user":staff "$home/Library/Arduino15"
  done
fi


# --- 6. The machine-wide environment --------------------------------------
# Two things go in here: the uv cache locations, and a git identity.
#
# uv: without these, `uv add --script game.py pygame` reaches out to PyPI in
# the middle of class, once per account per machine. With them, the wheels
# and the interpreter are already on disk. UV_PYTHON_INSTALL_DIR is separate
# because UV_CACHE_DIR does not cover Python installs.
#
# git: without an identity, the first `git commit` of Project 04 stops with
# "Please tell me who you are" and a class period goes on configuring git
# instead of building a game. The alternative — teaching
# `git config --global user.name` in P01 — writes one period's real name and
# email into a ~/.gitconfig that the next seven periods can read, since the
# eight accounts are shared by class period and not by student.
#
# ${USER:-$(id -un)} expands when the shell sources the file, so one
# machine-wide line gives each account its own identity: blue01 commits as
# blue01. The fallback covers a shell that starts without USER set.
#
# The address uses .invalid, a suffix reserved by RFC 2606 that can never
# route anywhere. Nothing here is pushed — the repo lives on the machine and
# PowerSchool is the record of completion — so a real address would only
# invite mail to somewhere nobody reads.
#
# GIT_CONFIG_COUNT/KEY_0/VALUE_0 sets init.defaultBranch, which silences the
# hint paragraph `git init` otherwise prints in P01. A printed guide cannot
# explain output that varies, so it is pinned rather than described.
#
# These are exported as environment variables rather than written with
# `git config --system` on purpose: Apple's git keeps its system config
# inside the Command Line Tools bundle, where a CLT update can erase it.
# The /etc block is already proven on this hardware.
#
# Written between markers so re-running replaces the block instead of
# stacking up copies of it.

echo ""
echo "Setting the machine-wide environment..."
for envfile in "${ENV_FILES[@]}"; do
  touch "$envfile"
  if grep -qF "$MARK_BEGIN" "$envfile"; then
    # Delete the old block, inclusive of both markers.
    sed -i '' "/^${MARK_BEGIN}$/,/^${MARK_END}$/d" "$envfile"
  fi
  {
    echo "$MARK_BEGIN"
    echo "export UV_CACHE_DIR=\"$SHARED_UV_CACHE\""
    echo "export UV_PYTHON_INSTALL_DIR=\"$SHARED_UV_PYTHON\""
    # UV_PYTHON_PREFERENCE is deliberately NOT set. uv's default (`managed`)
    # already prefers the interpreter we ship in UV_PYTHON_INSTALL_DIR, and
    # falls back to Apple's /usr/bin/python3 if that copy is ever missing or
    # broken. Forcing `only-managed` would remove that fallback and turn one
    # bad drive into a dead class period, in exchange for nothing — the
    # shipped interpreter already wins when it is present.
    echo 'export GIT_AUTHOR_NAME="${USER:-$(id -un)}"'
    echo 'export GIT_AUTHOR_EMAIL="${USER:-$(id -un)}@nhs.invalid"'
    echo 'export GIT_COMMITTER_NAME="${USER:-$(id -un)}"'
    echo 'export GIT_COMMITTER_EMAIL="${USER:-$(id -un)}@nhs.invalid"'
    echo 'export GIT_CONFIG_COUNT=1'
    echo 'export GIT_CONFIG_KEY_0=init.defaultBranch'
    echo 'export GIT_CONFIG_VALUE_0=main'
    echo "$MARK_END"
  } >> "$envfile"
  echo "  $envfile"
done

# Which shell each account will actually get, so a surprise is visible here
# rather than in September. Nothing to fix if one says bash — that is why the
# block above goes in three files — but it is worth seeing.
echo ""
echo "Account shells:"
for user in "${ACCOUNTS[@]}"; do
  sh=$(dscl . -read "/Users/$user" UserShell 2>/dev/null | awk '{print $2}')
  [[ -n "$sh" ]] && echo "  $user: $sh"
done

# --- Done -----------------------------------------------------------------

echo ""
echo "Install complete. Verify in one account by logging in and running:"
echo "  ollama list        lists qwen2.5-coder:7b, with no download"
echo "  cot --help         prints CotEditor's usage"
echo "  uv --version       prints a version number"
echo ""
echo "Then, in a scratch folder, confirm nothing reaches the network:"
echo "  touch t.py && uv add --script t.py pygame && uv run t.py"
echo "It should finish in seconds. If it downloads, the uv seed is incomplete."
echo ""
echo "And confirm git commits without asking who the student is:"
echo "  git init g && cd g && touch f && git add f && git commit -m t"
echo "It should commit as this account's name. If it asks for a name and"
echo "email, the environment block did not reach this account's shell."
echo ""
echo "Check from a student account, not from an admin one: an admin account"
echo "has its own PATH, its own ~/.ollama, and possibly its own uv."
