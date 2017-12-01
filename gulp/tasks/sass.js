var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var config = require('../config');

gulp.task('sass', function(){
	return gulp.src(config.sass.src)
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(sass())
		.pipe(gulp.dest(config.sass.dest))
});
