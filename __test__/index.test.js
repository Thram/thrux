/**
 * Created by thram on 17/01/17.
 */

test('Test thrux', () => {
  const thrux = require('../src');
  expect(thrux.test()).toBe('Test!');
})
;