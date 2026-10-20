#!/usr/bin/env bash
# Switches the site to an image that is already loaded: bash deploy.sh <tag>.
# If the new version does not become healthy, the previous one is started again.
set -euo pipefail
cd "$(dirname "$0")"

tag="${1:?usage: deploy.sh <image tag>}"
previous="$(sed -n 's/^TAG=//p' .env 2>/dev/null || true)"

echo "TAG=$tag" > .env
if ! docker compose up --detach --wait --wait-timeout 120 --remove-orphans; then
  echo "Version $tag did not become healthy." >&2
  if [[ -n "$previous" ]]; then
    echo "TAG=$previous" > .env
    docker compose up --detach --wait --wait-timeout 120 --remove-orphans
    echo "Rolled back to $previous." >&2
  fi
  exit 1
fi

# Applies a changed Caddyfile without dropping connections.
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile
# Deletes images no container uses, older versions of the site included.
docker image prune --all --force
echo "Deployed $tag."