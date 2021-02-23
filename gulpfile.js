var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var bowerFiles = require("main-bower-files");
var del = require("del");
var es = require("event-stream");

var paths = {
  scripts: ["!./src/**/*.spec.js", "./src/**/*.js"],
  styles: "./src/**/*.+(css|scss)",
  templates: "./src/**/*.html",
  index: "./public/index.html",
  images: "./public/assets/images/**/*.+(svg|png|gif|jpg|jpeg)",
  static: ["!./public/assets/images/**/*.*", "./public/**/*.*"],
  devDist: "./dist/dev",
  prodDist: "./dist/prod",
};

// PIPES

pipes = {};

// app scripts

// order angularjs modules to prevent $injector:modulerr
pipes.orderAppScripts = function () {
  return plugins.angularFilesort();
};

// transpile app scripts from ES6+ (2015+) to ES5 (2009)
pipes.transpileAppScripts = function () {
  return plugins.babel();
};

// validate app scripts for javascript syntax errors
pipes.validateAppScripts = function () {
  return gulp
    .src(paths.scripts)
    .pipe(pipes.transpileAppScripts())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter("jshint-stylish"));
};

// validate and move app scripts into the dev environment
pipes.buildDevAppScripts = function () {
  return pipes.validateAppScripts().pipe(gulp.dest(paths.devDist));
};

// bundle app scripts + templates into the prod environment
pipes.buildProdAppScripts = function () {
  var scriptedTemplates = pipes.scriptTemplates();
  var validatedAppScripts = pipes.validateAppScripts();

  return es
    .merge(scriptedTemplates, validatedAppScripts)
    .pipe(pipes.orderAppScripts())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("app.min.js"))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(paths.prodDist));
};

// vendor scripts

// order vendor scripts that depend upon one another
pipes.orderVendorScripts = function () {
  return plugins.order(["jquery.js", "angular.js"]);
};

// simply move vendor scrips into the dev environment
pipes.buildDevVendorScripts = function () {
  return gulp
    .src(bowerFiles())
    .pipe(gulp.dest(paths.devDist + "/bower_components"));
};

// bundle ordered vendor scripts to the prod environment
pipes.buildProdVendorScripts = function () {
  return gulp
    .src(bowerFiles("**/*.js"))
    .pipe(pipes.orderVendorScripts())
    .pipe(plugins.concat("vendor.min.js"))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.prodDist));
};

// styles

// add a .min to the file extension (e.g. .css -> .min.css)
pipes.addMinSuffix = function () {
  return plugins.rename(function (path) {
    path.extname = ".min" + path.extname;
  });
};

// compile scss/sass files and save into the dev environment
pipes.buildDevStyles = function () {
  return gulp
    .src(paths.styles)
    .pipe(plugins.sass())
    .pipe(gulp.dest(paths.devDist));
};

// compile and bundle scss/sass to the prod environment
pipes.buildProdStyles = function () {
  return gulp
    .src(paths.styles)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.minifyCss())
    .pipe(plugins.sourcemaps.write())
    .pipe(pipes.addMinSuffix())
    .pipe(gulp.dest(paths.prodDist));
};

// templates

// check templates for html syntax errors
pipes.validateTemplates = function () {
  return gulp
    .src(paths.templates)
    .pipe(plugins.htmlhint({ "doctype-first": false }))
    .pipe(plugins.htmlhint.reporter());
};

// move html templates into the dev environment
pipes.buildDevTemplates = function () {
  return pipes.validateTemplates().pipe(gulp.dest(paths.devDist));
};

// convert html templates to js and add to $templateCache
pipes.scriptTemplates = function () {
  return pipes
    .validateTemplates()
    .pipe(plugins.htmlhint.failReporter())
    .pipe(plugins.htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(plugins.ngHtml2js({ moduleName: "app" }));
};

// index

// check index.html for html syntax errors
pipes.validateIndex = function () {
  return gulp
    .src(paths.index)
    .pipe(plugins.htmlhint()) // doctype-first: true
    .pipe(plugins.htmlhint.reporter());
};

// validate index.html and inject all script/style sources
pipes.buildDevIndex = function () {
  var orderedVendorScripts = pipes
    .buildDevVendorScripts()
    .pipe(pipes.orderVendorScripts());

  var orderedAppScripts = pipes
    .buildDevAppScripts()
    .pipe(pipes.orderAppScripts());

  var appStyles = pipes.buildDevStyles();

  // prettier-ignore
  return pipes
    .validateIndex()
    .pipe(gulp.dest(paths.devDist)) // so inject can use relative
    .pipe(plugins.inject(orderedVendorScripts, { relative: true, name: "vendor" }))
    .pipe(plugins.inject(orderedAppScripts, { relative: true }))
    .pipe(plugins.inject(appStyles, { relative: true }))
    .pipe(gulp.dest(paths.devDist));
};

// validate index.html, inject minified sources and minify it
pipes.buildProdIndex = function () {
  var orderedVendorScripts = pipes.buildProdVendorScripts();
  var orderedAppScripts = pipes.buildProdAppScripts();
  var appStyles = pipes.buildProdStyles();

  // prettier-ignore
  return pipes
    .validateIndex()
    .pipe(gulp.dest(paths.prodDist)) // so inject can use relative
    .pipe(plugins.inject(orderedVendorScripts, { relative: true, name: "vendor" }))
    .pipe(plugins.inject(orderedAppScripts, { relative: true }))
    .pipe(plugins.inject(appStyles, { relative: true }))
    .pipe(plugins.htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.prodDist));
};

