import flatten from 'flat';

/**
 * @class Messages
 *
 * Handles converting key paths into strings. Can pick random items
 * from an array if present, and interpolate variables from the context.
 */
export default class Messages {
  /**
   * Creates a new Messages instance.
   *
   * @param {object} strings - Object containing keys and matching strings
   */
  constructor(strings) {
    if (typeof strings !== 'object' || Array.isArray(strings)) {
      throw new TypeError("Argument 'strings' must be an object");
    }

    this.strings = flatten(strings, { safe: true });
  }

  /**
   * Picks a message using the key path and interpolating using the context
   *
   * @param {string} key - The key path of the message to use
   * @param {object} context - The context to use when interpolating
   *
   * @returns {string} A fully interpolated message for the specified key path
   */
  pick(key, context = {}) {
    if (typeof key !== 'string') {
      throw new TypeError("Argument 'key' must be a string");
    }

    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError("Argument 'context' must be an object");
    }

    let message = '';

    if (this.strings.hasOwnProperty(key)) {
      const value = this.strings[key];

      if (Array.isArray(value)) {
        const idx = Math.floor(Math.random() * value.length);

        message = value[idx].toString();
      } else {
        message = value.toString();
      }
    }

    message = this.interpolate(message, context);

    return message;
  }

  /**
   * Interpolates a string using the context. Expects the format:
   *   Hello, #{name}
   *
   * @param {string} message - The message to interpolate
   * @param {object} context - The context to interpolate the variables with
   *
   * @returns {string} The fully interpolated message
   */
  interpolate(message, context) {
    if (typeof message !== 'string') {
      throw new TypeError("Argument 'key' must be a string");
    }

    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError("Argument 'context' must be an object");
    }

    // Matches #{something} in a string
    const re = /#{(\w+)}/g;

    let interpolated = message;
    let match;

    // Find all the matches
    while ((match = re.exec(interpolated)) !== null) {
      const matched = match[0];
      const key = match[1];

      if (Array.isArray(context[key]) &&
          context[key][0].hasOwnProperty('value')) {
        interpolated = interpolated.replace(matched, context[key][0].value);
      } else {
        throw new TypeError(
          `Context item '${key}' must be an array of objects containing a 'value' key`
        );
      }
    }

    return interpolated;
  }
}
