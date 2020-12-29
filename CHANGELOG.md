# Changelog

## Version `0.1.1`

Add `deploy` script to run `gulp build` and then `surge` with CLI options to make it work with Node 5 (`--harmony_sloppy_let` and `--harmony_destructuring`) to simulate a 2015 stack. `surge` recommends loading the deploy domain from a `CNAME` file, but `$(< CNAME)` doesn't work within `npm run deploy`. Anyone?

Installed the `http-server` dev dependency since I dropped the ExpressJS static server. Added a `develop` script that runs `gulp` (default) and server `dist/dev` with `http-server`. I didn't know I needed the [LiveReload Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension) to make Gulp's LiveReload plugin work properly. (Installed, working now.)

Finally, fixed the `app` directive's `templateUrl` property and Gulp plugin `ng-html2js`'s `moduleName` property to make AngularJS load templates from the `$templateCache` in production. (Wasn't working, it is now.)

## Version `0.1.0`

#todo

## Before version `0.1.0`

#todo
