import { BrowserWindow, app, Menu, ipcMain } from "electron";
import { IPCMainHandlers } from "./ipc";

app.on("window-all-closed", app.quit)
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false
        }
    })

    win.loadFile('build/app/index.html')
    // win.loadURL("http://localhost:3000")
    // win.webContents.openDevTools()

    win.setMenu(Menu.buildFromTemplate([]))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

/**
 * All IPC Handlers are placed below
 */
IPCMainHandlers
