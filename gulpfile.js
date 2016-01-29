var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    connect = require("gulp-connect"),
    gulpif = require("gulp-if"),
    uglify = require("gulp-uglify"),
    htmlmin = require("gulp-htmlmin"),
    jsonminify = require("gulp-jsonminify"),
    imagemin = require("gulp-imagemin"),
    pngcrush = require("imagemin-pngcrush"),
    concat = require('gulp-concat');



// Create Variables
var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;

// Assign variables
env = process.env.NODE_ENV || 'development';

if (env==='development'){
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
}else{
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}


// Create Variables for source paths to make code easier to read
// In this case an array incase you need to pass in other paths...
coffeeSources = ['components/coffee/*.coffee'];
// this case you can control the order the files are processed by listing them indviidually
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
// We can use a single file to process our sass and rely on imports in our sass code to structure our sass files in a way that stays true to sass.
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];


// Just a test task
gulp.task('log', function() {
    gutil.log('Workflows are awesome!'); // uses the log function of gulp-util to print to the console
});

/*
COFFEE TASK

First specify where to grab the input for this pipe 
.src() is a gulp function that grabs the input 
so most tasks start that way.

Curly braces allow you to set options (key value pairs) on a 
gulp config object for the plugin you are piping into. 
You can find the available options for a plugin by looking 
at the underlaying library the plugin is wrapping. 
In this case by looking at the coffee language:
http://coffeescript.org (see usage...) 
 
If coffee throws an error processing your coffeescript
it will crash gulp, unless you catch it and send it 
somewhere like, maybe... the console!
*/

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
        .pipe(coffee({
                bare: true
            })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {	
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {	
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			css: outputDir + 'css',
			image: outputDir + 'images',
			style: sassStyle,
			comments: true,
			sourcemap: true
		}))
			.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload());
});

gulp.task('json', function() {	
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env === 'production', jsonminify()))
	.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
		.pipe(connect.reload());
});

gulp.task('html', function() {	
	gulp.src(htmlSources)
		.pipe(connect.reload())
});

gulp.task('minihtml', function() {
	gulp.src('builds/development/*.html')
    	.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest('builds/production/'))
    	.pipe(connect.reload())
});

gulp.task('images', function() {
	gulp.src('builds/development/images/**/*.*')
		.pipe(gulpif(env === 'production', imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngcrush()]
		})))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('builds/development/*.html', ['html', 'minihtml'])
	gulp.watch('components/sass/**/*.scss', ['compass'])
	gulp.watch('builds/development/js/*.json', ['json'])
	gulp.watch('builds/development/images/**/*.*', ['images'])
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('default', ['connect', 'coffee', 'js', 'html', 'compass', 'images', 'json', 'minihtml', 'watch']);
