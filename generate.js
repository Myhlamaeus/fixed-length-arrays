const { writeFile } = require('fs');
const { resolve: resolvePath, join: joinPath } = require('path');

function writeToLib(fileName, content) {
  return new Promise((resolve, reject) =>
    writeFile(
      resolvePath(__dirname, 'lib', `${fileName}`),
      content.replace(/(^|\n) +/g, '$1').trim() + '\n',
      err => (err ? reject(err) : resolve())
    )
  );
}

function getFixedLengthClassName(className) {
  return `FixedLength${className}`;
}

function createFixedLengthClassModule(className, fixedLengthClassName) {
  return writeToLib(
    `${fixedLengthClassName}.mjs`,
    ` import factory from './factory';

      export default factory(${className});`
  );
}

function createFixedLengthClassEntry(className, fixedLengthClassName) {
  return writeToLib(
    `${fixedLengthClassName}.js`,
    ` 'use strict';

      module.exports = require('@std/esm')(module)('./${fixedLengthClassName}.mjs').default;`
  );
}

function createFixedLengthClassTest(className, fixedLengthClassName) {
  return writeToLib(
    joinPath('__tests__', `${fixedLengthClassName}.test.js`),
    ` 'use strict';

      require('../testType')('${className}');`
  );
}

function createFixedLengthClass(className) {
  const fixedLengthClassName = getFixedLengthClassName(className);

  return Promise.all(
    [
      createFixedLengthClassModule,
      createFixedLengthClassEntry,
      createFixedLengthClassTest
    ].map(f => f(className, fixedLengthClassName))
  );
}

function createClassesModule(types) {
  return writeToLib(
    'classes.mjs',
    types
      .map(getFixedLengthClassName)
      .map(className => `export { default as ${className} } from './${className}';`)
      .join('\n')
  );
}

function createClassesEntry() {
  return writeToLib(
    `classes.js`,
    ` 'use strict';

      module.exports = require('@std/esm')(module)('./classes.mjs');`
  );
}

function createClasses(types) {
  Promise.all([createClassesModule(types), createClassesEntry()]);
}

function classNamesFromLengths(lengths, start, end = 'Array') {
  return lengths.map(length => start + length + end);
}

const intSizes = [8, 16, 32];
const floatSizes = [32, 64];
const clampedIntSizes = [8];
const types = [
  'Array',
  ...[
    [intSizes, 'Int'],
    [intSizes, 'Uint'],
    [clampedIntSizes, 'Uint', 'ClampedArray'],
    [floatSizes, 'Float']
  ]
    .map(args => classNamesFromLengths(...args))
    .reduce((a, b) => [...a, ...b], [])
];

Promise.all(
  types.map(className =>
    createFixedLengthClass(className).then(() => console.log(`Created ${className}`))
  )
)
  .then(() => createClasses(types))
  .catch(console.error);
