// Globals
var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    combineMQ       = require('gulp-merge-media-queries'),
    nunjucks        = require('gulp-nunjucks'),
    prettify        = require('gulp-html-prettify'),
    plumber         = require('gulp-plumber'),
    lazypipe        = require('lazypipe'),
    runSequence     = require('run-sequence'),
    browserSync     = require('browser-sync').create();

// Error handler to print the errors in the console.
var errorHandler = function (error) {
    console.error(error.message);
    this.emit('end');
};


// ### CSS processing pipeline
// Example
// ```
// gulp.src(cssFiles)
//   .pipe(cssTasks())
//   .pipe(gulp.dest(path))
// ```
var cssTasks = function () {
    return lazypipe()
        .pipe(plumber)
        .pipe(sass, {
            outputStyle: 'expanded',
            sourceMap: false,
            errLogToConsole: true
        })
        .pipe(combineMQ)
        .pipe(autoprefixer, {
            browsers: ['last 2 version']
        })().on('error', errorHandler);
};

// ### CSS
// `gulp css` - Compile styles.
gulp.task('css', function () {
    return gulp.src('assets/scss/style.scss')
        .pipe(cssTasks())
        .pipe(gulp.dest('./assets/css/'));
});


// ### HTML
// `gulp html` - Compile the html templates.
gulp.task( 'html', function() {
    return gulp.src(['views/**/*.html', '!views/utils/*.html', '!views/layouts/*.html', '!views/partials/*.html'])
        .pipe(plumber())
        .pipe(nunjucks.compile())
        .pipe(prettify()).on('error', errorHandler)
        .pipe(gulp.dest('./'));
});


// ### Build
// `gulp build` - Run all the build tasks.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task('build', function (callback) {
    return runSequence(
        'html',
        callback
    );
});


// ### Watch
// `gulp watch [--proxy wordpress.dev]` - When a modification is made to
// an asset, run the build step for that asset. Also reload the browser.
gulp.task( 'watch', ['build'], function() {
    var config = {};

    config.server = {
        baseDir: './'
    };

    browserSync.init(config);

    gulp.watch(['assets/scss/**/*'], ['css']);
    gulp.watch(['views/**/*.html'], ['html']);
    gulp.watch(['./*.html', 'assets/css/**/*', 'assets/js/**/*']).on('change', browserSync.reload);
});


// ### Gulp
// `gulp` - Run a complete build and watch.
gulp.task( 'default', function() {
    gulp.start( 'watch' );
});