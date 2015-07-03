var loadConfig = require('confi');
var Hapi = require('hapi');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

var Rapptor = function(options) {
  options = options || {};

  this.cwd = options.cwd || process.cwd();

  //load up config
  this._setupConfig();

  var serverConfig = _.cloneDeep(this.config.server);
  serverConfig.app = this.config;
  serverConfig.cache = {
    engine: require('catbox-mongodb'),
    partition: this.config.cache.partition,
    host: this.config.cache.host,
    port: this.config.cache.port,
    username: this.config.cache.username,
    password: this.config.cache.password
  };

  this.server = new Hapi.Server(serverConfig);

  this.server.app.config = this.config;

  this.plugins = [];
  this.authPlugins = [];
  this._setupLogging();
  this._readPlugins(this.config.authPlugins, 'authPlugins');
  this._readPlugins(this.config.plugins, 'plugins');


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

  if (process.env.RAPPTORDEBUG == 1 || process.env.RAPPTORCONFIG == 1) {
    console.log('RAPPTOR CONFIG. RAAR');
    console.log(JSON.stringify(this.config, null, '  '));
    if (process.env.RAPPTORCONFIG == 1) {
      process.exit(0);
    }
  }
};

Rapptor.prototype._readPlugins = function(arr, type) {

  var self = this;
  _.forIn(arr, function(value, key) {
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
    self.loadPlugin(key, value, type);
  });
};

Rapptor.prototype._setupLogging = function() {
  var reporters = [];

  _.forIn(this.config.logging.reporters, function(values, key) {
    if (values === false || values._enabled === false) {
      return;
    }

    delete values._enabled;

    values.reporter = require('good-'+key);

    reporters.push(values);
  });

  if (reporters.length !== 0) {
    this.config.logging.reporters = reporters;
    this.loadPlugin('good', this.config.logging);
  }

};

Rapptor.prototype.loadPlugin = function(key, options, type) {
  if (!type) {
    type = 'plugins';
  }
  this[type].push({
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
    var path = request.path;

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

      if (self.config.views.errorBlacklist && path.match(new RegExp(self.config.views.errorBlacklist))) {
        return reply.continue();
      }

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

  if (this.config.assets.mapping) {
    var assetPath = path.join(this.cwd, this.config.structure.assets, this.config.assets.mapping);
    if (fs.existsSync(assetPath)) {
      this.config.assets.mappingObj = require(assetPath);
    }
  }
  if (!this.config.assets.mappingObj) {
    this.config.assets.mappingObj = {};
  }

  var self = this;
  this.server.route({
    path: self.config.assets.path+'/{path*}',
    method: 'GET',
    config: {
      auth: false,
      cors: self.config.assets.cors,
      cache: self.config.assets.cache,
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

Rapptor.prototype._setupStrategies = function() {

  var self = this;
  _.forIn(this.config.strategies, function(value, name) {
    self.server.auth.strategy(name, value.scheme, value.mode, value.options);
  });

};

Rapptor.prototype.setup = function(callback) {
  var self = this;

  async.waterfall([
    function(done) {
      self.server.register(self.authPlugins, done);
    },
    function(done) {
      self._setupStrategies();
      done();
    },
    function(done) {
      self.server.register(self.plugins, done);
    },
    function(done) {
      self.server.plugins['hapi-auto-loader'].load({
        cwd: __dirname,
        routes: false,
        partials: false
      }, done);
    },
    function(done) {
      self.server.plugins['hapi-auto-loader'].load({
        cwd: self.cwd,
        routes: {
          path: self.config.structure.routes,
          base: self.config.routes.base,
          context: self.config.routes.context
        },
        partials: {
          path: self.config.structure.partials
        },
        helpers: {
          path: self.config.structure.helpers
        },
        methods: {
          path: self.config.structure.methods
        }
      }, done);
    },
    function(done) {
      self._setupViews();
      self._setupAssets();
      done(null, self.server);
    },


  ], callback);
};

Rapptor.prototype.callMethod = function(server, method, argv, callback) {

  callback = callback || _.noop;

  var methodFunc = _.get(server.methods, method);

  if(methodFunc) {
    var funcArgs = argv;

    for(i=0; i<funcArgs.length; i++){
      funcArgs[i] = JSON.parse(funcArgs[i]);
    }
    
    funcArgs.push(function(err, data) {
      if(err) {
        console.log('An ERROR Occured');
        console.log(err.toString());
        process.exit();
      }

      console.log('Method '+method+' Result');
      console.log(JSON.stringify(data, null, ' '));
      process.exit();

    });

    methodFunc.apply(server, funcArgs);

  } else {
    console.log('WARNING: Method ' + method + ' doesn\'t exist');
    process.exit();
  }
}

Rapptor.prototype.start = function(callback) {

  callback = callback || _.noop;

  this.setup(function(err, server){
    if (err) {
      return callback(err);
    }

    var args = process.argv.slice(2);

    if(args.shift() == 'method') {
      var method = args.shift();
      Rapptor.prototype.callMethod(server, method, args, callback);
    } else {
      server.start(function(err) {
        if (!err) {
          server.log(['server', 'info'], 'Server started '+ server.info.uri);
        }

        if (callback) {
          callback(err, server);
        }
      });
    }


  });

};

module.exports = Rapptor;
