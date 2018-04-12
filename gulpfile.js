var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var notify = require("gulp-notify");
var jsValidate = require('gulp-jsvalidate');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

gulp.task('compress-js', function() {
    return gulp.src('Resources/Private/JavaScript/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('Resources/Public/JavaScript'));
});

gulp.task('scss', function(){
    return gulp.src(['Resources/Private/Scss/lektorat/**/*.scss'])
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('Resources/Public/Css/'))
});

gulp.task('css', function() {
    return gulp.src(['Resources/Private/Css/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('Resources/Public/Css/'))
});

gulp.task('minimg', function(){
    return gulp.src(['Resources/Private/Images/**/*.{jpg,png,gif,svg}',
                     'Resources/Public/Icons/**/*.{jpg,png,gif}' ])
      .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true }))
      .pipe(gulp.dest('Resources/Public/Images/'));
});

gulp.task('valid', function () {
    return gulp.src("Resources/Public/JavaScript/**/*.js")
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(jsValidate());
});

gulp.task('watch', function(){
    gulp.watch('Resources/Private/Css/**/*.css', ['css']);
    gulp.watch('Resources/Private/Scss/**/*.scss', ['scss']);
    gulp.watch('Resources/Public/JavaScript/**/*.js',['valid']);
    gulp.watch('Resources/Private/JavaScript/**/*.js',['compress-js']);
    gulp.watch('Resources/Private/Images/**/*.{jpg,png,gif,svg}', ['minimg']);
});

gulp.task('build', ['css', 'scss', 'valid', 'compress-js', 'minimg']);

gulp.task('default', ['build', 'watch']);
