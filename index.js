'use strict';
const Hapi = require('hapi');
const hapiConfi = require('hapi-confi');

class Rapptor {
  constructor(options) {
    this.options = options || {};
    const projectConfig = options.configPath || `${process.cwd()}/conf`;
    //inject rapptor config first
    const configPaths = [
      `${__dirname}/conf`,
      projectConfig
    ];
    this.options.configPath = configPaths;
  }

  start(done) {
    hapiConfi(Hapi, this.options, (err, server, config) => {
      if (err) {
        return done(err);
      }
      server.start((err) => {
        done(err, server, config);
      });
    });
  }
};

module.exports = Rapptor;
