"use strict";

exports.__esModule = true;
exports.default = subqueryOmit;
/**
 * Helper function to get only parts of a query. Specify
 * which parameters to omit.
 */
function subqueryOmit(query) {
  for (var _len = arguments.length, omitParams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    omitParams[_key - 1] = arguments[_key];
  }

  if (!query) {
    return query;
  }

  return Object.keys(query).filter(function (param) {
    return !omitParams.includes(param);
  }).reduce(function (newQuery, param) {
    newQuery[param] = query[param];
    return newQuery;
  }, {});
}