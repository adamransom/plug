import { assert } from 'chai';
import { assertArgIsObject } from '../test_helper';
import sinon from 'sinon';

import Messages from '../../src/lib/messages';


describe('Messages', () => {
  const strings = {
    single_string: 'Hello',
    nested: {
      string: 'World',
      array: [
        'one string',
        'two strings',
      ],
    },
    array: [
      'one string',
      'two strings',
    ],
    hello: 'Hello, #{name}!',
    direction: 'Going from #{a} to #{b}',
  };
  let messages;

  beforeEach(() => {
    messages = new Messages(strings);
  });

  describe('#constructor', () => {
    describe('(strings)', () => {
      assertArgIsObject(arg => new Messages(arg), 'strings');
    })
  });

  describe('#merge', () => {
    it('adds new single keys to `strings`', () => {
      messages.merge({ new: 'value' });

      assert.property(messages.strings, 'new');
    });

    it('adds new nested keys to `strings`', () => {
      messages.merge({ new: { nested: 'value' } });

      assert.property(messages.strings, 'new.nested');
    });

    it('replaces existing single keys', () => {
      messages.merge({ single_string: 'World' });

      assert.propertyVal(messages.strings, 'single_string', 'World');
    });

    it('replaces existing nested keys', () => {
      messages.merge({ nested: { string: 'Hello' } });

      assert.propertyVal(messages.strings, 'nested.string', 'Hello');
    });

    describe('(strings)', () => {
      assertArgIsObject(arg => new Messages(arg), 'strings');
    })
  });

  describe('#pick', () => {
    describe('(key, ...)', () => {
      it('throws if key is not a string', () => {
        const fn = () => { messages.pick(1) };

        assert.throws(fn, TypeError);
      });
    });

    describe('(..., context)', () => {
      assertArgIsObject(arg => messages.pick('', arg), 'context');
    });

    it('returns a string if value is string', () => {
      const expected = strings.single_string;
      const actual = messages.pick('single_string');

      assert.equal(actual, expected);
    });

    it('returns a string if value is string and key is nested', () => {
      const expected = strings.nested.string;
      const actual = messages.pick('nested.string');

      assert.equal(actual, expected);
    });

    it('returns a random string if value is array of strings', () => {
      const expected = strings.array;
      const actual = messages.pick('array');

      assert.include(expected, actual);
    });

    it('returns a random string if value is array of strings and key is nested', () => {
      const expected = strings.nested.array;
      const actual = messages.pick('nested.array');

      assert.include(expected, actual);
    });

    it('returns an interpolated string', () => {
      const expected = 'Hello, World!';
      const actual = messages.pick('hello', { name: [{ value: 'World' }] });

      assert.include(expected, actual);
    });
  });

  describe('#interpolate', () => {
    describe('(message, ...)', () => {
      it('throws if message is not a string', () => {
        const fn = () => { messages.interpolate(1, {}) };

        assert.throws(fn, TypeError);
      });
    });

    describe('(..., context)', () => {
      assertArgIsObject(arg => messages.interpolate('', arg), 'context');
    });

    it('interpolates a single key from the context', () => {
      const expected = 'Hello, World!';
      const actual = messages.interpolate(strings.hello, { name: [{ value: 'World' }] });

      assert.equal(actual, expected);
    });

    it('interpolates multiple keys from the context', () => {
      const expected = 'Going from London to Tokyo';
      const actual = messages.interpolate(strings.direction, { a: [{ value: 'London' }], b: [{ value: 'Tokyo' }] });

      assert.equal(actual, expected);
    });

    it('throws if the context is in the wrong format', () => {
      const fn = () => { messages.interpolate(strings.hello, { name: { value: 'World' } })};

      assert.throws(fn, TypeError);
    });
  });
});
