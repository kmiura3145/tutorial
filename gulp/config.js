var path = require('path');
var dest = path.relative('.', 'dest');
var release = path.relative('.', 'release');
var src = path.relative('.', 'src');

module.exports = {
	src: src,
	dest: dest,
	release: release,
	sass: {
		src: src + '/css/**/*.scss',
		dest: dest + '/css' 
	},
};
