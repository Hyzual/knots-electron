/*
 * Copyright (C) 2016  Joris "Hyzual" MASSON
 *
 * This file is part of knots-electron.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var electron = require('electron');
var ipc      = require('electron').ipcMain;
var dialog   = require('electron').dialog;

var app           = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
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
