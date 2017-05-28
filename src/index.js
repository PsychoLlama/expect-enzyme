import expect from 'expect';

import createAssertions from './assertions';

// eslint-disable-next-line
module.exports = function enzymify () {
  const asserted = expect();

  return createAssertions({

    // Custom.
    toNotHaveRendered: asserted.toNotHaveRendered,
    toNotHaveContext: asserted.toNotHaveContext,
    toHaveRendered: asserted.toHaveRendered,
    toNotHaveStyle: asserted.toNotHaveStyle,
    toNotHaveClass: asserted.toNotHaveClass,
    toNotHaveProps: asserted.toNotHaveProps,
    toNotHaveState: asserted.toNotHaveState,
    toNotHaveProp: asserted.toNotHaveProp,
    toHaveContext: asserted.toHaveContext,
    toHaveClass: asserted.toHaveClass,
    toHaveState: asserted.toHaveState,
    toHaveProps: asserted.toHaveProps,
    toHaveStyle: asserted.toHaveStyle,
    toHaveProp: asserted.toHaveProp,

    // Built-in.
    toNotContain: asserted.toNotContain,
    toNotExist: asserted.toNotExist,
    toContain: asserted.toContain,
    toNotBeAn: asserted.toNotBeAn,
    toNotBeA: asserted.toNotBeA,
    toExist: asserted.toExist,
    toBeAn: asserted.toBeAn,
    toBeA: asserted.toBeA,
  });
};
