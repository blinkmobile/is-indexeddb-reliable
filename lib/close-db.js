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
