import { jsdom } from 'jsdom';

// Shhh, React won't know the difference!
const document = global.document = jsdom('');
const window = global.window = document.defaultView;

// Export all window properties.
Object.keys(window).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = window[key];
  }
});

global.navigator = { userAgent: 'node.js' };
