import getDisplayName from 'react-display-name';
import stringifyObject from 'stringify-object';
import {ShallowWrapper, ReactWrapper} from 'enzyme';
import deepEqual from 'deep-eql';
import expect from 'expect';

/**
 * Checks if the given value is an enzyme wrapper.
 * @param  {Any} actual - The value to check.
 * @return {Boolean} - Whether it's enzyme.
 */
const isEnzymeWrapper = (actual) => (
  actual instanceof ShallowWrapper ||
    actual instanceof ReactWrapper
);

/**
 * Throws an error if the given argument isn't an enzyme wrapper.
 * @param  {Any} actual - Preferably an enzyme wrapper.
 * @return {undefined}
 * @throws {Error} - If the type isn't enzyme.
 */
const assertIsEnzymeWrapper = (actual) => expect.assert(
  isEnzymeWrapper(actual),
  `${actual} is not an enzyme wrapper`
);

/**
 * Turns an enzyme selector into a printable string.
 * @param  {Function|String|Object} selector - An enzyme selector.
 * @return {String} - A loggable description of the selector.
 */
const stringifySelector = (selector) => {
  const type = typeof selector;

  // CSS selector?
  if (type === 'string') {
    return selector;
  }

  // Component instance selector?
  if (type === 'function') {
    return getDisplayName(selector);
  }

  // Nope, enzyme attribute selector.
  return stringifyObject(selector, {

    // Prevents newlines.
    inlineCharacterLimit: Infinity,
  });
};

const asserted = expect();

const original = {

  // Custom.
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
};

/**
 * Only attempts an enzyme assertion if the given value is an enzyme wrapper.
 * @param  {Function} defaultAssertion - An expect assertion to overload.
 * @param  {Function} enzymeAssertion - An assertion handler for enzyme types.
 * @return {Function} - An assertion method.
 */
const addEnzymeSupport = (defaultAssertion, enzymeAssertion) => (
  function assertion () {

    // Is the value an enzyme wrapper?
    if (isEnzymeWrapper(this.actual)) {

      // Use the enzyme assertion.
      enzymeAssertion.apply(this, arguments);
    } else if (defaultAssertion) {
      return defaultAssertion.apply(this, arguments);
    }

    // There's no fallback assertion.
    assertIsEnzymeWrapper(this.actual);

    // Chain 'em assertions.
    return this;
  }
);

/**
 * Assert a component has a property.
 * @param  {String} prop - An expected property.
 * @param  {Any} [value] - An expected value.
 * @return {this} - The current expect assertion.
 */
export const toHaveProp = addEnzymeSupport(
  original.toHaveProp,

  function (prop, value) {
    assertIsEnzymeWrapper(this.actual);

    const actual = this.actual.props();
    const displayName = this.actual.name();

    expect.assert(
      actual.hasOwnProperty(prop),
      `Expected ${displayName} to have prop "${prop}"`
    );

    if (value !== undefined) {
      expect.assert(
        actual[prop] === value,
        `Expected ${displayName} property "${prop}" to be "${value}"`
      );
    }

    return this;
  }
);

/**
 * Verifies a component was given certain props.
 * @param  {Object} props - Expected props.
 * @return {this} - The current assertion.
 */
export const toHaveProps = addEnzymeSupport(
  original.toHaveProps,

  function (props) {

    // Props should be an object.
    expect.assert(
      props instanceof Object,
      `Method "toHaveProps()" expected a props object, was given "${props}"`
    );

    // Make sure we're dealing with an enzyme wrapper.
    assertIsEnzymeWrapper(this.actual);

    // Check each expected prop.
    Object.keys(props).forEach((key) => {
      const value = props[key];

      // Assert!
      this.toHaveProp(key, value);
    });

    // For chaining.
    return this;
  }
);

/**
 * Asserts a component contains a css class.
 * @param  {String} className - The class the component should have.
 * @return {this} - The expectation context.
 */
export const toHaveClass = addEnzymeSupport(
  original.toHaveClass,

  function (className) {
    const element = this.actual;

    // Only works for enzyme elements.
    assertIsEnzymeWrapper(element);

    expect.assert(
      element.hasClass(className),
      `Expected ${element.name()} to have class "${className}"`
    );

    return this;
  }
);

/**
 * Assert the element contains the given state.
 * @param  {Object} expectedState - State the component should contain.
 * @return {this} - The expectation context.
 */
export const toHaveState = addEnzymeSupport(
  original.toHaveState,

  function (expectedState) {
    const element = this.actual;
    assertIsEnzymeWrapper(element);

    // Make sure the expected state is valid.
    expect.assert(
      expectedState instanceof Object,
      `expect(...).toHaveState expects an object, was given "${expectedState}"`
    );

    // Check every property in the expected state.
    Object.keys(expectedState).forEach((key) => {
      const actual = element.state(key);
      const expected = expectedState[key];

      // Deeply check equivalence.
      expect.assert(
        deepEqual(actual, expected),
        `Expected state "${key}" to equal ${expected}`
      );
    });

    return this;
  }
);

