'use strict';

var gulp = require('gulp');
var process = require('child_process');

gulp.task('default', ['webpack'], function() {
    gulp.watch(['./src/**/*.*', './extension/**/*.*'], ['webpack']);
});

gulp.task('webpack', function() {
    process.exec('"node_modules/.bin/webpack"');
    process.exec('"node_modules/.bin/webpack" -p -d', function(err, stdout, stderr) {
        if (/ERROR in/.test(stdout)) {
            console.error(stdout);
        } else {
            console.info('Webpack success!');
        }
    });
});