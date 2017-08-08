var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// for SASS
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var csslint = require('gulp-csslint');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var bless = require('gulp-bless');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var svgfallback = require('gulp-svgfallback');
var cheerio = require('gulp-cheerio');
var path = require('path');
var replace = require('gulp-replace');
var rewrite = require('gulp-rewrite-css');
var autoprefixer = require('gulp-autoprefixer');
var gsize = require('gulp-size');
var parker = require('gulp-parker');
var inject = require('gulp-inject-string');
var purify = require('gulp-purifycss');


var config = {
  	entryFile: './src/app.js',
  	outputDir: './dist/',
  	outputFile: 'app.js',
},
basePaths = {
	src: 'src/',
	dest: 'dist/'
},
paths = {
    scripts: {
        src: basePaths.src + 'assets/scripts/',
        dest: basePaths.dest + 'assets/scripts/'
    },
    styles: {
        src: basePaths.src + 'assets/styles/',
        dest: basePaths.dest + 'assets/styles/'
    },
    svg: {
        src: basePaths.src + 'assets/sources/svg/',
        dest: basePaths.dest + 'assets/svg/'
    },
    images: {
        src: basePaths.src + 'assets/images/',
        dest: basePaths.dest + 'assets/images/'
    }
},

// prefix/suffix
filePrefix = "ko.",
classPrefix = "ko-",
minSuffix = ".min",

// csslint
csslintWarning = {
    "important": false,
    "adjoining-classes": false,
    "known-properties": true,
    "box-sizing": false,
    "box-model": false,
    "overqualified-elements": false,
    "display-property-grouping": false,
    "bulletproof-font-face": false,
    "compatible-vendor-prefixes": false,
    "regex-selectors": false,
    "errors": true,
    "duplicate-background-images": false,
    "duplicate-properties": true,
    "empty-rules": false,
    "selector-max-approaching": false,
    "gradients": false,
    "fallback-colors": false,
    "font-sizes": false,
    "font-faces": false,
    "floats": false,
    "star-property-hack": false,
    "outline-none": false,
    "import": false,
    "ids": false,
    "underscore-property-hack": false,
    "rules-count": false,
    "qualified-headings": false,
    "selector-max": false,
    "shorthand": false,
    "text-indent": false,
    "unique-headings": false,
    "universal-selector": false,
    "unqualified-attributes": false,
    "vendor-prefix": false,
    "zero-units": false
};

// clean the output directory
gulp.task('clean', function(cb){
	rimraf(config.outputDir, cb);
});


var bundler;
function getBundler() {
  if (!bundler) {
	bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle() {
  return getBundler()
	.transform(babelify)
	.bundle()
	.on('error', function(err) { console.log('Error: ' + err.message); })
	.pipe(source(config.outputFile))
	.pipe(gulp.dest(config.outputDir))
	.pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean'], function() {
	gulp.start('web-deploy')
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
	server: {
	  baseDir: './'
	}
  });

  getBundler().on('update', function() {
	gulp.start('build-persistent')
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
	server: {
	  baseDir: './'
	}
  });
});


// Cleaning... (Deletes the styles distribution folder)
gulp.task('clean-styles', function () {
    gutil.log(gutil.colors.yellow('Cleaning styles package...'));
    return gulp.src(paths.styles.dest, {read: false})
        .pipe(clean());
});

// Cleaning... (Deletes the scripts distribution folder)
gulp.task('clean-scripts', function () {
    gutil.log(gutil.colors.yellow('Cleaning scripts package...'));
    return gulp.src(paths.scripts.dest, {read: false})
        .pipe(clean());
});

// Cleaning... (Deletes the svgs distribution folder)
gulp.task('clean-svgs', function () {
    gutil.log(gutil.colors.yellow('Cleaning svgs package...'));
    return gulp.src(paths.svg.dest, {read: false})
        .pipe(clean());
});

// Cleaning... (Deletes the images distribution folder)
gulp.task('clean-imgs', function () {
    gutil.log(gutil.colors.yellow('Cleaning images package...'));
    return gulp.src(paths.images.dest, {read: false})
        .pipe(clean());
});

