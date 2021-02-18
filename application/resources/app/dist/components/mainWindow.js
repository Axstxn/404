"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainWindow = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const electron_1 = require("electron");
const electron_window_state_1 = __importDefault(require("electron-window-state"));
const helpers_1 = require("../helpers/helpers");
const contextMenu_1 = require("./contextMenu");
const mainWindowHelpers_1 = require("./mainWindowHelpers");
const menu_1 = require("./menu");
const ZOOM_INTERVAL = 0.1;
function hideWindow(window, event, fastQuit, tray) {
    if (helpers_1.isOSX() && !fastQuit) {
        // this is called when exiting from clicking the cross button on the window
        event.preventDefault();
        window.hide();
    }
    else if (!fastQuit && tray) {
        event.preventDefault();
        window.hide();
    }
    // will close the window on other platforms
}
function injectCss(browserWindow) {
    if (!helpers_1.shouldInjectCss()) {
        return;
    }
    const cssToInject = helpers_1.getCssToInject();
    browserWindow.webContents.on('did-navigate', () => {
        // We must inject css early enough; so onHeadersReceived is a good place.
        // Will run multiple times, see `did-finish-load` below that unsets this handler.
        browserWindow.webContents.session.webRequest.onHeadersReceived({ urls: [] }, // Pass an empty filter list; null will not match _any_ urls
        (details, callback) => {
            browserWindow.webContents.insertCSS(cssToInject);
            callback({ cancel: false, responseHeaders: details.responseHeaders });
        });
    });
}
async function clearCache(browserWindow) {
    const { session } = browserWindow.webContents;
    await session.clearStorageData();
    await session.clearCache();
}
function setProxyRules(browserWindow, proxyRules) {
    browserWindow.webContents.session.setProxy({
        proxyRules,
        pacScript: '',
        proxyBypassRules: '',
    });
}
/**
 * @param {{}} nativefierOptions AppArgs from nativefier.json
 * @param {function} onAppQuit
 * @param {function} setDockBadge
 */
