import Ember from 'ember';
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
import fabricate from '../helpers/fabricate';

var store;

module('async copying', {
  beforeEach: function() {
    store = fabricate(startApp(), true);
  }
});

test('it shallow copies relation', function(assert) {
  assert.expect(1);

  return Ember.run(function() {
    return store.find('fooBar', '1').then( function(fooBar) {

      return fooBar.copy().then(function (copy) {
        assert.equal(copy.get('fooFix.id'), '1');
      });
    });
  });
});

test('it copies belongsTo relation', function(assert) {
  assert.expect(2);

  return Ember.run(function() {
    return store.find('bar', '1').then( function(bar) {

      return bar.copy().then(function (copy) {
        assert.notEqual(copy.get('foo.id'), bar.get('foo.id'));
        assert.equal(copy.get('foo.property'), 'prop1');
      });
    });
  });
});

test('it copies hasMany relation', function(assert) {
  assert.expect(5);

  return Ember.run(function() {
    return store.find('baz', '1').then( function(baz) {

      return baz.copy().then(function (copy) {
        assert.equal(copy.get('foos.length'), 2);
        assert.notEqual(copy.get('foos.firstObject.id'), '1');
        assert.notEqual(copy.get('foos.lastObject.id'), '2');
        assert.equal(copy.get('foos.firstObject.property'), 'prop1');
        assert.equal(copy.get('foos.lastObject.property'), 'prop2');
      });
    });
  });
});

test('it copies complex objects', function(assert) {
  assert.expect(6);

  return Ember.run(function() {
    return store.find('multi', '1').then( function(multi) {

      return multi.copy().then(function (copy) {
        assert.notEqual(copy.get('bars.firstObject.id'), '1');
        assert.notEqual(copy.get('bars.firstObject.foo.id'), '1');
        assert.equal(copy.get('bars.firstObject.foo.property'), 'prop1');
        assert.notEqual(copy.get('baz.id'), '1');
        assert.notEqual(copy.get('baz.foos.lastObject.id'), '2');
        assert.equal(copy.get('baz.foos.lastObject.property'), 'prop2');
      });
    });
  });
});

test('it copies empty objects', function(assert) {
  assert.expect(3);

  return Ember.run(function() {
    return store.find('multi', '2').then( function(multi) {

      return multi.copy().then(function (copy) {
        assert.notEqual(copy.get('id'), '2');
        assert.equal(copy.get('bars.length'), 0);
        assert.equal(copy.get('baz.foos.firstObject.property'), 'prop1');
      });
    });
  });
});

module('sync copying', {
  beforeEach: function() {
    store = fabricate(startApp(), false);

    return Ember.RSVP.all(['foo','bar','baz','multi','fooBar','fooFix'].map(function(type) {
      return store.find(type);
    }));
  }
});

test('it shallow copies relation', function(assert) {
  assert.expect(1);

  var fooBar = store.getById('fooBar', '1');
  return Ember.run(function() {
    return fooBar.copy().then(function (copy) {
      assert.equal(copy.get('fooFix.id'), '1');
    });
  });
});

test('it copies belongsTo relation', function(assert) {
  assert.expect(2);

  var bar = store.getById('bar', '1');
  return Ember.run(function() {
    return bar.copy().then(function (copy) {
      assert.notEqual(copy.get('foo.id'), bar.get('foo.id'));
      assert.equal(copy.get('foo.property'), 'prop1');
    });
  });
});

test('it copies hasMany relation', function(assert) {
  assert.expect(5);

  var baz = store.getById('baz', '1');
  return Ember.run(function() {
    return baz.copy().then(function (copy) {
      assert.equal(copy.get('foos.length'), 2);
      assert.notEqual(copy.get('foos.firstObject.id'), '1');
      assert.notEqual(copy.get('foos.lastObject.id'), '2');
      assert.equal(copy.get('foos.firstObject.property'), 'prop1');
      assert.equal(copy.get('foos.lastObject.property'), 'prop2');
    });
  });
});

test('it copies complex objects', function(assert) {
  assert.expect(6);

  var multi = store.getById('multi', '1');
  return Ember.run(function() {
    return multi.copy().then(function (copy) {
      assert.notEqual(copy.get('bars.firstObject.id'), '1');
      assert.notEqual(copy.get('bars.firstObject.foo.id'), '1');
      assert.equal(copy.get('bars.firstObject.foo.property'), 'prop1');
      assert.notEqual(copy.get('baz.id'), '1');
      assert.notEqual(copy.get('baz.foos.lastObject.id'), '2');
      assert.equal(copy.get('baz.foos.lastObject.property'), 'prop2');
    });
  });
});

test('it copies empty objects', function(assert) {
  assert.expect(3);

  var multi = store.getById('multi', '2');
  return Ember.run(function() {
    return multi.copy().then(function (copy) {
      assert.notEqual(copy.get('id'), '2');
      assert.equal(copy.get('bars.length'), 0);
      assert.equal(copy.get('baz.foos.firstObject.property'), 'prop1');
    });
  });
});