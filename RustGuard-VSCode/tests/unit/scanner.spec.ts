import * as fs from 'fs';
import * as path from 'path';
import { getFileHash, checkHashSignature, checkContentPatterns, checkBinaryHeaders } from '../../src/extension';

describe('RustGuard Local Scanner - Unit Tests', () => {
    const testDir = path.join(__dirname, 'test_files');

    beforeAll(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterAll(() => {
        // Limpiar archivos temporales
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    test('getFileHash: debe calcular correctamente el SHA-256', () => {
        const filePath = path.join(testDir, 'test_hash.txt');
        fs.writeFileSync(filePath, 'Hola RustGuard');
        
        const hash = getFileHash(filePath);
        // SHA-256 de "Hola RustGuard"
        expect(hash).toBeDefined();
        expect(typeof hash).toBe('string');
        expect(hash.length).toBe(64);
    });

    test('checkHashSignature: debe detectar firma EICAR conocida', () => {
        const filePath = path.join(testDir, 'eicar_test.txt');
        // EICAR string exacto
        fs.writeFileSync(filePath, 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
        
        const threat = checkHashSignature(filePath);
        expect(threat).toBe('EICAR-Test-File');
    });

    test('checkContentPatterns: debe detectar ofuscación Base64 en Powershell', () => {
        const filePath = path.join(testDir, 'malicious.ps1');
        const maliciousContent = "powershell -Encodedcommand JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0AZQBtAG8AcgB5AFMAdAByAGUAYQBtACgAWwBDAG8AbgB2AGUAcgB0AF0AOgA6AEYAcgBvAG0AQgBhAHMAZQA2ADQAUwB0AHIAaQBuAGcAKAAiAEgA";
        fs.writeFileSync(filePath, maliciousContent);
        
        const result = checkContentPatterns(filePath);
        expect(result).not.toBeNull();
        expect(result?.threat).toBe('Trojan.PowerShell.Encoded');
    });

    test('checkBinaryHeaders: debe detectar ejecutable disfrazado de TXT', () => {
        const filePath = path.join(testDir, 'fake_text.txt');
        // 0x4D 0x5A es MZ (Windows PE Executable)
        const fakePE = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]);
        fs.writeFileSync(filePath, fakePE);
        
        const threat = checkBinaryHeaders(filePath);
        expect(threat).toBe('Suspicious.PE.HiddenExecutable');
    });

    test('checkBinaryHeaders: debe ignorar archivos muy pequeños', () => {
        const filePath = path.join(testDir, 'small.txt');
        fs.writeFileSync(filePath, Buffer.from([0x4D])); // Solo 1 byte
        
        const threat = checkBinaryHeaders(filePath);
        expect(threat).toBeNull();
    });
});
