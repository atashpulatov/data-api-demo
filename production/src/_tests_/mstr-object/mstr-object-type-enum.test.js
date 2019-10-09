import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

describe('mstrObjectTypeEnum', () => {
  it('should return proper type by subtype', () => {
    // given
    const subtypeMock = 774;
    const expectedOutput = mstrObjectEnum.mstrObjectType.report;
    // when
    const ouptput = mstrObjectEnum.getMstrTypeBySubtype(subtypeMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
  it('should return proper type by name', () => {
    // given
    const nameMock = 'DaTaSet';
    const expectedOutput = mstrObjectEnum.mstrObjectType.dataset;
    // when
    const ouptput = mstrObjectEnum.getMstrTypeByName(nameMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
});