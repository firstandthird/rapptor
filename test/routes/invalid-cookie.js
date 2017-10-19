'use strict';

exports.invalidCookie = {
  method: 'GET',
  path: '/invalidCookie',
  handler: (request, reply) => reply(null, 'celery is not a cookie')
};
