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
exports.getCounterValue = exports.nativeTabsSupported = exports.getAppIcon = exports.debugLog = exports.getCssToInject = exports.shouldInjectCss = exports.linkIsInternal = exports.isWindows = exports.isLinux = exports.isOSX = void 0;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const wurl_1 = __importDefault(require("wurl"));
const INJECT_CSS_PATH = path.join(__dirname, '..', 'inject/inject.css');
function isOSX() {
    return os.platform() === 'darwin';
}
exports.isOSX = isOSX;
function isLinux() {
    return os.platform() === 'linux';
}
exports.isLinux = isLinux;
function isWindows() {
    return os.platform() === 'win32';
}
exports.isWindows = isWindows;
function linkIsInternal(currentUrl, newUrl, internalUrlRegex) {
    if (newUrl === 'about:blank') {
        return true;
    }
    if (internalUrlRegex) {
        const regex = RegExp(internalUrlRegex);
        return regex.test(newUrl);
    }
    const currentDomain = wurl_1.default('domain', currentUrl);
    const newDomain = wurl_1.default('domain', newUrl);
    return currentDomain === newDomain;
}
exports.linkIsInternal = linkIsInternal;
function shouldInjectCss() {
    try {
        fs.accessSync(INJECT_CSS_PATH);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.shouldInjectCss = shouldInjectCss;
function getCssToInject() {
    return fs.readFileSync(INJECT_CSS_PATH).toString();
}
exports.getCssToInject = getCssToInject;
/**
 * Helper to print debug messages from the main process in the browser window
 */
function debugLog(browserWindow, message) {
    // Need a delay, as it takes time for the preloaded js to be loaded by the window
    setTimeout(() => {
        browserWindow.webContents.send('debug', message);
    }, 3000);
    console.info(message);
}
exports.debugLog = debugLog;
function getAppIcon() {
    return path.join(__dirname, '..', `icon.${isWindows() ? 'ico' : 'png'}`);
}
exports.getAppIcon = getAppIcon;
function nativeTabsSupported() {
    return isOSX();
}
exports.nativeTabsSupported = nativeTabsSupported;
function getCounterValue(title) {
    const itemCountRegex = /[([{]([\d.,]*)\+?[}\])]/;
    const match = itemCountRegex.exec(title);
    return match ? match[1] : undefined;
}
exports.getCounterValue = getCounterValue;
//# sourceMappingURL=helpers.js.map