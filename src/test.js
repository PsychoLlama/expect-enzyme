/* eslint-disable require-jsdoc */
import expect, { createSpy } from 'expect';
import { shallow, mount } from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';

import enzymify from './index';

expect.extend(enzymify());

describe('expect-enzyme', () => {
  let element;

  beforeEach(() => {
    element = shallow(<div attr="value">children</div>);
  });

  it('adds enzyme assertion methods', () => {
    expect(expect().toHaveProps).toBeA(Function);
    expect(expect().toHaveProp).toBeA(Function);
  });

  describe('toHaveProps()', () => {
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

  describe('toNotHaveProps()', () => {
    const element = shallow(<button disabled />);

    it('throws if any value matches', () => {
      const assertion = () =>
        expect(element).toNotHaveProps({
          missing: 'intentionally so',
          disabled: true,
        });

      expect(assertion).toThrow();
    });

    it('does not throw if all props are missing', () => {
      const assertion = () =>
        expect(element).toNotHaveProps({
          pool: 'closed',
          clowns: 10,
        });

      expect(assertion).toNotThrow();
    });
  });

  describe('toHaveProp()', () => {
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

    it('shows a diff', () => {
      try {
        expect(element).toHaveProp('attr', true);
        throw new Error('Made it past');
      } catch (error) {
        expect(error.message).toNotMatch(/past/);
        expect(error.expected).toEqual({ attr: true });
        expect(error.actual).toEqual({ attr: element.prop('attr') });
      }
    });
  });

  describe('toNotHaveProp()', () => {
    const element = shallow(<div disabled value="offline" />);

    it('throws if the prop exists', () => {
      const assertion = () => expect(element).toNotHaveProp('disabled');

      expect(assertion).toThrow(/disabled/);
    });

    it('does not throw if the prop is missing', () => {
      const assertion = () => expect(element).toNotHaveProp('potato');

      expect(assertion).toNotThrow();
    });

    it('does not throw if the value is different', () => {
      const assertion = () => expect(element).toNotHaveProp('value', 'no');

      expect(assertion).toNotThrow();
    });

    it('throws if the value matches', () => {
      const assertion = () => expect(element).toNotHaveProp('value', 'offline');

      expect(assertion).toThrow(/value/);
    });

    it('shows a diff if the value is unspecified', () => {
      try {
        expect(element).toNotHaveProp('value');
        throw new Error('Made it past');
      } catch (error) {
        expect(error.message).toNotMatch(/past/);
        expect(error.actual).toEqual({ value: 'offline' });
        expect(error.expected).toEqual({ value: undefined });
      }
    });
  });

  describe('toHaveClass()', () => {
    const element = shallow(<div className="class-one classTwo class_three" />);

    it('throws if actual is not an enzyme wrapper', () => {
      const assertion = () => expect(5).toHaveClass('class-name');

      expect(assertion).toThrow(/enzyme/i);
    });

    it('throws if the class name does not exist', () => {
      const assertion = () => expect(element).toHaveClass('class-four');

      expect(assertion).toThrow(/class-four/);
    });

    it('does not throw if the class name exists', () => {
      const assertion = () => expect(element).toHaveClass('class-one');

      expect(assertion).toNotThrow();
    });

    it('returns the assertion', () => {
      const expectation = expect(element);
      const result = expectation.toHaveClass('classTwo');

      expect(result).toBe(expectation);
    });

    it('shows the diff', () => {
      try {
        expect(element).toHaveClass('some-class');
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).toNotMatch(/thrown/);
        expect(error.actual).toEqual(element.prop('className').split(' '));
        expect(error.expected).toEqual([
          'some-class',
          ...element.prop('className').split(' '),
        ]);
      }
    });

    it('shows a diff when the className is undefined', () => {
      const element = shallow(<div />);

      try {
        expect(element).toHaveClass('non-existent-class');
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).toNotMatch(/(thrown|split)/);
        expect(error.actual).toEqual([]);
        expect(error.expected).toEqual(['non-existent-class']);
      }
    });
  });

  describe('toNotHaveClass()', () => {
    const element = shallow(<div className="profile" />);

    it('throws if the class is contained', () => {
      const assertion = () => expect(element).toNotHaveClass('profile');

      expect(assertion).toThrow(/profile/);
    });

    it('does not throw if the class is missing', () => {
      const assertion = () => expect(element).toNotHaveClass('elvis');

      expect(assertion).toNotThrow();
    });

    it('shows the diff', () => {
      const element = shallow(<div className="profile potato" />);
      try {
        expect(element).toNotHaveClass('potato');
        throw new Error('Should have thrown.');
      } catch (error) {
        expect(error.message).toNotMatch(/thrown/);
        expect(error.actual).toEqual(['profile', 'potato']);
        expect(error.expected).toEqual(['profile']);
      }
    });
  });

  describe('toHaveState()', () => {
    // Must be a stateful component.
    class Element extends React.Component {
      constructor() {
        super();
        this.state = {};
      }

      render() {
        return <div />;
      }
    }

    const element = shallow(<Element />);

    it('throws if the given value is not an enzyme wrapper', () => {
      const assertion = () => expect('potatoes').toHaveState({});

      expect(assertion).toThrow(/enzyme/i);
    });

    it('does not throw if the state matches', () => {
      const assertion = () => expect(element).toHaveState({});

      expect(assertion).toNotThrow();
    });

    it('throws if an object is not given', () => {
      const assertion = () => expect(element).toHaveState();

      expect(assertion).toThrow();
    });

    it('throws if a state does not exist', () => {
      const assertion = () =>
        expect(element).toHaveState({
          count: 1,
        });

      expect(assertion).toThrow();
    });

    it('throws if the state does not match', () => {
      element.setState({ count: 1 });
      const assertion = () =>
        expect(element).toHaveState({
          count: 5,
        });

      expect(assertion).toThrow(/5/);
    });

    it('does not throw if the state is deeply equal', () => {
      element.setState({ value: { isNested: true } });
      const assertion = () =>
        expect(element).toHaveState({
          value: { isNested: true },
        });

      expect(assertion).toNotThrow();
    });

    it('returns the expectation', () => {
      const expectation = expect(element);
      const result = expectation.toHaveState({});

      expect(result).toBe(expectation);
    });

    it('shows the diff', () => {
      const expected = { clicks: 10 };
      element.setState({ clicks: 48 });

      try {
        expect(element).toHaveState(expected);
        throw new Error('Should not throw');
      } catch (error) {
        expect(error.message).toNotMatch(/should/);
        expect(error.actual).toEqual(element.state('clicks'));
        expect(error.expected).toBe(expected.clicks);
      }
    });
  });

  describe('toHaveRendered()', () => {
    const clickHandler = createSpy();
    const element = shallow(<footer onClick={clickHandler} />);

    it('does not throw if the output matches', () => {
      const assertion = () =>
        expect(element).toHaveRendered(<footer onClick={clickHandler} />);

      expect(assertion).toNotThrow();
    });

    it('throws if the output is different', () => {
      const assertion = () => expect(element).toHaveRendered(<div />);

      expect(assertion).toThrow(/div/i);
    });

    it('does not throw if props are equal', () => {
      const object = {};
      const element = shallow(<div style={object} />);
      const assertion = () =>
        expect(element).toHaveRendered(<div style={{}} />);

      expect(assertion).toNotThrow();
    });

    it('throws if props are different', () => {
      const style = { color: 'blue' };
      const element = shallow(<div style={style} />);
      const assertion = () =>
        expect(element).toHaveRendered(<div style={{ color: 'red' }} />);

      expect(assertion).toThrow();
    });

    it('does not attempt to stringify non-elements', () => {
      const assertion = () => expect(element).toHaveRendered(null);

      expect(assertion).toThrow(/element/).toThrow(/null/);
    });

    it('does not throw if both outputs are null', () => {
      const Element = () => null;
      const element = shallow(<Element />);
      const assertion = () => expect(element).toHaveRendered(null);

      expect(assertion).toNotThrow();
    });

    it('indents the block if the element has props', () => {
      const assertion = () =>
        expect(element).toHaveRendered(<button value="a value" />);

      expect(assertion).toThrow(/\n/);
    });

    it('does not indent if the value is primitive', () => {
      const assertion = () => expect(element).toHaveRendered(null);

      expect(assertion).toNotThrow(/\n/);
    });

    it('does not indent if the element has no props', () => {
      const assertion = () => expect(element).toHaveRendered(<div />);

      expect(assertion).toNotThrow(/\n/);
    });

    it('show a colon if split onto another line', () => {
      const assertion = () =>
        expect(element).toHaveRendered(<button disabled />);

      expect(assertion).toThrow(/:/);
    });

    it('does not show a colon if on one line', () => {
      const assertion = () => expect(element).toHaveRendered(null);

      expect(assertion).toNotThrow(/:/);
    });
  });

  describe('toNotHaveRendered()', () => {
    const element = shallow(<button disabled value="Click me" />);

    it('throws if the value matches', () => {
      const Element = () => null;
      const element = shallow(<Element />);
      const assertion = () => expect(element).toNotHaveRendered(null);

      expect(assertion).toThrow(/element/);
    });

    it('does not throw if the value is different', () => {
      const assertion = () => expect(element).toNotHaveRendered(null);

      expect(assertion).toNotThrow();
    });

    it('throws if all props match', () => {
      const assertion = () =>
        expect(element).toNotHaveRendered(<button disabled value="Click me" />);

      expect(assertion).toThrow();
    });
  });

  describe('toNotHaveState()', () => {
    class Element extends React.Component {
      constructor() {
        super();

        this.state = {
          hovering: false,
          theme: 'dark',
        };
      }

      render() {
        return <div />;
      }
    }

    const element = shallow(<Element />);

    it('passes if the state is different', () => {
      const assertion = () =>
        expect(element).toNotHaveState({
          missing: 'property',
          hovering: true,
        });

      expect(assertion).toNotThrow();
    });

    it('throws if any state matches', () => {
      const assertion = () =>
        expect(element).toNotHaveState({
          hovering: false,
          theme: 'light',
        });

      expect(assertion).toThrow(/state/);
    });

    it('shows a diff', () => {
      const expected = { clicks: 48 };
      element.setState(expected);

      try {
        expect(element).toNotHaveState(expected);
        throw new Error('Should not survive');
      } catch (error) {
        expect(error.message).toNotMatch(/should/);
        expect(error.actual).toEqual(element.state('clicks'));
        expect(error.expected).toBe(expected.clicks);
      }
    });
  });

  describe('toHaveStyle()', () => {
    const style = { color: 'blue', transition: 'color 1s' };
    const element = shallow(<div style={style} />);

    it('throws if not given an enzyme wrapper', () => {
      const assertion = () => expect(5).toHaveStyle('color', 'red');

      expect(assertion).toThrow(/enzyme/);
    });

    it('throws if the component does not contain the style', () => {
      const assertion = () => expect(element).toHaveStyle('translate');

      expect(assertion).toThrow();
    });

    it('does not throw if the property exists and no value is asserted', () => {
      const assertion = () => expect(element).toHaveStyle('color');

      expect(assertion).toNotThrow();
    });

    it('throws if the value given does not match', () => {
      const assertion = () => expect(element).toHaveStyle('color', 'beige');

      expect(assertion).toThrow(/beige/);
    });

    it('does not throw if the given value matches', () => {
      const assertion = () => expect(element).toHaveStyle('color', 'blue');

      expect(assertion).toNotThrow();
    });

    it('accepts an object of styles', () => {
      const assertion = () => expect(element).toHaveStyle({ color: 'blue' });

      expect(assertion).toNotThrow();
    });

    it('throws if any style rule differs', () => {
      const assertion = () =>
        expect(element).toHaveStyle({
          display: 'none',
          color: 'blue',
        });

      expect(assertion).toThrow(/style|css/i);
    });

    it('does not throw if all styles match', () => {
      const assertion = () =>
        expect(element).toHaveStyle({
          transition: style.transition,
          color: style.color,
        });

      expect(assertion).toNotThrow();
    });

    it('returns the assertion', () => {
      const expectation = expect(element);
      const result = expectation.toHaveStyle('color');

      expect(result).toBe(expectation);
    });

    it('shows the diff', () => {
      const expected = { color: 'potato' };
      try {
        expect(element).toHaveStyle(expected);
        throw new Error('Should not throw');
      } catch (error) {
        expect(error.message).toNotMatch(/should/);
        expect(error.actual).toBe(element.prop('style'));
        expect(error.expected).toBe(expected);
      }
    });
  });

  describe('toNotHaveStyle()', () => {
    const element = shallow(
      <div
        style={{
          color: 'orange',
        }}
      />,
    );

    it('passes if the color does not exist', () => {
      const assertion = () => expect(element).toNotHaveStyle('transition');

      expect(assertion).toNotThrow();
    });

    it('throws if the style exists', () => {
      const assertion = () => expect(element).toNotHaveStyle('color');

      expect(assertion).toThrow();
    });

    it('passes if the style is different', () => {
      const expectation = expect(element);
      const assertion = () => expectation.toNotHaveStyle('color', 'crimson');

      expect(assertion).toNotThrow();
    });

    it('throws if the style matches', () => {
      const assertion = () => expect(element).toNotHaveStyle('color', 'orange');

      expect(assertion).toThrow(/color/);
    });

    it('passes if no styles match', () => {
      const assertion = () =>
        expect(element).toNotHaveStyle({
          backgroundColor: 'turquoise',
          color: 'not orange',
          borderWidth: 2,
        });

      expect(assertion).toNotThrow();
    });

    it('throws if any styles match', () => {
      const assertion = () =>
        expect(element).toNotHaveStyle({
          backgroundColor: 'turquoise',
          color: 'orange',
        });

      expect(assertion).toThrow(/color/);
    });

    it('shows a diff', () => {
      const expected = { color: 'orange' };

      try {
        expect(element).toNotHaveStyle(expected);
        throw new Error('Inadvertantly passed.');
      } catch (error) {
        expect(error.message).toNotMatch(/passed/);
        expect(error.actual).toBe(element.prop('style'));
        expect(error.expected).toBe(expected);
      }
    });
  });

  describe('toHaveContext()', () => {
    const Component = () => <div />;

    // React requires this to be specified, or context won't work.
    Component.contextTypes = {
      data: PropTypes.string,
    };

    const element = shallow(<Component />, {
      context: { data: 'probably' },
    });

    it('returns the assertion', () => {
      const expectation = expect(element);
      const result = expectation.toHaveContext({});

      expect(result).toBe(expectation);
    });

    it('throws if actual is not an enzyme type', () => {
      const assertion = () => expect('nope').toHaveContext({});

      expect(assertion).toThrow(/enzyme/);
    });

    it('throws when the context does not match', () => {
      const assertion = () =>
        expect(element).toHaveContext({
          propertyExists: false,
        });

      expect(assertion).toThrow(/context/);
    });

    it('does not throw when the context matches', () => {
      const assertion = () =>
        expect(element).toHaveContext({
          data: 'probably',
        });

      expect(assertion).toNotThrow();
    });

    it('shows the expected object for error messages', () => {
      const assertion = () =>
        expect(element).toHaveContext({
          data: { stringify: 'me' },
        });

      expect(assertion).toNotThrow(/object Object/);
      expect(assertion).toThrow(/stringify.*?me/);
    });

    it('shows a diff', () => {
      const expected = { data: 'different' };

      try {
        expect(element).toHaveContext(expected);
        throw new Error('Inadvertantly passed.');
      } catch (error) {
        expect(error.message).toNotMatch(/passed/);
        expect(error.actual).toBe(element.context('data'));
        expect(error.expected).toBe(expected.data);
      }
    });
  });

  describe('toNotHaveContext()', () => {
    const Component = () => <div />;

    // React requires this to be specified, or context won't work.
    Component.contextTypes = {
      string: PropTypes.string,
    };

    const element = shallow(<Component />, {
      context: { string: 'a tiny context variable' },
    });

    it('passes if the context is not contained', () => {
      const assertion = () =>
        expect(element).toNotHaveContext({
          missing: 'not defined in the context types',
        });

      expect(assertion).toNotThrow();
    });

    it('fails if the context type matches', () => {
      const { string } = element.context();

      const assertion = () =>
        expect(element).toNotHaveContext({
          string,
        });

      expect(assertion).toThrow(/context/);
    });

    it('shows the diff', () => {
      const expected = { string: element.context('string') };

      try {
        expect(element).toNotHaveContext(expected);
        throw new Error('Inadvertantly passed.');
      } catch (error) {
        expect(error.message).toNotMatch(/passed/);
        expect(error.actual).toBe(element.context('string'));
        expect(error.expected).toBe(expected.string);
      }
    });
  });

  describe('toContain()', () => {
    const Component = () => <div />;
    const element = shallow(
      <div>
        <article />

        <aside />
        <aside />

        <Component enabled className="component" />
      </div>,
    );

    it('only affects enzyme types', () => {
      expect(() => expect('hello world').toContain('hello')).toNotThrow();
      expect(() => expect([1, 2, 3]).toContain(3)).toNotThrow();

      expect(() => expect({}).toContain({ key: 'value' })).toThrow();
      expect(() => expect([1, 2, 3]).toContain(4)).toThrow();
    });

    it('throws if the value does not exist', () => {
      const assertion = () => expect(element).toContain('SomeComponent');

      expect(assertion).toThrow(/SomeComponent/);
    });

    it('does not throw if the selector is found', () => {
      const assertion = () => expect(element).toContain('article');

      expect(assertion).toNotThrow();
    });

    it('does not throw if many matches are found', () => {
      const assertion = () => expect(element).toContain('aside');

      expect(assertion).toNotThrow();
    });

    it('works with advanced enzyme selectors', () => {
      expect(() => expect(element).toContain(Component)).toNotThrow();
      expect(() => expect(element).toContain('.component')).toNotThrow();
      expect(() => expect(element).toContain({ enabled: true })).toNotThrow();

      expect(() => expect(element).toContain({ enabled: false })).toThrow();
    });
  });

  describe('toNotContain()', () => {
    const Component = () => <div />;
    const element = shallow(
      <div>
        <article />

        <aside />
        <aside />

        <Component enabled className="component" />
      </div>,
    );

    it('only affects enzyme types', () => {
      expect(() => expect('hello').toNotContain('lettuce')).toNotThrow();
      expect(() => expect([1, 2, 3]).toNotContain(60)).toNotThrow();

      expect(() => expect('hello world').toNotContain('world')).toThrow();
      expect(() => expect([1, 2, 3]).toNotContain(1)).toThrow();
    });

    it('throws if the selector is found', () => {
      const assertion = () => expect(element).toNotContain('article');

      expect(assertion).toThrow();
    });

    it('does not throw if the selector cannot be found', () => {
      const assertion = () => expect(element).toNotContain('section');

      expect(assertion).toNotThrow();
    });
  });

  describe('toBeA()', () => {
    const createElement = type => shallow(React.createElement(type));
    const Child = () => <div>Nested component</div>;
    const Composite = () =>
      <div>
        <Child />
      </div>;
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

    it('throws a diff', () => {
      try {
        expect(element).toBeA('section');
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.expected).toBe('section');
        expect(error.actual).toBe('div');
      }
    });
  });

  describe('toBeAn()', () => {
    const element = shallow(<aside />);

    it('throws the correct grammar article form', () => {
      const element = shallow(<section />);
      const assertion = () => expect(element).toBeAn('aside');

      expect(assertion).toThrow(/an/);
    });

    it('passes through if actual is not an enzyme wrapper', () => {
      // I just needed something that worked with the "an" article.
      const error = new Error();

      expect(() => expect([]).toBeAn(Array)).toNotThrow();
      expect(() => expect(error).toBeAn(Error)).toNotThrow();

      expect(() => expect([]).toBeAn(Error)).toThrow();
      expect(() => expect(error).toBeAn(Array)).toThrow();
    });

    it('does not throw if the type matches', () => {
      const assertion = () => expect(element).toBeAn('aside');

      expect(assertion).toNotThrow();
    });

    it('returns the correct context', () => {
      const expectation = expect(element);
      const result = expectation.toBeAn('aside');

      expect(result).toBe(expectation);
    });
  });

  describe('toNotBeA()', () => {
    const element = shallow(<header />);

    it('throws if the type matches', () => {
      const assertion = () => expect(element).toNotBeA('header');

      expect(assertion).toThrow();
    });

    it('does not throw if the type does not match', () => {
      const assertion = () => expect(element).toNotBeA('div');

      expect(assertion).toNotThrow();
    });

    it('only operates on enzyme values', () => {
      expect(() => expect('value').toNotBeA('function')).toNotThrow();
      expect(() => expect('value').toNotBeA('number')).toNotThrow();

      expect(() => expect('value').toNotBeA('string')).toThrow();
      expect(() => expect(9001).toNotBeA('number')).toThrow();
    });

    it('works with components', () => {
      const Component = () => <div />;
      const element = shallow(
        <div>
          <Component />
        </div>,
      );
      const component = element.find('Component');

      expect(() => expect(component).toNotBeA(Component)).toThrow();
      expect(() => expect(element).toNotBeA(Component)).toNotThrow();
    });

    it('shows a diff', () => {
      try {
        expect(element).toNotBeA('header');
        throw new Error('Should have thrown.');
      } catch (error) {
        expect(error.message).toNotMatch(/thrown/);
        expect(error.actual).toBe('header');
        expect(error.expected).toBe('header');
      }
    });
  });

  describe('toNotBeAn()', () => {
    const Item = () => <div />;
    const element = shallow(
      <div>
        <Item />
      </div>,
    );
    const item = element.find('Item');

    it('throws if the type matches', () => {
      const assertion = () => expect(item).toNotBeAn(Item);

      // Correct grammar usage.
      expect(assertion).toThrow(/an/i);
    });

    it('does not throw if the type is different', () => {
      const assertion = () => expect(element).toNotBeAn(Item);

      expect(assertion).toNotThrow();
    });
  });

  describe('toExist()', () => {
    let element;
    beforeEach(() => {
      element = shallow(<div />);
    });

    it('only operates on enzyme values', () => {
      expect(() => expect('stuff').toExist()).toNotThrow();
      expect(() => expect({}).toExist()).toNotThrow();

      expect(() => expect(undefined).toExist()).toThrow();
    });

    it('throws if the element does not exist', () => {
      const noSuchElement = element.find('NoSuchElement');
      const assertion = () => expect(noSuchElement).toExist();

      expect(assertion).toThrow();
    });

    it('does not throw if the element does exist', () => {
      const assertion = () => expect(element).toExist();

      expect(assertion).toNotThrow();
    });

    it('works in older versions of enzyme', () => {
      element.exists = null;
      const nope = element.find('Nope');

      expect(() => expect(element).toExist()).toNotThrow();
      expect(() => expect(nope).toExist()).toThrow();
    });
  });

  describe('toNotExist()', () => {
    let element;
    beforeEach(() => {
      element = shallow(<div />);
    });

    it('should only affect enzyme types', () => {
      expect(() => expect(undefined).toNotExist()).toNotThrow();
      expect(() => expect(false).toNotExist()).toNotThrow();

      expect(() => expect(true).toNotExist()).toThrow();
      expect(() => expect('value').toNotExist()).toThrow();
    });

    it('throws if the element exists', () => {
      const assertion = () => expect(element).toNotExist();

      expect(assertion).toThrow(/not exist/);
    });

    it('does not throw if the element does not exist', () => {
      const assertion = () => expect(element.find('Elvis')).toNotExist();

      expect(assertion).toNotThrow();
    });

    it('works in older versions of enzyme', () => {
      const absent = element.find('Potato');
      element.exists = null;
      absent.exists = null;

      expect(() => expect(absent).toNotExist()).toNotThrow();
      expect(() => expect(element).toNotExist()).toThrow();
    });

    it('only negates the given assertion', () => {
      const expectation = expect(element);
      const assertion = () => expectation.toNotExist();

      expect(assertion).toThrow();

      // Asserts the negation flag was removed before throwing.
      expect(() => expectation.toExist()).toNotThrow();
    });
  });

  // Not all methods are tested with `enzyme.mount`,
  // though enough to ensure nothing is terribly wrong.
  describe('mounted wrapper', () => {
    const element = mount(<audio className="playing" controls />);

    it('works with "toBeA"', () => {
      expect(() => expect(element).toBeAn('audio')).toNotThrow();
      expect(() => expect(element).toBeA('section')).toThrow();
    });

    it('works with "toHaveClass"', () => {
      expect(() => expect(element).toHaveClass('playing')).toNotThrow();
      expect(() => expect(element).toHaveClass('naaaaah')).toThrow();
    });

    it('works with "toHaveProp"', () => {
      expect(() => expect(element).toHaveProp('controls')).toNotThrow();
      expect(() => expect(element).toHaveProp('bools')).toThrow();
    });

    it('works with "toExist"', () => {
      expect(() => expect(element).toExist()).toNotThrow();
      expect(() => expect(element.find('Yeti')).toExist()).toThrow();
    });
  });
});
