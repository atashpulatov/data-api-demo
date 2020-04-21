import officeFormatHyperlinks from '../../../office/format/office-format-hyperlinks';

describe('OfficeFormatHyperlinks', () => {
  it.each`
  string                             | expectedResult

  ${'https://example.com'}           | ${true}   
  ${'http://example.com'}            | ${true}
  ${'ftp://example.com'}             | ${true}
  ${'http://223.255.255.254'}        | ${true}
  ${'http://foo.com/a/?b=1'}         | ${true}
  ${'hps://example.com'}             | ${false}   
  ${'256.900.12.1'}                  | ${false}
  ${'http:///a'}                     | ${false}
  
  `('isValidUrl should return $expectedResult for $string',
  ({
    string,
    expectedResult
  }) => {
    // when
    const result = officeFormatHyperlinks.isValidUrl(string);

    // then
    expect(result).toEqual(expectedResult);
  });


  it.each`
  string | baseFormType | expectedResult
  
  ${'https://example.com'} | ${'url'} | ${{ address: 'https://example.com', textToDisplay: 'https://example.com' }}   
  ${'ftp://example.com'} | ${'url'} | ${{ address: 'ftp://example.com', textToDisplay: 'ftp://example.com' }}
  ${'ftp://example.com'} | ${'url'} | ${{ address: 'ftp://example.com', textToDisplay: 'ftp://example.com' }}
  ${'<a href="https://example.com">link</a>'} | ${'url'} | ${null}
  ${'invalid'} | ${'url'} | ${null}
  ${'<a href="https://example.com">link</a>'} | ${'HTMLTag'} | ${{ address: 'https://example.com', textToDisplay: 'https://example.com' }}
  ${'<a data="text" href="https://example.com">text</a>'} | ${'HTMLTag'} | ${{ address: 'https://example.com', textToDisplay: 'text' }}
  ${'invalid'} | ${'HTMLTag'} | ${null}
  
  `('parseHTMLTag should work for $string with form $baseFormType',
  ({
    string,
    baseFormType,
    expectedResult
  }) => {
    // when
    const result = officeFormatHyperlinks.parseHTMLTag(string, baseFormType);

    // then
    expect(result).toEqual(expectedResult);
  });
});
