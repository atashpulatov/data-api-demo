export const columnInformationMock = [{
  name: 'HTML',
  id: '5526A4C611EA84801D4C0080EFB58BBB',
  type: 'attribute',
  forms: [{
    id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
    name: 'Description',
    dataType: 'UTF8Char',
    baseFormCategory: 'DESC',
    baseFormType: 'text'
  },
  {
    id: '45C11FA478E745FEA08D781CEA190FE5',
    name: 'HTML',
    dataType: 'varChar',
    baseFormCategory: 'ID',
    baseFormType: 'HTMLTag'
  }],
  elements: [{
    formValues: ['a', '<a href="https://rally1.rallydev.com/#/53987408409d/detail/defect/344574260072?fdp=true" TARGET="_NEW">Link</a>'],
    id: 'h<a href="https\\://rally1.rallydev.com/#/53987408409d/detail/defect/344574260072?fdp=true" TARGET="_NEW">Link</a>;5526A4C611EA84801D4C0080EFB58BBB'
  }],
  value: ['HTML']
},
{
  name: 'ID',
  id: '0BAF7D6611EA847D2B6C0080EF45ABBA',
  type: 'attribute',
  forms: [{
    id: '45C11FA478E745FEA08D781CEA190FE5',
    name: 'ID',
    dataType: 'integer',
    baseFormCategory: 'ID',
    baseFormType: 'number'
  }],
  elements: [{
    formValues: ['3'],
    id: 'h3;0BAF7D6611EA847D2B6C0080EF45ABBA'
  }],
  value: ['ID']
},
{
  name: 'Row Count - Custom Data',
  id: '0B4790AD11EA847DBB6B0080EFA5EA24',
  type: 'metric',
  min: 1,
  max: 1,
  dataType: 'double',
  numberFormatting: {
    category: 0,
    decimalPlaces: 0,
    formatString: '#,##0;(#,##0)'
  }, value: ['Row Count - Custom Data'],
  subtotalAddress: false
}];

export const expectedColumnSplit = [
  {
    attributeId: '5526A4C611EA84801D4C0080EFB58BBB',
    attributeName: 'HTML',
    forms: [
      {
        baseFormCategory: 'DESC',
        baseFormType: 'text',
        dataType: 'UTF8Char',
        id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
        name: 'Description',
      },
    ],
    isAttribute: true,
  },
  {
    attributeId: '5526A4C611EA84801D4C0080EFB58BBB',
    attributeName: 'HTML',
    forms: [
      {
        baseFormCategory: 'ID',
        baseFormType: 'HTMLTag',
        dataType: 'varChar',
        id: '45C11FA478E745FEA08D781CEA190FE5',
        name: 'HTML',
      },
    ],
    isAttribute: true,
  },
  {
    attributeId: '0BAF7D6611EA847D2B6C0080EF45ABBA',
    attributeName: 'ID',
    forms: [
      {
        baseFormCategory: 'ID',
        baseFormType: 'number',
        dataType: 'integer',
        id: '45C11FA478E745FEA08D781CEA190FE5',
        name: 'ID',
      }],
    isAttribute: true,
  },
  {
    category: 0,
    formatString: '#,##0;(#,##0)',
    id: '0B4790AD11EA847DBB6B0080EFA5EA24',
    isAttribute: false,
    name: 'Row Count - Custom Data',
  },
];

export const expectedColumnNoSplit = [
  {
    attributeId: '5526A4C611EA84801D4C0080EFB58BBB',
    attributeName: 'HTML',
    forms: [
      {
        baseFormCategory: 'DESC',
        baseFormType: 'text',
        dataType: 'UTF8Char',
        id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
        name: 'Description',
      },
      {
        baseFormCategory: 'ID',
        baseFormType: 'HTMLTag',
        dataType: 'varChar',
        id: '45C11FA478E745FEA08D781CEA190FE5',
        name: 'HTML',
      },
    ],
    isAttribute: true,
  },
  {
    attributeId: '0BAF7D6611EA847D2B6C0080EF45ABBA',
    attributeName: 'ID',
    forms: [
      {
        baseFormCategory: 'ID',
        baseFormType: 'number',
        dataType: 'integer',
        id: '45C11FA478E745FEA08D781CEA190FE5',
        name: 'ID',
      },
    ],
    isAttribute: true,
  },
  {
    category: 0,
    formatString: '#,##0;(#,##0)',
    id: '0B4790AD11EA847DBB6B0080EFA5EA24',
    isAttribute: false,
    name: 'Row Count - Custom Data',
  },
];
