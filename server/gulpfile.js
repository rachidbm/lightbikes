"use strict";
var gulp = require('gulp');
var jslint = require('gulp-jslint-simple');

gulp.task('default', function() {
  // place code for your default task here
  console.log('Meuh!');
});

 
gulp.task('lint', function () {
    gulp.src('*.js')
        .pipe(jslint.run({
            // project-wide JSLint options 
            continue: true,
            white: true,
            node: true,
            nomen: true,
            plusplus: true,
            vars: true
        }))
        .pipe(jslint.report({
            reporter: require('jshint-stylish').reporter
        }));
});