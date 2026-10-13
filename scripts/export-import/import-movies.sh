#!/usr/bin/env bash
# Run from the directory containing movies.json and movies.csv.
set -euo pipefail
mongoimport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb_import_test --collection movies_json_import --file movies.json

mongoimport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb_import_test --collection movies_csv_import \
  --type=csv --headerline --file movies.csv

# Upsert exercise; matching documents are identified by _id.
mongoimport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb_import_test --collection movies_upsert_test \
  --file movies.json --mode=upsert --upsertFields=_id
