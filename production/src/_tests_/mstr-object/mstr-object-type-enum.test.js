import mstrObjectType from '../../mstr-object/mstr-object-type-enum';

describe('mstrObjectTypeEnum', () => {
  it('should return proper type by subtype', () => {
    // given
    const subtypeMock = 774;
    const expectedOutput = mstrObjectType.mstrObjectType.report;
    // when
    const ouptput = mstrObjectType.getMstrTypeBySubtype(subtypeMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
  it('should return proper type by name', () => {
    // given
    const nameMock = 'DaTaSet';
    const expectedOutput = mstrObjectType.mstrObjectType.dataset;
    // when
    const ouptput = mstrObjectType.getMstrTypeByName(nameMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
});
