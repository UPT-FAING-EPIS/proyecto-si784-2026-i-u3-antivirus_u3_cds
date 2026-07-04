import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("Falta TELEGRAM_BOT_TOKEN en el archivo .env");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const isWindows = os.platform() === 'win32';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio temporal
const TEMP_DIR = path.join(os.tmpdir(), 'rustguard_telegram');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

console.log('RustGuard Telegram Bot iniciado...');

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.document) {
        await bot.sendMessage(chatId, `🔍 Analizando *${msg.document.file_name}*... Por favor espera.`, { parse_mode: 'Markdown' });

        try {
            // Descargar el archivo
            const fileLink = await bot.getFileLink(msg.document.file_id);
            const res = await fetch(fileLink);
            const buffer = await res.arrayBuffer();

            const tempFilePath = path.join(TEMP_DIR, `${Date.now()}_${msg.document.file_name}`);
            fs.writeFileSync(tempFilePath, Buffer.from(buffer));

            const command = buildClamscanCommand(isWindows, tempFilePath, __dirname);

            exec(command, (error, stdout, stderr) => {
                const outputCompleto = (stdout || '') + (stderr || '');

                // Limpiar archivo temporal siempre
                try { fs.unlinkSync(tempFilePath); } catch (e) {}

                // La ÚNICA forma de confirmar virus es la presencia de "FOUND" en el output
                const threatName = parseClamAVOutput(outputCompleto);

                if (threatName) {
                    bot.sendMessage(chatId,
                        `🚨 *¡PELIGRO! MALWARE DETECTADO*\n\nArchivo: \`${msg.document.file_name}\`\nAmenaza: \`${threatName}\``,
                        { parse_mode: 'Markdown' }
                    );
                } else {
                    // Sin "FOUND" = limpio (sin importar el código de salida)
                    bot.sendMessage(chatId,
                        `✅ *SEGURO*: No se encontraron amenazas en \`${msg.document.file_name}\`.`,
                        { parse_mode: 'Markdown' }
                    );
                }
            });

        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, "❌ Error al descargar o procesar el archivo. Inténtalo de nuevo.");
        }
    } else if (msg.text === '/start') {
        bot.sendMessage(chatId,
            `🛡️ *RustGuard Antivirus Bot*\n\nEnvíame cualquier archivo y lo analizaré en busca de virus o malware usando el motor ClamAV.\n\n_Soporta: .exe, .pdf, .zip, .docx, y cualquier otro tipo de archivo._`,
            { parse_mode: 'Markdown' }
        );
    }
});

// ==========================================
// EXPORTS FOR TESTING (Pure Functions)
// ==========================================

export function buildClamscanCommand(isWin, filePath, dirName) {
    if (isWin) {
        const DB_DIR = path.resolve(dirName, '..', '..', 'clamav_db');
        const CLAMSCAN_EXE = path.resolve(dirName, '..', '..', 'bin', 'clamav', 'clamscan.exe');
        return `"${CLAMSCAN_EXE}" -d "${DB_DIR}" "${filePath}"`;
    }
    return `clamscan "${filePath}"`;
}

export function parseClamAVOutput(output) {
    const match = output.match(/:\s+(.+?)\s+FOUND/);
    if (match) {
        return match[1].trim();
    }
    return null;
}
