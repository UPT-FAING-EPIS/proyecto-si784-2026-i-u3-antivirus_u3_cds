import { Given, When, Then, AfterAll } from '@cucumber/cucumber';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { checkHashSignature, checkContentPatterns } from '../../src/extension';

const bddTestDir = path.join(__dirname, '..', 'bdd_test_files');
let currentFilePath = '';
let scanResult: any = null;

Given('que tengo un archivo llamado {string} con el contenido {string}', function (fileName: string, content: string) {
    if (!fs.existsSync(bddTestDir)) {
        fs.mkdirSync(bddTestDir, { recursive: true });
    }
    currentFilePath = path.join(bddTestDir, fileName);
    fs.writeFileSync(currentFilePath, content);
});

Given('que tengo un script llamado {string} con un comando {string}', function (fileName: string, content: string) {
    if (!fs.existsSync(bddTestDir)) {
        fs.mkdirSync(bddTestDir, { recursive: true });
    }
    currentFilePath = path.join(bddTestDir, fileName);
    fs.writeFileSync(currentFilePath, content);
});

When('ejecuto el escáner de patrones de contenido en el archivo', function () {
    scanResult = checkContentPatterns(currentFilePath);
});

When('ejecuto el escáner de firmas criptográficas en el archivo', function () {
    scanResult = checkHashSignature(currentFilePath);
});

Then('el resultado debe ser {string}', function (expected: string) {
    if (expected === 'Seguro') {
        assert.strictEqual(scanResult, null);
    }
});

Then('el sistema debe alertar sobre {string}', function (expectedThreat: string) {
    if (typeof scanResult === 'string') {
        assert.strictEqual(scanResult, expectedThreat);
    } else {
        assert.notStrictEqual(scanResult, null, 'Expected a threat but got null');
        assert.strictEqual(scanResult.threat, expectedThreat);
    }
});

AfterAll(function() {
    if (fs.existsSync(bddTestDir)) {
        fs.rmSync(bddTestDir, { recursive: true, force: true });
    }
});
