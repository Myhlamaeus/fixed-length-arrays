# fixed-length-arrays [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Arrays of fixed length

## Installation

```sh
$ npm install --save fixed-length-arrays
```

## Usage

For any of the fixed-length array types, the length is checked against the
property with `symbolExpectedLength` as key **upon instantiation**. Note that
this does **not** affect the `length`-property—one can still set it to any value
one could set it to for the standard constructors.

### Using Predefined Fixed-Length Arrays

The module exports, for any `Array` and the `%TypedArray%`-constructors, a
constructor named `FixedLength*`. So, for example, `FixedLengthArray` for
`Array` and `FixedLengthUint8Array` for `Uint8Array`.

One can instead also import the constructors from equivalently-named files,
which can be found in `fixed-length-arrays/lib/`; however, those don’t include
`symbolExpectedLength`, which can instead be imported from
`fixed-length-arrays/lib/factory`.

```js
const {
  symbolExpectedLength,
  FixedLengthArray
} = require("fixed-length-arrays");
// Or, equivalently:
const { symbolExpectedLength } = require("fixed-length-arrays/lib/factory");
const FixedLengthArray = require("fixed-length-arrays/lib/FixedLengthArray");

class Example extends FixedLengthArray {}
Example[symbolExpectedLength] = 5; // Every new instance of Example with a different length will throw

new Example(10); // Throws
new Example(0); // Throws
new Example([0]); // Throws
new Example(); // Doesn’t throw and has length 5
new Example(5); // Doesn’t throw

Example.of(0, 1, 2); // Throws
Example.of(0, 1, 2, 3, 4); // Doesn’t throw

Example.from([0, 1, 2]); // Throws
Example.from([0, 1, 2, 3, 4]); // Doesn’t throw
```

### Creating Custom Fixed-Length Array-Types

`fixed-length-arrays/factory` exports a factory-function for constructors with
fixed length.

```js
const factory = require("fixed-length-arrays");

const SomeFixedLengthExample = factory(Example, {
  expectedLength: 15,
  name: "SomeName"
});

SomeFixedLengthExample[factory.symbolExpectedLength]; // 15
SomeFixedLengthExample.name; // "SomeName"

new SomeFixedLengthExample(0); // Throws
new SomeFixedLengthExample(10); // Throws
new SomeFixedLengthExample(15); // Doesn’t throw
```

## License

MIT © [Malte-Maurice Dreyer](https://github.com/Myhlamaeus)

[npm-image]: https://badge.fury.io/js/fixed-length-arrays.svg
[npm-url]: https://npmjs.org/package/fixed-length-arrays
[travis-image]: https://travis-ci.org/Myhlamaeus/fixed-length-arrays.svg?branch=master
[travis-url]: https://travis-ci.org/Myhlamaeus/fixed-length-arrays
[daviddm-image]: https://david-dm.org/Myhlamaeus/fixed-length-arrays.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Myhlamaeus/fixed-length-arrays
[coveralls-image]: https://coveralls.io/repos/Myhlamaeus/fixed-length-arrays/badge.svg
[coveralls-url]: https://coveralls.io/r/Myhlamaeus/fixed-length-arrays
