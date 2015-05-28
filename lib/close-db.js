/*eslint-disable no-empty*/ // explicitly want noop catches

'use strict';

module.exports = function close (api, db, name) {
  try {
    db.close();
  } catch (ignore) {}

  try {
    api.deleteDatabase(name);
  } catch (ignore) {}
};
