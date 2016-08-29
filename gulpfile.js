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

var gulp     = require('gulp');
var glob     = require('glob-all');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  var files = glob.sync([
    'app/style.css',
  	'app/**/*.js',
  	'index.html'
  ]);
  gulp.watch(files, electron.reload);
});
