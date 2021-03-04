const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appRuntime", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  invoke: (channel, data) => ipcRenderer.invoke(channel, data), 
  subscribe: (channel, listener) => {
    const subscription = (event, ...args) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
