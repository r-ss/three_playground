var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');

var sassStyle = 'expanded'; // Type: String Default: nested Values: nested, expanded, compact, compressed

var basePaths = {
    src: 'src/',
    dest: 'build/'
};

var paths = {
    images: {
        src: basePaths.src + 'gfx/',
        dest: basePaths.dest + 'gfx/'
    },
    js: {
       src: basePaths.src + 'js/',
       dest: basePaths.dest + 'js'
    },
    html: {
        src: basePaths.src,
        dest: basePaths.dest
    },
    styles: {
        src: basePaths.src,
        dest: basePaths.dest
    },
    fonts: {
        src: basePaths.src + 'fonts/',
        dest: basePaths.dest + 'fonts/'
    },
};

gulp.task('default', ['watch']);


gulp.task('sass:watch', function(){
  return gulp.src(paths.styles.src + '*.scss')
    .pipe(sass({outputStyle: sassStyle, precision: 3})) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(paths.styles.src))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('watch', ['browserSync', 'sass:watch'], function (){
  gulp.watch(paths.styles.src + '*.scss', ['sass:watch']);
  gulp.watch(basePaths.src + '*.html', browserSync.reload); 
  gulp.watch(basePaths.src + '*.js', browserSync.reload);
})


gulp.task('build', function (callback) {
  runSequence('clean:destination', ['css', 'useref'], callback) // build regular
})

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: basePaths.src
    },
    browser: 'google chrome'
  })
})

gulp.task('useref', function(){
  return gulp.src([paths.html.src + '*.+(html|js)'])
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(paths.html.dest))
});


// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
  'Firefox >= 14'
];

gulp.task('css', function() {
  return gulp.src(paths.styles.src + '*.scss')
    .pipe(sass({ style: 'expanded', })) // Type: String Default: nested Values: nested, expanded, compact, compressed
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))    
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest))
});


gulp.task('clean:destination', function() {
  del(basePaths.dest + '*');
})