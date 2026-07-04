import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════
// RustGuard Antivirus Scanner - Extensión de VS Code
// Motor de detección autónomo: no depende de instalaciones externas.
// Usa análisis de firmas (hash), patrones de contenido y heurística.
// ═══════════════════════════════════════════════════════════════════

// ── Firmas de virus conocidas (hashes SHA-256) ──
// Estos son hashes de archivos de prueba EICAR y malware conocido.
// EICAR es el archivo estándar de la industria para probar antivirus.
export const KNOWN_MALWARE_HASHES: Record<string, string> = {
    // EICAR Standard Anti-Virus Test File
    '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f': 'EICAR-Test-File',
    // EICAR con extensión (eicar.com.txt)
    '131f95c51cc819465fa1797f6ccacf9d494aaaff46fa3eac73ae63ffbdfd8267': 'EICAR-Test-File.Variant',
};

// ── Patrones sospechosos en contenido de archivos ──
// Detecta cadenas que son indicadores comunes de malware
export const SUSPICIOUS_PATTERNS: { pattern: RegExp; threat: string; description: string }[] = [
    // EICAR test string (estándar de la industria para pruebas de antivirus)
    {
        pattern: /X5O!P%@AP\[4\\PZX54\(P\^\)7CC\)7\}\$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!\$H\+H\*/,
        threat: 'EICAR-Test-File',
        description: 'Archivo de prueba estándar de antivirus EICAR'
    },
    // PowerShell con codificación base64 oculta (técnica común de ofuscación de malware)
    {
        pattern: /powershell\s+.*-[eE]ncodedcommand\s+[A-Za-z0-9+\/=]{50,}/i,
        threat: 'Trojan.PowerShell.Encoded',
        description: 'Script PowerShell con comando codificado sospechoso'
    },
    // Descarga y ejecución remota (patrón de dropper/downloader)
    {
        pattern: /(?:Invoke-WebRequest|wget|curl|certutil\s+-urlcache).*(?:\|.*(?:iex|Invoke-Expression)|\.exe)/i,
        threat: 'Trojan.Downloader.Generic',
        description: 'Intento de descargar y ejecutar código remoto'
    },
    // Scripts VBS/JS maliciosos que crean objetos de shell
    {
        pattern: /CreateObject\s*\(\s*["'](?:WScript\.Shell|Shell\.Application|Scripting\.FileSystemObject)["']\s*\).*(?:Run|Exec|ShellExecute)/is,
        threat: 'VBS.Malware.Generic',
        description: 'Script que intenta ejecutar comandos del sistema'
    },
    // Macros maliciosas de Office (Auto_Open con Shell)
    {
        pattern: /(?:Auto_Open|AutoOpen|Document_Open|Workbook_Open)[\s\S]*(?:Shell|WScript|PowerShell|cmd\.exe)/i,
        threat: 'Macro.Trojan.Generic',
        description: 'Macro de Office con ejecución de comandos'
    },
];

// ── Extensiones de archivo de alto riesgo ──
export const HIGH_RISK_EXTENSIONS = new Set([
    '.exe', '.scr', '.pif', '.com', '.bat', '.cmd', '.vbs', '.vbe',
    '.js', '.jse', '.wsf', '.wsh', '.ps1', '.msi', '.dll', '.sys',
    '.cpl', '.hta', '.inf', '.reg', '.rgs', '.sct', '.shb', '.shs',
]);

// ══════════════════════════════════════════════════════════════
// FUNCIONES DE ANÁLISIS
// ══════════════════════════════════════════════════════════════

/**
 * Calcula el hash SHA-256 de un archivo
 */
export function getFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * Verifica si el hash del archivo coincide con malware conocido
 */
export function checkHashSignature(filePath: string): string | null {
    try {
        const hash = getFileHash(filePath);
        return KNOWN_MALWARE_HASHES[hash] || null;
    } catch {
        return null;
    }
}

/**
 * Analiza el contenido del archivo buscando patrones sospechosos
 */
export function checkContentPatterns(filePath: string): { threat: string; description: string } | null {
    try {
        const stats = fs.statSync(filePath);
        // No analizar contenido de archivos mayores a 10 MB (rendimiento)
        if (stats.size > 10 * 1024 * 1024) { return null; }
        // No analizar archivos vacíos
        if (stats.size === 0) { return null; }

        const content = fs.readFileSync(filePath, 'utf-8');

        for (const sig of SUSPICIOUS_PATTERNS) {
            if (sig.pattern.test(content)) {
                return { threat: sig.threat, description: sig.description };
            }
        }
    } catch {
        // Si no se puede leer como texto (ej. binario), ignorar errores
    }
    return null;
}

/**
 * Verifica indicadores de riesgo en archivos ejecutables (cabeceras PE)
 */
export function checkBinaryHeaders(filePath: string): string | null {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size < 2) { return null; }

        const buffer = Buffer.alloc(512);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, Math.min(512, stats.size), 0);
        fs.closeSync(fd);

        const ext = path.extname(filePath).toLowerCase();

        // Detectar archivos con extensión "inocente" pero que son realmente ejecutables (doble extensión)
        if (!HIGH_RISK_EXTENSIONS.has(ext)) {
            // Verificar cabecera PE (MZ) en un archivo que NO tiene extensión ejecutable
            if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
                return 'Suspicious.PE.HiddenExecutable';
            }
        }
    } catch {
        // Ignorar errores de lectura
    }
    return null;
}

