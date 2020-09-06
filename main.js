const { app, BrowserWindow,ipcMain } = require('electron')
const { autoUpdater } = require("electron-updater")

let win


const dispatch = (data) => {
  win.webContents.send('message', data)
}

const createDefaultWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.on('closed', () => {
    win = null
  })
  win.loadFile('index.html')
  return win
}

app.on('ready', () => {
  createDefaultWindow()
  autoUpdater.checkForUpdatesAndNotify();
})

ipcMain.on('version', (event) => {
  event.sender.send('version',app.getVersion());
});

app.on('window-all-closed', () => {
  app.quit()
})


autoUpdater.on('checking-for-update', () => {
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  win.webContents.send('download-progress', progressObj.percent)
})

autoUpdater.on('update-downloaded', (info) => {
  dispatch('Update downloaded')
})
