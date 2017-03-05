# expect-enzyme
*Super-powered enzyme assertions*

[![Travis branch](https://img.shields.io/travis/PsychoLlama/expect-enzyme/master.svg?style=flat-square)](https://travis-ci.org/PsychoLlama/expect-enzyme)
[![npm downloads](https://img.shields.io/npm/dt/expect-enzyme.svg?style=flat-square)](https://www.npmjs.com/package/expect-enzyme)
[![npm versions](https://img.shields.io/npm/v/expect-enzyme.svg?style=flat-square)](https://www.npmjs.com/package/expect-enzyme)

## Why you need this
The [expect](https://github.com/mjackson/expect) library by [mjackson](https://github.com/mjackson) is super great. I'm not gonna try to convince you of that. Try it for yourself and experience the magic of improved error messages.

While `expect` excels in delivering quality errors messages, it has no idea what enzyme is.

If you're writing React tests with expect, you've probably seen this madness:

```js
// Assert that "MyComponent" exists.
expect(element.find('MyComponent').exists()).toBe(true)

// Assert "Counter" was given the number 6.
expect(element.find('Counter').prop('count')).toBe(6)
```

That's cool and all, but what kind of error messages do you get?

```plain
Error: Expected false to be true

Error: Expected 0 to be 6
```

I think we can improve.

## Why it's awesome
This library teaches expect how to enzyme. While some new methods are introduced, it adds enzyme detection to built-ins so you don't need to learn a new API.

For example:

```js
expect(element).toBeAn('aside')
// Error: Expected header to be an aside
```

You get the idea.

## Using it
> Note: all expect extensions are global.

### Installation

```sh
# npm
npm install expect-enzyme --save-dev

# yarn
yarn add expect-enzyme --dev
```

### Extending

```js
import expect from 'expect'
import enzymify from 'expect-enzyme';

// Infects the kernel with a crippling rootkit.
// Just kidding.
expect.extend(enzymify)
```

## API

### Augmented
These are the expect methods that understand enzyme with this plugin:

#### `.toBeA(type)`

```js
// Can use a string...
expect(element).toBeA('video')

// Or a component type.
expect(element).toBeA(ProfilePage)
```

##### Error

```plain
Error: Expected div to be a video
```

> Aliases: `.toBeAn()`

#### `.toNotBeA(type)`

```js
// Once again, it accepts a string...
expect(element).toNotBeA('nav')

// Or a component type.
expect(element).toNotBeA(DropDown)
```

##### Error

```plain
Error: Expected nav to not be a nav
Error: Expected DropDown to not be a DropDown
```

> Aliases: `.toNotBeAn()`

#### `.toExist()`

```js
expect(element).toExist()
```

##### Error

```plain
Error: Expected element to exist
```

### Extensions
New methods added for `expect` assertions.

#### `.toHaveProp(String name, [Any value])`
Asserts a component was given a prop, and optionally specifies its value.

```js
// Assert the element has the prop "disabled".
expect(element).toHaveProp('disabled')

// Assert the value of the users' name.
expect(user).toHaveProp('name', 'l33t_hackzor')
```

##### Error

```plain
Error: Expected div to have prop "disabled"
Error: Expected User property "name" to be "l33t_hackzor"
```

#### `.toHaveProps({...props})`
Asserts a component has a set of properties.

```js
// Asserts the button has all these properties.
expect(button).toHaveProps({size: 'large', type: 'action'})
```

##### Error

```plain
Error: Expected Button to have prop "size"
```

#### `.toHaveClass(className)`
Asserts a component contains a class name.

```js
// This button should be disabled.
expect(button).toHaveClass('disabled')
```

##### Error

```plain
Error: Expected button to have class "disabled"
```

#### `.toHaveState({...state})`
Asserts a component contains the state you expect.

```js
// Throws if either property is different.
expect(counter).toHaveState({
  isActive: true,
  clickCount: 3,
})
```

##### Error

```plain
Error: Expected state "count" to equal 5
```

#### `.toContain(selector)`
Asserts the component does contain the given selector.

```js
// This blog post should have a byline.
expect(blogPost).toContain('article')

// Works with components, too.
expect(blogPost).toContain(AuthorByline)

// And attribute selectors. But please don't.
expect(blogPost).toContain({ commentsEnabled: true })
```

##### Error

```plain
Error: Expected element to contain "article"
Error: Expected element to contain "AuthorByline"
Error: Expected element to contain "{commentsEnabled: true}"
```

#### `.toNotContain(selector)`
Asserts the component does not contain the given selector.

> **Note:** accepts the same types as [`.toContain`](#tocontainselector)

```js
// This search should not have a search result.
expect(search).toNotContain('SearchResult')
```

##### Error

```plain
Error: Expected element to not contain "SearchResult"
```

## Roadmap
There are more methods to augment:

- `.toHaveContext(object)`
- `.toHaveStyle(name, value)`
- `.toHaveStyles(object)`

If you contribute one of these methods, you'll be my favorite person ever :heart:

## Support
:star: Please star this repository to maintain my unbounded ego.

:beetle: If you find a bug, an annoyance, or a feature you want, submit an issue and we'll brainstorm it.
