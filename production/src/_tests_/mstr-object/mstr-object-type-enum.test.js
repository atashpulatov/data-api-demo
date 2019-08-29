import MstrObjectType from '../../mstr-object/mstr-object-type-enum';

describe('MstrObjectTypeEnum', () => {
  it('should return proper type by subtype', () => {
    // given
    const subtypeMock = 774;
    const expectedOutput = MstrObjectType.mstrObjectType.report;
    // when
    const ouptput = MstrObjectType.getMstrTypeBySubtype(subtypeMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
  it('should return proper type by name', () => {
    // given
    const nameMock = 'DaTaSet';
    const expectedOutput = MstrObjectType.mstrObjectType.dataset;
    // when
    const ouptput = MstrObjectType.getMstrTypeByName(nameMock);
    // then
    expect(ouptput).toBe(expectedOutput);
  });
});
