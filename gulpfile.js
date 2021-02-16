const gulp = require('gulp');
const sass = require('gulp-sass')
const uglifycss = require('gulp-uglifycss');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Sass compiler
gulp.task('sass', done => {
    gulp.src('src/style/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/style'))
        .pipe(gulp.dest('dist/style'));
    done();
})

// CSS minifier
gulp.task('css', done => {
    gulp.src('dist/style/style.css')
        .pipe(uglifycss({
            "uglyComments": true
        }))
        .pipe(gulp.dest('dist/style'))
    done();
})

// JS transpiler
gulp.task('js', done => {
    gulp.src('src/js/main.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/js'));
    done();
})

// JS minifier
gulp.task('js-min', done => {
    gulp.src('dist/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
    done();
})

// HTML tracker
gulp.task('html', done => {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
    done();
})

// Image tracker
gulp.task('img', done => {
    gulp.src('src/img/**/*.+(png|jpeg)')
        .pipe(gulp.dest('dist/img'));
    done();
})

// File watcher that calls the above functions
gulp.task('watch', function() {
    gulp.watch('src/style/**/*.scss', gulp.series(['sass']));
    gulp.watch('src/js/main.js', gulp.series(['js']));
    gulp.watch('src/index.html', gulp.series(['html']));
    gulp.watch('src/img/**/*.+(png|jpeg)', gulp.series(['img']));
});