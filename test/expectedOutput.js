module.exports = {
  envVars: {
    gitCommit: '',
    gitBranch: '',
    port: 8080,
    routePrefix: '',
    healthToken: false,
    enableProm: false,
    forceHttps: false,
    logRequests: false,
  },
  name: 'rapptor',
  verbose: false,
  server: {
    debug: false,
    port: 8080,
    address: '0.0.0.0'
  },
  routePrefix: '',
  plugins: {
    'hapi-health': {
      token: false,
      endpoint: '/health',
      auth: false
    },
    'hapi-logr': {
      unhandledRejection: true,
      uncaughtException: true,
      reporters: {
        sentry: {
          reporter: 'logr-sentry',
          options: {
            enabled: false,
            dsn: '',
            environment: 'dev',
            logger: 'rapptor',
            filter: ['error', 'warning', 'user-error', 'server-error', 'sentry']
          }
        }
      }
    },
    'hapi-require-https': {
      _enabled: false
    },
    'hapi-method-loader': {
      verbose: false,
      autoLoad: true
    },
    'hapi-route-loader': {
      prefix: '',
      verbose: false
    },
    'hapi-log-response': {
      requests: false,
      includeEventTags: true,
      ignoreUnauthorizedTry: true
    },
    'hapi-trailing-slash': {
      method: 'remove',
      statusCode: 301
    }
  }
};
