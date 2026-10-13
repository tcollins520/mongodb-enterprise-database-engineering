#!/usr/bin/env bash
set -euo pipefail
systemctl is-active mongod
systemctl is-enabled mongod
sudo ss -lntp | grep 27017 || true
free -h
uptime
vmstat 1 5
df -h / /var/lib/mongo
sudo journalctl -u mongod --since "24 hours ago" --no-pager -p warning
sudo tail -n 60 /var/log/mongodb/mongod.log
