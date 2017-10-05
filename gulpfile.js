var gulp = require('gulp');
var sass = require('gulp-sass');
var browser = require("browser-sync");
var ssi = require("browsersync-ssi");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var spritesmith = require("gulp.spritesmith");
var notify = require("gulp-notify");

gulp.task("default", ["sprite", "sass", "server"], function(){
//	gulp.watch(["html/**/*.html", "html/common/inc/*.txt"], browser.reload);
	gulp.watch(["html/*.html"], browser.reload);
	gulp.watch(".dev/img/sprite-images/*", ["sprite"]);
	gulp.watch(".dev/scss/*.scss", ["sass"]);
//	gulp.watch("html/_dev/js/uncompressed/**/*.js", ["js"]);

});

gulp.task("sprite", function(){
	var spriteData = gulp.src("_dev/img/sprite-images/*").pipe(spritesmith({
		imgName: "sprite.png",
		cssName: "_sprite.scss",
		imgPath: "html/img/sprite.png",
		cssFormat: "scss",
		padding: 4,
		algorithm: 'binary-tree',
		cssVarMap: function(sprite){
			sprite.name = "sprite-" + sprite.name;
		}
	}));
	spriteData.img.pipe(gulp.dest("html/common/img"));
	spriteData.css.pipe(gulp.dest("_dev/scss"));
});

gulp.task('sass', function () {
  gulp.src('_dev/scss/*.scss')
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: "expanded" })) //outputStyle: "compressed" にすると圧縮
	.pipe(autoprefixer())
	.pipe(sourcemaps.write(""))
    .pipe(gulp.dest('html/common/css'))
	.pipe(browser.stream());
});

gulp.task("server", function(){
	browser({
		ghostMode: false,
		server: {
			baseDir: "html",
			middleware: [ ssi({ baseDir: "html", ext: ".html" }) ]
		}
	});
});




    
    