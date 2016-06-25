import Messages from './messages';
import Plugin from './plugin';
import Wit from './wit';

/**
 * @class Bot
 *
 * Main entry point for using Plug
 */
export default class Bot {
  /**
   * Construct a new Bot instance.
   *
   * @param {array} plugins - An array of plugins the bot will use
   * @param {object} [strings] - An object containing common keys and corresponding
   *                             text used for response output
   * @param {object} options - Options for the bot to use
   */
  constructor(plugins, strings, options) {
    if (typeof plugins !== 'object' || Array.isArray(plugins)) {
      throw new TypeError("Argument 'plugins' must be an object");
    }

    if (typeof strings !== 'object' || Array.isArray(strings)) {
      throw new TypeError("Argument 'strings' must be an object");
    }

    if (typeof options !== 'object' || Array.isArray(options)) {
      throw new TypeError("Argument 'options' must be an object");
    }

    this.messages = new Messages(strings);
    this.plugins = {};

    // Instantiate plugin if passed a class or simply use a Plugin
    // instance as is
    Object.keys(plugins).forEach(key => {
      if (plugins[key] instanceof Plugin) {
        this.plugins[key] = plugins[key];
      } else {
        this.plugins[key] = new plugins[key](strings);
      }
    });

    this.options = options;

    if (typeof options.witToken === 'string') {
      this.wit = new Wit(options.witToken);
    } else {
      throw new TypeError(
        `Option 'witToken' must be a string. Found ${options.witToken} instead.`
      );
    }
  }

  /**
   * @callback responseCallback
   * @param {string} response - The textual response from the bot
   * @param {object} context - The new context
   */

  /**
   * Sends a message to the bot, receiving the response in a callback
   *
   * @param {string} message - The message to send to the bot
   * @param {object} context - The current context, to be passed along with the message
   * @param {responseCallback} callback - Callback which will be passed the respone
   */
  message(message, context, callback) {
    if (typeof message !== 'string') {
      throw new TypeError("Argument 'message' must be a string");
    }

    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError("Argument 'context' must be an object");
    }

    if (typeof callback !== 'function') {
      throw new TypeError("Argument 'callback' must be a function");
    }

    this.wit.message(message, context => {
      // Only handles single intent
      const primaryIntent = getPrimaryIntent(context);

      if (primaryIntent) {
        const plugin = this.plugins[primaryIntent];

        if (plugin) {
          context = normalizeIntent(context, primaryIntent);

          plugin.act(context, newContext => {
            callback(plugin.respond(newContext), newContext);
          });
        } else {
          callback(this.messages.pick('common.missing_plugin'), context);
        }
      } else {
        callback(this.messages.pick('common.missing_intent'), context);
      }
    });
  }
}

/*
 * Private Functions
 */

/**
 * Retrieve the primary intent from the Wit.ai response.
 *
 * Converts { "intent_something": ... } into "something", so we can map
 * that intent to the correct plugin.
 *
 * @param {object} context - The context returned from Wit.ai containing an intent
 */
const getPrimaryIntent = (context) => {
  let intent = null;

  Object.keys(context).some(key => {
    if(key.startsWith('intent_')) {
      intent = key.replace(/^intent_/, '');
      return true;
    }
  });

  return intent;
};

/**
 * Turns the context from Wit.ai into something we can send a specific plugin.
 *
 * Converts { intent_something: [{ value: "something_intent" }] }
 *     into { intent: [{ value: "something_intent" }] } which is then passed to the
 * "something" plugin.
 *
 * @param {object} context - The context returned from Wit.ai
 * @param {string} intent - The primary intent for this context
 */
const normalizeIntent = (context, intent) => {
  context['intent'] = context[`intent_${intent}`];
  delete context[`intent_${intent}`];

  return context;
}
