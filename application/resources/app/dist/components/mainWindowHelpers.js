"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewWindowHelper = void 0;
const helpers_1 = require("../helpers/helpers");
function onNewWindowHelper(urlToGo, disposition, targetUrl, internalUrls, preventDefault, openExternal, createAboutBlankWindow, nativeTabsSupported, createNewTab) {
    if (!helpers_1.linkIsInternal(targetUrl, urlToGo, internalUrls)) {
        openExternal(urlToGo);
        preventDefault();
    }
    else if (urlToGo === 'about:blank') {
        const newWindow = createAboutBlankWindow();
        preventDefault(newWindow);
    }
    else if (nativeTabsSupported()) {
        if (disposition === 'background-tab') {
            const newTab = createNewTab(urlToGo, false);
            preventDefault(newTab);
        }
        else if (disposition === 'foreground-tab') {
            const newTab = createNewTab(urlToGo, true);
            preventDefault(newTab);
        }
    }
}
exports.onNewWindowHelper = onNewWindowHelper;
//# sourceMappingURL=mainWindowHelpers.js.map