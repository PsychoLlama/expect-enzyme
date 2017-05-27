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
    const string = stringify(<div><span /></div>);

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

  it('shows children if there are no other props', () => {
    const string = stringify(<button>Buy now</button>);

    expect(string).toBe('<button>Buy now</button>');
  });

  it('shows primitive children', () => {
    const string = stringify(<div>Clicked {4} times</div>);

    expect(string).toBe('<div>Clicked 4 times</div>');
  });

  it('hides children if any are complex', () => {
    const string = stringify(
      <div>Text but then <i /> and more text later</div>
    );

    expect(string).toBe('<div>...</div>');
  });

  it('hides children if props take up too much space', () => {
    const string1 = stringify(<button disabled>content</button>);
    const string2 = stringify(<button disabled enabled>content</button>);
    const string3 = stringify(<button potato disabled enabled>content</button>);

    expect(string1).toBe('<button disabled>content</button>');
    expect(string2).toBe('<button disabled enabled>content</button>');
    expect(string3).toBe('<button potato disabled enabled>...</button>');
  });

  it('shows an ellipsis if text is too long', () => {
    const string = stringify(
      <div>
        Hey check it out this is a string but with
        like a huge amount of text why would anyone write
        this much I sure have no idea. #regrets
      </div>
    );

    expect(string).toBe('<div>Hey check it out this is...</div>');
  });

  it('does not show an ellipsis if text fits perfectly', () => {
    const string = stringify(
      <div>Exactly 25 letters long!!</div>
    );

    expect(string).toBe('<div>Exactly 25 letters long!!</div>');
  });

  it('truncates children at a good breaking point', () => {
    const string = stringify(
      <div>Exactly 25 characterslongloljustkidding</div>
    );

    expect(string).toBe('<div>Exactly 25...</div>');
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
      >
        <section>
          <div>
            <ol>
              <li></li>
              <li></li>
              <li></li>
            </ol>
          </div>
        </section>
      </Element>
    );

    expect(string).toBe(
      '<Element onAction={onAction} enabled disabled={false} ' +
        'string="value" style={Object[empty]}>...</Element>'
    );
  });
});
