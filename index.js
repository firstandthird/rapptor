var loadConfig = require('confi');
var Hapi = require('hapi');
var _ = require('lodash');
var aug = require('aug');
var fs = require('fs');
var path = require('path');
var mongodbUri = require('mongodb-uri');

var Rapptor = function(options) {

  options = options || {};

  this.cwd = options.cwd || process.cwd();

  //load up config
  this._setupConfig();

  var serverConfig = _.cloneDeep(this.config.server);
  serverConfig.app = this.config;
  serverConfig.cache = {
    engine: require('catbox-mongodb'),
    partition: this.config.cache.partition || this.config.mongo.db,
    host: this.config.cache.host || this.config.mongo.params.hosts[0].host,
    port: this.config.cache.port || this.config.mongo.params.hosts[0].port,
    username: this.config.cache.username || this.config.mongo.params.username,
    password: this.config.cache.password || this.config.mongo.params.password
  };

  this.server = new Hapi.Server(serverConfig);

  this.server.app.config = this.config;

  this.plugins = [];
  this._setupLogging();
  this._readPlugins();

  this.loadPlugin('hapi-auto-loader', {
    cwd: this.cwd,
    routes: {
      path: this.config.structure.routes,
      base: this.config.routes.base,
      context: this.config.routes.context
    },
    partials: {
      path: this.config.structure.partials
    },
    helpers: {
      path: this.config.structure.helpers
    },
    methods: {
      path: this.config.structure.methods
    }
  });

  this.server.connection(this.config.connection);
};

Rapptor.prototype._setupConfig = function() {

  //rapptor defaults
  this.config = loadConfig({
    path: [
      __dirname + '/conf',
      this.cwd + '/conf'
    ]
  });

  //port
  if (process.env.PORT) {
    this.config.connection.port = process.env.PORT;
  }

  this.config.cwd = this.cwd;

  //parse mongo info for plugins that require it split out (catbox-mongodb)
  this.config.mongo.params = mongodbUri.parse(this.config.mongo.url);


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
    value = value || {};
    if (value._enabled === false) {
      return;
    }
    if (!value._nativePlugin) {
      if (key[0] == '.') {
        key = path.join(self.cwd, key);
      } else {
        key = path.join(self.cwd, 'node_modules', key);
      }
    }
    delete value._enabled;
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

Rapptor.prototype._setupViews = function() {
  var self = this;
  var viewPath = path.join(this.cwd, this.config.structure.views);
  if (!fs.existsSync(viewPath)) {
    return;
  }
  var viewConfig = {
    engines: {
      html: this.server.app.handlebars
    },
    path: path.join(viewPath, 'pages'),
    isCached: (this.config.env == 'prod')
  };

  this.server.views(viewConfig);

  this.server.ext('onPreResponse', function(request, reply) {
    var response = request.response;

    if (response.variety === 'view') {

      var context = response.source.context || {};

      context.env = self.config.env;

      if (typeof self.getViewData === 'function') {
        self.getViewData(context, request, self.config);
      }
      response.source.context = context;

      if (request.query.json == '1') {
        return reply(response.source.context);
      }

    } else if (response.isBoom && self.config.views.errors) {

      var payload = response.output.payload;


      return reply.view(self.config.views.errors, {
        statusCode: response.output.statusCode,
        error: payload.error,
        message: payload.message
      }).code(response.output.statusCode);
    }

    reply.continue();
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

Rapptor.prototype.start = function(callback) {
  var self = this;

  this.server.register(this.plugins, function(err) {
    if (err) {
      throw err;
    }

    // load up rapptor budled methods and helpers
    require('hapi-auto-loader')(self.server, {
      cwd: __dirname,
      routes: false,
      partials: false
    }, function(err) {
      if (err) {
        throw err;
      }

      self._setupViews();
      self._setupAssets();
      self.server.start(function() {
        self.server.log(['server', 'info'], 'Server started '+ self.server.info.uri);
        if (callback) {
          callback(self.server);
        }
      });
    });

  });
};

module.exports = Rapptor;
