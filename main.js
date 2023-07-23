const fs = require("fs");
const path = require("path");
const { BrowserWindow, ipcMain } = require("electron");


// 防抖函数
function debounce(fn, time) {
    let timer = null;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
}


// 更新样式
function updateStyle(webContents) {
    const csspath = path.join(__dirname, "dist/main.css");
    fs.readFile(csspath, "utf-8", (err, data) => {
        if (err) {
            return;
        }
        webContents.send(
            "LiteLoader.Theme_Altruistic.updateStyle",
            data
        );
    });
}


// 监听CSS修改-开发时候用的
function watchCSSChange(webContents) {
    const filepath = path.join(__dirname, "dist/main.css");
    fs.watch(filepath, "utf-8", debounce(() => {
        updateStyle(webContents);
    }, 100));
}


function onLoad(plugin) {
    const PluginDataPath = plugin.path.data;
    const SettingsPath = path.join(PluginDataPath, "settings.json");

    if (!fs.existsSync(PluginDataPath)) {
        fs.mkdirSync(PluginDataPath, { recursive: true });
    }

    if (!fs.existsSync(SettingsPath)) {
        fs.writeFileSync(SettingsPath, JSON.stringify(
            {
                CSSVariables: {
                    ThemeColor: "#ff3352",
                    BackgroundOpacity: 0.35
                }
            }
        ));
    }

    ipcMain.on(
        "LiteLoader.Theme_Altruistic.rendererReady",
        (event) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            updateStyle(window.webContents);
        }
    );

    ipcMain.handle(
        "LiteLoader.Theme_Altruistic.getSettings",
        () => {
            try {
                return JSON.parse( fs.readFileSync(SettingsPath, "utf-8") );
            } catch (error) {
                console.error(error);
                return { ERROR: error };
            }
        }
    );

    ipcMain.handle(
        "LiteLoader.Theme_Altruistic.setSettings",
        ( content ) => {
            try {
                fs.writeFileSync(SettingsPath, JSON.stringify(content), "utf-8");
                return { msg: "OK", info: "ok." };
            } catch (error) {
                console.error(error);
                return { msg: "ERROR", info: error };
            }
        }
    );
}


function onBrowserWindowCreated(window, plugin) {
    window.on("ready-to-show", () => {
        watchCSSChange(window.webContents);
        // const url = window.webContents.getURL();
        // if (url.includes("app://./renderer/index.html")) {
        //     watchCSSChange(window.webContents);
        // }
    });
}


module.exports = {
    onLoad,
    onBrowserWindowCreated
}
