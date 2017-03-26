var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var envify = require('envify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var scp = require('gulp-scp2');

gulp.task('build', function () {
    return browserify({entries: './src/index.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {
            presets: ['es2015', 'react', 'stage-1'], 
            plugins: ['transform-decorators-legacy']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('watch', ['build'], function () {
    gulp.watch('*.jsx', ['build']);
});

gulp.task('min-css', function() {
    return gulp.src('./src/styles/*.css')
        .pipe(concat('food-journal-styles.css.min'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['apply-prod-environment', 'build']);
gulp.task('css', ['min-css']);
