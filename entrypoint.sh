#!/bin/sh

# until cd /home/app
# do
#     echo "Waiting for server volume..."
# done

until python manage.py collectstatic --noinput
do
    echo "Collecting static files..."
    sleep 2
done

until python manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

gunicorn --bind :8000 --workers 2 --log-level 'info' facet.administracion.wsgi
