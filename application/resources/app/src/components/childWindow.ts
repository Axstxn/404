import { BrowserWindow, shell } from 'electron';

/**
 * To create a new child window
 * @param showChild
 * @param htmlUrl
 * @param openInBrowser
 */
export function createChildWindow(
  showChild: boolean,
  htmlUrl: string,
  openInBrowser: boolean,
) {
  const childWindow = new BrowserWindow({
    width: 800,
    height: 200,
  });
  childWindow.loadFile(htmlUrl);
  if (openInBrowser) {
    childWindow.webContents.on('new-window', function (event, url) {
      event.preventDefault();
      shell.openExternal(url);
    });
  }
}
