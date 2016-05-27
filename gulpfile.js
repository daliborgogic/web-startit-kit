var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: ['.tmp', 'app']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
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

gulp.task('default', ['serve'])
