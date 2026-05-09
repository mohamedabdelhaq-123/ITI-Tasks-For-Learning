const { isValidPassword} = require('./index');

describe('isValidPassword', () => {

  test('happy path (simple valid pass)', () => {
    const pass = isValidPassword("Momo12345");
    expect(pass).toEqual(
      {
        valid: true
        , reason: ''
      }
    )
  });

  test('too short (>8 chars)', () => {
    const pass= isValidPassword("Momo123");
    expect(pass).toEqual(
      {
        valid: false,
        reason: 'Too short (min 8 characters)'
      }
    )
  });

  test('no Uppercase (lowercase+nums)', () => {
    const pass= isValidPassword("momo12345");
    expect(pass).toEqual(
      {
        valid: false,
        reason: 'Must contain an uppercase letter'
      }
    )
  });

  test('no number (Lower+Upper)', () => {
    const pass= isValidPassword("Momomomomo");
    expect(pass).toEqual(
      {
        valid: false,
        reason: 'Must contain a number'
      }
    )
  });

  test('wrong type !(char or num)', () => {
    const pass= isValidPassword();
    expect(pass).toEqual(
      {
        valid: false,
        reason: 'Password must be a string'
      }
    )
  });

  test('edge case (boundries test)', () => {
    const pass= isValidPassword("Momo1235");
    expect(pass).toEqual(
      {
        valid: true
        , reason: ''
      }
    )
  });


})