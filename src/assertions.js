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
  `${actual} is not an enzyme wrapper.`
);

const asserted = expect();

const original = {
  toBeA: asserted.toBeA,
};

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
    `Expected ${displayName} to have prop "${prop}".`
  );

  if (value !== undefined) {
    expect.assert(
      actual[prop] === value,
      `Expected ${displayName} property "${prop}" to be "${value}".`
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
    `Method "toHaveProps()" expected a props object, was given "${props}".`
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
export function toBeA (type) {
  const isWrapper = isEnzymeWrapper(this.actual);

  // Defer everything non-enzyme related to the original method.
  if (isWrapper === false) {
    return original.toBeA.apply(this, arguments);
  }

  // User-friendly component description.
  const displayName = getDisplayName(type);
  const element = this.actual;

  // Check the type.
  expect.assert(
    element.is(type),
    `Expected ${element.name()} to be a ${displayName}`
  );

  return this;
}
