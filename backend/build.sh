#!/usr/bin/env bash
set -e
pip install -r requirements.txt
cd asnn_project
python manage.py migrate --no-input
python manage.py collectstatic --no-input
python manage.py seed_data
