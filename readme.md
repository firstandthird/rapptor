## rapptor

### Usage:

```js
const Rapptor = require('rapptor');
const rapptor = new Rapptor();
rapptor.start();
```

see example directory for a working app.

### Backwards breaking changes

 - Rapptor now requires nodejs > v4
 - Some core Hapi plugins might require initializing via plugin config

### Using in tests

Use the `.setup()` method in place of `.start()`

### Built in Handlebar helpers

All block helpers support `{{else}}`

##### {{#all}}

Checks if all passed params are true

```js
var param1 = true;
var param2 = false;
var param3 = true;
```

```html
{{#all param1 param2 param3}}
  This won't output since param2 is false.
{{/all}}
```

##### {{asset}}

Links to an asset using a cdn (if configured and env = prod).

Input:
```html
{{asset "js" "test"}}
{{asset "css" "test"}}
{{asset "image" "cat.jpg"}}
{{asset "image-path" "cat.jpg"}}
```

Output:
```html
<script src="http://cdn.example.com/_prod/test.js"></script>
<link rel="stylesheet" href="http://cdn.example.com/_prod/test.css"/>
<img src="http://cdn.example.com/_prod/cat.jpg"/>
http://cdn.example.com/_prod/cat.jpg
```

##### {{escaper}}

Runs param through `Handlebars.Utils.escapeExpression` and returns it via `Handlebars.SafeString`. Useful when nesting helpers.

```html
{{escaper unsafeString}}
```

##### {{#greaterthan}}

Checks if the first param is greater than the second param.

```html
{{#greaterthan memberCount 5}}
  There's more than five members.
{{/greaterthan}}
```

##### {{#ifequal}}

Checks if the first param equals the second. Objects are compared using `.toString()`.

```html
{{#ifequal person1 person2}}
  Person 1 and 2 are identical.
{{/ifequal}}
```

##### {{#ifnotequal}}

Inverse of `{{#ifequal}}` except doesn't compare objects.

##### {{#indexof}}

Checks if param2 exists in param1.

```html
{{#indexof 'doghouse' 'house'}}
  House is in Doghouse.
{{/indexof}}

##### {{linkify}}

Parses links in text.

```html
{{linkify sometextwithalink}}
```

##### {{log}}

Logs a param to console.

```js
var catNames = [
  'larry',
  'mark'
];
```

```html
{{log catNames}}
```

Console output:
```
[
  'larry',
  'mark'
]
```

##### {{nl2br}}

Converts newlines to `<br>`

```html
{{nl2br userComment}}
```

##### {{#or}}

Checks if param1 or param2 is true.

```html
{{#or true false}}
  At least one was true!
{{/or}}
```

##### {{stringify}}

Converts param to a JSON string. Useful for printing out in `<script>` tags. Second parameter controls if output should be pretty (indented) or not. Defaults to false.

```js
var sizes = ['large','small'];
```

```html
<script>
var sizes = {{stringify sizes true}};
</script>
```

```html
<script>
var sizes = [
  'large',
  'small'
];
</script>
```

##### {{urlencode}}

url encodes a param.

```html
{{urlencode somestring}}
```
