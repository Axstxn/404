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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginWindow = void 0;
const path = __importStar(require("path"));
const electron_1 = require("electron");
function createLoginWindow(loginCallback) {
    const loginWindow = new electron_1.BrowserWindow({
        width: 300,
        height: 400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    loginWindow.loadURL(`file://${path.join(__dirname, 'static/login.html')}`);
    electron_1.ipcMain.once('login-message', (event, usernameAndPassword) => {
        loginCallback(usernameAndPassword[0], usernameAndPassword[1]);
        loginWindow.close();
    });
    return loginWindow;
}
exports.createLoginWindow = createLoginWindow;
//# sourceMappingURL=loginWindow.js.map