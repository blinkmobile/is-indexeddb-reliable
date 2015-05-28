/*globals isIndexedDBReliable:false*/

(function () {
  'use strict';

  var list = document.createElement('ul');

  document.body.appendChild(list);

  function log (msg) {
    list.insertAdjacentHTML('beforeend', '<li>' + msg + '</li>');
  }

  function logQuick (result) {
    log('quick: ' + result);
  }

  function logThorough (result) {
    log('thorough: ' + result);
  }

  // sync
  log('sync: ' + isIndexedDBReliable.sync());

  // quick
  isIndexedDBReliable.quick(logQuick);

  // thorough
  isIndexedDBReliable.thorough(logThorough);

}());
