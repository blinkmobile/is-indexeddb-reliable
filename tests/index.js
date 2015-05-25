'use strict';

// 3rd-party modules

var test = require('tape');

// our modules

var mod = require('../index.js');

// this module

require('tape-chai');

test('module', function (t) {
  t.isObject(mod);

  t.end();
});

test('.sync()', function (t) {
  t.isFunction(mod.sync);
  t.isBoolean(mod.sync());

  t.end();
});

test('.quick()', function (t) {
  t.isFunction(mod.quick);
  mod.quick(function (result) {
    t.isBoolean(result);

    t.end();
  });
});

test('.thorough()', function (t) {
  t.isFunction(mod.thorough);
  mod.thorough(function (result) {
    t.isBoolean(result);

    t.end();
  });
});
