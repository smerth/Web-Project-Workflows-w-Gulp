# Workflows

This project is built following the Lynda.com course:

[Web Project Workflows with Gulp.js, Git, and Browserify](http://www.lynda.com/Web-Design-tutorials/Web-Project-Workflows-Gulp-js-Git-Browserify/154416-2.html)

# Issues

## 1. Browserify is deprecated 

Section 2 - Importing libraries with Browserify.

The task works as outlined in the course.  The setup is as follows:

1. You need to require the jQuery and Mustache libraries

```
npm insall --save-dev jquery
```


```
npm insall --save-dev mustache
```

2. You need to require the libaries in the site code.  For the coffeescript file


```
$ = require 'jquery'
```


and the templating file for Mustache


```
var Mustache = require('mustache');
```
3. Add Browserify to the JS processing pipeline


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
scripts.js is piped into Browserify which finds the two libraries are required and goes out and gets them and adds them to sripts.js so that it is a concaentation of all the site .js files and the libaries they require.

Unfortunately this task requires that somewhere in the .js files you require the libraries and that means there is no clear separation between site code and this process step...

There must be a better way to include required libraries into the concatenated .js file.

## 2. Process design

The process outlined in the course places `index.html` and `data.json` in the `builds/development` folder.  That's messy.  I'm of the opinion that nothing in `builds/development` and `builds/production` should be edited by hand.

The process would be better designed if all site files origated in components, let Gulp write everything to the two site folders...

## 3. Cleaner development and production tasks

There should be `gulp dev` and `gulp prod` tasks. Setting the NODE_ENV variable should not need to be called from the terminal prompt.

## 4 minifyHtml is deprecated

This code uses htmlmin instead but the task has been changed as the two plugins don't work the same.

# This project integrates the following software:

## Site basics

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
- [gulp-browserify](https://www.npmjs.com/package/gulp-compass) - Bundle modules with Browserify.
- [gulp-compass](https://www.npmjs.com/package/gulp-compass) - Compile SASS and Compass
- [gulp-connect](https://www.npmjs.com/package/gulp-connect) - Run server
- [gulp-if](https://www.npmjs.com/package/gulp-if) - conditionally pipe into a plugin
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) - Compress code
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin) - Compress html
- [gulp-jsonminify](https://www.npmjs.com/package/gulp-jsonminify) - Compress JSON
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) - Compress Images
- [imagemin-pngcrush](https://www.npmjs.com/package/gulp-pngcrush) - dependancy of imagemin
- [gulp-concat](https://www.npmjs.com/package/gulp-concat) - Concatenate files













