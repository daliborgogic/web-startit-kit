var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var standard = require('gulp-standard')
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var psi = require('psi')
var site = 'https://daliborgogic.com'

// Synchronised browser testing
// https://www.browsersync.io/
gulp.task('serve', ['sass', 'standard', 'concat'], function () {
  browserSync.init({
    server: ['./app', './.tmp']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/js/*.js', ['standard', 'concat'])
  gulp.watch('.tmp/js/*js').on('change', browserSync.reload)
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
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.stream())
})

// No decisions to make. No .eslintrc, .jshintrc, or .jscsrc files to manage
// https://github.com/feross/standard
gulp.task('standard', function () {
  return gulp.src(['./app/js/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('concat', function () {
  return gulp.src('app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/js'))
})

gulp.task('clean', function () {
  return gulp.src([
    'node_modules',
    'app/bower_components'
  ])
    .pipe(clean({force: true}))
})

gulp.task('mobile', function () {
  return psi(site, {
    nokey: true,
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: key
    strategy: 'mobile'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score)
    console.log('Usability score: ' + data.ruleGroups.USABILITY.score)
    console.log('Page Stats: ', data.pageStats)
  })
})

gulp.task('desktop', function () {
  return psi(site, {
    nokey: true,
    // key: 'YOUR_API_KEY'
    strategy: 'desktop'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score)
    console.log('Page Stats: ', data.pageStats)
  })
})

gulp.task('default', ['serve'])
