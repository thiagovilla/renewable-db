# Changelog

## Version `0.1.2`

Set up unit tests and add unit test for the `app` directive. Installed Karma version 1.1.0 (for a 2015-stack simulation) and set it up to use Jasmine as a test library and Firefox as a test browser.

This required AngularJS' `angular-mocks` library, both in the version. Installed it via Bower to stick to legacy practices.

Also installed the `ng-html2js-preprocessor` Karma plugin to compile HTML templates to JS and load them in the `$templateCache` at test-time.

## Version `0.1.1`

Added a `deploy` script to run `gulp build` and then deploy the production build to Surge.sh. Added `surge` CLI options to make it work with Node 5 (`--harmony_sloppy_let` and `--harmony_destructuring`) to simulate a 2015 stack. (`surge` recommends loading the deploy domain from a `CNAME` file, but `$(< CNAME)` doesn't work within `npm run deploy`. Anyone?)

Installed the `http-server` dev dependency since I dropped the ExpressJS static server. Added a `develop` script that runs `gulp` (default) and then serves `dist/dev` with `http-server`. I didn't know I needed the [LiveReload Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension) to make Gulp's LiveReload plugin work properly. (Installed, working now.)

Finally, fixed the `app` directive's `templateUrl` property and Gulp plugin `ng-html2js`'s `moduleName` property to make AngularJS load templates from the `$templateCache` in production. (Wasn't working, it is now.)

## Version `0.1.0`

#todo

## Before version `0.1.0`

#todo
