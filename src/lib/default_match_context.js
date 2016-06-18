/**
 * Matches context with a list containing context matching rules
 *
 * @param {array} items - An array of items (which should at least be an object
 *                        containing a 'context' object)
 * @param {object} context - The context to match with
 *
 * @returns {object} The item from the list which matches the context
 */
export default function defaultMatchContext(items, context) {
  if (typeof context !== 'object' || Array.isArray(context)) {
    throw new TypeError("Argument 'context' must be an object");
  }

  if (!Array.isArray(items)) {
    throw new TypeError("Argument 'items' must be an array");
  }

  let match = null;

  items.forEach(item => {
    if (typeof item.context !== 'object' || Array.isArray(item.context)) {
      throw new TypeError(
        `Item must contain a context object. Found '${item.context}' instead.`
      );
    }

    // Checks if each entity in the item's context matches an entity in the context.
    // If the value an entity is different from the key, it will check for matching
    // values in the context. However, if the value of an entity is the same as the key,
    // it will just check for presence of that key in the context e.g.
    //
    // item.context = { entity: 'test' } matches context { entity: 'test' }
    // item.context = { entity: 'something' } DOES NOT match context { entity: 'wrong' }
    // item.context = { location: 'location' } matches context { location: 'Tokyo' }
    //
    const matches = Object.keys(item.context).every(key => {
      if (context.hasOwnProperty(key)) {
        if (Array.isArray(context[key]) &&
            context[key][0].hasOwnProperty('value')) {
          return (
            context[key][0].value == item.context[key] ||
            item.context[key] === key
          )
        } else {
          throw new TypeError(`Context item '${key}' must be an array of objects containing a 'value' key`);
        }
      }

      return false;
    });

    if (matches) {
      match = item;
    }
  });

  return match;
}
