'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.replaceUrlQuery = replaceUrlQuery;
exports.pushUrlQuery = pushUrlQuery;
exports.replaceInUrlQuery = replaceInUrlQuery;
exports.pushInUrlQuery = pushInUrlQuery;
exports.multiReplaceInUrlQuery = multiReplaceInUrlQuery;
exports.multiPushInUrlQuery = multiPushInUrlQuery;
exports.updateUrlQuerySingle = updateUrlQuerySingle;
exports.updateUrlQueryMulti = updateUrlQueryMulti;

var _queryString = require('query-string');

var _urlQueryConfig = require('./urlQueryConfig');

var _urlQueryConfig2 = _interopRequireDefault(_urlQueryConfig);

var _UrlUpdateTypes = require('./UrlUpdateTypes');

var _UrlUpdateTypes2 = _interopRequireDefault(_UrlUpdateTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLocation(location) {
  if (location) {
    return location;
  }

  // if no location provided, check history
  var history = _urlQueryConfig2.default.history;

  // if not in history, use window

  return history.location ? history.location : window.location;
}

function mergeLocationQueryOrSearch(location, newQuery) {
  // if location.query exists, update the query in location. otherwise update the search string
  // replace location.query
  if (location.query) {
    return _extends({}, location, {
      query: newQuery,
      search: undefined });
  }

  // replace location.search
  var queryStr = (0, _queryString.stringify)(newQuery);
  return _extends({}, location, {
    search: queryStr.length ? '?' + queryStr : undefined
  });
}

function updateLocation(newQuery, location) {
  location = getLocation(location);

  // remove query params that are nully or an empty strings.
  // note: these values are assumed to be already encoded as strings.
  var filteredQuery = Object.keys(newQuery).reduce(function (queryAccumulator, queryParam) {
    var encodedValue = newQuery[queryParam];
    if (encodedValue != null && encodedValue !== '') {
      queryAccumulator[queryParam] = encodedValue;
    }

    return queryAccumulator;
  }, {});

  var newLocation = mergeLocationQueryOrSearch(location, filteredQuery);

  // remove the key from the location
  delete newLocation.key;

  return newLocation;
}

function updateInLocation(queryParam, encodedValue, location) {
  location = getLocation(location);

  // if a query is there, use it, otherwise parse the search string
  var currQuery = location.query || (0, _queryString.parse)(location.search);

  var newQuery = _extends({}, currQuery, _defineProperty({}, queryParam, encodedValue));

  // remove if it is nully or an empty string when encoded
  if (encodedValue == null || encodedValue === '') {
    delete newQuery[queryParam];
  }

  var newLocation = mergeLocationQueryOrSearch(location, newQuery);

  // remove the key from the location
  delete newLocation.key;

  return newLocation;
}

/**
 * Update multiple parts of the location at once
 */
function multiUpdateInLocation(queryReplacements, location) {
  location = getLocation(location);

  // if a query is there, use it, otherwise parse the search string
  var currQuery = location.query || (0, _queryString.parse)(location.search);

  var newQuery = _extends({}, currQuery, queryReplacements);

  // remove if it is nully or an empty string when encoded
  Object.keys(queryReplacements).forEach(function (queryParam) {
    var encodedValue = queryReplacements[queryParam];
    if (encodedValue == null || encodedValue === '') {
      delete newQuery[queryParam];
    }
  });

  var newLocation = mergeLocationQueryOrSearch(location, newQuery);

  // remove the key from the location
  delete newLocation.key;

  return newLocation;
}

function replaceUrlQuery(newQuery, location) {
  var newLocation = updateLocation(newQuery, location);
  return _urlQueryConfig2.default.history.replace(newLocation);
}

function pushUrlQuery(newQuery, location) {
  var newLocation = updateLocation(newQuery, location);
  return _urlQueryConfig2.default.history.push(newLocation);
}

function replaceInUrlQuery(queryParam, encodedValue, location) {
  var newLocation = updateInLocation(queryParam, encodedValue, location);
  return _urlQueryConfig2.default.history.replace(newLocation);
}

function pushInUrlQuery(queryParam, encodedValue, location) {
  var newLocation = updateInLocation(queryParam, encodedValue, location);
  return _urlQueryConfig2.default.history.push(newLocation);
}

/**
 * Replace multiple query parameters in a URL at once with only one
 * call to `history.replace`
 *
 * @param {Object} queryReplacements Object representing the params and
 *   their encoded values. { queryParam: encodedValue, ... }
 */
function multiReplaceInUrlQuery(queryReplacements, location) {
  var newLocation = multiUpdateInLocation(queryReplacements, location);
  return _urlQueryConfig2.default.history.replace(newLocation);
}

function multiPushInUrlQuery(queryReplacements, location) {
  var newLocation = multiUpdateInLocation(queryReplacements, location);
  return _urlQueryConfig2.default.history.push(newLocation);
}

/**
 * Updates a single value in a query based on the type
 */
function updateUrlQuerySingle() {
  var updateType = arguments.length <= 0 || arguments[0] === undefined ? _UrlUpdateTypes2.default.replaceIn : arguments[0];
  var queryParam = arguments[1];
  var encodedValue = arguments[2];
  var location = arguments[3];

  if (updateType === _UrlUpdateTypes2.default.replaceIn) {
    return replaceInUrlQuery(queryParam, encodedValue, location);
  }
  if (updateType === _UrlUpdateTypes2.default.pushIn) {
    return pushInUrlQuery(queryParam, encodedValue, location);
  }

  // for these, wrap it in a whole new query object
  var newQuery = _defineProperty({}, queryParam, encodedValue);
  if (updateType === _UrlUpdateTypes2.default.replace) {
    return replaceUrlQuery(newQuery, location);
  }
  if (updateType === _UrlUpdateTypes2.default.push) {
    return pushUrlQuery(newQuery, location);
  }

  return undefined;
}

/**
 * Updates a multiple values in a query based on the type
 */
function updateUrlQueryMulti() {
  var updateType = arguments.length <= 0 || arguments[0] === undefined ? _UrlUpdateTypes2.default.replaceIn : arguments[0];
  var queryReplacements = arguments[1];
  var location = arguments[2];

  if (updateType === _UrlUpdateTypes2.default.replaceIn) {
    return multiReplaceInUrlQuery(queryReplacements, location);
  }
  if (updateType === _UrlUpdateTypes2.default.pushIn) {
    return multiPushInUrlQuery(queryReplacements, location);
  }

  if (updateType === _UrlUpdateTypes2.default.replace) {
    return replaceUrlQuery(queryReplacements, location);
  }
  if (updateType === _UrlUpdateTypes2.default.push) {
    return pushUrlQuery(queryReplacements, location);
  }

  return undefined;
}