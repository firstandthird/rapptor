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

Rapptor is a server framework that vastly simplifies use of [hapi](http://hapijs.com) servers by leveraging easy-to-read YAML config files instead of Javascript. If you use the hapi library, the Rapptor framework is a must-have!

## Features

* Configure and manage server plugins with YAML
* Automatically load and configure server routes from the __routes__ directory
* Automatically load and configure server methods from the __methods__ directory
* Configure logging from YAML
* Configure server health monitoring and alerts
* Track server metrics using [Prometheus](https://prometheus.io/) metrics.


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

Then run: `npm start` to launch the server!

### Directory Layout
The following is an example of the directory layout for a rapptor project:
```
/conf
│   ├── default.yaml/
│   ├── default-envs.yaml/
│   ├── dev.yaml/
/methods
│   ├── foo_method.js/
│   ├── auth_methods
│       ├── login.js/
│       ├── logout.js/
/plugins
│   ├── my_security_plugin.js/
/routes
├── api
│   ├── foo_route.js/
│   ├── bat/
│       ├── bif_route.js/
├── login.js
├── logout.js
/node_modules
│   ...
package.json
```

Configuration files are in _/conf_, routes are defined in the _/routes_ directory, server methods are defined in _/methods_ and server plugins are defined either in _/plugins_ or installed automatically by npm in _node_modules_.

### Configuring

All server configuration takes place in YAML files located in the _/conf_ directory.  At minimum you should have a _conf/default.yaml_ file but you can
have as many configuration files in _/conf_ as you want.

File names beginning with _default-<whatever>.yaml form will always be loaded in the order they appear in the directory. Files lacking the _default-_ prefix will only be loaded if they match ENV.NODE_ENV.  So you can have a _dev.yaml_ that only loads when NODE_ENV is dev and a _production.yaml_ that only loads when NODE_ENV is production.

  Inside your configuration files you can access environment variables and create/access more complex variables inside YAML in a flexible manner with the double-bracket notation like this:

```yaml
github:
  token: '{{ENV.GITHUB_TOKEN}}'
  endpoint: '{{ENV.GITHUB_REPO}}'
githubToken: '{{github.token}}'

```

  This could cause problems if you forgot to define the correct environment variables in your shell, so for safety it is best to use the built-in env handlers like so:

```yaml
aString: '{{getEnv("EXAMPLE_ENV_VARIABLE", "the backup value!")}}'
aBoolean: '{{truthyEnv("IS_TRUTHY")}}'
```

since this will set `aValue` to the string "`the backup value!`" if you didn't define EXAMPLE_ENV_VARIABLE and will coerce `aBoolean` to be either 'true' or 'false' depending on whether ENV.IS_TRUTHY was defined and is 'truthy'.  For example if IS_TRUTHY is the literal string 'false' or the numeric -1 then it will be a boolean 'false' value.

More information on configuration file format is available at __[hapi-confi](https://github.com/firstandthird/hapi-confi)__.


### Adding a plugin

Plugins can be added and configured by listing them in a `plugins:` section like so:

```yaml
plugins:
  my_security_plugin:
    authRoute: '/auth'
    keys:
      serverKey: '{{ENV.SERVER_API_KEY"}}'
      adminKey: '1234abc'
```
 This will cause hapi to look for "my_security_plugin" in the _plugins_ directory and then in _node_modules_ for a plugin named _my_security_plugin_.  Once found it will be registered with your hapi server along with any of the underlying options. Note that `plugins:` could appear in any of your conf files, so you can have a _default-plugins.yaml_ file just for listing your plugins, or have different plugins in a production.yaml file that will only load when you set NODE_ENV to production.

By default rapptor includes the following core plugins:
- [hapi-favicon](https://github.com/firstandthird/hapi-favicon)
- [hapi-health](https://github.com/firstandthird/hapi-health)
- [hapi-prom](https://github.com/firstandthird/hapi-prom)
- [hapi-logr](https://github.com/firstandthird/hapi-logr)
- [hapi-require-https](https://github.com/firstandthird/hapi-require-https)
- [hapi-method-loader](https://github.com/firstandthird/hapi-method-loader)
- [hapi-route-loader](https://github.com/firstandthird/hapi-route-loader)
- [hapi-trailing-slash](https://github.com/firstandthird/hapi-trailing-slash)

### Adding a route

Create a file: `routes/someroute.js` and add the following:

```javascript
exports.homepage = {
  path: '/',
  method: 'GET'
  handler(req, h) {
    return 'homepage!';
  }
}
```

Now if you launch rapptor and go to `http://localhost:8080/` you should see `homepage!`.

For more information on configuring route loading see [hapi-route-loader](https://github.com/firstandthird/hapi-route-loader).

### Adding a method

Add a file: `methods/foo.js` and then add the following:

```javascript
module.exports = {
  method() {
    //some stuff
    this.log(['tag1', 'tag2'], "Hello World!");
  }
}
```

This will cause hapi to register foo() as a server method, so  `server.methods.foo()` will be available in your code.  Server methods will be bound to the server, so `this.log` is equivalent to `server.log`.

For more information on method loading in rapptor see [hapi-method-loader](https://github.com/firstandthird/hapi-method-loader).

## Additional Features
#### Logging

Rapptor also includes facilities for logging in various formats and output media via the [hapi-logr](https://github.com/firstandthird/hapi-logr) plugin. By default hapi-logr prints to console but can be configured to log to just about any output such as a [Slack channel](https://github.com/firstandthird/logr-slack) or [text messages via SNS](https://github.com/firstandthird/logr-sns).  For more information see the documentation at [hapi-logr](https://github.com/firstandthird/hapi-logr).

#### Healthcheck

Rapptor includes a built-in secure healthcheck plugin, which will register an endpoint at `/health` that is protected by ENV.HEALTH_TOKEN.  Calling /health?token={HEALTH_TOKEN} will return basic metrics like server uptime, CPU level and current memory usage. This route can be polled at regular intervals from a remote script to ensure that your server is alive and available.


#### Metrics

Rapptor also includes metrics reporting via [Prometheus](https://prometheus.io/).  If ENV.ENABLE_PROM is set to true then the [hapi-prom]((https://github.com/firstandthird/hapi-prom)
server plugin will automatically begin collecting default metrics using the [prom-client](https://github.com/siimon/prom-client) package.  These metrics are available at the /metrics route on your hapi server, for more info on how to configure hapi-prom see [hapi-prom]((https://github.com/firstandthird/hapi-prom).

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
