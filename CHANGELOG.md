
n.n.n / 2015-04-08
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
