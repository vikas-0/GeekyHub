const {task, src, dest, series} = require('gulp')
const htmlmin = require('gulp-htmlmin')
const exec = require('child_process').exec
const runSequnce = require('run-sequence')

task('hugo-build', (cb)=>{
    exec('hugo',(err,stdout,stderr)=>{
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})


task('minify-html', ()=>{
    return src('public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true,
            minifyCSS:true,
            minifyJS:true,
            removeComments: true,
            useShortDoctype: true
        }))
        .pipe(dest('./public'))
})

task('build',series('hugo-build', 'minify-html'))