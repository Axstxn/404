"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContextMenu = void 0;
const electron_1 = require("electron");
const electron_context_menu_1 = __importDefault(require("electron-context-menu"));
function initContextMenu(createNewWindow, createNewTab) {
    electron_context_menu_1.default({
        prepend: (actions, params) => {
            const items = [];
            if (params.linkURL) {
                items.push({
                    label: 'Open Link in Default Browser',
                    click: () => {
                        electron_1.shell.openExternal(params.linkURL);
                    },
                });
                items.push({
                    label: 'Open Link in New Window',
                    click: () => {
                        createNewWindow(params.linkURL);
                    },
                });
                if (createNewTab) {
                    items.push({
                        label: 'Open Link in New Tab',
                        click: () => {
                            createNewTab(params.linkURL, false);
                        },
                    });
                }
            }
            return items;
        },
    });
}
exports.initContextMenu = initContextMenu;
//# sourceMappingURL=contextMenu.js.map