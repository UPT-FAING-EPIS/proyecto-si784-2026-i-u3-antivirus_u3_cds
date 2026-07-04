import os
import re
from typing import Optional

# ─────────────────────────────────────────────────────────────────────
# Firma EICAR estándar (el estándar internacional para probar antivirus)
# ─────────────────────────────────────────────────────────────────────
EICAR_SIGNATURE = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"

# ─────────────────────────────────────────────────────────────────────
# Firma personalizada de RustGuard para pruebas propias
# ─────────────────────────────────────────────────────────────────────
RUSTGUARD_SIGNATURE = "RUSTGUARD-TEST-SIGNATURE-12345"

# ─────────────────────────────────────────────────────────────────────
# Extensiones de ejecutables peligrosos que no deberían estar en repos
# ─────────────────────────────────────────────────────────────────────
EXTENSIONES_PELIGROSAS = [
    '.exe', '.scr', '.pif', '.com', '.bat', '.cmd', '.vbs', '.vbe',
    '.js.exe', '.ws', '.wsf', '.msi', '.dll', '.cpl', '.hta',
]

# ─────────────────────────────────────────────────────────────────────
# Patrones regex para detección heurística de código malicioso
# ─────────────────────────────────────────────────────────────────────
PATRONES_MALICIOSOS = [
    # Ofuscación en Python
    (r'eval\s*\(\s*base64\.b64decode\s*\(', "Ofuscación Python: eval(base64.b64decode(...))"),
    (r'exec\s*\(\s*base64\.b64decode\s*\(', "Ofuscación Python: exec(base64.b64decode(...))"),
    (r'eval\s*\(\s*compile\s*\(', "Ofuscación Python: eval(compile(...))"),

    # WebShells PHP
    (r'<\?php\s+.*system\s*\(\s*\$_(GET|POST|REQUEST)\s*\[', "WebShell PHP: system($_GET/POST[...])"),
    (r'<\?php\s+.*exec\s*\(\s*\$_(GET|POST|REQUEST)\s*\[', "WebShell PHP: exec($_GET/POST[...])"),
    (r'<\?php\s+.*passthru\s*\(\s*\$_(GET|POST|REQUEST)\s*\[', "WebShell PHP: passthru($_GET/POST[...])"),
    (r'<\?php\s+.*shell_exec\s*\(\s*\$_(GET|POST|REQUEST)\s*\[', "WebShell PHP: shell_exec($_GET/POST[...])"),
    (r'<\?php\s+.*eval\s*\(\s*\$_(GET|POST|REQUEST)\s*\[', "WebShell PHP: eval($_GET/POST[...])"),

    # Ofuscación PHP con base64
    (r'eval\s*\(\s*base64_decode\s*\(', "Ofuscación PHP: eval(base64_decode(...))"),
    (r'exec\s*\(\s*base64_decode\s*\(', "Ofuscación PHP: exec(base64_decode(...))"),
    (r'system\s*\(\s*base64_decode\s*\(', "Ofuscación PHP: system(base64_decode(...))"),

    # Ofuscación JavaScript
    (r'eval\s*\(\s*atob\s*\(', "Ofuscación JS: eval(atob(...))"),
    (r'eval\s*\(\s*unescape\s*\(', "Ofuscación JS: eval(unescape(...))"),

    # PowerShell malicioso
    (r'powershell\s+.*-enc(odedcommand)?\s+[A-Za-z0-9+/=]{20,}', "PowerShell con comando codificado"),
    (r'Invoke-Expression\s*\(\s*\(New-Object', "PowerShell: Invoke-Expression con descarga remota"),

    # Conexiones reversas (reverse shells)
    (r'/bin/(ba)?sh\s+-i\s+>&\s*/dev/tcp/', "Reverse Shell: bash /dev/tcp"),
    (r'nc\s+-[a-z]*e\s+/bin/(ba)?sh', "Reverse Shell: netcat"),

    # ─── Ejecución de Payloads Remotos (descarga + ejecución) ────
    (r'curl\s+.*\|\s*(ba)?sh', "Ejecución remota: curl pipe a shell"),
    (r'wget\s+.*\|\s*(ba)?sh', "Ejecución remota: wget pipe a shell"),
    (r'curl\s+.*\|\s*python', "Ejecución remota: curl pipe a python"),
    (r'wget\s+.*-O-\s*\|\s*(ba)?sh', "Ejecución remota: wget -O- pipe a shell"),
    (r'wget\s+.*&&\s*chmod\s+\+x', "Ejecución remota: wget + chmod +x"),
    (r'curl\s+.*-o\s+\S+\s*&&\s*chmod\s+\+x', "Ejecución remota: curl -o + chmod +x"),
    (r'Invoke-WebRequest\s+.*\|\s*Invoke-Expression', "PowerShell: descarga y ejecución remota (IWR|IEX)"),
    (r'iwr\s+.*\|\s*iex', "PowerShell: iwr pipe a iex"),
]

