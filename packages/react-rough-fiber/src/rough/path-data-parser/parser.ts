export interface Segment {
  key: string;
  data: number[];
}

const PARAMS: { [key: string]: number } = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };

const isWsp = (c: string) => {
  const codePoint = c.codePointAt(0);
  return (
    codePoint === 0x20 ||
    codePoint === 0x9 ||
    codePoint === 0xd ||
    codePoint === 0xa
  );
};

const isDigit = (c: string) => {
  const codePoint = c.codePointAt(0);
  if (codePoint === null || codePoint === undefined) {
    return false;
  }
  return 48 <= codePoint && codePoint <= 57;
};


const readNumber = (string: string, cursor: number): [number, number | null] => {
  let i = cursor;
  let value = '';
  let state = 'none';
  for (; i < string.length; i += 1) {
    const c = string[i];
    if (c === '+' || c === '-') {
      if (state === 'none') {
        state = 'sign';
        value += c;
        continue;
      }
      if (state === 'e') {
        state = 'exponent_sign';
        value += c;
        continue;
      }
    }
    if (isDigit(c)) {
      if (state === 'none' || state === 'sign' || state === 'whole') {
        state = 'whole';
        value += c;
        continue;
      }
      if (state === 'decimal_point' || state === 'decimal') {
        state = 'decimal';
        value += c;
        continue;
      }
      if (state === 'e' || state === 'exponent_sign' || state === 'exponent') {
        state = 'exponent';
        value += c;
        continue;
      }
    }
    if (c === '.') {
      if (state === 'none' || state === 'sign' || state === 'whole') {
        state = 'decimal_point';
        value += c;
        continue;
      }
    }
    if (c === 'E' || c === 'e') {
      if (
        state === 'whole' ||
        state === 'decimal_point' ||
        state === 'decimal'
      ) {
        state = 'e';
        value += c;
        continue;
      }
    }
    break;
  }
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) {
    return [cursor, null];
  } else {
    // step back to delegate iteration to parent loop
    return [i - 1, number];
  }
};

const isKey = (c: string) => {
  return c in PARAMS;
};

export function parsePath(d: string): Segment[] {
  const pathData = [];
  let key = null;
  let data: number[] = [];
  let argsCount = 0;
  let canHaveComma = false;
  let hadComma = false;
  for (let i = 0; i < d.length; i += 1) {
    const c = d.charAt(i);
    if (isWsp(c)) {
      continue;
    }
    // allow comma only between arguments
    if (canHaveComma && c === ',') {
      if (hadComma) {
        break;
      }
      hadComma = true;
      continue;
    }
    if (isKey(c)) {
      if (hadComma) {
        return pathData;
      }
      if (key === null || key === undefined) {
        // moveto should be leading key
        if (c !== 'M' && c !== 'm') {
          return pathData;
        }
      } else {
        // stop if previous key arguments are not flushed
        if (data.length !== 0) {
          return pathData;
        }
      }
      key = c;
      data = [];
      argsCount = PARAMS[key];
      canHaveComma = false;
      // flush key without arguments
      if (argsCount === 0) {
        pathData.push({ key, data });
      }
      continue;
    }
    // avoid parsing arguments if no key detected
    if (key === null || key === undefined) {
      return pathData;
    }
    // read next argument
    let newCursor = i;
    let number = null;
    if (key === 'A' || key === 'a') {
      const position = data.length;
      if (position === 0 || position === 1) {
        // allow only positive number without sign as first two arguments
        if (c !== '+' && c !== '-') {
          [newCursor, number] = readNumber(d, i);
        }
      }
      if (position === 2 || position === 5 || position === 6) {
        [newCursor, number] = readNumber(d, i);
      }
      if (position === 3 || position === 4) {
        // read flags
        if (c === '0') {
          number = 0;
        }
        if (c === '1') {
          number = 1;
        }
      }
    } else {
      [newCursor, number] = readNumber(d, i);
    }
    if (number === null || number === undefined) {
      return pathData;
    }
    data.push(number);
    canHaveComma = true;
    hadComma = false;
    i = newCursor;
    // flush arguments when necessary count is reached
    if (data.length === argsCount) {
      pathData.push({ key, data });
      // subsequent moveto coordinates are threated as implicit lineto commands
      if (key === 'M') {
        key = 'L';
      }
      if (key === 'm') {
        key = 'l';
      }
      data = [];
    }
  }
  return pathData;
}

export function serialize(segments: Segment[]): string {
  const tokens: (string | number)[] = [];
  for (const { key, data } of segments) {
    tokens.push(key);
    switch (key) {
      case 'C':
      case 'c':
        tokens.push(data[0], `${data[1]},`, data[2], `${data[3]},`, data[4], data[5]);
        break;
      case 'S':
      case 's':
      case 'Q':
      case 'q':
        tokens.push(data[0], `${data[1]},`, data[2], data[3]);
        break;
      default:
        tokens.push(...data);
        break;
    }
  }
  return tokens.join(' ');
}