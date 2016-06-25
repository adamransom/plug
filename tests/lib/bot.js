import { assert } from 'chai';
import { assertArgIsObject } from '../test_helper';
import sinon from 'sinon';

import Bot from '../../src/lib/bot';
import Plugin from '../../src/lib/plugin';

describe('Bot', () => {
  describe('#constructor', () => {
    it('should instantiate plugins if passed class', () => {
      class TestPlugin extends Plugin {};
      const bot = new Bot({ test: TestPlugin }, {}, { witToken: '' });

      assert.instanceOf(bot.plugins.test, TestPlugin);
    });

    it('should instantiate plugins with strings', () => {
      const spy = sinon.spy();
      class TestPlugin extends Plugin { constructor() { super(); spy.apply(this, arguments) }};

      const expected = [{ test: 'value' }];
      const bot = new Bot({ test: TestPlugin }, expected[0], { witToken: '' });
      const actual = spy.getCall(0).args;


      assert.deepEqual(actual, expected);
    });

    it('should leave instantiated plugins as is', () => {
      class TestPlugin extends Plugin {};

      const expected = new TestPlugin();
      const bot = new Bot({ test: expected }, {}, { witToken: '' });
      const actual = bot.plugins.test;

      assert.equal(actual, expected);
    });

    describe('(plugins, ..., ...)', () => {
      assertArgIsObject(arg => new Bot(arg), 'plugins');
    });

    describe('(..., strings, ...)', () => {
      assertArgIsObject(arg => new Bot({}, arg), 'strings');
    });

    describe('(..., ..., options)', () => {
      assertArgIsObject(arg => new Bot({}, {}, arg), 'options');

      it('`options.witToken` must be a string', () => {
        const fn = () => { new Bot({}, {}, { witToken: 123 }) };

        assert.throws(fn, TypeError);
      });
    });
  });

  describe('#message', () => {
    let bot;
    let spy;

    class TestOnePlugin extends Plugin {};
    class TestTwoPlugin extends Plugin { act() { spy.apply(this, arguments) }};

    beforeEach(() => {
      bot = new Bot({
        'test_one': TestOnePlugin,
        'test_two': TestTwoPlugin,
      }, {}, { witToken: '' });
    });

    it('calls the correct plugins #act function', () => {
      spy = sinon.spy();
      const entities = { intent_test_two: [{ value: 'test_two_intent' }] };
      const stub = sinon.stub(bot.wit, 'message', (_, callback) => { callback(entities) });
      bot.message('', {}, () => {});

      assert.isTrue(spy.called);
    });

    it('calls plugins #act function with correct context', () => {
      spy = sinon.spy();
      const entities = { intent_test_two: [{ value: 'test_two_intent' }] };
      const stub = sinon.stub(bot.wit, 'message', (_, callback) => { callback(entities) });
      bot.message('', {}, () => {});

      const expected = { intent: [{ value: 'test_two_intent' }] };
      const actual = spy.getCall(0).args[0];

      assert.deepEqual(actual, expected);
    });

    it('returns common.missing_intent if no intent can be found in the context', () => {
      const entities = { no_intent: [{ value: '' }] };
      const wit_stub = sinon.stub(bot.wit, 'message', (_, callback) => { callback(entities) });
      const messages_stub = sinon.stub(bot.messages, 'pick')
      bot.message('', {}, () => {});

      const expected = 'common.missing_intent';
      const actual = messages_stub.getCall(0).args[0];

      assert.deepEqual(actual, expected);
    });

    it('returns common.missing_plugin if no matching plugin found', () => {
      const entities = { intent_test_three: [{ value: 'test_three_intent' }] };
      const wit_stub = sinon.stub(bot.wit, 'message', (_, callback) => { callback(entities) });
      const messages_stub = sinon.stub(bot.messages, 'pick')
      bot.message('', {}, () => {});

      const expected = 'common.missing_plugin';
      const actual = messages_stub.getCall(0).args[0];

      assert.deepEqual(actual, expected);
    });

    describe('(message, ..., ...)', () => {
      it('throws if message is not a string', () => {
        const fn = () => { bot.message(1, {}, () => {}) };

        assert.throws(fn, TypeError);
      });
    });

    describe('(..., context, ...)', () => {
      assertArgIsObject(arg => bot.message('', arg, () => {}), 'context');
    });

    describe('(..., ..., callback)', () => {
      it('throws if callback is not a function', () => {
        const fn = () => { bot.message('', {}, {}) };

        assert.throws(fn, TypeError);
      });
    });
  });
});
