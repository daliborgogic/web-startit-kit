var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var standard = require('gulp-standard')

gulp.task('serve', ['sass', 'standard'], function () {
  browserSync.init({
    server: ['.tmp', 'app']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/js/*.js', ['standard'])
  gulp.watch('app/*.html').on('change', browserSync.reload)
})

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({precision: 10}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./tmp/css'))
    .pipe(browserSync.stream())
})

// Checking JavaScript code with the standard syntax
// https://www.npmjs.com/package/gulp-standard
gulp.task('standard', function () {
  return gulp.src(['./app/js/main.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('default', ['serve'])
