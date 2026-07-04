FROM python:3.10-slim

# Metadatos
LABEL maintainer="DevSecOps Antivirus Action"
LABEL version="1.0"

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del escaner
COPY main.py .
COPY scanner.py .

# Ejecutar el controlador
ENTRYPOINT ["python", "/app/main.py"]
