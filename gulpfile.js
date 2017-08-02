const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const exec = require('child_process').exec
const runSequnce = require('run-sequence')

gulp.task('hugo-build', (cb)=>{
    exec('hugo',(err,stdout,stderr)=>{
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

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