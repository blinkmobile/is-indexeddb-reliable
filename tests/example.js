/*globals isIndexedDBReliable:false*/

(function () {
  'use strict';

  var list = document.createElement('ul');

  document.body.appendChild(list);

  function log(msg) {
    list.insertAdjacentHTML('beforeend', '<li>' + msg + '</li>');
  }

  // sync
  log('sync: ' + isIndexedDBReliable.sync());

  // quick
  isIndexedDBReliable.quick(function (result) {
    log('quick: ' + result);
  });

  // thorough
  isIndexedDBReliable.thorough(function (result) {
    log('thorough: ' + result);
  });

}());
