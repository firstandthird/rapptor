'use strict';

exports.invalidCookie = {
  method: 'GET',
  path: '/invalidCookie',
  handler: (request, h) => 'celery is not a cookie'
};
