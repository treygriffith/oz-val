/**
 * Module dependencies
 */
var value = require('value');

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

function render (el, val, scope) {

  var change = this.change.bind(this);

  // set form value
  if(val !== undefined) value(el, val);

  // listen for changes to values
  onChange(this.events, el, function (val) {
    change(scope, val);
  });
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
