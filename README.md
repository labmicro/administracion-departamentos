# administracion-departamentos
 Administracion departamentos FACET

cd backend/facet
 .\venv\Scripts\activate
py manage.py runserver  


 chmod 400 "administracion-departamentos.pem"

  ssh -i "administracion-departamentos.pem" ubuntu@ec2-18-215-115-94.compute-1.amazonaws.com

  source venv/bin/activate

## En consola wsl

chmod 400 "administracion-departamentos.pem"
 ssh -i "administracion-departamentos.pem" ubuntu@ec2-18-215-115-94.compute-1.amazonaws.com

 ## Descargar los cambios
  git  pull origin main

  cd administracion-departamentos/backend/facet
  cd administracion-departamentos/frontend

  gunicorn --bind 0.0.0.0:8000 administracion.wsgi:application