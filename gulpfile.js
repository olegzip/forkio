const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    pump = require('pump');


gulp.task('copy-html', () => {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('concat-css', () => {
    return gulp.src('./dist/css/**/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minify-css', () => {
    return gulp.src('./dist/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('minify-js', (cb) => {
    pump([
            gulp.src('./dist/js/**/*.js'),
            uglify(),
            gulp.dest('./dist/js/')
        ],
        cb
    );
});

gulp.task('concat-js', () => {
    return gulp.src('./dist/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('serve', ['copy-html', 'sass'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('./src/**/*.html', ['copy-html']).on
    ('change', browserSync.reload);

    gulp.watch('./src/scss/**/*.scss', ['sass']).on
    ('change', browserSync.reload);

    gulp.watch('./src/js/**/*.js').on
    ('change', browserSync.reload);

});

// gulp.watch('./src/**/*.html', ['copy-html']).onchange(browserSync.reload);