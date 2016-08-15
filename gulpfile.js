'use strict';

var gulp = require('gulp');
var process = require('child_process');

gulp.task('default', ['webpack'], function () {
    gulp.watch(['./src/**/*.*', './scss/**/*.*', './extension/**/*.*'], ['webpack']);
});

gulp.task('webpack', function () {
    process.exec('webpack');
    process.exec('webpack -p -d', function (err, stdout, stderr) {
        if (/ERROR in/.test(stdout)) {
            console.error(stdout);
        } else {
            console.info('Webpack success!');
        }
    });
});