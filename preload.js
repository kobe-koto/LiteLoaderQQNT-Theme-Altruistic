const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("Theme_Altruistic", {
    updateStyle: (callback) => ipcRenderer.on(
        "LiteLoader.Theme_Altruistic.updateStyle",
        callback
    ),
    rendererReady: () => ipcRenderer.send(
        "LiteLoader.Theme_Altruistic.rendererReady"
    ),
    getSettings: () => ipcRenderer.invoke(
        "LiteLoader.Theme_Altruistic.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "LiteLoader.Theme_Altruistic.setSettings",
        content
    ),
});
