'use strict';

var _subquery = require('../subquery');

var _subquery2 = _interopRequireDefault(_subquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('works with nully query', function () {
  expect((0, _subquery2.default)(undefined, 'one')).toBeFalsy();
});

it('returns empty object if no params', function () {
  expect((0, _subquery2.default)({ one: 'one', two: 'two' })).toEqual({});
});

it('returns proper subquery', function () {
  expect((0, _subquery2.default)({ one: 'one', two: 'two', thr: 'ree' }, 'two', 'one')).toEqual({ one: 'one', two: 'two' });
});

it('returns a new object even if all keys match', function () {
  var input = { one: 'one' };
  var result = (0, _subquery2.default)(input, 'one');
  expect(result).toEqual({ one: 'one' });
  expect(result).not.toBe(input);
});