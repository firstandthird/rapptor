module.exports = {
  envVars: {
    port: 8080,
    routePrefix: '',
    healthToken: false,
    timing: false,
    threshold: 300,
    cacheStatsInterval: false,
    cacheStatsEnabled: false,
    cacheStatsVerbose: false,
    opsInterval: 0,
    opsEnabled: false,
    forceHttps: false,
    logRequests: false,
    sentryDsn: ''
  },
  name: 'rapptor',
  verbose: false,
  server: {
    debug: false,
    routes: {
      state: {
        failAction: 'ignore'
      }
    },
    port: 8080,
    address: '0.0.0.0'
  },
  routePrefix: '',
  sentryFilter: ['error', 'warning', 'user-error', 'server-error', 'sentry'],
  plugins: {
    'hapi-health': {
      token: false,
      endpoint: '/health',
      auth: false
    },
    'hapi-trailing-slash': {
      method: 'remove',
      statusCode: 301
    },
    'hapi-logr': {
      unhandledRejection: true,
      uncaughtException: true
    },
    'hapi-timing': { _enabled: false, threshold: 300 },
    'hapi-cache-stats': { interval: false, _enabled: false, verbose: false },
    'hapi-oppsy': { _enabled: false, interval: 0, logCpu: false, logMemory: false },
    'hapi-require-https': { _enabled: false },
    'hapi-method-loader': {
      cwd: '/home/ubuntu/Documents/GitHub/rapptor',
      verbose: false,
      path: '/home/ubuntu/Documents/GitHub/rapptor/methods',
      autoLoad: true
    },
    'hapi-route-loader': {
      cwd: '/home/ubuntu/Documents/GitHub/rapptor',
      prefix: '',
      verbose: false
    },
    'hapi-log-response': {
      requests: false,
      includeEventTags: true,
      ignoreUnauthorizedTry: true,
    }
  }
};
