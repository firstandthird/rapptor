
1.5.0 / 2017-02-05
==================

  * updated hapi and hapi-logr

1.4.0 / 2017-02-05
==================

  * tweaked default logging output
  * pin deps
  * fix(package): update hapi-method-loader to version 1.2.0
  * chore(package): update dependencies

1.3.2 / 2016-10-21
==================

  * updated hapi-route-loader 2.1.0
  * update eslint

1.3.1 / 2016-10-21
==================

  * updated hapi-confi 2.3.1

1.3.0 / 2016-10-21
==================

  * updated hapi-confi and hapi-route-loader

1.2.0 / 2016-09-05
==================

  * updated hapi-logr to 1.4.0
  * updated hapi to 15
  * updated hapi-route-loader to 1.2.0
  * license

1.1.0 / 2016-06-15
==================

  * updated hapi-confi to 2.2.0

1.0.0 / 2016-06-15
==================

  * added readme
  * updated hapi-confi to 2.1.1
  * updated hapi-confi to 2.1.0
  * updated hapi-route-loader to 1.0.1
  * updated hapi-confi 2.0.0.  removes authPlugin and strategy loading
  * hapi-logr priority -5 (to make sure its first)
  * updated lint config
  * hapi-logr - changed priority to -1
  * updated hapi-method-loader to 0.2.0
  * updated route-loader to 1.0.0
  * updated hapi-confi to 1.0.0
  * log config if CONFIG=1 env var set
  * added additional options for json logging
  * use VIRTUAL_HOST in log if it exists
  * updated hapi-route-loader, hapi-method-loader
  * example run script
  * added bug route to test logging
  * server.debug false
  * be able to pass in directory to cli
  * added stop function and listen for SIGTERM
  * updated linting
  * fixed options issue
  * added cli
  * updated dependencies
  * changed server start tags
  * updated default log options for console logging
  * updated hapi-logr
  * log on server start
  * swapped out good with hapi-logr to simplify things
  * added before hook
  * removed unneeded deps
  * just the basics

0.20.0 / 2016-04-25
==================

  * updated node

0.19.1 / 2015-07-15
==================

  * more detailed error logging
  * updated dockerfile version

0.19.0 / 2015-07-14
==================

  * Logs errors
  * updated dockerfile

0.18.2 / 2015-07-13
==================

  * lock down deps

0.18.1 / 2015-07-09
==================

  * fixed passing strings to server methods

0.18.0 / 2015-07-07
==================

  * Ability to call a server methods from the command line

0.17.0 / 2015-06-22
==================

  * updated hapi-auto-loader


0.16.1 / 2015-06-15
==================

  * fixed a bug where stringify would have a circular reference because _server is getting added


0.16.0 / 2015-06-11
==================

  * updated node version to 0.10.38.  fixes #69
  * updated good-mongodb-viewer to 0.8.1.  Fixes #68
  * check reporter length before loading good plugin. fixes #66
  * removed mongo uri dep
  * [docker] install grunt-set-rapptor first, upped version to 0.1.0


0.15.0 / 2015-06-06
==================

  * updated hapi-metrics


0.14.0 / 2015-06-05
==================

  * added dockerfile
  * updated good-mongodb


0.13.0 / 2015-05-30
==================

  * updated hapi-metrics to 2.0.0


0.12.0 / 2015-05-29
==================

  * added fullHost, which includes protocol.  set host and asset host to blank on dev


0.11.1 / 2015-05-28
==================

  * set admin password ttl as 30 days


0.11.0 / 2015-05-28
==================

  * added protocol option and use for asset hosts
  * don't enable metrics api by default
  * Disabled strict header by default.
  * default asset host to main host and default cors to asset host


0.10.0 / 2015-05-24
==================

  * updated hapi-metrics and enabled api


0.9.0 / 2015-05-13
==================

  * updated hapi-password to 0.3.0 and added prettyName field
  * run auth plugins first
  * updated confi, removed MONGOURL and DIRNAME replacements
  * updated hapi-output-cache to 0.3.0
  * updated hapi-auto-loader


0.8.0 / 2015-05-05
==================

  * default mapping object to empty object
  * refactor getAsset to load mapping file on server start and add support for either passing in a version to the asset helper or setting globally   in the config


0.7.0 / 2015-05-05
==================

  * be able to set cors and cache options on assets


0.6.0 / 2015-05-04
==================

  * updated good-mongodb and good-mongodb-viewer


0.5.0 / 2015-04-28
==================

  * changed log endpoint
  * hapi-admin and strategy support
  * added RAPPTORCONFIG to print config and then exit
  * updated hapi-auto-loader to 0.4.0


0.4.0 / 2015-04-28
==================

  * Fixes linkify helper

