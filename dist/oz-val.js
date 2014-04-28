
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~type@1.0.0", function (exports, module) {

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});

require.register("component~value@1.1.0", function (exports, module) {

/**
 * Module dependencies.
 */

var typeOf = require("component~type@1.0.0");

/**
 * Set or get `el`'s' value.
 *
 * @param {Element} el
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

module.exports = function(el, val){
  if (2 == arguments.length) return set(el, val);
  return get(el);
};

/**
 * Get `el`'s value.
 */

function get(el) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (el.checked) {
        var attr = el.getAttribute('value');
        return null == attr ? true : attr;
      } else {
        return false;
      }
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) return radio.value;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        if (option.selected) return option.value;
      }
      break;
    default:
      return el.value;
  }
}

/**
 * Set `el`'s value.
 */

function set(el, val) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (val) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      break;
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        radio.checked = radio.value === val;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        option.selected = option.value === val;
      }
      break;
    default:
      el.value = val;
  }
}

/**
 * Element type.
 */

function type(el) {
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);
  if (group) el = el[0];
  var name = el.nodeName.toLowerCase();
  var type = el.getAttribute('type');

  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';
  if ('select' == name) return 'select';
  return name;
}

});

require.register("oz-val", function (exports, module) {
/**
 * Module dependencies
 */
var value = require("component~value@1.1.0");

/**
 * Export plugin
 */
module.exports = function (Oz) {
  Oz.tag('oz-val', render);
};

module.exports.render = render;

/**
 * Bind form values to context
 * template: <input type="text" oz-val="person.name">
 * context: { person: { name: 'Tobi' } }
 * output: <input type="text" value="Tobi">
 * template.on('change:person.name', fn); // fired when <input> is changed
 */
// TODO: handle form elements like checkboxes, radio buttons

function render (el, ctx, prop, scope, next) {

  var val = this.get(ctx, prop)
    , self = this;

  // set form value
  if(val !== undefined) value(el, val);

  // listen for changes to values
  onChange(this.events, el, function (val) {
    self.change(self.scope(scope, prop), val);
  });

  next();
}

// bind an element to all potential `change` events, but only trigger when content changes
function onChange(events, el, fn) {

  var val = value(el);

  var changed = function(e) {
    if(value(el) !== val) fn(value(el));
    val = value(el);
  };

  events.bind(el, 'click', changed);
  events.bind(el, 'change', changed);
  events.bind(el, 'keyup', changed);
}

});

if (typeof exports == "object") {
  module.exports = require("oz-val");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("oz-val"); });
} else {
  this["oz-val"] = require("oz-val");
}
})()
