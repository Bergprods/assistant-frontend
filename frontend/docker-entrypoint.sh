#!/bin/sh
set -e

# If /app/node_modules is empty or missing, install dependencies inside the container
if [ ! -d /app/node_modules ] || [ -z "$(ls -A /app/node_modules 2>/dev/null)" ]; then
  echo "node_modules not present or empty inside container — running npm ci --no-optional"
  cd /app
  # Prefer npm ci for reproducible installs; fall back to npm install if it fails
  npm ci --no-optional --silent || npm install --no-optional --silent
else
  echo "node_modules present — skipping install"
fi

# exec the CMD from the Dockerfile
exec "$@"
