/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
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
    if (typeof this.options.verbose === 'undefined') {
      this.options.verbose = true;
    }
  }

  // callback should be an async function
  before(callback) {
    this.options.before = callback;
  }

  async setup() {
    // start listening for any unhandled promises
    this.unhandledPromiseHandler = async(reason, promise) => {
      // this may happen before server and server.log is configured:
      if (this.server) {
        this.server.log(['promise', 'error'], reason);
        await this.stop();
      } else {
        console.log('[promise, error]', reason);
      }
      // exit with error (unless we're just testing it):
      if (reason.toString() !== 'Error: rapptorTesting') {
        process.exit(1);
      }
    };
    this.unhandledPromiseHandler.bind(this);
    process.on('unhandledRejection', this.unhandledPromiseHandler);
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
    this.sigtermHandler = async () => {
      await this.stop('SIGTERM');
      process.exit(0);
    };
    this.sigtermHandler.bind(this);
    process.on('SIGTERM', this.sigtermHandler);
    await server.start();
    const logData = {
      message: 'Starting Server',
      uri,
      rapptorVersion: require('./package.json').version
    };
    try {
      const appVersion = require(`${this.options.cwd}/package.json`).version;
      if (appVersion) {
        logData.appVersion = appVersion;
      }
    } catch (e) {
      // not a problem just skip logging appversion
    }
    if (config.envVars.gitBranch) {
      logData.gitBranch = config.envVars.gitBranch;
    }
    if (config.envVars.gitCommit) {
      logData.gitCommit = config.envVars.gitCommit;
    }
    server.log(['server', 'start', 'notice'], logData);
    return { server, config };
  }

  async stop(stoppedBy) {
    if (this.sigtermHandler) {
      process.removeListener('SIGTERM', this.sigtermHandler);
    }
    if (this.unhandledPromiseHandler) {
      process.removeListener('unhandledRejection', this.unhandledPromiseHandler);
    }
    const tags = ['server', 'stopping', 'notice'];
    if (stoppedBy === 'SIGTERM') {
      tags.push('sigterm');
    }
    this.server.log(tags, 'Stopping server...');
    // only stop if the server is running to avoid causing an unhandled promise rejection:
    if (this.server.info.started !== 0) {
      await this.server.stop({ timeout: 5000 });
    }
    this.server.log(['server', 'stop'], 'Server stopped');
  }
}

module.exports = Rapptor;
