'use strict';

exports.__esModule = true;

var _urlQueryReducer = require('./urlQueryReducer');

var _urlQueryReducer2 = _interopRequireDefault(_urlQueryReducer);

var _urlQueryConfig = require('../urlQueryConfig');

var _urlQueryConfig2 = _interopRequireDefault(_urlQueryConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Middleware to handle updating the URL query params
 */
var urlQueryMiddleware = function urlQueryMiddleware() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        // if not a URL action, do nothing.
        if (!action.meta || !action.meta.urlQuery) {
          return next(action);
        }

        // otherwise, handle with URL handler -- doesn't go to Redux dispatcher
        // update the URL

        // use the default reducer if none provided
        var reducer = options.reducer || _urlQueryConfig2.default.reducer || _urlQueryReducer2.default;

        // if configured to read from the redux store (react-router-redux), do so and pass it to
        // the reducer
        var readLocationFromStore = options.readLocationFromStore == null ? _urlQueryConfig2.default.readLocationFromStore : options.readLocationFromStore;

        if (readLocationFromStore) {
          var location = readLocationFromStore(getState());
          reducer(action, location);
        } else {
          reducer(action);
        }

        // shortcircuit by default (don't pass to redux store), unless explicitly set
        // to false.
        if (options.shortcircuit === false) {
          return next(action);
        }

        return undefined;
      };
    };
  };
};

exports.default = urlQueryMiddleware;