import { Wit as WitAi } from 'node-wit';
/**
 * @class Wit
 *
 * Wrapper around Wit.ai
 */
export default class Wit {
  constructor(token) {
    // We need this always, even if we don't use it
    const actions = {
      say(sessionId, context, message, cb) {
        console.log(message);
        cb();
      },
      merge(sessionId, context, entities, message, cb) {
        cb(context);
      },
      error(sessionId, context, error) {
        console.error(error.message);
      },
    };

    this.client = new WitAi(token, actions);
  }

  message(message, callback) {
    this.client.message(message, (error, data) => {
      if (error) {
        console.log('Oops! Got an error: ' + error);
      } else {
        console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
      }

      callback(data.entities);
    });
  }
}
