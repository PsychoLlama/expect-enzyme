const eslint = exports;

eslint.extends = [
  'plugin:react/recommended',
  'eslint:recommended',
  'llama',
];

eslint.plugins = [
  'react',
];

eslint.env = {
  mocha: true,
  node: true,
  es6: true,
};

eslint.parserOptions = {
  sourceType: 'module',
};
