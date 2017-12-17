export const symbolExpectedLength = Symbol('expectedLength');

function assertLength(instance, FixedLengthConstructor) {
  const expectedLength = FixedLengthConstructor[symbolExpectedLength];

  if (instance.length !== expectedLength) {
    throw new Error(`Length must be ${expectedLength}`);
  }
}

function describeFunction(Constructor, prop) {
  return {
    value(...args) {
      const instance = Constructor[prop].call(this, ...args);

      assertLength(instance, this);

      return instance;
    }
  };
}

export function setExpectedLength(FixedLengthConstructor, expectedLength) {
  FixedLengthConstructor[symbolExpectedLength] = expectedLength;
}

export default function(
  Constructor,
  { expectedLength = 0, name = `FixedLength${Constructor.name}` } = {}
) {
  const FixedLengthConstructor = class extends Constructor {
    constructor(init = new.target[symbolExpectedLength], ...otherArgs) {
      super(init, ...otherArgs);

      assertLength(this, new.target);
    }
  };

  setExpectedLength(FixedLengthConstructor, expectedLength);

  const desc = {};

  function addFunction(prop) {
    desc[prop] = describeFunction(Constructor, prop);
  }

  for (const prop of ['from', 'of']) {
    addFunction(prop);
  }

  if (name) {
    desc.name = {
      value: name,
      configurable: true
    };
  }

  Object.defineProperties(FixedLengthConstructor, desc);

  return FixedLengthConstructor;
}
