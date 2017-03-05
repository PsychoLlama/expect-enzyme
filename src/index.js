import * as assertions from './assertions';

// Re-export assertions for ESModules/CommonJS interop.
for (const key in assertions) {
  if (assertions.hasOwnProperty(key)) {
    exports[key] = assertions[key];
  }
}
