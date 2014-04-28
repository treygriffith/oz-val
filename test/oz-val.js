
var Oz = require('oz');
var ozScope = require('oz-scope');
var assert = require('assert');
var trigger = require('trigger-event');
var children = require('children');

Oz.use(ozScope);

describe('Rendering', function(){

  it('should not display undefined as a form value', function(){
    var els = children(Oz.render('<input oz-val="name">', {}));

    assert(els[0].value === '');
  });

  it('should render form values', function(){
    var el = children(Oz.render('<input type="text" oz-val="person.name" />', { person: { name: 'Tobi' } }))[0];
    assert('Tobi' == children(el)[0].value);
  });
});

describe("Updating", function() {

  it('should update form values', function(){

    var template = Oz('<input type="text" oz-val="person.name" />');
    var el = children(template.render({ person: { name: 'Tobi' } }))[0];
    assert('Tobi' == children(el)[0].value);

    template.update({ person: { name: 'Brian' } });

    assert('Brian' == children(el)[0].value);
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

    el.value = 'Tobi';

    trigger(el, 'change');
  });

});
