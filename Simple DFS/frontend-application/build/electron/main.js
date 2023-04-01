"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var ipc_1 = require("./ipc");
electron_1.app.on("window-all-closed", electron_1.app.quit);
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false
        }
    });
    win.loadFile('build/app/index.html');
    win.setMenu(electron_1.Menu.buildFromTemplate([]));
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
ipc_1.IPCMainHandlers;
