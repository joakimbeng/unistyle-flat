# unistyle-flat

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![js-xo-style][codestyle-image]][codestyle-url]

> Unnest/flatten a [Unistyle](https://github.com/joakimbeng/unistyle) Object to a structure which resembles real CSS

## Installation

Install `unistyle-flat` using [npm](https://www.npmjs.com/):

```bash
npm install --save unistyle-flat
```

## Usage

### Module usage

#### Nesting

```javascript
var flat = require('unistyle-flat');

flat({
	a: {
		':hover': {
			fontWeight: 'bold'
		}
	}
});
/**
 * {
 *   'a:hover': {
 *     fontWeight: 'bold'
 *   }
 * }
 */
```

#### References

```javascript
var flat = require('unistyle-flat');

flat({
	a: {
		'& + span': {
			fontWeight: 'bold'
		}
	}
});
/**
 * {
 *   'a + span': {
 *     fontWeight: 'bold'
 *   }
 * }
 */
```

#### Media Queries

```javascript
var flat = require('unistyle-flat');

flat({
	p: {
		fontSize: '1em',
		'@media only screen and (max-width: 700px)': {
			fontSize: '.8em'
		}
	}
});
/**
 * {
 *   p: {
 *     fontSize: '1em'
 *   },
 *   '@media only screen and (max-width: 700px)': {
 *     p: {
 *       fontSize: '.8em'
 *     }
 *   }
 * }
 */
```

#### Arrays

```javascript
var flat = require('unistyle-flat');

flat([
	{body: {color: 'white'}},
	{body: {background: 'blue'}}
]);
/**
 * {
 *   body: {
 *     color: 'white',
 *     background: 'blue'
 *   }
 * }
 */
```

#### Grouping of selectors

```javascript
var flat = require('unistyle-flat');

flat({
	'.item1': {color: 'white'},
	'.item2': {color: 'white', background: 'blue'}
});
/**
 * {
 *   '.item1, .item2': {
 *     color: 'white'
 *   },
 *   '.item2': {
 *     background: 'blue'
 *   }
 * }
 */
```

## API

### `flat(obj)`

| Name | Type | Description |
|------|------|-------------|
| obj | `Object|Array` | A Unistyle Object or an Array of Unistyle Objects |

Returns: `Object`, the flattened/unnested object.

## License

MIT © Joakim Carlstein

[npm-url]: https://npmjs.org/package/unistyle-flat
[npm-image]: https://badge.fury.io/js/unistyle-flat.svg
[travis-url]: https://travis-ci.org/joakimbeng/unistyle-flat
[travis-image]: https://travis-ci.org/joakimbeng/unistyle-flat.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-brightgreen.svg?style=flat
