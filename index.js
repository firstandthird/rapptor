'use strict';

const loadConfig = require('confi');
const Hapi = require('hapi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');

const Rapptor = function(options) {
  options = options || {};

  this.cwd = options.cwd || process.cwd();

  //load up config
  this._setupConfig();

  const serverConfig = _.cloneDeep(this.config.server);

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
  _.forIn(arr, (value, key) => {
    value = value || {};

    if (value._enabled === false) {
      return;
    }

    if (!value._nativePlugin) {
      if (key[0] == '.') {
        key = path.join(this.cwd, key);
      } else {
        key = path.join(this.cwd, 'node_modules', key);
      }
    }

    delete value._enabled;
    delete value._nativePlugin;

    this.loadPlugin(key, value, type);
  });
};

Rapptor.prototype._setupLogging = function() {
  const reporters = [];

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
  const viewPath = path.join(this.cwd, this.config.structure.views);

  if (!fs.existsSync(viewPath)) {
    return;
  }

  const viewConfig = {
    engines: {
      html: this.server.app.handlebars
    },
    path: path.join(viewPath, 'pages'),
    isCached: (this.config.env == 'prod')
  };

  this.server.views(viewConfig);

  this.server.ext('onPreResponse', (request, reply) => {
    const response = request.response;
    const path = request.path;

    if (response.variety === 'view') {
      const context = response.source.context || {};

      context.env = this.config.env;

      if (typeof this.getViewData === 'function') {
        this.getViewData(context, request, this.config);
      }

      response.source.context = context;

      if (request.query.json == '1') {
        return reply(response.source.context);
      }
    } else if (response.isBoom && this.config.views.errors) {
      if (this.config.views.errorBlacklist && path.match(new RegExp(this.config.views.errorBlacklist))) {
        return reply.continue();
      }

      if (response.output.statusCode == 500) {
        this.server.log(['error'], {
          output: response.output,
          path: request.path,
          method: request.method,
          payload: request.payload,
          stack: response.stack
        });
      }

      const payload = response.output.payload;

      return reply.view(this.config.views.errors, {
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
    const assetPath = path.join(this.cwd, this.config.structure.assets, this.config.assets.mapping);

    if (fs.existsSync(assetPath)) {
      this.config.assets.mappingObj = require(assetPath);
    }
  }

  if (!this.config.assets.mappingObj) {
    this.config.assets.mappingObj = {};
  }

  this.server.route({
    path: this.config.assets.path+'/{path*}',
    method: 'GET',
    config: {
      auth: false,
      cors: this.config.assets.cors,
      cache: this.config.assets.cache,
      handler: {
        directory: {
          path: path.resolve(this.cwd, this.config.structure.assets),
          listing: false,
          index: false
        }
      }
    }
  });
};

Rapptor.prototype._setupStrategies = function() {
  _.forIn(this.config.strategies, (value, name) => {
    this.server.auth.strategy(name, value.scheme, value.mode, value.options)
  });
};

Rapptor.prototype.setup = function(callback) {
  async.waterfall([
    done => this.server.register(this.authPlugins, done),
    done => {
      this._setupStrategies();
      done();
    },
    done => this.server.register(this.plugins, done),
    done => {
      this.server.plugins['hapi-auto-loader'].load({
        cwd: __dirname,
        routes: false,
        partials: false
      }, done);
    },
    done => {
      this.server.plugins['hapi-auto-loader'].load({
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
      }, done);
    },
    done => {
      this._setupViews();
      this._setupAssets();
      done(null, this.server);
    }
  ], callback);
};

Rapptor.prototype.callMethod = function(server, method, argv, callback) {
  callback = callback || _.noop;

  const methodFunc = _.get(server.methods, method);

  if(methodFunc) {
    const funcArgs = argv;

    for(let i=0; i<funcArgs.length; i++){
      try {
        funcArgs[i] = JSON.parse(funcArgs[i]);
      } catch(e) {
        funcArgs[i] = funcArgs[i];
      }
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

    const args = process.argv.slice(2);

    if(args.shift() == 'method') {
      const method = args.shift();
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
