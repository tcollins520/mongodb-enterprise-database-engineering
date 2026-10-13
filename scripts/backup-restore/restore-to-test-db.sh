#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR="${1:?Usage: $0 /path/to/backup-parent-directory}"
mongorestore \
  --host 127.0.0.1 \
  --port 27017 \
  --username labAdmin \
  --authenticationDatabase admin \
  --password \
  --nsFrom='mymongodb.*' \
  --nsTo='mymongodb_restore_test.*' \
  "$BACKUP_DIR"
