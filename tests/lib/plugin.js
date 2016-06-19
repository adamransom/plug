import { assert } from 'chai';
import { assertArgIsObject } from '../test_helper';
import sinon from 'sinon';

import Plugin from '../../src/lib/plugin';


describe('Plugin', () => {
  let plugin;
  let strings;

  describe('[all]', () => {
    beforeEach(() => {
      plugin = new Plugin();
      strings = {
        common: {
          missing_action: 'missing_action',
        }
      };
    });

    describe('#constructor', () => {
      describe('(strings)', () => {
        assertArgIsObject(arg => new Plugin(arg), 'strings');
      });
    });

    describe('#act', () => {
      describe('(context, ...)', () => {
        assertArgIsObject(arg => plugin.act(arg, () => {}), 'context');
      });

      describe('(..., callback)', () => {
        it('throws if callback is not a function', () => {
          const fn = () => { plugin.act({}, '') };

          assert.throws(fn, TypeError);
        });
      });
    });

    describe('#respond', () => {
      describe('(context)', () => {
        assertArgIsObject(arg => plugin.respond(arg), 'context');
      });
    });
  });

  describe('[without actions]', () => {
    class WithoutActions extends Plugin {};

    beforeEach(() => {
      plugin = new WithoutActions();
    });

    describe('#act', () => {
      it('passes the same context passed in to the callback', () => {
        const context = { intent: 'Something' };
        const expected = context;
        const spy = sinon.spy();

        plugin.act(context, spy);

        assert.isTrue(spy.calledWith(context));
      });
    });

    describe('#respond', () => {
      it('returns common.missing_action if available', () => {
        plugin = new WithoutActions(strings);

        const context = { intent: 'Something' };
        const expected = strings.common.missing_action;
        const actual = plugin.respond(context);

        assert.equal(actual, expected);
      });

      it('returns empty string if common.missing_action unavailable', () => {
        const context = { intent: 'Something' };
        const expected = '';
        const actual = plugin.respond(context);

        assert.equal(actual, expected);
      });
    });
  });

  describe('[with actions]', () => {
    class WithActions extends Plugin {
      constructor(matchContext) {
        super(strings, matchContext);

        this.actions = ['action'];
        this.responses = ['response'];
      }
    };

    describe('#act', () => {
      it('calls the matcher passed to it with actions and context', () => {
        const matchContext = sinon.stub().returns(null);
        const plugin = new WithActions(matchContext);
        const context = { intent: 'an_action' };
        const expected = [ ['action'], context ];

        plugin.act(context, () => {});

        const actual = matchContext.getCall(0).args;

        assert.deepEqual(actual, expected);
      });

      it('throws if the action is not a function', () => {
        const matchContext = sinon.stub().returns(true);
        const plugin = new WithActions(matchContext);
        const context = { intent: 'an_action' };

        const fn = () => { plugin.act(context, () => {}) };

        assert.throws(fn, TypeError);
      });
    });

    describe('#respond', () => {
      it('calls the matcher passed to it with reponses and context', () => {
        const matchContext = sinon.stub().returns(null);
        const plugin = new WithActions(matchContext);
        const context = { intent: 'an_action' };
        const expected = [ ['response'], context ];

        plugin.respond(context);

        const actual = matchContext.getCall(0).args;

        assert.deepEqual(actual, expected);
      });

      it('converts the response into natural text using `this.strings`', () => {
        strings.reply = { default: 'Reply' };

        const matchContext = sinon.stub().returns({ response: 'reply.default' });
        const plugin = new WithActions(matchContext);
        const context = { intent: 'an_action' };
        const expected = strings.reply.default;
        const actual = plugin.respond(context);

        assert.equal(actual, expected);
      });

      it('throws if the action is not a function', () => {
        const matchContext = sinon.stub().returns(true);
        const plugin = new WithActions(matchContext);
        const context = { intent: 'an_action' };

        const fn = () => { plugin.respond(context) };

        assert.throws(fn, TypeError);
      });
    });
  });
});
