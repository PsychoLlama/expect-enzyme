import getDisplayName from 'react-display-name';
import {ShallowWrapper} from 'enzyme';
import expect from 'expect';

/**
 * Checks if the given value is an enzyme wrapper.
 * @param  {Any} actual - The value to check.
 * @return {Boolean} - Whether it's enzyme.
 */
const isEnzymeWrapper = (actual) => actual instanceof ShallowWrapper;

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

const asserted = expect();

const original = {
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

      return this;
    }

    // Otherwise, use the built-in.
    return defaultAssertion.apply(this, arguments);
  }
);

/**
 * Assert a component has a property.
 * @param  {String} prop - An expected property.
 * @param  {Any} [value] - An expected value.
 * @return {this} - The current expect assertion.
 */
export function toHaveProp (prop, value) {
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

/**
 * Verifies a component was given certain props.
 * @param  {Object} props - Expected props.
 * @return {this} - The current assertion.
 */
export function toHaveProps (props) {

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

/**
 * Assert the type of an enzyme wrapper.
 * @param  {String|Function} type - The type you expect your element to be.
 * @return {this} - The expectation.
 */
export const toBeA = addEnzymeSupport(original.toBeA, function (type) {

  // User-friendly component description.
  const displayName = getDisplayName(type);
  const element = this.actual;
  const { article = 'a' } = this;

  // Check the type.
  expect.assert(
    element.is(type),
    `Expected ${element.name()} to be ${article} ${displayName}`
  );
});

/**
 * Same as `.toBeA(type)`, but with different wording.
 * @param  {String|Function} type - The type you expect your element to be.
 * @return {this} - The expectation context.
 */
export const toBeAn = addEnzymeSupport(original.toBeAn, function (type) {

  // Set the correct article form.
  this.article = 'an';

  // Assert!
  this.toBeA(type);
});

/**
 * Asserts the enzyme wrapper contains something.
 * @return {this} - The expectation context.
 */
export const toExist = addEnzymeSupport(original.toExist, function () {
  expect.assert(
    this.actual.exists(),
    'Expected element to exist'
  );
});

/**
 * Assert the component is not a type.
 * @param  {String|Function} type - The type you expect your element not to be.
 * @return {this} - The expectation context.
 */
export const toNotBeA = addEnzymeSupport(original.toNotBeA, function (type) {
  const element = this.actual;
  const notEqual = !element.is(type);
  const displayName = getDisplayName(type);

  const { article = 'a' } = this;

  expect.assert(
    notEqual,
    `Expected ${element.name()} to not be ${article} ${displayName}`
  );
});

/**
 * Same as `.toNotBeA(type)`, but with different wording.
 * @param  {String|Function} type - The type you expect your element not to be.
 * @return {this} - The expectation context.
 */
export const toNotBeAn = addEnzymeSupport(original.toNotBeAn, function (type) {

  // Correct grammar.
  this.article = 'an';

  // Throw us some errors!
  this.toNotBeA(type);
});
