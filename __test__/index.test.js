/**
 * Created by thram on 17/01/17.
 */

const thrux = require('../src').default;

test('Test thrux', () => expect(thrux.test()).toBe('Test!'));
test('Test 2 thrux', () => expect(thrux.test2()).toEqual({test:'Test!'}));