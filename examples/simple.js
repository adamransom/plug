'use strict';

// When using as a real npm module, replace the below with:
//
//   const Plug = require('plug-ai');
//
const Plug = require('../');

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
    missing_intent: "Umm, I don't really know what you want me to do :(",
    missing_plugin: "I don't think I've been taught how to handle this yet!",
  }
};

// Create a new bot instance
const bot = new Plug.Bot(
  { time: TimePlugin },
  commonStrings,
  { witToken: 'ZJFOZPU5MKZLRCJT562ZH67G5WB6KELU' }
);


// Test our bot!
const message = "What's the time?";
console.log(`> ${message}`);
bot.message(message, {}, (response, context) => {
  console.log(response);
});
