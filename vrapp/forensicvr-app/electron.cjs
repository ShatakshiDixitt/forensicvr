const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { WebSocketServer } = require('ws')

let mainWindow
let wss
const connectedVRClients = new Set()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#06060f'
  })

  mainWindow.maximize()
  mainWindow.show()

  // Allow camera access
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') callback(true)
    else callback(false)
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

function startWebSocketServer() {
  wss = new WebSocketServer({ port: 9090 })
  console.log('[WS] Server started on port 9090')

  wss.on('connection', (ws) => {
    console.log('[WS] VR client connected')
    connectedVRClients.add(ws)

    ws.on('close', () => connectedVRClients.delete(ws))

    ws.on('message', (data) => {
      mainWindow.webContents.send('vr-message', data.toString())
    })
  })
}

ipcMain.on('send-to-vr', (event, payload) => {
  const msg = JSON.stringify(payload)
  console.log('[IPC] Sending to VR:', msg)
  connectedVRClients.forEach(client => {
    if (client.readyState === 1) client.send(msg)
  })
})

app.whenReady().then(() => {
  createWindow()
  startWebSocketServer()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
