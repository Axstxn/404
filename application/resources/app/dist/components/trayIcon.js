"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrayIcon = void 0;
const electron_1 = require("electron");
const helpers_1 = require("../helpers/helpers");
function createTrayIcon(nativefierOptions, mainWindow) {
    const options = Object.assign({}, nativefierOptions);
    if (options.tray) {
        const iconPath = helpers_1.getAppIcon();
        const nimage = electron_1.nativeImage.createFromPath(iconPath);
        const appIcon = new electron_1.Tray(nimage);
        const onClick = () => {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            }
            else {
                mainWindow.show();
            }
        };
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: options.name,
                click: onClick,
            },
            {
                label: 'Quit',
                click: electron_1.app.exit.bind(this),
            },
        ]);
        appIcon.on('click', onClick);
        if (options.counter) {
            mainWindow.on('page-title-updated', (e, title) => {
                const counterValue = helpers_1.getCounterValue(title);
                if (counterValue) {
                    appIcon.setToolTip(`(${counterValue})  ${options.name}`);
                }
                else {
                    appIcon.setToolTip(options.name);
                }
            });
        }
        else {
            electron_1.ipcMain.on('notification', () => {
                if (mainWindow.isFocused()) {
                    return;
                }
                appIcon.setToolTip(`•  ${options.name}`);
            });
            mainWindow.on('focus', () => {
                appIcon.setToolTip(options.name);
            });
        }
        appIcon.setToolTip(options.name);
        appIcon.setContextMenu(contextMenu);
        return appIcon;
    }
    return null;
}
exports.createTrayIcon = createTrayIcon;
//# sourceMappingURL=trayIcon.js.map