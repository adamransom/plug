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
  constructor() {
    super();

    // Create a mapping of actions to run depending
    // on the current context.
    this.actions = [{
      // When a context with 'intent = time',
      // call the `getTime` function
      action: this.getTime,
      context: {
        intent: 'time',
      },
    }]
  }

  getTime(context) {
    context.time = new Date().toLocaleTimeString();
    return context;
  }
}

// Crudely test our plugin
const timePlugin = new TimePlugin();
timePlugin.act({ intent: [{ value: 'time' }] }, context => {
  console.log(context.time);
});
