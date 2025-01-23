# Imagen base con Python
FROM python:3.10-slim

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto
COPY . .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto en el que FastAPI se ejecutará
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
