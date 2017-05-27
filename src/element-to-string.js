/* eslint-disable no-confusing-arrow */
import getDisplayName from 'react-display-name';
import React, { Children } from 'react';

/**
 * Turns nearly any value into a developer-friendly string.
 * @param  {Object} props - Props object.
 * @param  {String} key - Value index.
 * @return {Primitive} - A primitive value, often a string.
 */
const toPrimitive = (props, key) => {
  const value = props[key];

  // Get function names.
  if (typeof value === 'function') {
    return value.name || 'fn';
  }

  // Symbols require explicit string coercion.
  if (typeof value === 'symbol' || value instanceof RegExp) {
    return String(value);
  }

  // Prettify react components.
  if (React.isValidElement(value)) {
    return `<${getDisplayName(value.type)}>`;
  }

  // Abbreviate arrays and objects.
  if (value instanceof Array) {
    return `Array[${value.length}]`;
  }

  // Show object subclass names.
  if (value instanceof Object && value.constructor !== Object) {
    const type = value.constructor.name || 'Object';
    return `${type} {...}`;
  }

  // Abbreviate using the number of object keys.
  if (value instanceof Object) {
    const keys = Object.keys(value).length;
    return keys ? `Object[${keys}]` : 'Object[empty]';
  }

  return value;
};

/**
 * Turns a props object into an html-style attribute string.
 * @param  {Object} props - Attributes.
 * @return {String} - html-style attributes.
 */
const stringifyProps = (props) => (
  Object.keys(props).reduce((string, key) => {
    if (key === 'children') {
      return string;
    }

    const value = toPrimitive(props, key);
    const shouldUseBraces = typeof props[key] !== 'string';
    const open = shouldUseBraces ? '{' : '"';
    const close = shouldUseBraces ? '}' : '"';

    const keyValuePair = value === true
      ? key : `${key}=${open}${value}${close}`;

    return `${string} ${keyValuePair}`;
  }, '')
);

/**
 * Turns any children set into a screen-space friendly string.
 * @param  {ReactElement} element - Any react element.
 * @param  {String} propsString - The stringified element props.
 * @return {String} - Space-friendly string representation of the children.
 */
const stringifyChildren = (element, propsString) => {
  const children = Children.toArray(element.props.children);

  // Assume all non-objects are primitive.
  const primitives = children.filter((child) => (
    typeof child !== 'object' || child === null
  ));

  const spaceRemains = propsString.length < 20;
  const isPrimitive = children.length === primitives.length;
  const content = primitives.join('');

  // Find the furthest-most space character while being
  // no more than 25 characters in.
  const truncatePoint = content
    .split('')
    .map((char, index) => ({ char, index }))
    .filter((entry) => entry.char === ' ')
    .reduce((max, { index }) => index > 25 ? max : index, 0);

  const visibleContent = content.length > 25
    ? `${content.slice(0, truncatePoint)}...`
    : content;

  // Hide children if there isn't enough space left.
  // somewhat guesswork involved.
  return isPrimitive && spaceRemains ? visibleContent : '...';
};

/**
 * Turns an element into a string. Different from
 * `react-element-to-jsx-string` and `jsx-to-string`
 * since it renders on a single line (optimized for error messages).
 * Non-recursive, children are excluded.
 * @param  {ReactElement} element - Any react element.
 * @return {String} - A string representing the element.
 */
export default function stringify (element) {
  const type = getDisplayName(element.type);
  const props = stringifyProps(element.props);
  const hasChildren = Children.count(element.props.children) > 0;
  const children = stringifyChildren(element, props);
  const end = hasChildren ? `>${children}</${type}>` : ' />';

  return `<${type}${props}${end}`;
}
