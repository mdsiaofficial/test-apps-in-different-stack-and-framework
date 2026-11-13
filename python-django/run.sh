#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
exec python manage.py runserver "0.0.0.0:${PORT:-8016}"
