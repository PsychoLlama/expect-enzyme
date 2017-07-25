import { JSDOM } from 'jsdom';

// Shhh, React won't know the difference!
const { window } = new JSDOM('');

const document = (global.document = window.document);

global.window = document.defaultView;

// Export all window properties.
Object.keys(window).forEach(key => {
  if (typeof global[key] === 'undefined') {
    global[key] = window[key];
  }
});

global.navigator = { userAgent: 'node.js' };
