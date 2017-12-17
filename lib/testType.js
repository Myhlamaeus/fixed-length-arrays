const assert = require('assert');

const fixedLengthArrays = require('./');
const { symbolExpectedLength, setExpectedLength } = fixedLengthArrays;
const classes = require('./classes');

function assertExpectedLength(Test, expected) {
  assert.equal(
    Test[symbolExpectedLength],
    expected,
    `@@expectedLength should be ${expected}`
  );
}

function testTypeForLength(FixedLengthType, expectedLength) {
  it(`should enforce a length of @@expectedLength (@@expectedLength = ${expectedLength})`, () => {
    const Test = class extends FixedLengthType {};

    for (const newExpectedLength of ['wrongValue', expectedLength, 'wrongValue']) {
      Test[symbolExpectedLength] = newExpectedLength;
      assertExpectedLength(newExpectedLength);
    }

    setExpectedLength(Test, expectedLength);
    assertExpectedLength(expectedLength);

    for (let testLength = 0; testLength < 5; ++testLength) {
      const shouldFail = testLength !== expectedLength;

      for (const testInit of [testLength]) {
        const testConstructor = () => {
          return new Test(testInit);
        };

        if (shouldFail) {
          assert.throws(
            testConstructor,
            `@@expectedLength ${expectedLength} -> should throw for value ${JSON.stringify(
              testInit
            )}`
          );
        } else {
          testConstructor();
        }
      }

      for (const testObject of [new Array(testLength).fill(0)]) {
        const tests = [
          () => {
            return Test.from(testObject);
          },
          () => {
            return Test.of(...testObject);
          }
        ];

        for (const test of tests) {
          if (shouldFail) {
            assert.throws(
              test,
              `@@expectedLength ${expectedLength} -> should throw for value ${JSON.stringify(
                testObject
              )}`
            );
          } else {
            test();
          }
        }
      }
    }
  });
}

module.exports = type => {
  const fixedLengthType = `FixedLength${type}`;

  describe(fixedLengthType, () => {
    const FixedLengthType = require(`./${fixedLengthType}`);

    it('should have the correct name', () => {
      assert.equal(FixedLengthType.name, fixedLengthType, 'The name is different');
    });

    it('should inherit correctly', () => {
      assert.equal(
        Object.getPrototypeOf(FixedLengthType).name,
        type,
        `The name of ${fixedLengthType}'s prototype must be '${type}'`
      );
    });

    it('should be exported correctly', () => {
      assert.equal(FixedLengthType, fixedLengthArrays[fixedLengthType]);
      assert.equal(FixedLengthType, classes[fixedLengthType]);
    });

    it('should have a property @@expectedLength, set to 0 by default', () => {
      assert.equal(FixedLengthType[symbolExpectedLength], 0);
    });

    testTypeForLength(FixedLengthType, 0);
    testTypeForLength(FixedLengthType, 1);
    testTypeForLength(FixedLengthType, 3);
  });
};
