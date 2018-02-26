'use strict';
const Hapi = require('hapi');
const hapiConfi = require('hapi-confi');

class Rapptor {
  constructor(options) {
    this.options = options || {};
    this.options.cwd = this.options.cwd || process.cwd();
    const prefix = this.options.configPrefix || 'rapptor';
    const projectConfig = this.options.configPath || `${this.options.cwd}/conf`;
    // inject rapptor config first
    const configPaths = [
      `${__dirname}/conf`,
      projectConfig,
      { path: this.options.cwd, prefix }
    ];
    this.options.configPath = configPaths;
    if (!this.options.envPrefix) {
      this.options.envPrefix = 'rapptor';
    }
    this.options.configUrl = process.env.RAPPTOR_CONFIG_URL;
    this.isConfigured = false;
    this.sigtermHandler = undefined;
  }

  // callback should be an async function
  before(callback) {
    this.options.before = callback;
  }

  async setup() {
    const { server, config } = await hapiConfi(Hapi, this.options);
    this.config = config;
    this.server = server;
    this.isConfigured = true;
    return { server, config };
  }

  async start() {
    if (!this.isConfigured) {
      await this.setup();
    }
    const server = this.server;
    const config = this.config;
    const uri = process.env.VIRTUAL_HOST || server.info.uri;
    this.sigtermHandler = () => {
      process.removeListener('SIGTERM', this.sigtermHandler);
      this.stop(() => { process.exit(0); });
    };
    this.sigtermHandler.bind(this);
    process.on('SIGTERM', this.sigtermHandler);
    await server.start();
    server.log(['server', 'notice'], `Server started: ${uri}`);
    return { server, config };
  }

  async stop() {
    if (this.sigtermHandler) {
      process.removeListener('SIGTERM', this.sigtermHandler);
    }
    await this.server.stop({ timeout: 5 * 1000 });
  }
}

module.exports = Rapptor;
