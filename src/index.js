import Plug from './lib/plug';
import Plugin from './lib/plugin';

// Use CommonJS exports so this library can easily be used
// in ES5 environments as well.
module.exports = {
  Bot: Plug,
  Plugin
};
