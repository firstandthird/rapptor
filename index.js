var loadConfig = require('confi');
var Hapi = require('hapi');
var _ = require('lodash');
var aug = require('aug');
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);


var Rapptor = function(options) {

  options = options || {};

  this.cwd = options.cwd || process.cwd();

  //load up config
  this._setupConfig();
  //default view data
  this._viewData = { env: this.config.env };

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
  this._loadMethods();

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

  //port
  if (process.env.PORT) {
    this.config.connection.port = process.env.PORT;
  }

  //mongo
  this.mongoHost = process.env.MONGO_PORT_27017_TCP_ADDR || this.config.mongo.host;
  this.mongoPort = process.env.MONGO_PORT_27017_TCP_PORT || this.config.mongo.port;
  this.config.mongo.url = 'mongodb://'+this.mongoHost+':'+this.mongoPort+'/'+this.config.mongo.db;

  //replace MONGOURL in config
  var configStr = JSON.stringify(this.config);
  configStr = configStr.replace(/MONGOURL/g, this.config.mongo.url);
  configStr = configStr.replace(/DIRNAME/g, this.cwd);
  this.config = JSON.parse(configStr);
  if (process.env.RAPPTORDEBUG == 1) {
    console.log('RAPPTOR CONFIG. RAAR');
    console.log(JSON.stringify(this.config, null, '  '));
  }
};

Rapptor.prototype._readPlugins = function() {

  var self = this;
  _.forIn(this.config.plugins, function(value, key) {
    if (value.enabled === false) {
      return;
    }
    if (!value._nativePlugin) {
      if (key[0] == '.') {
        key = path.join(self.cwd, key);
      } else {
        key = path.join(self.cwd, 'node_modules', key);
      }
    }
    delete value.enabled;
    delete value._nativePlugin;
    self.loadPlugin(key, value);
  });
};

Rapptor.prototype._setupLogging = function() {
  var reporters = [];

  _.forIn(this.config.logging.reporters, function(values, key) {
    if (values === false || values.enabled === false) {
      return;
    }
    reporters.push({
      reporter: require('good-'+key),
      args: values.args
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
  var self = this;
  var viewPath = path.join(this.cwd, this.config.structure.views);
  if (!fs.existsSync(viewPath)) {
    return;
  }
  var viewConfig = {
    engines: {
      html: Handlebars
    },
    path: path.join(viewPath, 'pages'),
    isCached: (this.config.env == 'prod')
  };
  var partialsPath = path.join(viewPath, 'modules');
  if (fs.existsSync(partialsPath)) {
    viewConfig.partialsPath = partialsPath;
  }
  var helpersPath = path.join(this.cwd, this.config.structure.helpers);
  if (fs.existsSync(helpersPath)) {
    viewConfig.helpersPath = helpersPath;
  }
  this.server.views(viewConfig);

  var layouts = this.config.views.layouts;
  layouts.forEach(function(layout) {
    var layoutPath = path.resolve(viewPath, layout+'.html');
    if (fs.existsSync(layoutPath)) {
      var src = fs.readFileSync(layoutPath, 'utf8');
      Handlebars.registerPartial(layout, src);
    }
  });

  var helperPath = path.join(__dirname, './helpers');
  if (fs.existsSync(helperPath)) {

    var helpers = require('require-all')(helperPath);

    _.forIn(helpers, function(value, key) {
      Handlebars.registerHelper(key, value.bind(self));
    });
  }

  this.server.ext('onPreResponse', function(request, reply) {
    var response = request.response;

    if (response.variety === 'view') {

      var context = response.source.context || {};
      
      context.env = config.env;

      if (typeof this.getViewData === 'function') {
        this.getViewData(request, context);
      }
      response.source.context = context;

      if (request.query.json == '1') {
        return reply(response.source.context);
      }

    }
    reply(response);
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

  this.server.method('getAsset', require(path.join(__dirname, './methods/assets')).call(this));
};

Rapptor.prototype._loadMethods = function() {

  var self = this;
  var methodPath = path.join(this.cwd, this.config.structure.methods);
  if (fs.existsSync(methodPath)) {

    var methods = require('require-all')(methodPath);

    _.forIn(methods, function(value, key) {
      self.server.method(key, value.method.bind(self), value.options || {});
    });
  }
};

Rapptor.prototype.start = function(callback) {
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
      if (callback) {
        callback(self.server);
      }
    });
  });
};

module.exports = Rapptor;
