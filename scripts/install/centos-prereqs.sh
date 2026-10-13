#!/usr/bin/env bash
# Run inside a CentOS Stream 9 VM. This does not configure a MongoDB repo.
set -euo pipefail
sudo dnf makecache
sudo dnf install -y curl
sudo dnf update -y
echo "Prerequisites updated. Configure the approved MongoDB Enterprise repository separately."
