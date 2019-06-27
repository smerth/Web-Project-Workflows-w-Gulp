# Gulp 4 Web Project Workflow

## About

This is a project to learn how to build workflows with Gulp 4



## Intall 

1. Clone the repo `git clone...`
2. Install the dependancies ```npm install```
3. Run the default batch of Gulp task ```gulp```

Your browser should open up.  It should reload auto-mattically when you make changes to any of the relevant site files.

By default the `NODE_ENV` is development, however you can set this to production, when you do so the output directory for gulp tasks changes to production and the minification and optimization tasks run, resulting in a build that is ready to deploy.

## Gulpfile.js

```javascript
var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpCoffee = require("gulp-coffee");
var browserify = require("gulp-browserify");
var compass = require("gulp-compass");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var jsonminify = require("gulp-jsonminify");
var imagemin = require("gulp-imagemin");
var pngcrush = require("imagemin-pngcrush");
var concat = require("gulp-concat");
var browserSync = require("browser-sync").create();

// Environment variables
var env = process.env.NODE_ENV || "development";
var outputDir;
var sassStyle;

if (env === "development") {
  outputDir = "builds/development/";
  sassStyle = "expanded";
} else {
  outputDir = "builds/production/";
  sassStyle = "compressed";
}

// Just a test task
async function log() {
  await gutil.log("Workflows are awesome!");
}

/*
COFFEE TASK
First specify where to grab the input for this pipe .src() is a gulp function that grabs the input so most tasks start that way.

Curly braces allow you to set options (key value pairs) on a gulp config object for the plugin you are piping into. You can find the available options for a plugin by looking at the library the plugin is wrapping. 

In this case by looking at the coffee language: http://coffeescript.org (see usage...) 
 
If coffee throws an error processing your coffeescript it will crash gulp, unless you catch it and send it somewhere like, maybe... the console!
*/

// Use an array in case you need to pass in other paths...
var coffeeSources = ["components/coffee/*.coffee"];
// You can use an es6 arrow function...
const coffee = () => {
  return gulp
    .src(coffeeSources)
    .pipe(
      gulpCoffee({
        bare: true
      }).on("error", gutil.log)
    )
    .pipe(gulp.dest("components/scripts"));
};

// Javascript task

// control the order the files being processed by listing them indviidually in an array
var jsSources = [
  "components/scripts/rclick.js",
  "components/scripts/pixgrid.js",
  "components/scripts/tagline.js",
  "components/scripts/template.js"
];

function js() {
  return gulp
    .src(jsSources)
    .pipe(concat("script.js"))
    .pipe(browserify())
    .pipe(gulpif(env === "production", uglify()))
    .pipe(gulp.dest(outputDir + "js"));
}

// Process SASS with Compass and Images

// We can use a single file to process our sass and rely on imports in our sass code to structure our sass files in a way that stays true to sass.
var sassSources = ["components/sass/style.scss"];

function sass() {
  return gulp
    .src(sassSources)
    .pipe(
      compass({
        sass: "components/sass",
        css: outputDir + "css",
        image: outputDir + "images",
        style: sassStyle,
        comments: true,
        sourcemap: true
      })
    )
    .on("error", gutil.log)
    .pipe(gulp.dest(outputDir + "css"));
}

// If in production environment compress JSON data in the development folder and put it in the production folder
var jsonSources = [outputDir + "js/*.json"];

function json() {
  return gulp
    .src(jsonSources)
    .pipe(gulpif(env === "production", jsonminify()))
    .pipe(gulpif(env === "production", gulp.dest("builds/production/js")));
}

// html? - I forget what this html function does
var htmlSources = [outputDir + "*.html"];

function html() {
  return gulp.src(htmlSources);
}

// Take the html in dev and minify it then put it into production
function minihtml() {
  return gulp
    .src("builds/development/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("builds/production/"));
}

// Take images in dev and optimize for production

function images() {
  return gulp
    .src("builds/development/images/**/*.*")
    .pipe(
      gulpif(
        env === "production",
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngcrush()]
        })
      )
    )
    .pipe(gulpif(env === "production", gulp.dest(outputDir + "images")));
}

// Serve the output folder and watch for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: outputDir
    },
    open: "external"
  });
  gulp.watch(coffeeSources, coffee);
  gulp.watch(jsSources, js);
  gulp.watch("builds/development/*.html", gulp.series([html, minihtml]));
  gulp.watch("components/sass/**/*.scss", sass);

  gulp.watch("builds/development/js/*.json", json);
  gulp.watch("builds/development/images/**/*.*", images);
  gulp.watch([outputDir]).on("change", browserSync.reload);
}

exports.log = log;
exports.coffee = coffee;
exports.js = js;
exports.sass = sass;
exports.json = json;
exports.html = html;
exports.minihtml = minihtml;
exports.images = images;

var develop = gulp.series(
  coffee,
  js,
  html,
  sass,
  images,
  json,
  minihtml,
  watch
);

gulp.task("default", develop);

```







## Todo

Write a deploy task...



## Useful links

### Writing
- [HTML](http://www.w3schools.com/html/html5_intro.asp) - Markup
- [SASS](http://sass-lang.com) - CSS extension language
- [Compass](http://compass-style.org) - CSS Authoring Framework
- [jQuery](http://jquery.com) - JavaScript Library
- [CoffeeScript](http://coffeescript.org) - CoffeeScript is a little language that compiles into JavaScript
- [JSON](http://json.org) - JavaScript Object Notation for data formatting
- [Mustache](https://github.com/janl/mustache.js) - HTML templating (in this case used to integrate JSON datafeeds)

### Version Control

- [GIT](http://www.git-scm.com) - Version control SW
- [GitHub](http://github.com) - Social coding with version control

### Gulp Build Process

- [Node.js](https://nodejs.org/en/) - Node.js applications
- [npm](https://www.npmjs.com) - The package manager for JavaScript applications, this is where you can find plugins for gulp
- [Gulp.js](http://gulpjs.com) - Allows you to stream input through a series of chained plugins to create a custom build process

### Gulp Packages

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
