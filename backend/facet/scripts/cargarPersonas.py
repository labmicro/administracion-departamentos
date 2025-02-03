import pandas as pd
import psycopg2
from datetime import datetime

# Configuración de la conexión a la base de datos
DB_CONFIG = {
    'dbname': 'administracion-departamentos',  # Cambia al nombre de tu base de datos
    'user': 'admin',             # Cambia al usuario de tu base de datos
    'password': '1234',      # Cambia la contraseña
    'host': 'localhost',           # Cambia si la base de datos no está en localhost
    'port': '5432',                # Cambia al puerto que uses (por defecto es 5432 para PostgreSQL)
}

# Ruta al archivo Excel
file_path = "/home/ubuntu/administracion-departamentos/backend/facet/scripts/Planta Docente.xlsx"

# Leer el archivo Excel
data = pd.read_excel(file_path)

# Función para extraer el DNI del CUIL
def extraer_dni(cuil):
    return cuil[2:10]  # Extrae los caracteres del índice 2 al 9


try:
    # Conectar a la base de datos
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # Iterar sobre las filas del DataFrame
    for index, row in data.iterrows():
        legajo = str(row['nrolegajo'])
        cuil = str(row['cuil'])
        apellido = row['apellido']
        nombre = row['nombre']
        dni = extraer_dni(cuil)
        estado = 1  # Usar 1 para representar True
        fecha_creacion = datetime.now()
        fecha_modificacion = datetime.now()

        # Verificar si el registro ya existe
        cursor.execute("SELECT COUNT(*) FROM departamentos_persona WHERE legajo = %s", (legajo,))
        existe = cursor.fetchone()[0]

        if not existe:
            # Insertar el registro si no existe
            cursor.execute("""
                INSERT INTO departamentos_persona 
                (legajo, dni, apellido, nombre, estado, fecha_creacion, fecha_modificacion)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (legajo, dni, apellido, nombre, estado, fecha_creacion, fecha_modificacion))
            print(f"Registro creado para legajo: {legajo}")
        else:
            print(f"Registro omitido (ya existe) para legajo: {legajo}")

    # Confirmar los cambios
    conn.commit()
    print("Todos los datos han sido procesados correctamente.")

except Exception as e:
    print(f"Error al procesar los datos: {e}")

finally:
    # Cerrar la conexión
    if conn:
        cursor.close()
        conn.close()