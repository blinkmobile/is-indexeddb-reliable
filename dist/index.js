(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.isIndexedDBReliable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// our modules

var close = require('./close-db');

// this module

function runWrites (db, callback) {
  var tx, store;

  try {
    tx = db.transaction(['people', 'notes'], 'readwrite');
  } catch (err) {
    callback(err);
    return;
  }

  tx.onerror = function (err) {
    callback(err);
  };

  tx.oncomplete = function () {
    callback(null, null);
  };

  store = tx.objectStore('people');
  store.add({ name: 'Harry', created: (new Date()).toString() });

  store = tx.objectStore('notes');
  store.add({ note: 'blah', created: (new Date()).toString() });
}

function findEntry (db, store, prop, value, callback) {
  var tx, req;

  try {
    tx = db.transaction([store], 'readonly');
  } catch (err) {
    callback(err);
    return;
  }

  req = tx.objectStore(store).openCursor();

  req.onerror = function (err) {
    callback(err);
  };

  req.onsuccess = function () {
    var cursor = req.result;
    if (cursor) {
      if (cursor.value && cursor.value.created && cursor.value[prop] === value) {
        callback(null, cursor.value);
        return;
      }
      cursor.continue();
      return;
    }
    callback(new Error('test entry not found'), null);
  };
}

function runReads (db, callback) {
  findEntry(db, 'people', 'name', 'Harry', function (err) {
    if (err) {
      callback(err);
      return;
    }
    findEntry(db, 'notes', 'note', 'blah', callback);
  });
}

// http://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad
module.exports = function runBrokenBadTest (api, callback) {
  var BB_NAME = 'idbTest-brokenBad-safari';
  var req = api.open(BB_NAME, 1);

  req.onerror = function (err) {
    close(req.result, BB_NAME);
    callback(err);
  };

  req.onupgradeneeded = function () {
    var db;
    db = req.result;
    if (!db.objectStoreNames.contains('people')) {
      db.createObjectStore('people', { autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('notes')) {
      db.createObjectStore('notes', { autoIncrement: true });
    }
  };

  req.onsuccess = function () {
    runWrites(req.result, function (wErr) {
      if (wErr) {
        close(req.result, BB_NAME);
        callback(wErr);
        return;
      }
      runReads(req.result, function (rErr) {
        close(req.result, BB_NAME);
        callback(rErr);
      });
    });
  };
};

},{"./close-db":2}],2:[function(require,module,exports){
'use strict';

module.exports = function close (api, db, name) {
  try {
    db.close();
    api.deleteDatabase(name);
    return true;
  } catch (ignore) {
    return false;
  }
};

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function runCallback (callback, arg) {
  try {
    callback(arg);
  } catch (err) {
    if (global.console && global.console.error) {
      global.console.error('error thrown during callback');
      global.console.error(err);
    }
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/broken-bad":1,"./lib/close-db":2,"./lib/run-callback":3}]},{},[4])(4)
});