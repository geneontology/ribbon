'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = urlQueryDecoder;

var _serialize = require('./serialize');

/**
 * Decodes a query based on the config. It compares against cached values to see
 * if decoding is necessary or if it can reuse old values.
 *
 * @param {Object} query The query object (typically from props.location.query)
 *
 * @return {Object} the decoded values `{ key: decodedValue, ... }`
 */
function urlQueryDecoder(config) {
  var cachedQuery = void 0;
  var cachedDecodedQuery = void 0;

  return function decodeQueryWithCache(query) {
    // decode the query
    var decodedQuery = Object.keys(config).reduce(function (decoded, key) {
      var keyConfig = config[key];
      // read from the URL key if provided, otherwise use the key
      var _keyConfig$queryParam = keyConfig.queryParam;
      var queryParam = _keyConfig$queryParam === undefined ? key : _keyConfig$queryParam;

      var encodedValue = query[queryParam];

      var decodedValue = void 0;
      // reused cached value
      if (cachedQuery && cachedQuery[queryParam] !== undefined && cachedQuery[queryParam] === encodedValue) {
        decodedValue = cachedDecodedQuery[key];

        // not cached, decode now
        // only decode if no validate provided or validate is provided and the encoded value is valid
      } else {
        decodedValue = (0, _serialize.decode)(keyConfig.type, encodedValue, keyConfig.defaultValue);
      }

      // validate the decoded value if configured. set to undefined if not valid
      if (decodedValue !== undefined && keyConfig.validate && !keyConfig.validate(decodedValue)) {
        decodedValue = undefined;
      }

      decoded[key] = decodedValue;
      return decoded;
    }, {});

    // update the cache
    cachedQuery = query;
    cachedDecodedQuery = decodedQuery;

    return decodedQuery;
  };
}