# What is this?

This is a study site for the Lynda.com course: [Web Project Workflows with Gulp.js, Git, and Browserify](http://www.lynda.com/Web-Design-tutorials/Web-Project-Workflows-Gulp-js-Git-Browserify/154416-2.html)

# Some Notes...

## 1. Workflow design

The workflow outlined in the course starts with `index.html`, the `images` and `data.json` in the `builds/development` folder.  Gulp processes these into the `production` folder with minification and compression, etc.  That means you need to store `components` and `builds/development` in a github repository.

If Gulp generated every file in `builds/**` from `components` then it wouldn't be necessary to store `builds/**` at all which would be much cleaner and less storage on github.

## 2. gulp-browserify is deprecated

To get browserify to work in this process:

- You need to install the jQuery and Mustache libraries
	```
	npm insall --save-dev jquery
	```
	```
	npm insall --save-dev mustache
	```

- You need to require the libraries somewhere in the site's code.  

	In the CoffeeScript file:
	```
	$ = require 'jquery'
	```
	and the templating file for Mustache
	```
	var Mustache = require('mustache');
	```

- Add Browserify to the JS processing pipeline
	```js
	gulp.task('js', function() {
		gulp.src(jsSources)
			.pipe(concat('script.js'))
			.pipe(browserify())
			.pipe(gulpif(env === 'production', uglify()))
			.pipe(gulp.dest(outputDir + 'js'))
			.pipe(connect.reload())
	});
	```
Prior to the above task all CoffeeScript files have been converted to JS. The above task concatenates all the JS files into a single scripts.js file. Browserify parses that file looking for dependancies and then pulls in jQuery and Mustache and adds them to scripts.js.

## 3. Gulp-if and Environment Variable

There's a good example of using an Environment variable and gulp-if to conditionally process the piped files to a different outputDir.

## 4 JSON and Mustache

There's a good example of how to pull data into a mustache template.

# Useful links
- [HTML](http://www.w3schools.com/html/html5_intro.asp) - Markup
- [SASS](http://sass-lang.com) - CSS extension language
- [Compass](http://compass-style.org) - CSS Authoring Framework
- [jQuery](http://jquery.com) - JavaScript Library
- [CoffeeScript](http://coffeescript.org) - CoffeeScript is a little language that compiles into JavaScript
- [JSON](http://json.org) - JavaScript Object Notation for data formatting
- [Mustache](https://github.com/janl/mustache.js) - HTML templating (in this case used to integrate JSON datafeeds)

## Version Control

- [GIT](http://www.git-scm.com) - Version control SW
- [GitHub](http://github.com) - Social coding with version control

## Build Process

- [Node.js](https://nodejs.org/en/) - Node.js applications
- [npm](https://www.npmjs.com) - The package manager for JavaScript applications, this is where you can find plugins for gulp
- [Gulp.js](http://gulpjs.com) - Allows you to stream input through a series of chained plugins to create a custom build process

## Packages

- [gulp-util](https://www.npmjs.com/package/gulp-util) - Utility functions for gulp plugins
- [gulp-coffee](https://www.npmjs.com/package/gulp-coffee) - Compiles CoffeeScript
- [gulp-browserify](https://www.npmjs.com/package/gulp-compass) - Bundle modules and dependancies with Browserify.
- [gulp-compass](https://www.npmjs.com/package/gulp-compass) - Compile SASS and Compass
- [gulp-connect](https://www.npmjs.com/package/gulp-connect) - Run server
- [gulp-if](https://www.npmjs.com/package/gulp-if) - conditionally pipe into a plugin
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) - Compress code
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin) - Compress html
- [gulp-jsonminify](https://www.npmjs.com/package/gulp-jsonminify) - Compress JSON
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) - Compress Images
- [imagemin-pngcrush](https://www.npmjs.com/package/gulp-pngcrush) - dependancy of imagemin
- [gulp-concat](https://www.npmjs.com/package/gulp-concat) - Concatenate files
