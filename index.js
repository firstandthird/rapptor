var loadConfig = require('confi');
var Hapi = require('hapi');
var _ = require('lodash');
var aug = require('aug');
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);


var Rapptor = function() {

  this.cwd = process.cwd();

  //load up config
  this._setupConfig();

  this.server = new Hapi.Server({
    app: this.config,
    cache: {
      engine: require('catbox-mongodb'),
      partition: this.config.cache.partition || this.config.mongo.db,
      host: this.config.cache.host || this.mongoHost,
      port: this.config.cache.port || this.mongoPort
    }
  });

  this.plugins = [];
  this._setupLogging();
  this._readPlugins();

  this.server.connection(this.config.connection);
};

Rapptor.prototype._setupConfig = function() {

  //rapptor defaults
  var defaultConfig = loadConfig({
    path: __dirname + '/conf'
  });
  loadConfig.reset();

  //app defaults
  this.config = aug(true, {}, defaultConfig, loadConfig());

  //mongo
  this.mongoHost = process.env.MONGO_PORT_27017_TCP_ADDR || this.config.mongo.host;
  this.mongoPort = process.env.MONGO_PORT_27017_TCP_PORT || this.config.mongo.port;
  this.config.mongo.url = 'mongodb://'+this.mongoHost+':'+this.mongoPort+'/'+this.config.mongo.db;

  //replace MONGOURL in config
  var configStr = JSON.stringify(this.config);
  configStr = configStr.replace(/MONGOURL/g, this.config.mongo.url);
  configStr = configStr.replace(/DIRNAME/g, this.cwd);
  this.config = JSON.parse(configStr);
  //console.log(JSON.stringify(this.config, null, '  '));
};

Rapptor.prototype._readPlugins = function() {

  var self = this;
  _.forIn(this.config.plugins, function(value, key) {
    if (value.enabled === false) {
      return;
    }
    self.loadPlugin(key, value);
  });
};

Rapptor.prototype._setupLogging = function() {
  var reporters = [];

  _.forIn(this.config.logging.reporters, function(values, key) {
    if (values === false) {
      return;
    }
    reporters.push({
      reporter: require('good-'+key),
      args: values
    });
  });

  this.loadPlugin('good', {
    opsInterval: this.config.logging.opsInterval,
    reporters: reporters
  });

};

Rapptor.prototype.loadPlugin = function(key, options) {
  this.plugins.push({
    register: require(key),
    options: options
  });
};

Rapptor.prototype._loadRoutes = function() {

  var self = this;
  var routePath = path.join(this.cwd, this.config.structure.routes);
  if (fs.existsSync(routePath)) {

    require('require-all')({
      dirname: routePath,
      resolve: function(routeObj) {
        _.forIn(routeObj, function(route) {
          self.server.route(route);
        });
      }
    });
  }
};

Rapptor.prototype._setupViews = function() {
  var viewPath = path.join(this.cwd, this.config.structure.views);
  if (!fs.existsSync(viewPath)) {
    return;
  }
  this.server.views({
    engines: {
      html: Handlebars
    },
    path: path.join(viewPath, 'pages'),
    isCached: (this.config.env == 'prod'),
    partialsPath: path.join(viewPath, 'modules'),
    helpersPath: path.join(this.cwd, this.config.structure.helpers)
  });

  var layouts = this.config.views.layouts;
  layouts.forEach(function(layout) {
    var layoutPath = path.resolve(viewPath, layout+'.html');
    var src = fs.readFileSync(layoutPath, 'utf8');
    Handlebars.registerPartial(layout, src);
  });
};

Rapptor.prototype._setupAssets = function() {

  var self = this;
  this.server.route({
    path: self.config.assets.path+'/{path*}',
    method: 'GET',
    config: {
      auth: false,
      cache: {
        //privacy: 'public',
        //expiresIn: 1000 * 60 * 60 * 24 * 7
      },
      handler: {
        directory: {
          path: path.resolve(self.cwd, self.config.structure.assets),
          listing: false,
          index: false
        }
      }
    }
  });
};

Rapptor.prototype.start = function() {
  var self = this;

  this.server.register(this.plugins, function(err) {
    if (err) {
      throw err;
    }
    self._loadRoutes();
    self._setupViews();
    self._setupAssets();
    self.server.start(function() {
      self.server.log(['server', 'info'], 'Server started '+ self.server.info.uri);
    });
  });
};

module.exports = Rapptor;
