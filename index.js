var loadConfig = require('confi');
var Hapi = require('hapi');
var _ = require('lodash');
var aug = require('aug');
var fs = require('fs');
var path = require('path');


var Rapptor = function() {

  this.cwd = process.cwd();

  //load up config
  this._setupConfig();

  this.server = new Hapi.Server({
    app: this.config
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
  var mongoHost = process.env.MONGO_PORT_27017_TCP_ADDR || this.config.mongo.host;
  var mongoPort = process.env.MONGO_PORT_27017_TCP_PORT || this.config.mongo.port;
  this.config.mongo.url = 'mongodb://'+mongoHost+':'+mongoPort+'/'+this.config.mongo.db;

  //replace MONGOURL in config
  var configStr = JSON.stringify(this.config);
  configStr = configStr.replace(/MONGOURL/g, this.config.mongo.url);
  this.config = JSON.parse(configStr);
  console.log(JSON.stringify(this.config, null, '  '));
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

    var routeObj = require('require-all')(routePath);

    _.forIn(routeObj, function(routeFile) {
      _.forIn(routeFile, function(route) {
        self.server.route(route);
      });
    });

  }

};

Rapptor.prototype.start = function() {
  var self = this;

  this.server.register(this.plugins, function(err) {
    if (err) {
      throw err;
    }
    self._loadRoutes();
    self.server.start(function() {
      self.server.log(['server', 'info'], 'Server started '+ self.server.info.uri);
    });
  });
};

module.exports = Rapptor;
