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

module.exports = {

  /**
   * Assert a component has a property.
   * @param  {String} prop - An expected property.
   * @param  {Any} [value] - An expected value.
   * @return {this} - The current expect assertion.
   */
  toHaveProp (prop, value) {
    assertIsEnzymeWrapper(this.actual);

    const actual = this.actual.props();
    const type = this.actual.name();

    expect.assert(
      actual.hasOwnProperty(prop),
      `Expected ${type} to have prop "${prop}".`
    );

    if (value !== undefined) {
      expect.assert(
        actual[prop] === value,
        `Expected ${type} property "${prop}" to be "${value}".`
      );
    }

    return this;
  },

  /**
   * Verifies a component was given certain props.
   * @param  {Object} props - Expected props.
   * @return {this} - The current assertion.
   */
  toHaveProps (props) {

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

      this.toHaveProp(key, value);
    });

    // For chaining.
    return this;
  },
};
