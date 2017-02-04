# Rapptor

Rapptor is a lightweight library that sits on top of [hapi](http://hapijs.com).

## Features

* Configuration and plugin management via yaml with [hapi-confi](https://github.com/firstandthird/hapi-confi).
* Automatically add any route in the `routes` directory with [hapi-route-loader](https://github.com/firstandthird/hapi-route-loader).
* Automatically add any method in the `methods` directory with [hapi-method-loader](https://github.com/firstandthird/hapi-method-loader).
* Logging with [hapi-logr](https://github.com/firstandthird/hapi-logr).

## Install

`npm install --save rapptor`

## Usage:

Add the following to your package.json:

```json
{
  "scripts": {
    "start": "rapptor"
  }
}
```

Then run: `npm start`

### Adding a plugin

Open up `conf/default.yaml` and add the following:

```yaml
plugins:
  hapi-plugin-name:
    someOption: "someValue"
```

See more information on configuration in [hapi-confi](https://github.com/firstandthird/hapi-confi).

### Adding a route

Add a file: `routes/someroute.js` and add the following:

```javascript
exports.homepage = {
  path: '/',
  method: 'GET'
  handler(request, reply) {
    reply('homepage!');
  }
}
```

Now if you go to `http://localhost:8080/` you should see `homepage!`.

See more information on route loading in [hapi-route-loader](https://github.com/firstandthird/hapi-route-loader).

### Adding a method

Add a file: `methods/somemethod.js` and then add the following:

```javascript
module.exports = {
  method(arg, done) {
    //some stuff
    done();
  }
}
```

Now you can call `server.method.somemethod()` in your code.

See more information on method loading in [hapi-method-loader](https://github.com/firstandthird/hapi-method-loader).
