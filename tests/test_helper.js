import { assert } from 'chai';

export function assertArgIsObject(func, parameter) {
  it(`throws if ${parameter} is not an object`, () => {
    const fn = () => { func('') };

    assert.throws(fn, TypeError);
  });

  it(`throws if ${parameter} is an array`, () => {
    const fn = () => { func([]) };
    assert.throws(fn, TypeError);
  });
}