0.3.0 / 2015-04-22
==================

  * updated good-hipchat, added prefix and suffix to logs


0.2.0 / 2015-04-21
==================

  * updated default searches in mongo log viewer
  * updated logging to use Good 6


0.1.0 / 2015-04-20
==================

  * updated hapi-metrics


0.0.36 / 2015-04-10
==================

  * Renamed views.json to views.errorBlacklist
  * Allows a regex to be set to define json paths.

0.0.35 / 2015-04-09
==================

  * Switched to use .setup() method.

0.0.34 / 2015-04-08
==================

  * updated default paths
  * Adds option to pass in the name of a server method to format hipchat messages.

0.0.33 / 2015-04-01
==================

  * Bumped hapi-agenda

0.0.32 / 2015-04-01
==================

  * updated hapi-agenda to 0.9.0


0.0.31 / 2015-03-28
==================

  * BREAKING: return err back on start callback.  Fixes #54
  * Correct host and port.
  * Parses mongourl for plugins like catbox-mongodb that insist on taking each param.


0.0.30 / 2015-03-27
==================

  * Only call loadConfig once

0.0.29 / 2015-03-27
==================

  * Fixed getAsset method

0.0.28 / 2015-03-27
==================

  * Updated confi and set port to ENV.PORT

0.0.27 / 2015-03-26
==================

  * Asset helper now uses this._server

0.0.26 / 2015-03-26
==================

  * fixed if config had no value
  * renamed cache partition to {{name}}-cache


0.0.25 / 2015-03-26
==================

  * updated hapi-output-cache
  * Bumped hapi to 8.4.0
  * Changed plugin enabled flag
  * Added a bunch of default helpers and some docs for them.
  * Removed the other mongo config nonsense.
  * Updated confi and switched configs to use {{name}}. Also have mongo config use ENV if available.


0.0.24 / 2015-03-18
==================

  * added hapi-output-cache as a native plugin


0.0.23 / 2015-03-18
==================

  * updated confi, split up config file
  * Fixing path of appDefaults to be able to load rapptor from various locations

0.0.22 / 2015-03-15
==================

  * server options and additional connection options
  * Integrated hapi-auto-loader


0.0.21 / 2015-03-04
==================

  * enable hapi-agenda json api


0.0.20 / 2015-03-03
==================

  * updated hapi-agenda


0.0.19 / 2015-03-03
==================

  * Native plugin
  * Added metrics - kinda

0.0.18 / 2015-03-02
==================

  * Bumped good-hipchat
  * Merge pull request #36 from firstandthird/feature/error-page
  * Added error page handling

0.0.17 / 2015-02-27
==================

  * generalized asset loading


0.0.16 / 2015-02-26
==================

  * Merge pull request #33 from firstandthird/feature/image-asset
  * Added image-path to asset helper
  * Added support for images in asset handler

0.0.15 / 2015-02-26
==================

  * fixing getViewData
  * update dev good-console logging


0.0.14 / 2015-02-26
==================

  * Adding getViewData method call


0.0.13 / 2015-02-25
==================

  * updated hapi-agenda


0.0.12 / 2015-02-25
==================

  * fixed combining asset url paths


0.0.11 / 2015-02-25
==================

  * renamed hostCDN to just host
  * add support for passing in root folder


0.0.10 / 2015-02-24
==================

  * Merge pull request #32 from firstandthird/feature/assets
  * Added asset helper and method.

0.0.9 / 2015-02-24
==================

  * callback after server start


0.0.8 / 2015-02-24
==================

  * updated good-mongodb-viewer
  * updated good-mongodb
  * disable hapi-log-response and removed search


0.0.7 / 2015-02-23
==================

  * updated good-mongodb


0.0.6 / 2015-02-18
==================

  * setViewData to set view data across all routes


0.0.5 / 2015-02-17
==================

  * updated request-errors to response-errors
  * updated good events from request to response
  * be able to override port with env var
  * expose env to views
  * check if layout exists before registering
  * check if helpers and partials paths exist
  * RAPPTORDEBUG=1 will output rapptor config


0.0.4 / 2015-02-17
==================

  * Binds server methods to server.
  * updated hapi-agenda
  * Added abled flag for reporters.
  * Added good-hipchat support.

0.0.3 / 2015-02-10
==================

  * Loads up server methods in a directory.
  * Added catbox-mongodb support.
  * Added hapi-agenda support.

0.0.2 / 2015-02-06
==================

  * serve static assets


0.0.1 / 2015-02-06
==================

  * added handlebars and handlebars-layouts support
  * support directories for routes
  * loadRoutes from routes directory
  * set up hapi-redirects
  * initial work
