const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const merge = require('merge-stream');
const del = require('del');

const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const newer = require('gulp-newer');
const sass = require('gulp-sass');

// Browser
const sync = () => {
  browserSync.init({
    server: { baseDir: './' },
  });
};

// Styles
const styles = () => {
  return merge(
    src('src/scss/*.scss').pipe(sass()),
    src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
    ])
  )
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('template.min.css'))
    .pipe(cleancss())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('css/'))
    .pipe(browserSync.stream());
};

// Scripts
const scripts = () => {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    'src/js/template.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('template.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('js/'))
    .pipe(browserSync.stream());
};

// Images
const images = () => {
  return src('src/img/**/*')
    .pipe(newer('img/'))
    .pipe(imagemin())
    .pipe(dest('img/'));
};

// Watch
const watcher = () => {
  watch('src/scss/*.scss', styles);
  watch('src/js/*.js', scripts);
  watch('src/img/**/*', images);
  watch('./*.html').on('change', browserSync.reload);
};

// Clean
const clean = () => {
  return del(['css/**/*', 'js/**/*', 'img/**/*'], { force: true });
};

// Export
exports.clean = clean;
exports.default = parallel(sync, styles, scripts, images, watcher);
