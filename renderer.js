export function onLoad() {
    const element = document.createElement("style");
    document.head.appendChild(element);

    const plugins_data = LiteLoader.plugins.Theme_Altruistic.path.data;

    Theme_Altruistic.updateStyle((event, message) => {
        element.textContent = message;
    });

    Theme_Altruistic.rendererReady();
}
