// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

const ALLOWED_URLS_FOR_NEW_WINDOW = [
    "https://accounts.google.com/AccountChooser?service=mail&continue=https://mail.google.com/mail/",
    "https://accounts.google.com/AddSession?hl=en&continue=https://mail.google.com/mail&service=mail"
]

const REPLACE_URLS = [
    "mail.google.com"
]

const webview = document.querySelector('webview')
webview.addEventListener('dom-ready', () => {
  webview.openDevTools()
})

webview.addEventListener('new-window', (event) => {
    if (ALLOWED_URLS_FOR_NEW_WINDOW.find(url => url === event.url)){
        const win = new BrowserWindow({
          webContents: event.options.webContents, // use existing webContents if provided
          show: false
        })
        win.once('ready-to-show', () => win.show())
        if (!event.options.webContents) {
          win.loadURL(event.url, {userAgent: 'Chrome'}) // existing webContents will be navigated automatically
        }
        event.newGuest = win
        win.webContents.on('did-stop-loading', () => {
            let title = win.webContents.getTitle()
            if (title.search('- Inbox') > -1) {
                win.close()
                location.reload()
            }
          })
    }
    else if (REPLACE_URLS.find(url => event.url.search(url) > -1)) {
        webview.loadURL(event.url)
    }
})