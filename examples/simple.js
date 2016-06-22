'use strict';

// When using as a real npm module, replace the below with:
//
//   const Plug = require('plug-ai');
//
const Plug = require('../');

// Create a new bot instance
const bot = new Plug.Bot();

// Define an extremely basic plugin
class TimePlugin extends Plug.Plugin {
  constructor(strings) {
    super(strings);

    // Set up plugin-specific strings
    this.strings = {
      time: {
        reply: {
          default: [
            'The time is #{time}!',
            'It is #{time} now!',
          ]
        }
      }
    }

    // Create a mapping of actions to run depending
    // on the current context.
    this.actions = [{
      // When a context with 'intent = time',
      // call the `getTime` function
      action: this.getTime,
      context: {
        intent: 'time',
      },
    }];

    this.responses = [{
      response: 'time.reply.default',
      context: {
        intent: 'time',
        time: 'time',
      },
    }];
  }

  getTime(context) {
    context.time = [{ value: new Date().toLocaleTimeString() }];
    return context;
  }
}

const commonStrings = {
  common: {
    missing_action: "Sorry, I don't know what you are talking about :/",
  }
};

// Crudely test our plugin
const timePlugin = new TimePlugin(commonStrings);
timePlugin.act({ intent: [{ value: 'time' }] }, context => {
  const response = timePlugin.respond(context);
  console.log(response);
});
