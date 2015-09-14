# @blinkmobile/is-indexeddb-reliable

[![npm module](https://img.shields.io/npm/v/@blinkmobile/is-indexeddb-reliable.svg)](https://www.npmjs.com/package/@blinkmobile/is-indexeddb-reliable)

does this browser provide a good IndexedDB implementation?


## API

### `sync()`

- @returns {`Boolean`}

Perform basic feature-detection and return a synchronous result

Avoids time-consuming or resource-intensive approaches

### `quick(callback)`

- @param {`resultCallback`} callback

Exercise (asynchronous) storage API enough to establish confidence that it works

Avoids time-consuming or resource-intensive approaches

### `thorough(callback)` (NOT IMPLEMENTED)

- @param {`resultCallback`} callback

Exercise (asynchronous) storage API without care for time taken, etc

### Callback: resultCallback

- @param {Boolean} result of the feature-detect


## Example

```javascript
isIndexedDBReliable.sync(); // true|false

isIndexedDBReliable.quick(function (result) {
  // result = true|false
});
```
