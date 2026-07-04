import os
import sys
from scanner import analizar_archivo

def main():
    # ──────────────────────────────────────────────────────────────
    # GITHUB_WORKSPACE apunta al repositorio del USUARIO que usa
    # esta Action (no al repositorio de la Action misma).
    # Los archivos de la Action (scanner.py, main.py, etc.) viven
    # dentro del contenedor Docker en /app/, NO en GITHUB_WORKSPACE.
    # ──────────────────────────────────────────────────────────────
    workspace = os.environ.get('GITHUB_WORKSPACE', os.getcwd())

    # Si se pasa un argumento (scan-path), usarlo como subdirectorio
    if len(sys.argv) > 1 and sys.argv[1] != '.':
        scan_path = os.path.join(workspace, sys.argv[1])
    else:
        scan_path = workspace

    if not os.path.isdir(scan_path):
        print(f"[!] ERROR: El directorio '{scan_path}' no existe.")
        sys.exit(1)

    print("==================================================")
    print("[!] DevSecOps Antivirus Scanner Iniciado")
    print("==================================================")
    print(f"[+] Workspace:          {workspace}")
    print(f"[+] Directorio escaneo: {scan_path}")
    print("")

    # Recorrer el directorio y analizar cada archivo
    archivos_infectados = []
    archivos_limpios = 0
    total_archivos = 0

    for root, dirs, files in os.walk(scan_path):
        # Excluir solo directorios de control de versiones y cache
        dirs[:] = [d for d in dirs if d not in ('.git', '__pycache__', 'node_modules', '.venv', 'venv')]

        for file in files:
            filepath = os.path.join(root, file)

            total_archivos += 1
            resultado = analizar_archivo(filepath)

            rel_path = os.path.relpath(filepath, scan_path)

            if resultado:
                archivos_infectados.append((rel_path, resultado))
                print(f"  [X] AMENAZA: {rel_path}")
                print(f"      Tipo:    {resultado['tipo']}")
                print(f"      Detalle: {resultado['detalle']}")
            else:
                archivos_limpios += 1
                print(f"  [+] LIMPIO:  {rel_path}")

    print(f"\n--------------------------------------------------")
    print(f"[i] Archivos escaneados: {total_archivos}")
    print(f"[i] Archivos limpios:    {archivos_limpios}")
    print(f"[i] Archivos infectados: {len(archivos_infectados)}")

    if archivos_infectados:
        print("\n[!] AMENAZA DETECTADA")
        print("--------------------------------------------------")
        for rel_path, resultado in archivos_infectados:
            print(f"[X] {rel_path} -> {resultado['tipo']}: {resultado['detalle']}")

        print("\n==================================================")
        print(f"[X] RESULTADO: FALLO. {len(archivos_infectados)} archivo(s) infectado(s) encontrado(s).")
        print("==================================================")
        sys.exit(1)
    else:
        print("\n==================================================")
        print("[+] RESULTADO: LIMPIO. No se detectaron amenazas.")
        print("==================================================")
        sys.exit(0)

if __name__ == "__main__":
    main()
