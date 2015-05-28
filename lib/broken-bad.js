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

  try {
    store = tx.objectStore('people');
    store.add({ name: 'Harry', created: (new Date()).toString() });

    store = tx.objectStore('notes');
    store.add({ note: 'blah', created: (new Date()).toString() });
  } catch (err) {
    callback(err);
  }
}

function findEntry (db, store, prop, value, callback) {
  var tx, req;

  try {
    tx = db.transaction([store], 'readonly');
    req = tx.objectStore(store).openCursor();
  } catch (err) {
    callback(err);
    return;
  }

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
  var req;

  try {
    req = api.open(BB_NAME, 1);
  } catch (err) {
    callback(err);
    return;
  }

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
