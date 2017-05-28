# Changelog
`expect-enzyme` uses [this changelog style](http://keepachangelog.com/en/0.3.0/) and follows [semver](http://semver.org/).

## Unreleased
### Changed
- **Breaking change**: `expect-enzyme` no longer exports an object. Now it's a function which returns the enzyme assertions. More details in [issue #9](https://github.com/PsychoLlama/expect-enzyme/issues/9).
- `react`, `react-dom`, `expect` and `enzyme` are peer dependencies now. This may break your tests if those dependencies aren't listed in your `package.json`.

### Added
- New `.toHaveRendered()` assertion.
- New `.toNotHaveRendered()` assertion.

## v0.15.0
### Added
- New `.toNotHaveClass(name)` assertion.
- New `.toNotHaveProp(name, value)` assertion.
- New `.toNotHaveProps(props)` assertion.
- New `.toNotHaveStyle(styles)` assertion.
- New `.toNotHaveState(state)` assertion.
- New `.toNotHaveContext(context)` assertion.

## v0.14.1
### Fixed
- Call to unsupported method `.exists()` on old enzyme versions.

## v0.14.0
### Added
- Support for mounted enzyme wrappers (`enzyme.mount`).

## v0.13.2
### Fixed
- Wraps custom assertions like `expect` built-ins rather than [obliterating them](https://github.com/PsychoLlama/expect-enzyme/issues/1).

## v0.13.1
### Changed
- If you're using `require`, you no longer need to import `.default` from `expect-enzyme`.

## v0.13.0
### Added
- `.toHaveContext({...})` assertion.

## v0.12.0
### Changed
- `.toHaveStyle()` now accepts an object of styles, replacing `.toHaveStyles({...})`.

### Removed
- `.toHaveStyles({...})` assertion.

## v0.11.0
### Added
- New `.toHaveStyles({...})` assertion.

## v0.10.0
### Added
- New `.toHaveStyle(property, [value])` assertion.

## v0.9.0
### Added
- Support for `.toNotExist()` assertion.

## v0.8.0
### Added
- New `.toContain(selector)` assertion.
- New `.toNotContain(selector)` assertion.

## v0.7.0
### Added
- New `.toHaveState({...state})` assertion.

## v0.6.0
### Added
- New `.toHaveClass(className)` assertion.

## v0.5.0
### Added
- Support for `.toNotBeA(type)` assertion.
- Support for `.toNotBeAn(type)` assertion.

## v0.4.0
### Added
- Support for `.toExist()` assertion.

## v0.3.1
### Added
- Shiny new readme.

## v0.3.0
### Added
- Support for `.toBeAn(type)` assertion. Slightly changes error messages for grammatical accuracy.

## v0.2.0
### Added
- Support for `.toBeA(type)` assertion.

### Fixed
- npm distribution hadn't included compiled source.

## v0.1.0
Initial release
