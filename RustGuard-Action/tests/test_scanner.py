import os
import pytest
from scanner import analizar_archivo, detectar_doble_extension

TEST_DIR = os.path.join(os.path.dirname(__file__), "test_files")

@pytest.fixture(autouse=True)
def setup_teardown():
    # Setup
    os.makedirs(TEST_DIR, exist_ok=True)
    yield
    # Teardown
    for f in os.listdir(TEST_DIR):
        os.remove(os.path.join(TEST_DIR, f))
    os.rmdir(TEST_DIR)

def test_detectar_doble_extension_maliciosa():
    resultado = detectar_doble_extension("documento.pdf.exe")
    assert resultado is not None
    assert "Doble extensión sospechosa" in resultado

def test_detectar_doble_extension_segura():
    resultado = detectar_doble_extension("documento.pdf")
    assert resultado is None

def test_analizar_archivo_eicar():
    file_path = os.path.join(TEST_DIR, "eicar.txt")
    with open(file_path, "w") as f:
        f.write("X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*")
    
    resultado = analizar_archivo(file_path)
    assert resultado is not None
    assert resultado["tipo"] == "EICAR"

def test_analizar_archivo_credenciales():
    file_path = os.path.join(TEST_DIR, "aws_secret.py")
    with open(file_path, "w") as f:
        f.write("aws_access_key = 'AKIAIOSFODNN7EXAMPLE'")
    
    resultado = analizar_archivo(file_path)
    assert resultado is not None
    assert resultado["tipo"] == "Credencial Expuesta"

def test_analizar_archivo_limpio():
    file_path = os.path.join(TEST_DIR, "limpio.py")
    with open(file_path, "w") as f:
        f.write("print('Hola mundo')")
    
    resultado = analizar_archivo(file_path)
    assert resultado is None
