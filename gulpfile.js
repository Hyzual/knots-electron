var gulp     = require('gulp');
var glob     = require('glob-all');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  // gulp.watch('main.js', electron.restart);

  // Reload renderer process
  var files = glob.sync([
  	'main.js',
    'app/style.css',
  	'app/**/*.js',
  	'index.html'
  ]);
  gulp.watch(files, electron.reload);
});
