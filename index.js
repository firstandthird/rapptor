'use strict';
const Hapi = require('hapi');
const hapiConfi = require('hapi-confi');

class Rapptor {
  constructor(options) {
    this.options = options || {};
    this.options.cwd = this.options.cwd || process.cwd();
    const projectConfig = this.options.configPath || `${this.options.cwd}/conf`;
    //inject rapptor config first
    const configPaths = [
      `${__dirname}/conf`,
      projectConfig,
      { path: this.options.cwd, prefix: 'rapptor' }
    ];
    this.options.configPath = configPaths;
  }

  before(callback) {
    this.options.before = callback;
  }

  start(done) {
    hapiConfi(Hapi, this.options, (err, server, config) => {
      if (err) {
        return done(err);
      }
      this.server = server;
      server.start((serverErr) => {
        if (!serverErr) {
          const uri = process.env.VIRTUAL_HOST || server.info.uri;
          server.log(['server', 'notice'], `Server started: ${uri}`);
        }
        done(serverErr, server, config);
      });
    });

    process.on('SIGTERM', () => {
      this.stop(() => { process.exit(0); });
    });
  }

  stop(done) {
    done = done || function() {};

    this.server.stop({ timeout: 5 * 1000 }, () => {
      done();
    });
  }
}

module.exports = Rapptor;
