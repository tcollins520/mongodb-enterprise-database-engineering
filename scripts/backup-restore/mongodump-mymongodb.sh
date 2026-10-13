#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-/home/dba/mongodb-backups/backup-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$(dirname "$OUT")"
mongodump \
  --host 127.0.0.1 \
  --port 27017 \
  --username labAdmin \
  --authenticationDatabase admin \
  --password \
  --db mymongodb \
  --out "$OUT"
echo "Backup written to: $OUT"
