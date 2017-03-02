/* eslint-env mocha */
import { shallow } from 'enzyme';
import React from 'react';

import expect from 'expect';

import expectEnzyme from './index';

expect.extend(expectEnzyme);


describe('expect-enzyme', () => {
  let element;

  beforeEach(() => {
    element = shallow(
      <div attr="value">
        children
      </div>
    );
  });

  it('adds enzyme assertion methods', () => {
    expect(expect().toHaveProps).toBeA(Function);
  });

  describe('method "toHaveProps"', () => {
    const createAssertion = (props, el = element) => () => {
      expect(el).toHaveProps(props);
    };

    it('returns the context', () => {
      const expectation = expect(element);
      const result = expectation.toHaveProps({});

      expect(result).toBe(expectation);
    });

    it('throws if no props are given', () => {
      expect(createAssertion()).toThrow(/props object/i);
      expect(createAssertion(undefined)).toThrow(/props object/i);
      expect(createAssertion(null)).toThrow(/props object/i);
      expect(createAssertion(5)).toThrow(/props object/i);
      expect(createAssertion('string')).toThrow(/props object/i);

      expect(createAssertion({})).toNotThrow();
    });

    it('throws if actual is not an enzyme wrapper', () => {
      expect(createAssertion({}, 5)).toThrow(/enzyme wrapper/i);
      expect(createAssertion({}, 'string')).toThrow(/enzyme wrapper/i);
      expect(createAssertion({}, null)).toThrow(/enzyme wrapper/i);

      expect(createAssertion({}, element)).toNotThrow();
    });

    it('throws if missing props', () => {
      const assertion = createAssertion({
        someProperty: 'too late to think',
      });

      expect(assertion).toThrow(/someProperty/);
    });

    it('throws if props do not match', () => {
      const assertion = createAssertion({
        attr: 'some other value',
      });

      expect(assertion).toThrow();
    });

    it('does not throw if all props are equal', () => {
      const assertion = createAssertion({
        attr: 'value',
      });

      expect(assertion).toNotThrow();
    });

  });

  describe('method "toHaveProp"', () => {
    const createAssertion = (prop, val) => () => {
      expect(element).toHaveProp(prop, val);
    };

    it('throws if the component is missing the prop', () => {
      const assertion = createAssertion('weird prop');

      expect(assertion).toThrow(/Expected div to have prop/i);
    });

    it('does not throw if the prop exists', () => {
      const assertion = createAssertion('attr');

      expect(assertion).toNotThrow();
    });

    it('throws if the value does not match', () => {
      const assertion = createAssertion('attr', 'different value');

      expect(assertion).toThrow(/property "attr"/i);
    });

    it('returns the expectation context', () => {
      const expectation = expect(element);
      const result = expectation.toHaveProp('attr');

      expect(result).toBe(expectation);
    });

    it('throws if actual is not an enzyme wrapper', () => {
      const assertion = () => expect(5).toHaveProp('stuff');

      expect(assertion).toThrow(/enzyme wrapper/i);
    });

  });

});
