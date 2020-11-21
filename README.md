<h1 align="center">Rapptor</h1>

<p align="center">
  <a href="https://github.com/firstandthird/rapptor/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/rapptor/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/rapptor/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/rapptor/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
  <img src="https://img.shields.io/npm/v/rapptor.svg?label=npm&style=for-the-badge" alt="NPM" />
</p>

Rapptor is a lightweight library that sits on top of [hapi](http://hapijs.com).

## Features

* Configuration and plugin management via yaml with [hapi-confi](https://github.com/firstandthird/hapi-confi).
* Automatically add any route in the `routes` directory with [hapi-route-loader](https://github.com/firstandthird/hapi-route-loader).
* Automatically add any method in the `methods` directory with [hapi-method-loader](https://github.com/firstandthird/hapi-method-loader).
* Logging with [hapi-logr](https://github.com/firstandthird/hapi-logr).

## Installation

```sh
npm install rapptor
```

_or_

```sh
yarn add rapptor
```

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


---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
