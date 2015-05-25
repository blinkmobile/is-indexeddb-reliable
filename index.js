'use strict';

/**
 * @returns {Boolean} basic feature-detect result
 */
function sync () {
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
  callback(false);
}

/**
 * @param {resultCallback} callback
 */
function thorough (callback) {
  callback(false);
}

module.exports = {
  sync: sync,
  quick: quick,
  thorough: thorough
};
