import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { parseClamAVOutput } from '../../bot.js';

let clamOutput = '';
let scanResult = null;

Given('que el motor antivirus devuelve el string {string}', function (outputStr) {
    clamOutput = outputStr;
});

When('el bot procesa el resultado del análisis', function () {
    scanResult = parseClamAVOutput(clamOutput);
});

Then('debe detectar el virus {string}', function (expectedVirus) {
    assert.strictEqual(scanResult, expectedVirus);
});

Then('debe retornar que el archivo es seguro', function () {
    assert.strictEqual(scanResult, null);
});
