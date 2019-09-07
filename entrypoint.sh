#!/bin/bash

set -xe

./manage.py migrate --noinput
./manage.py populate_countries
./manage.py collectstatic --noinput

# Execute subcommand, wrapping
exec "$@"