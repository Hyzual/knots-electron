'use strict';

var electron = require('electron');
var ipc      = require('electron').ipcMain;
var dialog   = require('electron').dialog;

// Module to control application life.
var app           = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    filters: [
      { name: 'Javascript files', extensions: ['js'] }
    ]
  }, function (file_paths) {
    if (! file_paths) {
      return;
    }
    var file_path = file_paths[0];

    event.sender.send('selected-file', file_path);
  });
});

ipc.on('open-directory-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (directory_paths) {
    if (! directory_paths) {
      return;
    }
    var directory_path = directory_paths[0];

    event.sender.send('selected-directory', directory_path);
 });
});
