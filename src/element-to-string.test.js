/* eslint-disable require-jsdoc */
import expect from 'expect';
import React from 'react';

import stringify from './element-to-string';


describe('Element to string', () => {
  it('shows the element type', () => {
    const string = stringify(<section />);

    expect(string).toBe('<section />');
  });

  it('shows component names', () => {
    const Potato = () => <div />;
    const string = stringify(<Potato />);

    expect(string).toBe('<Potato />');
  });

  it('shows attribute values', () => {
    const string = stringify(<input value="text" />);

    expect(string).toBe('<input value="text" />');
  });

  it('truncates truthy boolean attributes', () => {
    const string = stringify(<button disabled />);

    expect(string).toBe('<button disabled />');
  });

  it('spaces attributes correctly', () => {
    const string = stringify(<input value="" disabled />);

    expect(string).toBe('<input value="" disabled />');
  });

  it('shows expressions through braces', () => {
    const string = stringify(<div things={4} />);

    expect(string).toBe('<div things={4} />');
  });

  it('shows false values with braces', () => {
    const string = stringify(<button disabled={false} />);

    expect(string).toBe('<button disabled={false} />');
  });

  // This stringifier is about approximation, not exact precision.
  it('indicates there were children passed', () => {
    const string = stringify(<div>yay, another jsx stringifier.</div>);

    expect(string).toBe('<div>...</div>');
  });

  it('shows function names', () => {
    function handleClick () {}
    const string = stringify(<button onClick={handleClick} />);

    expect(string).toBe('<button onClick={handleClick} />');
  });

  it('assigns a default function name', () => {
    // Comma operator to avoid JavaScript's function name inference.
    const fn = (0, () => {});
    const string = stringify(<button onClick={fn} />);

    expect(string).toBe('<button onClick={fn} />');
  });

  it('abbreviates arrays', () => {
    const list = Array(150).fill(5);
    const string = stringify(<div list={list} />);

    expect(string).toBe('<div list={Array[150]} />');
  });

  it('abbreviates objects', () => {
    const object = Array(100)
      .fill()
      .map((value, index) => index + 1)
      .reduce((obj, index) => {
        obj[index] = index;
        return obj;
      }, {});

    const string = stringify(<div object={object} />);

    expect(string).toBe('<div object={Object[100]} />');
  });

  it('shows empty objects', () => {
    const string = stringify(<div style={{}} />);

    expect(string).toBe('<div style={Object[empty]} />');
  });

  it('shows null values', () => {
    const string = stringify(<div onClick={null} />);

    expect(string).toBe('<div onClick={null} />');
  });

  it('shows symbols', () => {
    const string = stringify(<div onClick={Symbol('description')} />);

    expect(string).toBe('<div onClick={Symbol(description)} />');
  });

  it('shows regex values', () => {
    const regex = /hey steve/;
    const string = stringify(<li search={regex} />);

    expect(string).toBe('<li search={/hey steve/} />');
  });

  it('shows the constructor name if not an object', () => {
    class Potato {}
    const string = stringify(<div value={new Potato()} />);

    expect(string).toBe('<div value={Potato {...}} />');
  });

  it('shows react element names', () => {
    const Potato = () => <div />;
    const string = stringify(<div value={<Potato />} />);

    expect(string).toBe('<div value={<Potato>} />');
  });

  it('works', () => {
    const Element = () => <div />;
    function onAction () {}
    const string = stringify(
      <Element
        onAction={onAction}
        enabled
        disabled={false}
        string="value"
        style={{}}
      >Oh look children</Element>
    );

    expect(string).toBe(
      '<Element onAction={onAction} enabled disabled={false} ' +
        'string="value" style={Object[empty]}>...</Element>'
    );
  });
});
