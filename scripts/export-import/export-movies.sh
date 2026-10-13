#!/usr/bin/env bash
# Run from the desired output directory. Password is prompted interactively.
set -euo pipefail
mongoexport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb --collection movies --out movies.json

mongoexport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb --collection movies --type=csv \
  --fields=title,year,genre,rating --out movies.csv

mongoexport --host 127.0.0.1 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password \
  --db mymongodb --collection movies \
  --query '{"genre":"Sci-Fi"}' --out scifi_movies.json
