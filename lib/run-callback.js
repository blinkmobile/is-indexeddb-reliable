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
