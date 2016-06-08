const electron = require('electron')
//const ipc = require('ipc')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow



app.on('ready', () => {
    var mainWindow = new BrowserWindow({
        width: 1024,
        height: 768
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    //mainWindow.loadURL('http://intranet')        

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('ping', 'whoooooooh!');
    });

    electron.powerMonitor.on('suspend', () => {
        console.log('The system is going to sleep');
    });

    const idle = require('./idle.js')
    setInterval(()=> 
        mainWindow.webContents.send('ping', idle.getIdleTimeInMs() + new Date())
    , 5 * 1000)
});    

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
