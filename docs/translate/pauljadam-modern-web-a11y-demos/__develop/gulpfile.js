'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const browser = require('browser-sync').create();
const browserReload = () => {
    browser.reload();
};


browser.init({
    server: {
        baseDir: '../'
    }
});


gulp.task('BUILD_EJS', () => {
    browserReload();

    return gulp.src([
        './ejs/**/*.ejs',
        '!./ejs/**/_*.ejs'
    ])
        .pipe(plumber())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(ejs())
        .pipe(gulp.dest('../'));
});


gulp.task('default', () => {
    gulp.watch('./ejs/**/*.ejs', gulp.task('BUILD_EJS'));
});
