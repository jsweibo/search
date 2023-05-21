const { src, dest, series, watch } = require('gulp');
const del = require('delete');
const browserSync = require('browser-sync').create();

function clean() {
  return del.promise('dist');
}

function cleanForPages() {
  return del.promise('docs');
}

function copy() {
  return src('src/**').pipe(dest('dist'));
}

function copyForPages() {
  return src('src/**').pipe(dest('docs'));
}

function server(cb) {
  browserSync.init(
    {
      server: {
        baseDir: './dist',
      },
      notify: false,
    },
    cb
  );
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function watchChange() {
  watch('src/**', series(copy, reload));
}

const build = series(clean, copy);
const buildForPages = series(cleanForPages, copyForPages);

const dev = series(clean, copy, server, watchChange);

exports.build = build;
exports.buildForPages = buildForPages;
exports.dev = dev;
exports.default = build;
