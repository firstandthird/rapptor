'use strict';
const Hapi = require('hapi');
const hapiConfi = require('hapi-confi');

class Rapptor {
  constructor(options) {
    this.options = options || {};
    this.options.cwd = this.options.cwd || process.cwd();
    const projectConfig = this.options.configPath || `${this.options.cwd}/conf`;
    // inject rapptor config first
    const configPaths = [
      `${__dirname}/conf`,
      projectConfig,
      { path: this.options.cwd, prefix: 'rapptor' }
    ];
    this.options.configPath = configPaths;
    if (!this.options.envPrefix) {
      this.options.envPrefix = 'rapptor';
    }
    this.options.configUrl = process.env.RAPPTOR_CONFIG_URL;
  }

  // callback should be an async function
  before(callback) {
    this.options.before = callback;
  }

  start() {
    return new Promise(async (resolve, reject) => {
      try {
        const { server, config } = await hapiConfi(Hapi, this.options);
        this.config = config;
        this.server = server;
        const uri = process.env.VIRTUAL_HOST || server.info.uri;
        process.on('SIGTERM', () => {
          this.stop(() => { process.exit(0); });
        });
        await server.start();
        server.log(['server', 'notice'], `Server started: ${uri}`);
        return resolve({ server, config });
      } catch (e) {
        return reject(e);
      }
    });
  }

  stop() {
    return new Promise( async (resolve, reject) => {
      await this.server.stop({ timeout: 5 * 1000 });
      resolve();
    });
  }
}

Rapptor.prototype.stop = async function() {
  await this.server.stop();
};

module.exports = Rapptor;
