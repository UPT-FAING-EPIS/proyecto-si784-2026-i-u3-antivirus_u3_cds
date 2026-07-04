# =========================================================
# ARCHIVO DE PRUEBA - Fuga de Credenciales (Secret Scanning)
# Este archivo contiene credenciales falsas a propósito
# para validar que el escáner las detecta correctamente.
# =========================================================

# Patrón 1: Contraseña hardcodeada
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "password": "SuperSecretP@ssw0rd123!"
}

# Patrón 2: AWS Access Key (falsa, solo para pruebas)
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"

# Patrón 3: Llave privada RSA (fragmento de prueba)
PRIVATE_KEY = """
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy... (contenido de prueba)
-----END RSA PRIVATE KEY-----
"""
