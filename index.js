'use strict';

// our modules

var close = require('./lib/close-db');
var runCallback = require('./lib/run-callback');
var runBrokenBadTest = require('./lib/broken-bad');

// this module

var UTIL_NAME = 'isIndexedDBReliable';
var DB_NAME = UTIL_NAME + '-test';

var api;

/**
 * @returns {Boolean} basic feature-detect result
 */
function sync () {
  var NAME = DB_NAME + '-sync';
  var req;
  api = global.indexedDB || global.mozIndexedDB || global.webkitIndexedDB || global.msIndexedDB;
  if (!api) {
    return false;
  }
  if ('deleteDatabase' in api) {
    try {
      req = api.open(NAME, 1);
      if ('onsuccess' in req && 'onupgradeneeded' in req) {
        req.onerror = function () {
          close(api, req.result, NAME);
        };
        req.onsuccess = function () {
          close(api, req.result, NAME);
        };
        return true;
      }
    } catch (err) {
      console.error(err);
      return !err;
    }
  }
  return false;
}

/**
 * @callback resultCallback
 * @param {Boolean} result of the feature-detect
 */

/**
 * @param {resultCallback} callback
 */
function quick (callback) {
  if (!sync()) {
    runCallback(callback, false);
    return;
  }

  runBrokenBadTest(api, function (err) {
    if (err) {
      runCallback(callback, false);
      return;
    }
    runCallback(callback, true);
  });
}

/**
 * @param {resultCallback} callback
 */
function thorough (callback) {
  runCallback(callback, false);
}

module.exports = {
  sync: sync,
  quick: quick,
  thorough: thorough
};
