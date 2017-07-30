const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const shell= require('gulp-shell')
const runSequnce = require('run-sequence')

gulp.task('hugo-build', shell.task['hugo'])

gulp.task('minify-html', ()=>{
    return gulp.src('public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true,
            minifyCSS:true,
            minifyJS:true,
            removeComments: true,
            useShortDoctype: true
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('build', ['hugo-build'], (callback)=>{
    runSequnce('minify-html', callback)
})