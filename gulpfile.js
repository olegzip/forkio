const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    pump = require('pump');

gulp.task('copy-html', () => {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'))
});

gulp.task('sass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('autoprefix', ['sass'], () => {
    return gulp.src('./src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css/'));
})

gulp.task('concat-css', ['autoprefix'], function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('minify-css', ['concat-css'], () => {
    return gulp.src('./src/css/style.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('copy-css', ['concat-css'], () =>{
   return gulp.src('./src/css/**/*.css')
       .pipe(gulp.dest('./dist/css/'))
});

gulp.task('concat-js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./src/js/'));
});

gulp.task('minify-js', ['concat-js'], (cb) => {
    pump([
            gulp.src('./src/js/script.js'),
            uglify(),
            gulp.dest('./src/js/')
        ],
        cb
    );
});

gulp.task('copy-js', ['minify-js'], () =>{
    return gulp.src('./src/js/script.js')
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('serve', ['copy-html', 'copy-css', 'copy-js'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('./src/**/*.html', ['copy-html']).on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', ['copy-css']).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', ['copy-js']).on('change', browserSync.reload);

});