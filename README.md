oz-val
========

Form value tag for [Oz](http://github.com/treygriffith/oz).


Installation
------------

Using component:

```
$ component install treygriffith/oz-val
```

Using a script tag (UMD compatible)

```
<script src="./oz-val.min.js"></script>
```

Usage
-----

Bind a form element's value to a template property. See [Two-way Bindings](http://github.com/treygriffith/oz#two-way-bindings) for information on how to update the data model with data from the template.

Notation:

```html
<input oz-val="name">
```

Example:

```javascript
var context = {
  name: "Tobi"
};
```

```html
<input oz-val="name" value="Tobi">
```

License
-------
MIT
