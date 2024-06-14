import { Element } from '../src/mstr-object/mstr-object-response-types';

function createElement(formValues: string[], id: string): Element {
  return {
    formValues,
    id,
  };
}

export const pageByDataResponse = {
  pageBy: [
    {
      name: 'Region',
      id: '8D679D4B11D3E4981000E787EC6DE8A4',
      type: 'attribute',
      forms: [
        {
          id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
          name: 'DESC',
          dataType: 'varChar',
          baseFormCategory: 'DESC',
          baseFormType: 'text',
        },
      ],
      elements: [
        createElement(
          ['East Coast'],
          'WE31F9F64492596FFC88E52873A8C45D4:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4'
        ),
        createElement(
          ['West Coast'],
          'W051E87C14073A1C7E382B29F3E6D1A18:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4'
        ),
        createElement(
          ['Central and South'],
          'W703FC02A43136C5D290286BCA3EA5D27:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4'
        ),
        createElement(
          ['Web'],
          'W047F5F6E4F0CBBF6FB476CA6604C6AC9:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4'
        ),
        createElement(
          ['Total'],
          'W1CE03D47405E8526E5FBE28263497882:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4'
        ),
      ],
    },
  ],
  validPageByElements: {
    paging: {
      total: 5,
      current: 5,
      offset: 0,
      limit: 1000,
    },
    items: [[0], [1], [2], [3], [4]],
  },
};
