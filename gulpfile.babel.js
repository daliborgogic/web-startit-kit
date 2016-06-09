const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const standard = require('gulp-standard')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const copy = require('gulp-copy')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const runSequence = require('run-sequence')
const del = require('del')
const fs = require('fs')

// Synchronised browser testing
// https://www.browsersync.io/
gulp.task('serve', ['sass', 'concat'], () => {
  browserSync.init({
    server: ['./app', './.tmp']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/js/*.js', ['standard', 'concat'])
  gulp.watch('.tmp/js/*js').on('change', browserSync.reload)
  gulp.watch('app/*.html').on('change', browserSync.reload)
})

gulp.task('serve:dist', () => {
  browserSync.init({
    server: ['dist']
  })
  gulp.watch('app/sass/*.scss', ['sass'])
  gulp.watch('app/js/*.js', ['standard', 'concat'])
  gulp.watch('.tmp/js/*js').on('change', browserSync.reload)
  gulp.watch('app/*.html').on('change', browserSync.reload)
})

// Compile your Sass
// https://github.com/dlmanning/gulp-sass
gulp.task('sass', () => gulp.src('./app/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'nested', precision: 10}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 versions']}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('.tmp/css'))
  .pipe(browserSync.stream())
)
gulp.task('sassDist', () => gulp.src('./app/sass/**/*.scss')
  .pipe(sass({outputStyle: 'compressed', precision: 10}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 versions']}))
  .pipe(gulp.dest('.tmp/css'))
)

// https://www.npmjs.com/package/gulp-imagemin
gulp.task('images', () => gulp.src('app/img/*')
  .pipe(imagemin({
    // progressive: true,
    // interlaced: true
  }))
  .pipe(gulp.dest('dist/img'))
)

gulp.task('minify', () => gulp.src('app/*.html')
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true
  }))
  .pipe(gulp.dest('dist'))
)

gulp.task('compress', () => gulp.src('.tmp/js/main.js')
  .pipe(uglify())
  .pipe(gulp.dest('.tmp/js/'))
)

gulp.task('concat', () => gulp.src([
  'app/js/base.js',
  'app/js/second.js'
])
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('.tmp/js'))
)

gulp.task('copy', () => gulp.src([
  '.tmp/**/*'
])
  .pipe(gulp.dest('dist'))
)

gulp.task('clean', () => gulp.src([
  'dist'
])
  .pipe(clean({force: true}))
)

// development task
gulp.task('default', ['serve'])

// production task
gulp.task('production', ['clean'], cb => runSequence([
  'sassDist',
  'concat',
  'compress',
  'minify',
  'copy',
  'images'
],
  cb
)
)

gulp.task('serve:production', ['serve:dist'])
