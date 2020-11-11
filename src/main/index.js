'use strict'

import { app, BrowserWindow, Menu, MenuItem, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isSpectron = process.env.SPECTRON === '1'
const isDevelopment = process.env.NODE_ENV !== 'production' && !isSpectron

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow, serverWindow;

function createMainWindow() {
  const window = new BrowserWindow({
		width: isDevelopment ? 1400 : 800,
    height: 400,
		webPreferences: {nodeIntegration: true}
  });
  
  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'Electron',
    submenu: [{
      label: 'Change multiplayer server',
      accelerator: process.platform === 'darwin' ? 'Shift+Cmd+S' : 'Shift+Ctrl+S',
      click: () => {
        serverWindow = new BrowserWindow({
          width: 300,
          height: 150,
          webPreferences: {nodeIntegration: true}
        });

        if (isDevelopment) {
          serverWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/server.html`);
        } else {
          serverWindow.loadURL(formatUrl({
            pathname: path.join(__dirname, 'server.html'),
            protocol: 'file',
            slashes: true
          }));
        }
        
        ipcMain.on("changeServer", (_e, args) => {
          serverWindow.close();
          console.log(`Sending ${args} to the main window`);
          window.webContents.send("changeServer", args);
          serverWindow = null;
        });
      }
    }]
  }));

  Menu.setApplicationMenu(menu);

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    if (isSpectron) {
			window.loadURL(formatUrl({
				pathname: path.join(__dirname, '../', 'renderer', 'index.html'),
				protocol: 'file',
				slashes: true
			}))
		} else {
			window.loadURL(formatUrl({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file',
				slashes: true
			}))
		}
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
