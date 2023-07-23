const plugin_path =
    ( LiteLoader || BetterQQNT )
        .plugins.Theme_Altruistic.path.plugin;

async function onLoad() {
    const element = document.createElement("style");
    document.head.appendChild(element);

    // 自動應用 Settings 中已設定的 CSS Property （如有）。
    const { CSSVariables } = await Theme_Altruistic.getSettings();
    for (let i in CSSVariables) {
        document.body.style.setProperty(`--${i}`, CSSVariables[i])
    }

    Theme_Altruistic.updateStyle((event, message) => {
        element.textContent = message;
    });

    Theme_Altruistic.rendererReady();
}


async function onConfigView (view) {
    const html_file_path = `file://${plugin_path}/src/settings.html`;

    // HTML Injection
    view.appendChild(
        ( new DOMParser() )
        .parseFromString(
            await ( await fetch(html_file_path) ).text(), "text/html"
        ).body
    )

    await setTimeout(500)

    const Settings = await Theme_Altruistic.getSettings();

    // 變更 Input 中的數值爲 Settings 中的
    document.querySelector(".setting-main input#BackgroundOpacity").value = Settings.CSSVariables.BackgroundOpacity;
    document.querySelector(".setting-main input#ThemeColor").value = Settings.CSSVariables.ThemeColor * 100;
    document.querySelector(".setting-main span#BackgroundOpacityPercent").innerText = Settings.CSSVariables.ThemeColor * 100;

    // 爲設定的兩個 Input 添加監聽。
    document.querySelector(".setting-main input#BackgroundOpacity").addEventListener("change", (e) => {
        Settings.CSSVariables.BackgroundOpacity = parseInt(e.target.value) / 100;
        document.querySelector(".setting-main span#BackgroundOpacityPercent").innerText = e.target.value;

        document.dispatchEvent(new CustomEvent("SettingsChanged"));
    })

    document.querySelector(".setting-main input#ThemeColor").addEventListener("change", (e) => {
        Settings.CSSVariables.ThemeColor = e.target.value;

        document.dispatchEvent(new CustomEvent(".setting-main SettingsChanged"));
    })

    // 監聽自訂的 SettingsChanged 事件，自動保存。
    document.addEventListener("SettingsChanged", () => {
        const ReturnedMsg = Theme_Altruistic.setSettings(Settings);
        if ( ReturnedMsg.msg === "ERROR") {
            alert(ReturnedMsg.info)
        }
    })

}


export {
    onLoad,
    onConfigView
}