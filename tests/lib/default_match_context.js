import { assert } from 'chai';
import { assertArgIsObject } from '../test_helper';
import sinon from 'sinon';

import defaultMatchContext from '../../src/lib/default_match_context';

describe('defaultMatchContext()', () => {
  describe('(items, ...)', () => {
    it('throws if items is not an array', () => {
      const fn = () => { defaultMatchContext('', {}) };

      assert.throws(fn, TypeError);
    });
  });

  describe('(..., context)', () => {
    assertArgIsObject(arg => defaultMatchContext([], arg), 'context');
  });

  it('returns item for single match', () => {
    const items = [
      {
        action: 'doAction',
        context: {
          intent: 'action',
        }
      },
    ];
    const context = {
      intent: [{ value: 'action' }],
    }
    const expected = items[0];
    const actual = defaultMatchContext(items, context);

    assert.deepEqual(actual, expected);
  });

  it('throws for multiple matches', () => {
  });

  it("throws if action doesn't contain a context object", () => {
    const fn = () => { defaultMatchContext([{}], {}) };

    assert.throws(fn, TypeError)
  });

  it('throws if the context is in the wrong format', () => {
    const items = [
      {
        action: 'doAction',
        context: {
          intent: 'action',
        }
      },
    ];
    const context = {
      intent: { value: 'action' },
    }
    const fn = () => { defaultMatchContext(items, context) };

    assert.throws(fn, TypeError)
  });

  describe('value', () => {
    describe('matches', () => {
      it('exactly a single string item', () => {
        const items = [
          {
            action: 'doActionOne',
            context: {
              intent: 'actionOne',
            }
          },
          {
            action: 'doActionTwo',
            context: {
              intent: 'actionTwo',
            }
          }
        ];
        const context = {
          intent: [{ value: 'actionTwo' }],
        }
        const expected = items[1];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('partially a single string item', () => {
        const items = [
          {
            action: 'doActionOne',
            context: {
              intent: 'actionOne',
            }
          },
          {
            action: 'doActionTwo',
            context: {
              intent: 'actionTwo',
            }
          }
        ];
        const context = {
          intent: [{ value: 'actionOne' }],
          something: [{ value: 'old' }],
        }
        const expected = items[0];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('exactly multiple string items', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'old',
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'new',
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
          something: [{ value: 'old' }],
        }
        const expected = items[0];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('partially multiple string items', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'old',
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'new',
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
          something: [{ value: 'new' }],
          another: [{ value: 'thing' }],
        }
        const expected = items[1];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('number items as well', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 1,
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 2,
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
          something: [{ value: 1 }],
          another: [{ value: 'thing' }],
        }
        const expected = items[0];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('numbers with strings', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 1,
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 2,
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
          something: [{ value: '2' }],
          another: [{ value: 'thing' }],
        }
        const expected = items[1];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('presence of single key', () => {
        const items = [
          {
            action: 'doActionOne',
            context: {
              location: 'location',
            }
          },
          {
            action: 'doActionTwo',
            context: {
              time: 'time',
            }
          }
        ];
        const context = {
          location: [{ value: 'Tokyo' }],
        }
        const expected = items[0];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('presence of multiple keys', () => {
        const items = [
          {
            action: 'doActionOne',
            context: {
              location: 'location',
            }
          },
          {
            action: 'doActionTwo',
            context: {
              location: 'location',
              time: 'time',
            }
          }
        ];
        const context = {
          location: [{ value: 'Tokyo' }],
          time: [{ value: 'evening' }],
        }
        const expected = items[1];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });

      it('combination of keys and presence', () => {
        const items = [
          {
            action: 'doActionOne',
            context: {
              location: 'location',
            }
          },
          {
            action: 'doActionTwo',
            context: {
              intent: 'time',
              location: 'location',
            }
          }
        ];
        const context = {
          intent: [{ value: 'time' }],
          location: [{ value: 'Tokyo' }],
        }
        const expected = items[1];
        const actual = defaultMatchContext(items, context);

        assert.deepEqual(actual, expected);
      });
    });
    describe("doesn't match", () => {
      it('if string value missing from context', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'old',
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'new',
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
        }
        const actual = defaultMatchContext(items, context);

        assert.isNull(actual);
      });

      it('if value is wrong', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'actionOne',
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'actionTwo',
            }
          }
        ];
        const context = {
          intent: [{ value: 'actionThree' }],
        }
        const actual = defaultMatchContext(items, context);

        assert.isNull(actual);
      });

      it('if presence missing from context', () => {
        const items = [
          {
            action: 'doAction',
            context: {
              intent: 'action',
              something: 'old',
            }
          },
          {
            action: 'doAction',
            context: {
              intent: 'action',
              location: 'location',
            }
          }
        ];
        const context = {
          intent: [{ value: 'action' }],
        }
        const actual = defaultMatchContext(items, context);

        assert.isNull(actual);
      });
    });
  });

});
