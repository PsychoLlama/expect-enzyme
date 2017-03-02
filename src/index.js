import {ShallowWrapper} from 'enzyme';
import expect from 'expect';

const isEnzymeWrapper = (actual) => actual instanceof ShallowWrapper;

module.exports = {

  /**
   * Verifies a component was given certain props.
   * @param  {Object} props - Expected props.
   * @return {this} - The current assertion.
   */
  toHaveProps (props) {
    expect.assert(
      props instanceof Object,
      `Method "toHaveProps()" expected a props object, was given "${props}".`
    );

    expect.assert(
      isEnzymeWrapper(this.actual),
      `${this.actual} is not an enzyme wrapper.`
    );

    const actual = this.actual.props();
    const type = this.actual.name();

    Object.keys(props).forEach((key) => {
      expect.assert(
        actual.hasOwnProperty(key),
        `Expected ${type} to have prop "${key}"`
      );

      expect.assert(
        actual[key] === props[key],
        `Expected ${type} property "${key}" to be "${props[key]}"`
      );
    });

    return this;
  },
};
