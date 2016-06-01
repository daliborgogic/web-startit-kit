var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var standard = require('gulp-standard')
var clean = require('gulp-clean')

// Synchronised browser testing
// https://www.browsersync.io/
gulp.task('serve', ['sass', 'standard'], function () {
  browserSync.init({
    server: ['./app']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/js/*.js', ['standard'])
  gulp.watch('app/*.html').on('change', browserSync.reload)
})

// Compile your Sass
// https://github.com/dlmanning/gulp-sass
gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed', precision: 10}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
})

// No decisions to make. No .eslintrc, .jshintrc, or .jscsrc files to manage
// https://github.com/feross/standard
gulp.task('standard', function () {
  return gulp.src(['./app/js/main.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('clean', function () {
  return gulp.src([
    'node_modules',
    'app/bower_components'
  ])
    .pipe(clean({force: true}))
})

gulp.task('default', ['serve'])
