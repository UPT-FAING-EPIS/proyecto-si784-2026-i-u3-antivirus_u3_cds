# Este es un script Python completamente seguro
def saludar(nombre):
    """Función que saluda al usuario."""
    return f"Hola, {nombre}! Bienvenido al proyecto."

def sumar(a, b):
    """Suma dos números."""
    return a + b

if __name__ == "__main__":
    print(saludar("Mundo"))
    print(f"2 + 3 = {sumar(2, 3)}")
