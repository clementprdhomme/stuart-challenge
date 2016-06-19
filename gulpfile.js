var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postcssHexRbga = require('postcss-hexrgba');
var postcssImport = require('postcss-import');
var postcssMediaMinmax = require('postcss-media-minmax');
var postcssNested = require('postcss-nested');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssExtend = require('postcss-extend');
var postcssCalc = require("postcss-calc");
var cssmin = require('gulp-cssmin');

var htmlmin = require('gulp-htmlmin');

var del = require('del');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('css', function () {
  var processors = [
    autoprefixer({ browsers: '> 5%' }),
    postcssImport,
    postcssSimpleVars,
    postcssCalc({ mediaQueries: true }),
    postcssHexRbga,
    postcssExtend,
    postcssNested,
    postcssMediaMinmax
  ];

  return gulp.src('src/styles/main.css')
      .pipe(postcss(processors))
      .pipe(cssmin())
      .pipe(gulp.dest('dist/'))
      .pipe(reload({ stream: true }));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(reload({ stream: true }));
});

gulp.task('clean', function() {
  return del('dist/**/*');
});

gulp.task('images', function() {
  return gulp.src([ 'src/images/**/*' ])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('js', function() {
  return gulp.src([ 'src/main.js' ])
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.css', [ 'css' ])
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });
    gulp.watch('src/**/*.html', [ 'html' ])
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });

    gulp.watch('src/main.js', [ 'js' ])
      .on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });
});

gulp.task('default', [ 'clean', 'images', 'css', 'js', 'html',  'serve', 'watch' ]);
