# expect-enzyme
*Super-powered enzyme assertions*

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

## Roadmap
There are more methods to augment:

- `.toNotBeA(type)`
- `.toContain(selector)`
- `.toHaveClass(name)`
- `.toHaveState(object)`
- `.toHaveContext(object)`
- `.toHaveStyle(name, value)`
- `.toHaveStyles(object)`

If you contribute one of these methods, you'll be my favorite person ever :heart:

## Support
:star: Please star this repository to maintain my unbounded ego.

:beetle: If you find a bug, an annoyance, or a feature you want, submit an issue and we'll brainstorm it.
