#!/usr/bin/env bash
# Watch-build the plugin straight into an Obsidian vault for live testing,
# without cutting a BRAT release. Requires the "Hot Reload" plugin (pjeby/
# hot-reload) enabled in the vault so the reload is automatic; otherwise
# reload manually with Cmd/Ctrl-R after each rebuild.
#
# Usage:
#   scripts/dev-vault.sh                      # uses the default path below
#   scripts/dev-vault.sh "/path/to/vault/.obsidian/plugins/recipe-box"
#   OBSIDIAN_PLUGIN_DIR="/path/..." scripts/dev-vault.sh
#
# When you're done: in BRAT run "check for updates" (or re-add the beta
# plugin) to restore the released build in the vault.
set -euo pipefail

DEFAULT_DIR="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/samsy_kitchen/.obsidian/plugins/recipe-box"
DIR="${1:-${OBSIDIAN_PLUGIN_DIR:-$DEFAULT_DIR}}"

if [ ! -d "$DIR" ]; then
  echo "Plugin dir not found: $DIR" >&2
  echo "Pass the path as an argument or set OBSIDIAN_PLUGIN_DIR." >&2
  exit 1
fi

echo "Mirroring dev build -> $DIR"
echo "(styles.css/manifest.json are copied as-is from the repo; edit those in the repo)"
OBSIDIAN_PLUGIN_DIR="$DIR" exec node esbuild.config.mjs
