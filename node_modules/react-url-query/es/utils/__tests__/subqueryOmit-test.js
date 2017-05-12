'use strict';

var _subqueryOmit = require('../subqueryOmit');

var _subqueryOmit2 = _interopRequireDefault(_subqueryOmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('works with nully query', function () {
  expect((0, _subqueryOmit2.default)(undefined, 'one')).toBeFalsy();
});

it('returns full input object if no params', function () {
  var input = { one: 'one', two: 'two' };
  expect((0, _subqueryOmit2.default)(input)).toEqual(input);
});

it('returns proper subquery', function () {
  expect((0, _subqueryOmit2.default)({ one: 'one', two: 'two', thr: 'ree' }, 'two', 'one')).toEqual({ thr: 'ree' });
});

it('returns an empty object when all keys omitted', function () {
  expect((0, _subqueryOmit2.default)({ one: 'one' }, 'one')).toEqual({});
});