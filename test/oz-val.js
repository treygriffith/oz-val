
var Oz = require('oz');
var ozScope = require('oz-scope');
var ozVal = require('oz-val');
var val = require('value');
var assert = require('assert');
var trigger = require('trigger-event');
var children = require('children');

Oz
  .use(ozScope)
  .use(ozVal);

describe('Rendering', function(){

  it('should not display undefined as a form value', function(){
    var els = children(Oz.render('<input oz-val="name">', {}));

    assert(val(els[0]) === '');
  });

  it('should render form values', function(){
    var el = children(Oz.render('<input type="text" oz-val="person.name" />', { person: { name: 'Tobi' } }))[0];
    assert('Tobi' == val(el));
  });
});

describe("Updating", function() {

  it('should update form values', function(){

    var template = Oz('<input type="text" oz-val="person.name" />');
    var el = children(template.render({ person: { name: 'Tobi' } }))[0];
    assert('Tobi' == val(el));

    template.update({ person: { name: 'Brian' } });

    assert('Brian' == val(el));
  });

  it('should emit scoped form events', function (next) {
    var template = Oz('<div oz-scope="person"><input oz-val="name"></div>');

    var el = children(children(template.render())[0])[0];

    template.on('change:name', function () {
      assert(false);
    });

    template.on('change:person.name', function () {
      assert(true);
      next();
    });

    val(el, 'Tobi');

    trigger(el, 'change');
  });

});