// images

pipes.minifyImages = function () {
  return plugins.imagemin({
    interlaced: true,
    progressive: true,
    optimizationLevel: 5,
    svgoPlugins: [{ removeViewBox: true, cleanupIDs: false }],
  });
};

// simply copy image files to the dev environment
pipes.buildDevImages = function () {
  return gulp
    .src(paths.images)
    .pipe(gulp.dest(paths.devDist + "/assets/images"));
};

// compress image files and save into the prod environment
pipes.buildProdImages = function () {
  return gulp
    .src(paths.images)
    .pipe(plugins.cache(pipes.minifyImages()))
    .pipe(gulp.dest(paths.prodDist + "/assets/images"));
};

// static

// simply copy static files to the dev environment
pipes.copyDevStatic = function () {
  return gulp.src(paths.static).pipe(gulp.dest(paths.devDist));
};

// simply copy static files to the prod environment
pipes.copyProdStatic = function () {
  return gulp.src(paths.static).pipe(gulp.dest(paths.prodDist));
};

// app

pipes.buildDevApp = function () {
  return es.merge(
    pipes.buildDevIndex(),
    pipes.buildDevTemplates(),
    pipes.buildDevImages(),
    pipes.copyDevStatic()
  );
};

pipes.buildProdApp = function () {
  return es.merge(
    pipes.buildProdIndex(),
    pipes.buildProdImages(),
    pipes.copyProdStatic()
  );
};

// TASKS

// clean

gulp.task("clean-dev-env", function () {
  return del.sync(paths.devDist);
});

gulp.task("clean-prod-env", function () {
  return del.sync(paths.prodDist);
});

// app scripts

gulp.task("validate-app-scripts", pipes.validateAppScripts);

gulp.task("build-dev-app-scripts", pipes.buildDevAppScripts);

gulp.task("build-prod-app-scripts", pipes.buildProdAppScripts);

// vendor scripts

gulp.task("build-dev-vendor-scripts", pipes.buildDevVendorScripts);

gulp.task("build-prod-vendor-scripts", pipes.buildProdVendorScripts);

// app styles

gulp.task("build-dev-styles", pipes.buildDevStyles);

gulp.task("build-prod-styles", pipes.buildProdStyles);

// templates

gulp.task("validate-templates", pipes.validateTemplates);

gulp.task("build-dev-templates", pipes.buildDevTemplates);

gulp.task("script-templates", pipes.scriptTemplates);

// index

gulp.task("validate-index", pipes.validateIndex);

gulp.task("build-dev-index", pipes.buildDevIndex);

gulp.task("build-prod-index", pipes.buildProdIndex);

// images

gulp.task("build-dev-images", pipes.buildDevImages);

gulp.task("build-prod-images", pipes.buildProdImages);

// static

gulp.task("copy-dev-static", pipes.copyDevStatic);

gulp.task("copy-prod-static", pipes.copyProdStatic);

// build

gulp.task("build-dev-app", pipes.buildDevApp);

gulp.task("build-prod-app", pipes.buildProdApp);

// clean

gulp.task("clean-build-dev-app", ["clean-dev-env"], pipes.buildDevApp);

gulp.task("clean-build-prod-app", ["clean-prod-env"], pipes.buildProdApp);

// watch

gulp.task("watch-dev", ["clean-build-dev-app"], function () {
  // start live-reload server
  plugins.livereload.listen({ start: true, basePath: paths.devDist });

  // watch app scripts
  gulp.watch(paths.scripts, function () {
    return pipes.buildDevAppScripts().pipe(plugins.livereload());
  });

  // watch styles
  gulp.watch(paths.styles, function () {
    return pipes.buildDevStyles().pipe(plugins.livereload());
  });

  // watch templates
  gulp.watch(paths.templates, function () {
    return pipes.buildDevTemplates().pipe(plugins.livereload());
  });

  // watch index
  gulp.watch(paths.index, function () {
    return pipes.buildDevIndex().pipe(plugins.livereload());
  });
});

gulp.task("watch-prod", ["clean-build-prod-app"], function () {
  // start live-reload server
  plugins.livereload.listen({ start: true, quiet: true });

  // watch app scripts
  gulp.watch(paths.scripts, function () {
    return pipes.buildProdAppScripts().pipe(plugins.livereload());
  });

  // watch styles
  gulp.watch(paths.styles, function () {
    return pipes.buildProdStyles().pipe(plugins.livereload());
  });

  // watch templates
  gulp.watch(paths.templates, function () {
    return pipes.buildProdAppScripts().pipe(plugins.livereload()); // script templates
  });

  // watch index
  gulp.watch(paths.index, function () {
    return pipes.buildProdIndex().pipe(plugins.livereload());
  });
});

// build and default

gulp.task("build", ["clean-prod-env"], pipes.buildProdApp);

gulp.task("default", ["clean-build-dev-app"]);

// heavily based on @paislee/healthy-gulp-angular
