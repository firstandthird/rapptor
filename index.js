'use strict';
const Hapi = require('hapi');
const hapiConfi = require('hapi-confi');

class Rapptor {
  constructor(options) {
    this.options = options || {};
    this.options.cwd = this.options.cwd || process.cwd();
    const projectConfig = options.configPath || `${options.cwd}/conf`;
    //inject rapptor config first
    const configPaths = [
      `${__dirname}/conf`,
      projectConfig
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
      server.start((serverErr) => {
        if (!serverErr) {
          server.log(['start', 'notify'], `Server started: ${server.info.uri}`);
        }
        done(serverErr, server, config);
      });
    });
  }
}

module.exports = Rapptor;