function createMainWindow(nativefierOptions, onAppQuit, setDockBadge) {
    const options = Object.assign({}, nativefierOptions);
    const mainWindowState = electron_window_state_1.default({
        defaultWidth: options.width || 1280,
        defaultHeight: options.height || 800,
    });
    const DEFAULT_WINDOW_OPTIONS = {
        // Convert dashes to spaces because on linux the app name is joined with dashes
        title: options.name,
        tabbingIdentifier: helpers_1.nativeTabsSupported() ? options.name : undefined,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: false,
            webSecurity: !options.insecure,
            preload: path.join(__dirname, 'preload.js'),
            zoomFactor: options.zoom,
        },
    };
    const browserwindowOptions = Object.assign({}, options.browserwindowOptions);
    const mainWindow = new electron_1.BrowserWindow(Object.assign(Object.assign({ frame: !options.hideWindowFrame, width: mainWindowState.width, height: mainWindowState.height, minWidth: options.minWidth, minHeight: options.minHeight, maxWidth: options.maxWidth, maxHeight: options.maxHeight, x: options.x, y: options.y, autoHideMenuBar: !options.showMenuBar, icon: helpers_1.getAppIcon(), 
        // set to undefined and not false because explicitly setting to false will disable full screen
        fullscreen: options.fullScreen || undefined, 
        // Whether the window should always stay on top of other windows. Default is false.
        alwaysOnTop: options.alwaysOnTop, titleBarStyle: options.titleBarStyle, show: options.tray !== 'start-in-tray', backgroundColor: options.backgroundColor }, DEFAULT_WINDOW_OPTIONS), browserwindowOptions));
    mainWindowState.manage(mainWindow);
    // after first run, no longer force maximize to be true
    if (options.maximize) {
        mainWindow.maximize();
        options.maximize = undefined;
        try {
            fs.writeFileSync(path.join(__dirname, '..', 'nativefier.json'), JSON.stringify(options));
        }
        catch (exception) {
            // eslint-disable-next-line no-console
            console.log(`WARNING: Ignored nativefier.json rewrital (${exception})`);
        }
    }
    const withFocusedWindow = (block) => {
        const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
            return block(focusedWindow);
        }
        return undefined;
    };
    const adjustWindowZoom = (window, adjustment) => {
        window.webContents.zoomFactor = window.webContents.zoomFactor + adjustment;
    };
    const onZoomIn = () => {
        withFocusedWindow((focusedWindow) => adjustWindowZoom(focusedWindow, ZOOM_INTERVAL));
    };
    const onZoomOut = () => {
        withFocusedWindow((focusedWindow) => adjustWindowZoom(focusedWindow, -ZOOM_INTERVAL));
    };
    const onZoomReset = () => {
        withFocusedWindow((focusedWindow) => {
            focusedWindow.webContents.zoomFactor = options.zoom;
        });
    };
    const clearAppData = async () => {
        const response = await electron_1.dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['Yes', 'Cancel'],
            defaultId: 1,
            title: 'Clear cache confirmation',
            message: 'This will clear all data (cookies, local storage etc) from this app. Are you sure you wish to proceed?',
        });
        if (response.response !== 0) {
            return;
        }
        await clearCache(mainWindow);
    };
    const onGoBack = () => {
        withFocusedWindow((focusedWindow) => {
            focusedWindow.webContents.goBack();
        });
    };
    const onGoForward = () => {
        withFocusedWindow((focusedWindow) => {
            focusedWindow.webContents.goForward();
        });
    };
    const getCurrentUrl = () => withFocusedWindow((focusedWindow) => focusedWindow.webContents.getURL());
    const onWillNavigate = (event, urlToGo) => {
        if (!helpers_1.linkIsInternal(options.targetUrl, urlToGo, options.internalUrls)) {
            event.preventDefault();
            electron_1.shell.openExternal(urlToGo);
        }
    };
    const createNewWindow = (url) => {
        const window = new electron_1.BrowserWindow(DEFAULT_WINDOW_OPTIONS);
        if (options.userAgent) {
            window.webContents.userAgent = options.userAgent;
        }
        if (options.proxyRules) {
            setProxyRules(window, options.proxyRules);
        }
        injectCss(window);
        sendParamsOnDidFinishLoad(window);
        window.webContents.on('new-window', onNewWindow);
        window.webContents.on('will-navigate', onWillNavigate);
        window.loadURL(url);
        return window;
    };
    const createNewTab = (url, foreground) => {
        withFocusedWindow((focusedWindow) => {
            const newTab = createNewWindow(url);
            focusedWindow.addTabbedWindow(newTab);
            if (!foreground) {
                focusedWindow.focus();
            }
            return newTab;
        });
        return undefined;
    };
    const createAboutBlankWindow = () => {
        const window = createNewWindow('about:blank');
        window.hide();
        window.webContents.once('did-stop-loading', () => {
            if (window.webContents.getURL() === 'about:blank') {
                window.close();
            }
            else {
                window.show();
            }
        });
        return window;
    };
    const onNewWindow = (event, urlToGo, frameName, disposition) => {
        const preventDefault = (newGuest) => {
            event.preventDefault();
            if (newGuest) {
                event.newGuest = newGuest;
            }
        };
        mainWindowHelpers_1.onNewWindowHelper(urlToGo, disposition, options.targetUrl, options.internalUrls, preventDefault, electron_1.shell.openExternal.bind(this), createAboutBlankWindow, helpers_1.nativeTabsSupported, createNewTab);
    };
    const sendParamsOnDidFinishLoad = (window) => {
        window.webContents.on('did-finish-load', () => {
            // In children windows too: Restore pinch-to-zoom, disabled by default in recent Electron.
            // See https://github.com/jiahaog/nativefier/issues/379#issuecomment-598612128
            // and https://github.com/electron/electron/pull/12679
            window.webContents.setVisualZoomLevelLimits(1, 3);
            window.webContents.send('params', JSON.stringify(options));
        });
    };
    const menuOptions = {
        nativefierVersion: options.nativefierVersion,
        appQuit: onAppQuit,
        zoomIn: onZoomIn,
        zoomOut: onZoomOut,
        zoomReset: onZoomReset,
        zoomBuildTimeValue: options.zoom,
        goBack: onGoBack,
        goForward: onGoForward,
        getCurrentUrl,
        clearAppData,
        disableDevTools: options.disableDevTools,
        whiteLabelEnabled: options.whiteLabelEnabled,
    };
    menu_1.createMenu(menuOptions);
    if (!options.disableContextMenu) {
        contextMenu_1.initContextMenu(createNewWindow, helpers_1.nativeTabsSupported() ? createNewTab : undefined);
    }
    if (options.userAgent) {
        mainWindow.webContents.userAgent = options.userAgent;
    }
    if (options.proxyRules) {
        setProxyRules(mainWindow, options.proxyRules);
    }
    injectCss(mainWindow);
    sendParamsOnDidFinishLoad(mainWindow);
    if (options.counter) {
        mainWindow.on('page-title-updated', (e, title) => {
            const counterValue = helpers_1.getCounterValue(title);
            if (counterValue) {
                setDockBadge(counterValue, options.bounce);
            }
            else {
                setDockBadge('');
            }
        });
    }
    else {
        electron_1.ipcMain.on('notification', () => {
            if (!helpers_1.isOSX() || mainWindow.isFocused()) {
                return;
            }
            setDockBadge('•', options.bounce);
        });
        mainWindow.on('focus', () => {
            setDockBadge('');
        });
    }
    electron_1.ipcMain.on('notification-click', () => {
        mainWindow.show();
    });
    mainWindow.webContents.on('new-window', onNewWindow);
    mainWindow.webContents.on('will-navigate', onWillNavigate);
    mainWindow.webContents.on('did-finish-load', () => {
        // Restore pinch-to-zoom, disabled by default in recent Electron.
        // See https://github.com/jiahaog/nativefier/issues/379#issuecomment-598309817
        // and https://github.com/electron/electron/pull/12679
        mainWindow.webContents.setVisualZoomLevelLimits(1, 3);
        // Remove potential css injection code set in `did-navigate`) (see injectCss code)
        mainWindow.webContents.session.webRequest.onHeadersReceived(null);
    });
    if (options.clearCache) {
        clearCache(mainWindow);
    }
    mainWindow.loadURL(options.targetUrl);
    // @ts-ignore
    mainWindow.on('new-tab', () => createNewTab(options.targetUrl, true));
    mainWindow.on('close', (event) => {
        if (mainWindow.isFullScreen()) {
            if (helpers_1.nativeTabsSupported()) {
                mainWindow.moveTabToNewWindow();
            }
            mainWindow.setFullScreen(false);
            mainWindow.once('leave-full-screen', hideWindow.bind(this, mainWindow, event, options.fastQuit));
        }
        hideWindow(mainWindow, event, options.fastQuit, options.tray);
        if (options.clearCache) {
            clearCache(mainWindow);
        }
    });
    return mainWindow;
}
exports.createMainWindow = createMainWindow;
//# sourceMappingURL=mainWindow.js.map