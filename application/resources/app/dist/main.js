"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_dl_1 = __importDefault(require("electron-dl"));
const loginWindow_1 = require("./components/loginWindow");
const mainWindow_1 = require("./components/mainWindow");
const trayIcon_1 = require("./components/trayIcon");
const helpers_1 = require("./helpers/helpers");
const inferFlash_1 = require("./helpers/inferFlash");
// import { createChildWindow } from './components/childWindow';
// Entrypoint for Squirrel, a windows update framework. See https://github.com/jiahaog/nativefier/pull/744
if (require('electron-squirrel-startup')) {
    electron_1.app.exit();
}
const APP_ARGS_FILE_PATH = path_1.default.join(__dirname, '..', 'nativefier.json');
const appArgs = JSON.parse(fs_1.default.readFileSync(APP_ARGS_FILE_PATH, 'utf8'));
const fileDownloadOptions = Object.assign({}, appArgs.fileDownloadOptions);
electron_dl_1.default(fileDownloadOptions);
if (appArgs.processEnvs) {
    Object.keys(appArgs.processEnvs).forEach((key) => {
        /* eslint-env node */
        process.env[key] = appArgs.processEnvs[key];
    });
}
let mainWindow;
if (typeof appArgs.flashPluginDir === 'string') {
    electron_1.app.commandLine.appendSwitch('ppapi-flash-path', appArgs.flashPluginDir);
}
else if (appArgs.flashPluginDir) {
    const flashPath = inferFlash_1.inferFlashPath();
    electron_1.app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
}
if (appArgs.ignoreCertificate) {
    electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
}
if (appArgs.disableGpu) {
    electron_1.app.disableHardwareAcceleration();
}
if (appArgs.ignoreGpuBlacklist) {
    electron_1.app.commandLine.appendSwitch('ignore-gpu-blacklist');
}
if (appArgs.enableEs3Apis) {
    electron_1.app.commandLine.appendSwitch('enable-es3-apis');
}
if (appArgs.diskCacheSize) {
    electron_1.app.commandLine.appendSwitch('disk-cache-size', appArgs.diskCacheSize);
}
if (appArgs.basicAuthUsername) {
    electron_1.app.commandLine.appendSwitch('basic-auth-username', appArgs.basicAuthUsername);
}
if (appArgs.basicAuthPassword) {
    electron_1.app.commandLine.appendSwitch('basic-auth-password', appArgs.basicAuthPassword);
}
const isRunningMacos = helpers_1.isOSX();
let currentBadgeCount = 0;
const setDockBadge = isRunningMacos
    ? (count, bounce = false) => {
        electron_1.app.dock.setBadge(count.toString());
        if (bounce && count > currentBadgeCount)
            electron_1.app.dock.bounce();
        currentBadgeCount = count;
    }
    : () => undefined;
electron_1.app.on('window-all-closed', () => {
    if (!helpers_1.isOSX() || appArgs.fastQuit) {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', (event, hasVisibleWindows) => {
    if (helpers_1.isOSX()) {
        // this is called when the dock is clicked
        if (!hasVisibleWindows) {
            mainWindow.show();
        }
    }
});
electron_1.app.on('before-quit', () => {
    // not fired when the close button on the window is clicked
    if (helpers_1.isOSX()) {
        // need to force a quit as a workaround here to simulate the osx app hiding behaviour
        // Somehow sokution at https://github.com/atom/electron/issues/444#issuecomment-76492576 does not work,
        // e.prevent default appears to persist
        // might cause issues in the future as before-quit and will-quit events are not called
        electron_1.app.exit(0);
    }
});
if (appArgs.crashReporter) {
    electron_1.app.on('will-finish-launching', () => {
        electron_1.crashReporter.start({
            companyName: appArgs.companyName || '',
            productName: appArgs.name,
            submitURL: appArgs.crashReporter,
            uploadToServer: true,
        });
    });
}
// quit if singleInstance mode and there's already another instance running
const shouldQuit = appArgs.singleInstance && !electron_1.app.requestSingleInstanceLock();
if (shouldQuit) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', () => {
        if (mainWindow) {
            if (!mainWindow.isVisible()) {
                // try
                mainWindow.show();
            }
            if (mainWindow.isMinimized()) {
                // minimized
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
    electron_1.app.on('ready', () => {
        mainWindow = mainWindow_1.createMainWindow(appArgs, electron_1.app.quit.bind(this), setDockBadge);
        trayIcon_1.createTrayIcon(appArgs, mainWindow);
        let splash;
        if (appArgs.whiteLabelEnabled === false) {
            mainWindow.hide();
            splash = new electron_1.BrowserWindow({
                width: appArgs.width || 1280,
                height: appArgs.height || 800,
                transparent: true,
                frame: false,
                alwaysOnTop: true,
            });
            splash.loadURL(`file://${__dirname}/static/splash.html`);
            splash.webContents.on('new-window', function (event, url) {
                event.preventDefault();
                electron_1.shell.openExternal(url);
            });
        }
        if (appArgs.whiteLabelEnabled === false && splash !== undefined) {
            setTimeout(() => {
                splash.destroy();
                mainWindow.show();
                // createChildWindow(true, `${__dirname}/static/child.html`, true);
            }, 4000);
        }
        // Register global shortcuts
        if (appArgs.globalShortcuts) {
            appArgs.globalShortcuts.forEach((shortcut) => {
                electron_1.globalShortcut.register(shortcut.key, () => {
                    shortcut.inputEvents.forEach((inputEvent) => {
                        mainWindow.webContents.sendInputEvent(inputEvent);
                    });
                });
            });
        }
    });
}
electron_1.app.on('new-window-for-tab', () => {
    mainWindow.emit('new-tab');
});
electron_1.app.on('login', (event, webContents, request, authInfo, callback) => {
    // for http authentication
    event.preventDefault();
    if (appArgs.basicAuthUsername !== null &&
        appArgs.basicAuthPassword !== null) {
        callback(appArgs.basicAuthUsername, appArgs.basicAuthPassword);
    }
    else {
        loginWindow_1.createLoginWindow(callback);
    }
});
//# sourceMappingURL=main.js.map