/**
 * Asserts a component contains a given style.
 * @param  {String} property - A CSS property.
 * @param  {Any} [value] - The expected CSS value.
 * @return {this} - The expectation context.
 */
export const toHaveStyle = addEnzymeSupport(
  original.toHaveStyle,

  function (property, value) {
    const element = this.actual;
    assertIsEnzymeWrapper(element);

    const style = element.prop('style') || {};
    const displayName = element.name();

    const styles = property instanceof Object ? property : {
      [property]: value,
    };

    Object.keys(styles).forEach((property) => {
      const value = styles[property];

      // "value" parameter is optional.
      if (value === undefined) {

        // Make sure the property is specified.
        expect.assert(
          style.hasOwnProperty(property),
          `Expected ${displayName} to have css property "${property}"`
        );

      } else {

        // Show what css is expected.
        const styleString = stringifyObject({ [property]: value }, {
          inlineCharacterLimit: Infinity,
        });

        // Make sure the value matches.
        expect.assert(
          style[property] === value,
          `Expected ${displayName} to have css ${styleString}`
        );
      }
    });

    return this;
  }
);

/**
 * Asserts a component has the given context.
 * @param  {Object} context - What you expect the context to equal.
 * @return {this} - The expectation context.
 */
export const toHaveContext = addEnzymeSupport(
  original.toHaveContext,

  function toHaveContext (context) {
    const element = this.actual;
    assertIsEnzymeWrapper(element);

    const actual = element.context();

    Object.keys(context).forEach((property) => {
      const expected = context[property];
      const expectedString = stringifyObject(expected, {
        inlineCharacterLimit: Infinity,
      });

      expect.assert(
        deepEqual(actual[property], expected),
        `Expected context property "${property}" to equal ${expectedString}`
      );
    });

    return this;
  }
);

/**
 * Assert the type of an enzyme wrapper.
 * @param  {String|Function} type - The type you expect your element to be.
 * @return {this} - The expectation.
 */
export const toBeA = addEnzymeSupport(
  original.toBeA,

  function (type) {

    // User-friendly component description.
    const displayName = getDisplayName(type);
    const element = this.actual;
    const { article = 'a' } = this;

    // Check the type.
    expect.assert(
      element.is(type),
      `Expected ${element.name()} to be ${article} ${displayName}`
    );
  }
);

/**
 * Same as `.toBeA(type)`, but with different wording.
 * @param  {String|Function} type - The type you expect your element to be.
 * @return {this} - The expectation context.
 */
export const toBeAn = addEnzymeSupport(
  original.toBeAn,

  function (type) {

    // Set the correct article form.
    this.article = 'an';

    // Assert!
    this.toBeA(type);
  }
);

/**
 * Asserts the enzyme wrapper contains something.
 * @return {this} - The expectation context.
 */
export const toExist = addEnzymeSupport(
  original.toExist,

  function () {
    expect.assert(
      this.actual.exists(),
      'Expected element to exist'
    );
  }
);

/**
 * Asserts an element does not exist.
 * @return {this} - The expectation context.
 */
export const toNotExist = addEnzymeSupport(
  original.toNotExist,

  function () {
    const exists = this.actual.exists();

    expect.assert(
      exists === false,
      'Expected element to not exist'
    );
  }
);

/**
 * Assert the component is not a type.
 * @param  {String|Function} type - The type you expect your element not to be.
 * @return {this} - The expectation context.
 */
export const toNotBeA = addEnzymeSupport(
  original.toNotBeA,

  function (type) {
    const element = this.actual;
    const notEqual = !element.is(type);
    const displayName = getDisplayName(type);

    const { article = 'a' } = this;

    expect.assert(
      notEqual,
      `Expected ${element.name()} to not be ${article} ${displayName}`
    );
  }
);

/**
 * Same as `.toNotBeA(type)`, but with different wording.
 * @param  {String|Function} type - The type you expect your element not to be.
 * @return {this} - The expectation context.
 */
export const toNotBeAn = addEnzymeSupport(
  original.toNotBeAn,

  function (type) {

    // Correct grammar.
    this.article = 'an';

    // Throw us some errors!
    this.toNotBeA(type);
  }
);

/**
 * Assert a component contains a selector.
 * @param  {String|Function|Object} selector -
 * A selector your element should have.
 * @return {this} - The expectation context.
 */
export const toContain = addEnzymeSupport(
  original.toContain,

  function (selector) {
    const element = this.actual;

    const isContained = element.find(selector).exists();
    const stringSelector = stringifySelector(selector);

    expect.assert(
      isContained,
      `Expected element to contain "${stringSelector}"`
    );
  }
);

/**
 * Asserts a component does not contain a selector.
 * @param  {String|Function|Object} selector -
 * A selector your component should not contain.
 * @return {this} - The expectation context.
 */
export const toNotContain = addEnzymeSupport(
  original.toNotContain,

  function (selector) {
    const element = this.actual;

    const isContained = element.find(selector).exists();
    const stringSelector = stringifySelector(selector);

    expect.assert(
      isContained === false,
      `Expected element to not contain "${stringSelector}"`
    );
  }
);
