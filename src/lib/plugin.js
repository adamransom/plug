import Messages from './messages';
import defaultMatchContext from './default_match_context';

/**
 * @class Plugin
 *
 * Base class for users to extend their own plugins from. It handles
 * taking context, acting on it (and updating it) and then responding.
 */
export default class Plugin {
  /**
   * Constructs a new plugin.
   *
   * @param {object} [strings] - An object containing keys and corresponding
   *                             text used for response output
   * @param {function} [matchContext] - A function used to match context with an
   *                                    action
   */
  constructor(strings = {}, matchContext = defaultMatchContext) {
    if (typeof strings !== 'object' || Array.isArray(strings)) {
      throw new TypeError("Argument 'strings' must be an object");
    }

    this.messages = new Messages(strings);
    this.matchContext = matchContext;
  }

  /**
   * @callback contextCallback
   * @param {object} context - The new context
   */

  /**
   * Takes the current context, acts on it and returns a new context in the callback.
   *
   * This tries to match the current context to an action (provided by the inheriting class)
   * and then calls that action with the context passed in.
   *
   * @param {object} context - The current context to act on
   * @param {contextCallback} callback - Callback when the action has finished and context updated
   */
  act(context, callback) {
    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError("Argument 'context' must be an object");
    }

    if (typeof callback !== 'function') {
      throw new TypeError("Argument 'callback' must be a function");
    }

    if (Array.isArray(this.actions) && this.actions.length > 0) {
      const match = this.matchContext(this.actions, context);

      if (match) {
        if (typeof match.action === 'function') {
          context = match.action(context);
        } else {
          throw new TypeError(`Action must be a function. Found '${match.action}' instead`);
        }
      }
    }

    callback(context);
  }

  /**
   * Converts context into a natural response.
   *
   * @param {object} context - The context to convert into a response
   *
   * @returns {string} - The natural response given the context
   */
  respond(context) {
    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError("Argument 'context' must be an object");
    }

    if (Array.isArray(this.responses) && this.responses.length > 0) {
      const match = this.matchContext(this.responses, context);

      if (match) {
        if (typeof match.response === 'string') {
          return this.messages.pick(match.response, context);
        } else {
          throw new TypeError(`Response must be a string. Found '${match.response}' instead`);
        }
      }
    }

    return this.messages.pick('common.missing_action');
  }
}
