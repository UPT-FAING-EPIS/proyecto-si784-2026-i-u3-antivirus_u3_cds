import { parseClamAVOutput, buildClamscanCommand } from '../../bot.js';

describe('RustGuard Telegram Bot - Unit Tests', () => {

    describe('parseClamAVOutput', () => {
        test('Debe retornar el nombre del virus cuando ClamAV reporta FOUND', () => {
            const rawOutput = "/tmp/rustguard_telegram/12345_archivo.exe: Win.Test.EICAR_HDB-1 FOUND\n----------- SCAN SUMMARY -----------";
            const threat = parseClamAVOutput(rawOutput);
            expect(threat).toBe('Win.Test.EICAR_HDB-1');
        });

        test('Debe retornar null cuando el archivo está limpio (OK)', () => {
            const rawOutput = "/tmp/rustguard_telegram/12345_seguro.pdf: OK\n----------- SCAN SUMMARY -----------";
            const threat = parseClamAVOutput(rawOutput);
            expect(threat).toBeNull();
        });

        test('Debe retornar null ante un string vacío o de error irrelevante', () => {
            const threat = parseClamAVOutput("LibClamAV Error: Can't load...");
            expect(threat).toBeNull();
        });
    });

    describe('buildClamscanCommand', () => {
        test('Debe construir comando robusto para Windows', () => {
            const cmd = buildClamscanCommand(true, 'C:\\temp\\file.txt', 'C:\\app\\src');
            expect(cmd).toContain('clamscan.exe');
            expect(cmd).toContain('clamav_db');
            expect(cmd).toContain('file.txt');
        });

        test('Debe construir comando limpio para Linux', () => {
            const cmd = buildClamscanCommand(false, '/tmp/file.txt', '/app');
            expect(cmd).toBe('clamscan "/tmp/file.txt"');
        });
    });
});
