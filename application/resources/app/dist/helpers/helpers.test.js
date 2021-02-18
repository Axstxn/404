"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const internalUrl = 'https://medium.com/';
const internalUrlSubPath = 'topic/technology';
const externalUrl = 'https://www.wikipedia.org/wiki/Electron';
const wildcardRegex = /.*/;
test('the original url should be internal', () => {
    expect(helpers_1.linkIsInternal(internalUrl, internalUrl, undefined)).toEqual(true);
});
test('sub-paths of the original url should be internal', () => {
    expect(helpers_1.linkIsInternal(internalUrl, internalUrl + internalUrlSubPath, undefined)).toEqual(true);
});
test("'about:blank' should be internal", () => {
    expect(helpers_1.linkIsInternal(internalUrl, 'about:blank', undefined)).toEqual(true);
});
test('urls from different sites should not be internal', () => {
    expect(helpers_1.linkIsInternal(internalUrl, externalUrl, undefined)).toEqual(false);
});
test('all urls should be internal with wildcard regex', () => {
    expect(helpers_1.linkIsInternal(internalUrl, externalUrl, wildcardRegex)).toEqual(true);
});
const smallCounterTitle = 'Inbox (11) - nobody@example.com - Gmail';
const largeCounterTitle = 'Inbox (8,756) - nobody@example.com - Gmail';
const noCounterTitle = 'Inbox - nobody@example.com - Gmail';
test('getCounterValue should return undefined for titles without counter numbers', () => {
    expect(helpers_1.getCounterValue(noCounterTitle)).toEqual(undefined);
});
test('getCounterValue should return a string for small counter numbers in the title', () => {
    expect(helpers_1.getCounterValue(smallCounterTitle)).toEqual('11');
});
test('getCounterValue should return a string for large counter numbers in the title', () => {
    expect(helpers_1.getCounterValue(largeCounterTitle)).toEqual('8,756');
});
//# sourceMappingURL=helpers.test.js.map