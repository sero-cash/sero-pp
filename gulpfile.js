#!/usr/bin/env node

'use strict';

var version = require('./lib/version.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var bower = require('bower');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');

var DEST = path.join(__dirname, 'dist/');
var src = 'index';
var dst = 'sero-pp';
var lightDst = 'sero-pp-light';

var browserifyOptions = {
    debug: true,
    insert_global_vars: false, // jshint ignore:line
    detectGlobals: false,
    bundleExternal: true
};


gulp.task('version',  function(done){
  gulp.src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  gulp.src(['./bower.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  // gulp.src(['./package.js'])
  //   .pipe(replace(/version\: \'([\.0-9]*)\'/, "version: '"+ version.version + "'"))
  //   .pipe(gulp.dest('./'));
    console.log('version done');
    done();
});

gulp.task('bower', gulp.series('version',function(cb){
    bower.commands.install().on('end', function (installed){
        console.log(installed);
        cb();
    });
}));

gulp.task('lint', function(){
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', gulp.series('lint' ,function(cb) {
    del([ DEST ]).then(cb.bind(null, null));
}));

gulp.task('light', gulp.series('clean',function() {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'sero-pp'})
        .add('./' + src + '.js')
        .bundle()
        .pipe(exorcist(path.join( DEST, lightDst + '.js.map')))
        .pipe(source(lightDst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(lightDst + '.min.js'))
        .pipe(gulp.dest( DEST ));
}));

gulp.task('standalone', gulp.series('clean', function()  {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'sero-pp'})
        .add('./' + src + '.js')
        .ignore('crypto')
        .bundle()
        .pipe(exorcist(path.join( DEST, dst + '.js.map')))
        .pipe(source(dst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(dst + '.min.js'))
        .pipe(gulp.dest( DEST ));
}));

gulp.task('watch', function() {
    gulp.watch(['./lib/*.js'], ['lint', 'build']);
});

gulp.task('default',gulp.series('version','lint','clean','light','standalone', function (done) {
    console.log('build done!');
    done();
}));

