const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendToVR: (payload) => ipcRenderer.send('send-to-vr', payload),
  onVRMessage: (callback) => ipcRenderer.on('vr-message', (_, data) => callback(data))
})
