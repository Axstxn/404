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
exports.inferFlashPath = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
/**
 * Find a file or directory
 */
function findSync(pattern, basePath, limitSearchToDirectories = false) {
    const matches = [];
    (function findSyncRecurse(base) {
        let children;
        try {
            children = fs.readdirSync(base);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return;
            }
            throw err;
        }
        for (const child of children) {
            const childPath = path.join(base, child);
            const childIsDirectory = fs.lstatSync(childPath).isDirectory();
            const patternMatches = pattern.test(childPath);
            if (!patternMatches) {
                if (!childIsDirectory) {
                    return;
                }
                findSyncRecurse(childPath);
                return;
            }
            if (!limitSearchToDirectories) {
                matches.push(childPath);
                return;
            }
            if (childIsDirectory) {
                matches.push(childPath);
            }
        }
    })(basePath);
    return matches;
}
function findFlashOnLinux() {
    return findSync(/libpepflashplayer\.so/, '/opt/google/chrome')[0];
}
function findFlashOnWindows() {
    return findSync(/pepflashplayer\.dll/, 'C:\\Program Files (x86)\\Google\\Chrome')[0];
}
function findFlashOnMac() {
    return findSync(/PepperFlashPlayer.plugin/, '/Applications/Google Chrome.app/', true)[0];
}
function inferFlashPath() {
    if (helpers_1.isOSX()) {
        return findFlashOnMac();
    }
    if (helpers_1.isWindows()) {
        return findFlashOnWindows();
    }
    if (helpers_1.isLinux()) {
        return findFlashOnLinux();
    }
    console.warn('Unable to determine OS to infer flash player');
    return null;
}
exports.inferFlashPath = inferFlashPath;
//# sourceMappingURL=inferFlash.js.map