var gulp = require('gulp');
var sass = require('gulp-sass');
var browser = require("browser-sync");
var ssi = require("browsersync-ssi");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var spritesmith = require("gulp.spritesmith");
var notify = require("gulp-notify");
var convertEncoding = require("gulp-convert-encoding");
var replace = require('gulp-replace');


gulp.task("default", ["sprite", "sass", "server"], function(){
//	gulp.watch(["html/**/*.html", "html/common/inc/*.txt"], browser.reload);
//	gulp.watch(["html/*.html"], browser.reload);
//	gulp.watch(".dev/img/sprite-images/*", ["sprite"]);
//	gulp.watch(".dev/scss/*.scss", ["sass"]);
//	gulp.watch("html/_dev/js/uncompressed/**/*.js", ["js"]);
});

// pc使用
gulp.task("pc", ["sass", "server" ], function(){
	gulp.watch(["pc/**/*.html"], browser.reload);
	gulp.watch(["pc/*.html"], browser.reload);
	gulp.watch("pc/**/*.scss", ["sass"]);
});

gulp.task("sprite", function(){
	var spriteData = gulp.src("pc/_dev/img/sprite-images/test/*").pipe(spritesmith({
		imgName: "sprite.png",
		cssName: "_sprite.scss",
		imgPath: "pc/html/common/img/sprite.png",
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

gulp.task('sass', function () {
  gulp.src('pc/_dev/scss/*.scss')
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: "expanded" })) //outputStyle: "compressed" にすると圧縮
	.pipe(autoprefixer())
	.pipe(sourcemaps.write(""))
    .pipe(gulp.dest('pc/html/common/css'))
	.pipe(browser.stream());
});

// server 立ち上げ
gulp.task("server", function(){
	browser({
		ghostMode: false,
		server: {
			baseDir: "pc/html",
			middleware: [ ssi({ baseDir: "pc/html", ext: ".html" }) ]
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

	gulp.src("pc/lib/js/*.js")
		.pipe(convertEncoding({to: "shift_jis"}))
		.pipe(gulp.dest("pc-SJIS/lib/js"));
	return
}); 

