"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildWindow = void 0;
const electron_1 = require("electron");
/**
 * To create a new child window
 * @param showChild
 * @param htmlUrl
 * @param openInBrowser
 */
function createChildWindow(showChild, htmlUrl, openInBrowser) {
    const childWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 200,
    });
    childWindow.loadFile(htmlUrl);
    if (openInBrowser) {
        childWindow.webContents.on('new-window', function (event, url) {
            event.preventDefault();
            electron_1.shell.openExternal(url);
        });
    }
}
exports.createChildWindow = createChildWindow;
//# sourceMappingURL=childWindow.js.map