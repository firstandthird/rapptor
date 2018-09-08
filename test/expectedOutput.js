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
    }
  }
};
