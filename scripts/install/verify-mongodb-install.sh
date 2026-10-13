#!/usr/bin/env bash
set -euo pipefail
echo "== OS =="
cat /etc/os-release
uname -m
echo "== MongoDB packages =="
mongod --version
mongosh --version
rpm -qa | grep -i mongo || true
echo "== Service =="
systemctl is-enabled mongod || true
systemctl is-active mongod || true
sudo ss -lntp | grep 27017 || true