# ─────────────────────────────────────────────────────────────────────
# Patrones de fuga de credenciales (Secret Scanning)
# ─────────────────────────────────────────────────────────────────────
PATRONES_CREDENCIALES = [
    # Llaves privadas
    (r'-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----', "Llave privada expuesta en el código"),

    # Tokens de servicios cloud
    (r'AKIA[0-9A-Z]{16}', "AWS Access Key ID expuesto"),

    # Contraseñas hardcodeadas
    (r'(?i)(password|passwd|pwd)\s*[=:]\s*["\'][^"\']{4,}["\']', "Contraseña hardcodeada en el código"),

    # API Keys genéricas
    (r'(?i)(api_key|apikey|api_secret)\s*[=:]\s*["\'][^"\']{8,}["\']', "API Key expuesta en el código"),

    # Secret Keys
    (r'(?i)(secret_key|secret)\s*[=:]\s*["\'][^"\']{8,}["\']', "Secret Key expuesta en el código"),

    # Tokens de acceso genéricos
    (r'(?i)token\s*[=:]\s*["\'][A-Za-z0-9_\-\.]{20,}["\']', "Token de acceso expuesto en el código"),

    # Tokens específicos de plataformas
    (r'ghp_[A-Za-z0-9]{36}', "GitHub Personal Access Token expuesto"),
    (r'sk-[A-Za-z0-9]{32,}', "API Key de OpenAI expuesta"),
]

# ─────────────────────────────────────────────────────────────────────
# Detección de doble extensión sospechosa (ej: factura.pdf.exe)
# ─────────────────────────────────────────────────────────────────────
EXTENSIONES_EJECUTABLES = {'.exe', '.scr', '.pif', '.com', '.bat', '.cmd', '.vbs', '.hta', '.msi'}
EXTENSIONES_DOCUMENTO = {'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.png', '.txt', '.csv'}


def detectar_doble_extension(nombre_archivo: str) -> Optional[str]:
    """
    Detecta si un archivo tiene doble extensión sospechosa.
    Ejemplo: 'factura.pdf.exe' -> la extensión real es .exe pero se disfraza de .pdf
    Retorna la descripción de la amenaza o None si está limpio.
    """
    nombre = nombre_archivo.lower()
    # Obtener todas las extensiones del archivo
    parts = nombre.split('.')
    if len(parts) >= 3:
        ext_real = '.' + parts[-1]       # La extensión real (última)
        ext_falsa = '.' + parts[-2]      # La extensión que finge ser
        if ext_real in EXTENSIONES_EJECUTABLES and ext_falsa in EXTENSIONES_DOCUMENTO:
            return f"Doble extensión sospechosa: se disfraza de '{ext_falsa}' pero es '{ext_real}'"
    return None


def analizar_archivo(ruta_absoluta: str) -> Optional[dict]:
    """
    Analiza un archivo en busca de firmas maliciosas.
    Devuelve un dict con detalles de la amenaza si detecta malware, o None si está limpio.

    Retorno ejemplo: {"tipo": "EICAR", "detalle": "Firma EICAR estándar detectada"}
    """
    nombre_archivo = os.path.basename(ruta_absoluta)

    # ── CHECK 1: Doble extensión sospechosa ──────────────────────────
    amenaza_doble_ext = detectar_doble_extension(nombre_archivo)
    if amenaza_doble_ext:
        return {"tipo": "Doble Extensión", "detalle": amenaza_doble_ext}

    # ── CHECK 2: Extensiones de ejecutables peligrosos ───────────────
    for ext in EXTENSIONES_PELIGROSAS:
        if nombre_archivo.lower().endswith(ext):
            return {"tipo": "Ejecutable Peligroso", "detalle": f"Extensión bloqueada: '{ext}'"}

    # ── CHECK 3: Análisis de contenido (firmas + heurística) ─────────
    try:
        with open(ruta_absoluta, 'r', encoding='utf-8', errors='ignore') as archivo:
            contenido = archivo.read()

            # Check 3a: Firma EICAR
            if EICAR_SIGNATURE in contenido:
                return {"tipo": "EICAR", "detalle": "Firma EICAR estándar detectada (test antivirus)"}

            # Check 3b: Firma personalizada RustGuard
            if RUSTGUARD_SIGNATURE in contenido:
                return {"tipo": "RustGuard Signature", "detalle": "Firma de prueba RustGuard detectada"}

            # Check 3c: Patrones heurísticos (regex)
            for patron, descripcion in PATRONES_MALICIOSOS:
                if re.search(patron, contenido, re.IGNORECASE | re.DOTALL):
                    return {"tipo": "Heurístico", "detalle": descripcion}

            # Check 3d: Fuga de credenciales (Secret Scanning)
            for patron, descripcion in PATRONES_CREDENCIALES:
                if re.search(patron, contenido):
                    return {"tipo": "Credencial Expuesta", "detalle": descripcion}

    except Exception as e:
        print(f"  [!] Advertencia: No se pudo leer '{nombre_archivo}': {e}")

    # Si pasa todas las pruebas, el archivo está limpio
    return None
