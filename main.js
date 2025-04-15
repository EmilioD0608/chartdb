/* eslint-env node */
/* eslint-disable no-undef */

import { app, BrowserWindow } from 'electron';
import electronServe from 'electron-serve';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuramos electron-serve para que sirva la carpeta 'dist'
const loadURL = electronServe({ directory: path.join(__dirname, 'dist') });

async function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Cargar la app mediante el servidor interno
    await loadURL(win);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
