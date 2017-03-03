/* eslint-env mocha */
import { shallow } from 'enzyme';
import React from 'react';

import expect from 'expect';

import assertions from './index';

expect.extend(assertions);


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
    expect(expect().toHaveProp).toBeA(Function);
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

  describe('method "toBeA"', () => {
    const createElement = (type) => shallow(React.createElement(type));
    const Child = () => <div>Nested component</div>;
    const Composite = () => <div><Child /></div>;
    const element = createElement(Composite);

    it('passes control if actual is not an enzyme wrapper', () => {
      expect(() => expect(5).toBeA('string')).toThrow();
      expect(() => expect('hello world').toBeA(Function)).toThrow();
      expect(() => expect(Symbol('weirder case')).toBeA('number')).toThrow();

      expect(() => expect(10).toBeA('number')).toNotThrow();
      expect(() => expect('hello world').toBeA('string')).toNotThrow();
      expect(() => expect(() => {}).toBeA(Function)).toNotThrow();
    });

    it('asserts the type when actual is a wrapper', () => {
      let assertion;

      assertion = () => expect(createElement('div')).toBeA('div');
      expect(assertion).toNotThrow();

      assertion = () => expect(createElement('ul')).toBeA('li');
      expect(assertion).toThrow(/Expected ul to be a li/i);
    });

    it('returns the expectation', () => {
      const expectation = expect(createElement('div'));
      const result = expectation.toBeA('div');

      expect(result).toBe(expectation);
    });

    it('throws if the component selector does not match', () => {
      const child = element.find('Child');

      expect(() => expect(child).toBeA('Potato')).toThrow(/Child/i);
      expect(() => expect(child).toBeA(Composite)).toThrow(/Child/i);
    });

    it('does not throw if the component selector matches', () => {
      const child = element.find('Child');

      const assertion = () => {
        expect(child).toBeA(Child);
        expect(child).toBeA('Child');
      };

      expect(assertion).toNotThrow();
    });

  });

});
