var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var sourcemaps = require('gulp-sourcemaps')

gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: ['app', 'dist']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/*.html').on('change', browserSync.reload)
})

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
})

gulp.task('default', ['serve'])
