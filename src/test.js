/* eslint-disable require-jsdoc */
/* eslint-env mocha */
import React, { PropTypes } from 'react';
import { shallow, mount } from 'enzyme';

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

  describe('method "toHaveClass"', () => {
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

  });

  describe('method "toHaveState"', () => {
    // Must be a stateful component.
    class Element extends React.Component {
      constructor () {
        super();
        this.state = {};
      }

      render () {
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
      const assertion = () => expect(element).toHaveState({
        count: 1,
      });

      expect(assertion).toThrow();
    });

    it('throws if the state does not match', () => {
      element.setState({ count: 1 });
      const assertion = () => expect(element).toHaveState({
        count: 5,
      });

      expect(assertion).toThrow(/5/);
    });

    it('does not throw if the state is deeply equal', () => {
      element.setState({ value: { isNested: true } });
      const assertion = () => expect(element).toHaveState({
        value: { isNested: true },
      });

      expect(assertion).toNotThrow();
    });

    it('returns the expectation', () => {
      const expectation = expect(element);
      const result = expectation.toHaveState({});

      expect(result).toBe(expectation);
    });

  });

  describe('method "toHaveStyle"', () => {
    const style = { color: 'blue', transition: 'color 1s' };
    const element = shallow(
      <div style={style} />
    );

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
      const assertion = () => expect(element).toHaveStyle({
        display: 'none',
        color: 'blue',
      });

      expect(assertion).toThrow(/style|css/i);
    });

    it('does not throw if all styles match', () => {
      const assertion = () => expect(element).toHaveStyle({
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

  });

  describe('method "toHaveContext"', () => {
    const Component = () => <div />;

    // React requires this to be specified, or context won't work.
    Component.contextTypes = {
      data: PropTypes.string,
    };

    const element = shallow(
      <Component />,
      {
        context: { data: 'probably' },
      }
    );

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
      const assertion = () => expect(element).toHaveContext({
        propertyExists: false,
      });

      expect(assertion).toThrow(/context/);
    });

    it('does not throw when the context matches', () => {
      const assertion = () => expect(element).toHaveContext({
        data: 'probably',
      });

      expect(assertion).toNotThrow();
    });

    it('shows stringifies the expected object for error messages', () => {
      const assertion = () => expect(element).toHaveContext({
        data: { stringify: 'me' },
      });

      expect(assertion).toNotThrow(/object Object/);
      expect(assertion).toThrow(/stringify.*?me/);
    });

  });

  describe('method "toContain"', () => {
    const Component = () => <div />;
    const element = shallow(
      <div>
        <article />

        <aside />
        <aside />

        <Component enabled className="component" />
      </div>
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

  describe('method "toNotContain"', () => {
    const Component = () => <div />;
    const element = shallow(
      <div>
        <article />

        <aside />
        <aside />

        <Component enabled className="component" />
      </div>
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

  describe('method "toBeAn"', () => {
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

  describe('method "toNotBeA"', () => {
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
      const element = shallow(<div><Component /></div>);
      const component = element.find('Component');

      expect(() => expect(component).toNotBeA(Component)).toThrow();
      expect(() => expect(element).toNotBeA(Component)).toNotThrow();
    });

  });

  describe('method "toNotBeAn"', () => {
    const Item = () => <div />;
    const element = shallow(<div><Item /></div>);
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

  describe('method "toExist"', () => {
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

  describe('method "toNotExist"', () => {
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
