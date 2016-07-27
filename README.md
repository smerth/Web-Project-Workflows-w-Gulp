Gulp

Intall this project

1. download the repo
2. npm install
3. gulp

View the completed project

(View at localhost:8080)[http://localhost:8080]



Project Overview

This is the completed study project for the Lynda.com course: Web Project Workflows with Gulp.js, Git, and Browserify

The course shows how to automate the build process for a web application using Gulp.  The build process is based on a simple development workflow.

1. npm is used to manage project dependancies which are defined in the package.json file.
2. the build process is defined as a series of Gulp tasks in gulpfile.js.
3. The components folder contains third party libraries and code you write that needs to transpiled.
4. The development folder contains your site markup, site assets and uncompressed JS and CSS.  The CSS and JS in the development folder is the result of Gulp tasks that process your SASS to CSS and your CoffeeScript to JS. Gulp then concatenates all the JS files in the components folder into a single file. 
5. Lastly the Gulp tasks compress CSS, JS, markup and Images into the production folder ready for deployment.

This workflow serves to demonstrate what Gulp does but it is a poor method of organising a real site.  Re-organising the project is the following manner would make it easier to understand and maintain.

1. Instead of having third-part js and your own js in the components folder use Bower to manage all third party libraries.
2. Create and src folder.  This is the only folder you should write to.
3. Instead of placing images into the development folder they should be placed in src/assets/img 
4. Re-write the Gulp tasks to delete any pre-existing development site and production site and then rebuild those folders when a Gulp task in run with a flag for development or production.

Setting up

Initiate NPM

    npm init



Install npm packages 

    npm install --save-dev gulp gulp-util gulp-coffee gulp-browserify gulp-compass gulp-connect gulp-if gulp-uglify gulp-htmlmin gulp-jsonminify gulp-imagemin imagemin-pngcrush gulp-concat



WritingGulp tasks

In gulpfile.js:

Import NPM projects

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



Create variables 

Create variables to hold paths

    // Create Variables
    var env,
    	coffeeSources,
    	jsSources,
    	sassSources,
    	htmlSources,
    	jsonSources,
    	outputDir,
    	sassStyle;



Assign variables 

Assign variables to paths

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





Create an environment variable

You can use to run Gulp tasks in a development mode

    // Assign variables
    env = process.env.NODE_ENV || 'development';



Write an if statement

Write an if statement to change the value of two variables when running Gulp in different env modes.

    if (env==='development'){
    	outputDir = 'builds/development/';
    	sassStyle = 'expanded';
    }else{
    	outputDir = 'builds/production/';
    	sassStyle = 'compressed';
    }



Write a test 

Write a Gulp task to see if Gulp is working

    // Just a test task
    gulp.task('log', function() {
        gutil.log('Workflows are awesome!'); // uses the log function of gulp-util to print to the console
    });



Process CoffeeSript

Write a task to process coffeescript

    /*
    COFFEE TASK
    
    First specify where to grab the input for this pipe .src() is a gulp function that grabs the input so most tasks start that way.
    
    Curly braces allow you to set options (key value pairs) on a gulp config object for the plugin you are piping into. You can find the available options for a plugin by looking at the underlaying library the Gulp plugin is wrapping. 
    
    In this case by looking at the coffee language: http://coffeescript.org (see usage...) 
     
    If coffee throws an error processing your coffeescript it will crash gulp, unless you catch it and send it somewhere like, maybe... the console!
    */
    gulp.task('coffee', function() {
        gulp.src(coffeeSources)
            .pipe(coffee({
                    bare: true
                })
                .on('error', gutil.log))
            .pipe(gulp.dest('components/scripts'))
    });



Process Javascript files

Write a task to process Scripts

    gulp.task('js', function() {	
    	gulp.src(jsSources)
    		.pipe(concat('script.js'))
    		.pipe(browserify())
    		.pipe(gulpif(env === 'production', uglify()))
    		.pipe(gulp.dest(outputDir + 'js'))
    		.pipe(connect.reload())
    });



Process SASS

Write a Gulp task to use Compass to process SASS

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



Process JSON files

Write a Gulp task to process JSON data files

    gulp.task('json', function() {	
    	gulp.src('builds/development/js/*.json')
    	.pipe(gulpif(env === 'production', jsonminify()))
    	.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    		.pipe(connect.reload());
    });



Minify HTML

Write a Gulp task to minify HTML in Development and export it to Production

    gulp.task('minihtml', function() {
    	gulp.src('builds/development/*.html')
        	.pipe(htmlmin({collapseWhitespace: true}))
        	.pipe(gulp.dest('builds/production/'))
        	.pipe(connect.reload())
    });



Manage Images

Write a Gulp task to manage images and image compression

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



Set up Watch Tasks

Write a Gulp task to watch for changes in source folders and then run appropriate tasks

    gulp.task('watch', function() {
    	gulp.watch(coffeeSources, ['coffee'])
    	gulp.watch(jsSources, ['js'])
    	gulp.watch('builds/development/*.html', ['html', 'minihtml'])
    	gulp.watch('components/sass/**/*.scss', ['compass'])
    	gulp.watch('builds/development/js/*.json', ['json'])
    	gulp.watch('builds/development/images/**/*.*', ['images'])
    });



Serve the site

Write a Gulp task to serve the ouput directory which depends on which env variable you are running gulp under...

    gulp.task('connect', function(){
    	connect.server({
    		root: outputDir,
    		livereload: true
    	});
    });



Define Gulp Default Task

Define what tasks run when you run the default Gulp command

    gulp.task('default', ['connect', 'coffee', 'js', 'html', 'compass', 'images', 'json', 'minihtml', 'watch']);



Notes!

1. gulp-browserify is deprecated

To get browserify to work in this process:

You need to install the jQuery

    npm insall --save-dev jquery

and Mustache libraries

    npm insall --save-dev mustache

You need to require the libraries somewhere in the site's code.  

In the CoffeeScript file:

    $ = require 'jquery'

and the templating file for Mustache

    var Mustache = require('mustache');

Lastly, add Browserify to the JS processing pipeline

    gulp.task('js', function() {
      gulp.src(jsSources)
          .pipe(concat('script.js'))
          .pipe(browserify())
          .pipe(gulpif(env === 'production', uglify()))
          .pipe(gulp.dest(outputDir + 'js'))
          .pipe(connect.reload())
    });

Prior to the above js task all CoffeeScript files have been converted to JS. The above task concatenates all the JS files into a single scripts.js file. Browserify parses that file looking for dependancies and then pulls in jQuery and Mustache and adds them to scripts.js.

2 JSON and Mustache

This site contains an example of how to pull data into a mustache template.

Useful links

Writing

- HTML - Markup
- SASS - CSS extension language
- Compass - CSS Authoring Framework
- jQuery - JavaScript Library
- CoffeeScript - CoffeeScript is a little language that compiles into JavaScript
- JSON - JavaScript Object Notation for data formatting
- Mustache - HTML templating (in this case used to integrate JSON datafeeds)

Version Control

- GIT - Version control SW
- GitHub - Social coding with version control

Gulp Build Process

- Node.js - Node.js applications
- npm - The package manager for JavaScript applications, this is where you can find plugins for gulp
- Gulp.js - Allows you to stream input through a series of chained plugins to create a custom build process

Gulp Packages

- gulp-util - Utility functions for gulp plugins
- gulp-coffee - Compiles CoffeeScript
- gulp-browserify - Bundle modules and dependancies with Browserify.
- gulp-compass - Compile SASS and Compass
- gulp-connect - Run server
- gulp-if - conditionally pipe into a plugin
- gulp-uglify - Compress code
- gulp-htmlmin - Compress html
- gulp-jsonminify - Compress JSON
- gulp-imagemin - Compress Images
- imagemin-pngcrush - dependancy of imagemin
- gulp-concat - Concatenate files
