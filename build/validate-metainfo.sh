#!/usr/bin/env bash
# Validates the AppStream metainfo with a current appstreamcli (1.x).
# Ubuntu 22.04 (our Linux build runner) ships AppStream 0.15, which doesn't know newer
# tags and URL types (developer, vcs-browser, contribute) and fails on them, so the
# validator runs inside an Ubuntu 24.04 container instead.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

docker run --rm -v "$DIR:/metainfo:ro" ubuntu:24.04 bash -c "\
  apt-get update -qq && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends appstream > /dev/null && \
  appstreamcli --version && \
  appstreamcli validate --no-net /metainfo/com.dygma.bazecor.metainfo.xml"
