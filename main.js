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
    ipcMain.on(
        "LiteLoader.Theme_Altruistic.rendererReady",
        (event, message) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            updateStyle(window.webContents);
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
