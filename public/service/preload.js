const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  call: (...args) => {
    return new Promise((resolve, reject) => {
      const [event, ...params] = args;
      ipcRenderer.send(event, ...params);
      ipcRenderer.once(event, (event, res) => {
        resolve(res);
      });
      ipcRenderer.once(`${event}.error`, (event, res) => {
        reject(res);
      });
    });
  },
});
