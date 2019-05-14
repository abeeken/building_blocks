var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var jsnano = require('gulp-minify');
var zip = require('gulp-zip');

var buildName = "sidebar";

var sourceFiles = [
    './*.html',
    'js/*.*',
    'css/*.*',
    'img/*.*'
];

var viewFiles = {
    'default': [
        'views/index.pug',
        'views/about.pug'
    ],
    'sidebar': [
        'views/sidebar/index.pug',
        'views/about.pug'
    ]
}

var jsfiles = [
    'js/parts/globals.js',
    'js/parts/scripts.js'
];

gulp.task('clean', function () {
    return del('dist/'+buildName+'/**/*');
});

gulp.task('makedist', function(){
    return gulp.src(sourceFiles,{ base: '.' })
        .pipe(gulp.dest('dist/'+buildName))
});

gulp.task('makezip', function(){
    return gulp.src('dist/'+buildName+'/**/*')
        .pipe(zip(buildName+'.zip'))
        .pipe(gulp.dest('dist'))
});

gulp.task('sass', function(){
    return gulp.src('sass/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
});

gulp.task('minicss', function(){
    return gulp.src('css/style.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
});

gulp.task('views', function(){
    return gulp.src(viewFiles[buildName])
        .pipe(pug())
        .pipe(gulp.dest('.'))
});

gulp.task('minijs', function(){
    return gulp.src(jsfiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./js'))
        .pipe(jsnano())
        .pipe(gulp.dest('./js'))
});

gulp.task('setDefault', function(done){
    buildName = "default";
    done();
});

gulp.task('setSidebar', function(done){
    buildName = "sidebar";
    done();
});

gulp.task('buildDefault', gulp.series('setDefault', 'clean', 'sass', 'minicss', 'minijs', 'views', 'makedist', 'makezip'), function(){});
gulp.task('buildSidebar', gulp.series('setSidebar', 'clean', 'sass', 'minicss', 'minijs', 'views', 'makedist', 'makezip'), function(){});

gulp.task('watch', function(){
    gulp.watch('sass/*.scss', gulp.series('sass','minicss'));
    gulp.watch('views/**/*.pug', gulp.series('views'));
    gulp.watch('js/parts/*.js', gulp.series('minijs'));
 });