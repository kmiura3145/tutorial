var requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse:true});


//const config = require('./script/config');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require("gulp-sass-glob");
const browser = require("browser-sync");
const ssi = require("browsersync-ssi");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const spritesmith = require("gulp.spritesmith");
const notify = require("gulp-notify");
const convertEncoding = require("gulp-convert-encoding");
const replace = require('gulp-replace');
const ejs = require('ejs');

gulp.task("default", ["sprite" , "html", "sass", "js", "server"], function(){
//	gulp.watch(["html/**/*.html", "html/common/inc/*.txt"], browser.reload);
	gulp.watch(["pc/_dev/html/*.html"], browser.reload);
	gulp.watch(["pc/_dev/html/*.html"], ["html"]);
//	gulp.watch(".dev/img/sprite-images/*", ["sprite"]);
	gulp.watch("pc/_dev/scss/*.scss", ["sass"]);
	gulp.watch("pc/_dev/scss/*/*.scss", ["sass"]);
//	gulp.watch("html/_dev/js/uncompressed/**/*.js", ["js"]);
});

// pc使用
gulp.task("pc", ["sass", "server" ], function(){
	gulp.watch(["pc/_dev/html/*.html"], browser.reload);
	gulp.watch("pc/**/*.scss", ["sass"]);
});

gulp.task("sprite", function(){
	var spriteData = gulp.src("pc/_dev/img/sprite-images/test/*").pipe(spritesmith({
		imgName: "sprite.png",
		cssName: "_sprite.scss",
		imgPath: "pc/dest/common/img/sprite.png",
		cssFormat: "scss",
		padding: 4,
		algorithm: 'binary-tree',
		cssVarMap: function(sprite){
			sprite.name = "sprite-" + sprite.name;
		}
	}));
	spriteData.img.pipe(gulp.dest("pc/html/common/img"));
	spriteData.css.pipe(gulp.dest("pc/_dev/scss"));
});

// html
gulp.task('html', function () {
  gulp.src('pc/_dev/html/*.html')
    .pipe(gulp.dest('pc/dest/'));
});

// sass
gulp.task('sass', function () {
  gulp.src('pc/_dev/scss/*.scss')
	.pipe(sassGlob())
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: "expanded" })) //outputStyle: "compressed" にすると圧縮
	.pipe(autoprefixer())
	.pipe(sourcemaps.write(""))
    .pipe(gulp.dest('pc/dest/common/css'))
	.pipe(browser.stream());
});

// html
gulp.task('js', function () {
  gulp.src('pc/_dev/js/*.js')
    .pipe(gulp.dest('pc/dest/common/js'));
});


// server 立ち上げ
gulp.task("server", function(){
	browser({
		ghostMode: false,
		server: {
			baseDir: "pc/dest",
			middleware: [ ssi({ baseDir: "pc/dest", ext: ".html" }) ]
		}
	});
});

// Shift_JIS変換
gulp.task("convertEncoding", function(){
	gulp.src("pc/*.html")
		// ファイル内のencode指定を置換する
		.pipe(replace(/(utf|UTF)-8/, "Shift_JIS"))
		// 実際にファイルのencodeを変換する
		.pipe(convertEncoding({to: "Shift_JIS"}))
		.pipe(gulp.dest("pc-SJIS"));

	gulp.src("pc/css/*.css")
		.pipe(convertEncoding({to: "shift_jis"}))
		.pipe(gulp.dest("pc-SJIS/css"));

	gulp.src("pc/js/*.js")
		.pipe(convertEncoding({to: "shift_jis"}))
		.pipe(gulp.dest("pc-SJIS/lib/js"));
	return
}); 

