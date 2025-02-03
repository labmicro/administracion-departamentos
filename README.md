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

  # Verifica permisos
ls -ld /home/ubuntu/administracion-departamentos/frontend/.next

# Cambia el propietario temporalmente a tu usuario
sudo chown -R ubuntu:ubuntu /home/ubuntu/administracion-departamentos/frontend/.next

# Ajusta permisos
sudo chmod -R 755 /home/ubuntu/administracion-departamentos/frontend/.next

# Si el problema persiste, elimina el directorio
rm -rf /home/ubuntu/administracion-departamentos/frontend/.next

# Reconstruye el proyecto
npm run build

# Cambia el propietario a www-data para Nginx
sudo chown -R www-data:www-data /home/ubuntu/administracion-departamentos/frontend/.next

# Editar arhcivo ngnix
 sudo nano /etc/nginx/sites-available/frontend
# Server en prod
 npm run start
