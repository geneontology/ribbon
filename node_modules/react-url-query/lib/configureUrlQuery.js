'use strict';

exports.__esModule = true;
exports.default = configureUrlQuery;

var _urlQueryConfig = require('./urlQueryConfig');

var _urlQueryConfig2 = _interopRequireDefault(_urlQueryConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureUrlQuery(options) {
  // update the url options singleton
  Object.assign(_urlQueryConfig2.default, options);
}