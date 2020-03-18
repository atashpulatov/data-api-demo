import { propsProxy } from '../../home/enum-props-proxy';


describe('propsProxy', () => {
  it('should return property of a target if it exists', () => {
    // given
    const name = 'name';
    const target = { name };

    // when
    const value = propsProxy.get(target, name);

    // then
    expect(value).toBe(name);
  });

  it('should throw an error if there is no such property', () => {
    // given
    const name = 'name';
    const target = {};

    // when

    // then
    try {
      expect(propsProxy.get(target, name)).toThrowError(`Property '${name}' does not exist in '${target}'.`);
    } catch (error) { console.error(error); }
  });
});