// Styles... (Minifies and merges CSS files)
gulp.task('tasks-css', ['clean-styles'], function() {
    gutil.log(gutil.colors.yellow('Gulping CSS...'));
    gulp.src(paths.styles.src + 'style.scss')
        .pipe(sass({errLogToConsole: true}).on('error', sass.logError))
        .pipe(csslint(csslintWarning))
        .pipe(csslint.reporter())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gsize({title:"CSS", showFiles: true}))
        .pipe(rename({
            basename: "core",
            prefix: filePrefix
        }))
        .pipe(bless())
        .pipe(replace('@charset "UTF-8";', ''))
        //.pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.styles.dest));
});

// SVG task... (Combines all svg sources into single svg file with <symbol> elements)
gulp.task('tasks-svg', ['clean-svgs'], function () {
    return gulp
        .src(paths.svg.src + '**/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    },
                    {
                        removeComments: true
                    },
                    {
                        convertStyleToAttrs: true
                    },
                    {
                        removeHiddenElems: true
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        removeAttrs: true
                    },
                    {
                        removeUselessStrokeAndFill: true
                    },
                    {
                        collapseGroups: true
                    }
                ]
            }
        }))
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(cheerio({
            run: function ($, file) {
                $('svg').addClass(classPrefix + 'to-hide');
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(rename("icons.svg"))
        .pipe(gulp.dest(paths.svg.dest));
});

// jQuery task... (moves jQuery from src to dist folder)
gulp.task('move-jquery', ['clean-scripts'], function() {
    gulp.src(paths.scripts.src + 'vendors/jquery.min.js')
        .pipe(gulp.dest(paths.scripts.dest));
});

// variables task... (moves variables.js from src to dist folder)
gulp.task('move-variables', ['clean-scripts'], function() {
    gulp.src(paths.scripts.src + 'core/variables.js')
        .pipe(rename({
            basename: "variables",
            prefix: filePrefix
        }))
        //.pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
        .pipe(gulp.dest(paths.scripts.dest))
        //.pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename({
            basename: "variables",
            prefix: filePrefix,
            suffix: minSuffix
        }))
        //.pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dest));
});

// UI Scripts... (Minifies and merges JS script files)
gulp.task('ui-js-files', ['clean-scripts'], function() {
    gutil.log(gutil.colors.yellow('Gulping All JS files together...'));
    return gulp.src([
            '!' + paths.scripts.src + 'vendors/jquery.min.js',
            '!' + paths.scripts.src + 'core/variables.js',
            '!' + paths.scripts.src + 'modules/*.js',
            '!' + paths.scripts.src + 'vendors/ie/**/*.js',
            paths.scripts.src + 'core/variables.js', // variables first - very important
            paths.scripts.src + 'core/init.js', // init in second
            paths.scripts.src + 'utils/**/*.js', // everything inside /utils/
            paths.scripts.src + 'vendors/bootstrap.modal.js', // modal vendor
            paths.scripts.src + 'modules/modal.js', // modal extend
            paths.scripts.src + 'vendors/timeline.js',  // timeline
        ])
        .pipe(concat(filePrefix + 'ui.js'))
        .pipe(rename({
            basename: "ui",
            prefix: filePrefix
        }))
        //.pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
        .pipe(gulp.dest(paths.scripts.dest))
        //.pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename({
            basename: "ui",
            prefix: filePrefix,
            suffix: minSuffix
        }))
        //.pipe(inject.prepend('<!-- Created: ' + Date() + ' -->\n'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dest));
});



// Move images from src to dist
gulp.task('move-imgs', ['clean-imgs'], function() {
    gulp.src(paths.images.src + '**/*.**')
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('css-purify', ['tasks-css'], function() {
  gulp.src(paths.styles.dest + '*.css')
    .pipe(purify([paths.scripts.dest + '*.js', '*.html']))
    .pipe(gulp.dest(paths.styles.dest));
});

// REPORT (Parker)
gulp.task('report', function() {
    gutil.log(gutil.colors.yellow('Analyzing...'));
    gulp
        .src(paths.styles.dest + '*.css')
        .pipe(parker());
});

// CSS
gulp.task('css', ['clean-styles', 'tasks-css', 'css-purify']);

// JS
gulp.task('js', ['clean-scripts', 'move-jquery', 'move-variables', 'ui-js-files', 'tasks-vendors-ie-js']);

// SVG
gulp.task('svg', ['clean-svgs', 'tasks-svg']);

// IMAGES
gulp.task('images', ['clean-imgs', 'move-imgs']);

// CSS + JS + SVG
gulp.task('web-deploy', ['css', 'svg', 'images']);


