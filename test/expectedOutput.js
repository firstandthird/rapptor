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
  verbose: true,
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
      uncaughtException: true
    },
    'hapi-require-https': {
      _enabled: false
    },
    'hapi-method-loader': {
      cwd: '/home/ubuntu/Documents/GitHub/rapptor',
      verbose: true,
      path: '/home/ubuntu/Documents/GitHub/rapptor/methods',
      autoLoad: true
    },
    'hapi-route-loader': {
      _dependencies: ['hapi-method-loader'],
      cwd: '/home/ubuntu/Documents/GitHub/rapptor',
      prefix: '',
      verbose: true
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