// ══════════════════════════════════════════════════════════════
// ACTIVACIÓN DE LA EXTENSIÓN
// ══════════════════════════════════════════════════════════════

export function activate(context: vscode.ExtensionContext) {
    console.log('RustGuard Antivirus Scanner está activo.');

    const disposable = vscode.commands.registerCommand('rustguard-vscode.scanFile', (uri: vscode.Uri) => {
        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Por favor, selecciona un archivo para analizar.');
            return;
        }

        const filePath = uri.fsPath;
        const fileName = path.basename(filePath);

        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            vscode.window.showErrorMessage(`El archivo "${fileName}" no existe.`);
            return;
        }

        // Verificar que es un archivo (no directorio)
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            vscode.window.showErrorMessage('Por favor, selecciona un archivo, no una carpeta.');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `🔍 Analizando "${fileName}" con RustGuard...`,
            cancellable: false
        }, async () => {
            const threats: string[] = [];
            const details: string[] = [];

            // ── Fase 1: Verificación de hash (firmas conocidas) ──
            const hashThreat = checkHashSignature(filePath);
            if (hashThreat) {
                threats.push(hashThreat);
                details.push(`Firma conocida: ${hashThreat}`);
            }

            // ── Fase 2: Análisis de patrones en contenido ──
            const contentThreat = checkContentPatterns(filePath);
            if (contentThreat) {
                threats.push(contentThreat.threat);
                details.push(contentThreat.description);
            }

            // ── Fase 3: Análisis de cabeceras binarias ──
            const binaryThreat = checkBinaryHeaders(filePath);
            if (binaryThreat) {
                threats.push(binaryThreat);
                details.push('Archivo ejecutable disfrazado con extensión inocente');
            }

            // ── Resultado final ──
            if (threats.length > 0) {
                const threatList = threats.join(', ');
                vscode.window.showWarningMessage(
                    `🚨 ¡ALERTA! Se detectaron amenazas en "${fileName}": ${threatList}`,
                    'Ver detalles'
                ).then(selection => {
                    if (selection === 'Ver detalles') {
                        const panel = vscode.window.createOutputChannel('RustGuard Antivirus');
                        panel.appendLine(`═══ Reporte de Análisis de RustGuard ═══`);
                        panel.appendLine(`Archivo: ${filePath}`);
                        panel.appendLine(`Tamaño: ${stats.size} bytes`);
                        panel.appendLine(`Amenazas encontradas: ${threats.length}`);
                        panel.appendLine('');
                        details.forEach((d, i) => panel.appendLine(`  ${i + 1}. ${d}`));
                        panel.appendLine('');
                        panel.appendLine('Recomendación: Elimina o cuarentena este archivo.');
                        panel.show();
                    }
                });
            } else {
                vscode.window.showInformationMessage(
                    `✅ SEGURO: "${fileName}" no contiene amenazas conocidas.`
                );
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
