'use strict';

// import
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import WP from 'wp-cli';
import babelify from 'babelify';
import watch from 'gulp-watch';

// const
const SRC = './src';
const CONFIG = './src/config';
const HTDOCS = './';
const BASE_PATH = '';
const DEST = `${HTDOCS}${BASE_PATH}`;
const HOST = '0.0.0.0';
const PORT = 8080;

// css
gulp.task('postcss', () => {
    return gulp.src(`${SRC}/pcss/style.pcss`)
        .pipe(postcss([
          require('postcss-easy-import')({
            prefix: '_',
            extensions: '.pcss',
          }),
          require('postcss-extend'),
          require('postcss-sassy-mixins'),
          require('postcss-nested'),
          require('postcss-nesting'),
          require('postcss-advanced-variables'),
          require('postcss-transform-shortcut'),
          require('postcss-assets')({
            loadPaths: [ 'images/' ],
            basePath: '../',
            relative: './',
          }),
          require('postcss-calc'),
          require('postcss-strip-inline-comments'),
          require('css-mqpacker'),
          require('autoprefixer')({
            browsers: [
              'ie >= 10',
              'ios >= 8',
              'android >= 4.0'
            ]
          }),
        ], { syntax: require('postcss-scss') }))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest(`../`));
});

gulp.task('css', gulp.series('postcss'));

// js
gulp.task('browserify', () => {
    return browserify(`${SRC}/js/script.js`)
        .transform(babelify)
        .bundle()
        .pipe(source('script.js'))
        .pipe(gulp.dest(`../js/`));
});

gulp.task('js', gulp.parallel('browserify'));

gulp.task('wp-server', done => {
  WP.discover({ path: '../../../../' }, WP => {
    WP.server(null, {
      host: HOST,
      port: PORT,
    }, (err, server) => {
      console.log(err, server);
    });
    done();
  });
});


gulp.task('reload', done => {
  browserSync.reload();
  done();
})
// serve
gulp.task('browser-sync', done => {
  browserSync({
    proxy: `${HOST}:${PORT}/`,
    ghostMode: false,
  })
  watch([`${SRC}/pcss/**/*.pcss`], gulp.series('postcss', 'reload'));
  watch([`${SRC}/js/**/*.js`], gulp.series('browserify', 'reload'));
  watch([`./../**/*.php`], gulp.series('reload'));
  done();
});

gulp.task('serve', gulp.series('wp-server', 'browser-sync'));

// default
gulp.task('build', gulp.parallel('css', 'js'));
gulp.task('default', gulp.series('build', 'serve'));
