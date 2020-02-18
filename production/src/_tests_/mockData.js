export const environmentProjectList = [{
  acg: 255, alias: '', dateCreated: '2015-06-30T21:55:35.000+0000', dateModified: '2019-02-08T15:00:55.000+0000', description: 'MicroStrategy Tutorial project and application set designed to illustrate the platform\'s rich functionality. The theme is an Electronics, Books, Movies and Music store. Employees, Inventory, Finance, Product Sales and Suppliers are analyzed.', id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754', name: 'MicroStrategy Tutorial', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, status: 0,
}, {
  acg: 255, alias: '', dateCreated: '2016-11-20T16:39:48.000+0000', dateModified: '2018-12-12T13:05:34.000+0000', description: '', id: 'CE52831411E696C8BD2F0080EFD5AF44', name: 'Consolidated Education Project', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, status: 0,
}, {
  acg: 255, alias: '', dateCreated: '2016-11-20T16:43:45.000+0000', dateModified: '2018-12-12T13:06:02.000+0000', description: '', id: 'B3FEE61A11E696C8BD0F0080EFC58F44', name: 'Hierarchies Project', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, status: 0,
}, {
  acg: 255, alias: '', dateCreated: '2016-11-20T16:46:11.000+0000', dateModified: '2018-12-12T13:06:29.000+0000', description: 'The Human Resources Analysis Module analyses workforce headcount, trends and profiles, employee attrition and recruitment, compensation and benefit costs and employee qualifications, performance and satisfaction.', id: '4BAE16A340B995CAD24193AA3AC15D29', name: 'Human Resources Analysis Module', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, status: 0,
}, {
  acg: 255, alias: '', dateCreated: '2016-11-20T16:49:27.000+0000', dateModified: '2018-12-12T13:07:30.000+0000', description: '', id: '4C09350211E69712BAEE0080EFB56D41', name: 'Relationships Project', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, status: 0,
}, {
  acg: 255, alias: '', dateCreated: '2018-12-12T13:15:41.000+0000', dateModified: '2018-12-18T15:58:31.000+0000', description: 'Platform Analytics (MicroStrategy 2019)', id: '065E7F1E11E8FE1004240080EFE55E79', name: 'Platform Analytics', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, platformAnalytics: true, status: 0,
}];
export const mockReports = [
  {
    id: 'F9E139BE11E85E842B520080EFC5C210',
    name: 'TestReport',
    instanceId: '88C04DF411E85E8646090080EFD5E10E',
    result: {
      definition: {
        attributes: [
          {
            name: 'Country',
            id: '8D679D3811D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
          {
            name: 'Region',
            id: '8D679D4B11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
          {
            name: 'Age Range',
            id: '5603951E4FE1BC04A44E44B85BBB8ED2',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Count of Customers',
            id: '82156AB211D40978C000C7906B98494F',
            type: 'Metric',
            min: 851,
            max: 8168,
            numberFormatting: {
              category: 0,
              decimalPlaces: 0,
              formatString: '#,##0',
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 40,
          current: 40,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'USA', },
                name: 'USA',
                id: 'h1;8D679D3811D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Central', },
                    name: 'Central',
                    id: 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Mid-Atlantic', },
                    name: 'Mid-Atlantic',
                    id: 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Northeast', },
                    name: 'Northeast',
                    id: 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Northwest', },
                    name: 'Northwest',
                    id: 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'South', },
                    name: 'South',
                    id: 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Southeast', },
                    name: 'Southeast',
                    id: 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Southwest', },
                    name: 'Southwest',
                    id: 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1702,
                          fv: '1,702',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3260,
                          fv: '3,260',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3436,
                          fv: '3,436',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 3434,
                          fv: '3,434',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 8168,
                          fv: '8,168',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Web', },
                name: 'Web',
                id: 'h7;8D679D3811D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Web', },
                    name: 'Web',
                    id: 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '24 and under', },
                        name: '24 and under',
                        id: 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 851,
                          fv: '851',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '25 to 34', },
                        name: '25 to 34',
                        id: 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1630,
                          fv: '1,630',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '35 to 44', },
                        name: '35 to 44',
                        id: 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1718,
                          fv: '1,718',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '45 to 54', },
                        name: '45 to 54',
                        id: 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 1717,
                          fv: '1,717',
                          mi: 0,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: '55 and over', },
                        name: '55 and over',
                        id: 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                      },
                      metrics: {
                        'Count of Customers': {
                          rv: 4084,
                          fv: '4,084',
                          mi: 0,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  },

  {
    id: 'BD1E844211E85FF536AB0080EFB5F215',
    name: 'SimpleReport',
    instanceId: '56A59BE011E85FF751620080EFD53213',
    result: {
      definition: {
        attributes: [
          {
            name: 'Region',
            id: '8D679D4B11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: '# of Customers',
            id: 'CAAC011C4617A0267D5C0C88039B6916',
            type: 'Metric',
            min: 554,
            max: 7981,
            numberFormatting: {
              category: 0,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '#,##0',
              negativeType: 1,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 8,
          current: 8,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Central', },
                name: 'Central',
                id: 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 1620,
                  fv: '1,620',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Mid-Atlantic', },
                name: 'Mid-Atlantic',
                id: 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 1432,
                  fv: '1,432',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Northeast', },
                name: 'Northeast',
                id: 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 2701,
                  fv: '2,701',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Northwest', },
                name: 'Northwest',
                id: 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 554,
                  fv: '554',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'South', },
                name: 'South',
                id: 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 1726,
                  fv: '1,726',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Southeast', },
                name: 'Southeast',
                id: 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 731,
                  fv: '731',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Southwest', },
                name: 'Southwest',
                id: 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 1206,
                  fv: '1,206',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Web', },
                name: 'Web',
                id: 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                '# of Customers': {
                  rv: 7981,
                  fv: '7,981',
                  mi: 0,
                },
              },
            },
          ],
        },
      },
    },
  },

  {
    id: '3FC4A93A11E85FF62EB70080EFE55315',
    name: 'ComplexReport',
    instanceId: 'BE18079011E85FF751620080EFD53417',
    result: {
      definition: {
        attributes: [
          {
            name: 'Country',
            id: '8D679D3811D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
          {
            name: 'Region',
            id: '8D679D4B11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
          {
            name: 'Category',
            id: '8D679D3711D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: '# of Customers',
            id: 'CAAC011C4617A0267D5C0C88039B6916',
            type: 'Metric',
            min: 537,
            max: 7269,
            numberFormatting: {
              category: 0,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Average Revenue',
            id: '971752994EFBAE6CF37A26A03FDA9813',
            type: 'Metric',
            min: 13.6780124947,
            max: 299.9392518824,
            numberFormatting: {
              category: 0,
              formatString: '#,##0;(#,##0)',
            },
          },
          {
            name: 'Cost',
            id: '7FD5B69611D5AC76C000D98A4CC5F24F',
            type: 'Metric',
            min: 101145.1220000004,
            max: 4909403.682000001,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Profit',
            id: '4C051DB611D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 9154.9188999992,
            max: 1053304.9179999968,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0;("$"#,##0)',
              negativeType: 3,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 32,
          current: 32,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'USA', },
                name: 'USA',
                id: 'h1;8D679D3811D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Central', },
                    name: 'Central',
                    id: 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1609,
                          fv: '1,609',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.6896846732,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 295504.8720000021,
                          fv: '$295,505',
                          mi: 2,
                        },
                        Profit: {
                          rv: 81331.0779999979,
                          fv: '$81,331',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1582,
                          fv: '1,582',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 294.0833962422,
                          fv: '294',
                          mi: 1,
                        },
                        Cost: {
                          rv: 2886348.2690000017,
                          fv: '$2,886,348',
                          mi: 2,
                        },
                        Profit: {
                          rv: 619713.9809999986,
                          fv: '$619,714',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1616,
                          fv: '1,616',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.4886913981,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 552347.5284999979,
                          fv: '$552,348',
                          mi: 2,
                        },
                        Profit: {
                          rv: 37008.9715000021,
                          fv: '$37,009',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1609,
                          fv: '1,609',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.9263961104,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 530842.8114000006,
                          fv: '$530,843',
                          mi: 2,
                        },
                        Profit: {
                          rv: 26268.7385999994,
                          fv: '$26,269',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Mid-Atlantic', },
                    name: 'Mid-Atlantic',
                    id: 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1425,
                          fv: '1,425',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8417643683,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 264862.2730000005,
                          fv: '$264,862',
                          mi: 2,
                        },
                        Profit: {
                          rv: 72793.7269999995,
                          fv: '$72,794',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1401,
                          fv: '1,401',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 294.5246279268,
                          fv: '295',
                          mi: 1,
                        },
                        Cost: {
                          rv: 2561246.8938,
                          fv: '$2,561,247',
                          mi: 2,
                        },
                        Profit: {
                          rv: 545693.4062000001,
                          fv: '$545,693',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1427,
                          fv: '1,427',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.4422928146,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 486673.7369999974,
                          fv: '$486,674',
                          mi: 2,
                        },
                        Profit: {
                          rv: 32295.6130000025,
                          fv: '$32,296',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1429,
                          fv: '1,429',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8847708818,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 466748.5707000013,
                          fv: '$466,749',
                          mi: 2,
                        },
                        Profit: {
                          rv: 22300.8292999988,
                          fv: '$22,301',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Northeast', },
                    name: 'Northeast',
                    id: 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 2683,
                          fv: '2,683',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8931664804,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 506489.6980000046,
                          fv: '$506,490',
                          mi: 2,
                        },
                        Profit: {
                          rv: 139931.5519999956,
                          fv: '$139,932',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 2640,
                          fv: '2,640',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 291.2901123596,
                          fv: '291',
                          mi: 1,
                        },
                        Cost: {
                          rv: 4909403.682000001,
                          fv: '$4,909,404',
                          mi: 2,
                        },
                        Profit: {
                          rv: 1053304.9179999968,
                          fv: '$1,053,305',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 2691,
                          fv: '2,691',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.4439948948,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 938490.503500001,
                          fv: '$938,491',
                          mi: 2,
                        },
                        Profit: {
                          rv: 63070.5464999987,
                          fv: '$63,071',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 2691,
                          fv: '2,691',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.9138921652,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 899298.9746999989,
                          fv: '$899,299',
                          mi: 2,
                        },
                        Profit: {
                          rv: 44424.6753000012,
                          fv: '$44,425',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Northwest', },
                    name: 'Northwest',
                    id: 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 550,
                          fv: '550',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.6780124947,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 101145.1220000004,
                          fv: '$101,145',
                          mi: 2,
                        },
                        Profit: {
                          rv: 28030.0279999996,
                          fv: '$28,030',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 537,
                          fv: '537',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 299.9392518824,
                          fv: '300',
                          mi: 1,
                        },
                        Cost: {
                          rv: 1017538.676,
                          fv: '$1,017,539',
                          mi: 2,
                        },
                        Profit: {
                          rv: 217311.2240000001,
                          fv: '$217,311',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 551,
                          fv: '551',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.3793321881,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 188404.3144999988,
                          fv: '$188,404',
                          mi: 2,
                        },
                        Profit: {
                          rv: 12489.3355000013,
                          fv: '$12,489',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 553,
                          fv: '553',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.9148174406,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 187113.5811000008,
                          fv: '$187,114',
                          mi: 2,
                        },
                        Profit: {
                          rv: 9154.9188999992,
                          fv: '$9,155',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'South', },
                    name: 'South',
                    id: 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1716,
                          fv: '1,716',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8005946919,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 319304.5700000016,
                          fv: '$319,305',
                          mi: 2,
                        },
                        Profit: {
                          rv: 86805.5299999984,
                          fv: '$86,806',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1683,
                          fv: '1,683',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 290.2833708301,
                          fv: '290',
                          mi: 1,
                        },
                        Cost: {
                          rv: 3087772.6412000023,
                          fv: '$3,087,773',
                          mi: 2,
                        },
                        Profit: {
                          rv: 653980.0087999986,
                          fv: '$653,980',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1723,
                          fv: '1,723',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.405676851,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 597212.8049999985,
                          fv: '$597,213',
                          mi: 2,
                        },
                        Profit: {
                          rv: 38841.0450000012,
                          fv: '$38,841',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1719,
                          fv: '1,719',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8902230279,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 578034.2717999995,
                          fv: '$578,034',
                          mi: 2,
                        },
                        Profit: {
                          rv: 27329.4282000006,
                          fv: '$27,329',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Southeast', },
                    name: 'Southeast',
                    id: 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 724,
                          fv: '724',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.7989515868,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 133825.2890000012,
                          fv: '$133,825',
                          mi: 2,
                        },
                        Profit: {
                          rv: 36619.3609999988,
                          fv: '$36,619',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 705,
                          fv: '705',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 287.4620114836,
                          fv: '287',
                          mi: 1,
                        },
                        Cost: {
                          rv: 1280174.341999999,
                          fv: '$1,280,174',
                          mi: 2,
                        },
                        Profit: {
                          rv: 271833.058000001,
                          fv: '$271,833',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 728,
                          fv: '728',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.3797731106,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 247948.680499998,
                          fv: '$247,949',
                          mi: 2,
                        },
                        Profit: {
                          rv: 16337.169500002,
                          fv: '$16,337',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 726,
                          fv: '726',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8686137584,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 241327.407600002,
                          fv: '$241,327',
                          mi: 2,
                        },
                        Profit: {
                          rv: 11885.742399998,
                          fv: '$11,886',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Southwest', },
                    name: 'Southwest',
                    id: 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1193,
                          fv: '1,193',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.7983513514,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 220099.4510000013,
                          fv: '$220,099',
                          mi: 2,
                        },
                        Profit: {
                          rv: 60696.9989999989,
                          fv: '$60,697',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1180,
                          fv: '1,180',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 292.0059038067,
                          fv: '292',
                          mi: 1,
                        },
                        Cost: {
                          rv: 2108086.307200002,
                          fv: '$2,108,086',
                          mi: 2,
                        },
                        Profit: {
                          rv: 453973.4927999981,
                          fv: '$453,973',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1196,
                          fv: '1,196',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.4137285053,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 408297.0030000042,
                          fv: '$408,297',
                          mi: 2,
                        },
                        Profit: {
                          rv: 27574.1469999957,
                          fv: '$27,574',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 1201,
                          fv: '1,201',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8528128856,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 396317.7296999956,
                          fv: '$396,318',
                          mi: 2,
                        },
                        Profit: {
                          rv: 19086.5703000043,
                          fv: '$19,087',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Web', },
                name: 'Web',
                id: 'h7;8D679D3811D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Web', },
                    name: 'Web',
                    id: 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
                  },
                  isPartial: false,
                  children: [
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Books', },
                        name: 'Books',
                        id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 6661,
                          fv: '6,661',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.9266631769,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 229584.823,
                          fv: '$229,585',
                          mi: 2,
                        },
                        Profit: {
                          rv: 63070.0770000001,
                          fv: '$63,070',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Electronics', },
                        name: 'Electronics',
                        id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 4919,
                          fv: '4,919',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 292.5305367687,
                          fv: '293',
                          mi: 1,
                        },
                        Cost: {
                          rv: 2251129.2412,
                          fv: '$2,251,129',
                          mi: 2,
                        },
                        Profit: {
                          rv: 473792.7088,
                          fv: '$473,793',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Movies', },
                        name: 'Movies',
                        id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 7269,
                          fv: '7,269',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 14.3727794562,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 424870.4014999995,
                          fv: '$424,870',
                          mi: 2,
                        },
                        Profit: {
                          rv: 27081.6485000001,
                          fv: '$27,082',
                          mi: 3,
                        },
                      },
                    },
                    {
                      depth: 2,
                      element: {
                        attributeIndex: 2,
                        formValues: { DESC: 'Music', },
                        name: 'Music',
                        id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                      },
                      metrics: {
                        '# of Customers': {
                          rv: 7253,
                          fv: '7,253',
                          mi: 0,
                        },
                        'Average Revenue': {
                          rv: 13.8896845244,
                          fv: '14',
                          mi: 1,
                        },
                        Cost: {
                          rv: 413640.0494999996,
                          fv: '$413,640',
                          mi: 2,
                        },
                        Profit: {
                          rv: 19593.1005000006,
                          fv: '$19,593',
                          mi: 3,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  },

  {
    id: 'C536EA7A11E903741E640080EF55BFE2',
    name: 'TEST REPORT 1',
    status: 1,
    instanceId: '5FB8720E11E92953186E0080EFA53000',
    result: {
      definition: {
        attributes: [
          {
            name: 'Customer',
            id: '8D679D3C11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: '8D67A35B11D3E4981000E787EC6DE8A4',
                name: 'Last Name',
                dataType: 'Char',
                baseFormType: 'Text',
              },
              {
                id: '8D67A35F11D3E4981000E787EC6DE8A4',
                name: 'First Name',
                dataType: 'Char',
                baseFormType: 'Text',
              },
              {
                id: '45C11FA478E745FEA08D781CEA190FE5',
                name: 'ID',
                dataType: 'Real',
                baseFormType: 'Number',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Revenue',
            id: '4C05177011D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 1567.6,
            max: 8899,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 51,
          current: 51,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Adams',
                  'First Name': 'Anne-Marie',
                  ID: '2118',
                },
                name: 'Adams Anne-Marie 2118',
                id: 'h2118;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5697.9,
                  fv: '$5,698',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Biltucci',
                  'First Name': 'David',
                  ID: '3523',
                },
                name: 'Biltucci David 3523',
                id: 'h3523;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6236.9,
                  fv: '$6,237',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Blum',
                  'First Name': 'Darrick',
                  ID: '99',
                },
                name: 'Blum Darrick 99',
                id: 'h99;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5313.25,
                  fv: '$5,313',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Bossen',
                  'First Name': 'May',
                  ID: '5166',
                },
                name: 'Bossen May 5166',
                id: 'h5166;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1916,
                  fv: '$1,916',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Bowyer',
                  'First Name': 'Buddy',
                  ID: '1342',
                },
                name: 'Bowyer Buddy 1342',
                id: 'h1342;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5258,
                  fv: '$5,258',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Brattensborg',
                  'First Name': 'Vic',
                  ID: '8949',
                },
                name: 'Brattensborg Vic 8949',
                id: 'h8949;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3186.4,
                  fv: '$3,186',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Buckner',
                  'First Name': 'Erling',
                  ID: '6435',
                },
                name: 'Buckner Erling 6435',
                id: 'h6435;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 7534,
                  fv: '$7,534',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Campillo',
                  'First Name': 'Ulyess',
                  ID: '3258',
                },
                name: 'Campillo Ulyess 3258',
                id: 'h3258;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4169,
                  fv: '$4,169',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Conterno',
                  'First Name': 'Kipp',
                  ID: '5740',
                },
                name: 'Conterno Kipp 5740',
                id: 'h5740;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6463.7,
                  fv: '$6,464',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Crum',
                  'First Name': 'Tralene',
                  ID: '7274',
                },
                name: 'Crum Tralene 7274',
                id: 'h7274;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4108.85,
                  fv: '$4,109',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Demuth',
                  'First Name': 'Enar',
                  ID: '7552',
                },
                name: 'Demuth Enar 7552',
                id: 'h7552;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5168.75,
                  fv: '$5,169',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Folz',
                  'First Name': 'Dinesh',
                  ID: '8141',
                },
                name: 'Folz Dinesh 8141',
                id: 'h8141;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6711.1,
                  fv: '$6,711',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Fuller',
                  'First Name': 'Doreen',
                  ID: '8036',
                },
                name: 'Fuller Doreen 8036',
                id: 'h8036;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1920.15,
                  fv: '$1,920',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Furrow',
                  'First Name': 'Van',
                  ID: '3508',
                },
                name: 'Furrow Van 3508',
                id: 'h3508;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6172,
                  fv: '$6,172',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Gates',
                  'First Name': 'Ilan',
                  ID: '1872',
                },
                name: 'Gates Ilan 1872',
                id: 'h1872;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3719.4,
                  fv: '$3,719',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'George',
                  'First Name': 'Mitch',
                  ID: '3939',
                },
                name: 'George Mitch 3939',
                id: 'h3939;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 7756.7,
                  fv: '$7,757',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Gordon',
                  'First Name': 'Wesley',
                  ID: '7630',
                },
                name: 'Gordon Wesley 7630',
                id: 'h7630;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3608,
                  fv: '$3,608',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Gouveia',
                  'First Name': 'Gretton',
                  ID: '6080',
                },
                name: 'Gouveia Gretton 6080',
                id: 'h6080;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5924.6,
                  fv: '$5,925',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Gulman',
                  'First Name': 'May',
                  ID: '2727',
                },
                name: 'Gulman May 2727',
                id: 'h2727;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 8899,
                  fv: '$8,899',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Haydon',
                  'First Name': 'Mark',
                  ID: '1299',
                },
                name: 'Haydon Mark 1299',
                id: 'h1299;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3962.1,
                  fv: '$3,962',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Herrick',
                  'First Name': 'Allwyn',
                  ID: '9598',
                },
                name: 'Herrick Allwyn 9598',
                id: 'h9598;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5811.3,
                  fv: '$5,811',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Hu',
                  'First Name': 'Gerald',
                  ID: '5302',
                },
                name: 'Hu Gerald 5302',
                id: 'h5302;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6507.5,
                  fv: '$6,508',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Julius',
                  'First Name': 'Beatrice',
                  ID: '6233',
                },
                name: 'Julius Beatrice 6233',
                id: 'h6233;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2434.4,
                  fv: '$2,434',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Kahn',
                  'First Name': 'Greg',
                  ID: '1838',
                },
                name: 'Kahn Greg 1838',
                id: 'h1838;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6646.25,
                  fv: '$6,646',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Kisker',
                  'First Name': 'Doyle',
                  ID: '3990',
                },
                name: 'Kisker Doyle 3990',
                id: 'h3990;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2998,
                  fv: '$2,998',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Kobi',
                  'First Name': 'Al',
                  ID: '8427',
                },
                name: 'Kobi Al 8427',
                id: 'h8427;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4833.8,
                  fv: '$4,834',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Korpela',
                  'First Name': 'Eugene',
                  ID: '4493',
                },
                name: 'Korpela Eugene 4493',
                id: 'h4493;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5865.5,
                  fv: '$5,866',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Kounovsky',
                  'First Name': 'Gloria',
                  ID: '3155',
                },
                name: 'Kounovsky Gloria 3155',
                id: 'h3155;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5084.95,
                  fv: '$5,085',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Lawrence',
                  'First Name': 'Cyril',
                  ID: '3485',
                },
                name: 'Lawrence Cyril 3485',
                id: 'h3485;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1567.6,
                  fv: '$1,568',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Lisker',
                  'First Name': 'Ola',
                  ID: '7609',
                },
                name: 'Lisker Ola 7609',
                id: 'h7609;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2306.3,
                  fv: '$2,306',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Littleman',
                  'First Name': 'Kate',
                  ID: '311',
                },
                name: 'Littleman Kate 311',
                id: 'h311;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6546.7,
                  fv: '$6,547',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Lutz',
                  'First Name': 'Chatherine',
                  ID: '2583',
                },
                name: 'Lutz Chatherine 2583',
                id: 'h2583;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 7771,
                  fv: '$7,771',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Main',
                  'First Name': 'Tyrone',
                  ID: '9317',
                },
                name: 'Main Tyrone 9317',
                id: 'h9317;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4169.9,
                  fv: '$4,170',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Mcnabb',
                  'First Name': 'Sarah',
                  ID: '3440',
                },
                name: 'Mcnabb Sarah 3440',
                id: 'h3440;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6249.2,
                  fv: '$6,249',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Paul',
                  'First Name': 'Fletch',
                  ID: '3136',
                },
                name: 'Paul Fletch 3136',
                id: 'h3136;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4131.7,
                  fv: '$4,132',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Pirnat',
                  'First Name': 'Kellie',
                  ID: '5124',
                },
                name: 'Pirnat Kellie 5124',
                id: 'h5124;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5768.25,
                  fv: '$5,768',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Pitcher',
                  'First Name': 'Derick',
                  ID: '4561',
                },
                name: 'Pitcher Derick 4561',
                id: 'h4561;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6465.6,
                  fv: '$6,466',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Powell',
                  'First Name': 'Dino',
                  ID: '3463',
                },
                name: 'Powell Dino 3463',
                id: 'h3463;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5022,
                  fv: '$5,022',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Rauch',
                  'First Name': 'Celeste',
                  ID: '3322',
                },
                name: 'Rauch Celeste 3322',
                id: 'h3322;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4125.4,
                  fv: '$4,125',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Reedy',
                  'First Name': 'Doane',
                  ID: '1383',
                },
                name: 'Reedy Doane 1383',
                id: 'h1383;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3800,
                  fv: '$3,800',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Scroggs',
                  'First Name': 'Daryle',
                  ID: '2004',
                },
                name: 'Scroggs Daryle 2004',
                id: 'h2004;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5477.15,
                  fv: '$5,477',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Shea',
                  'First Name': 'Bruno',
                  ID: '2651',
                },
                name: 'Shea Bruno 2651',
                id: 'h2651;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5434.3,
                  fv: '$5,434',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Shultz',
                  'First Name': 'Oriana',
                  ID: '1720',
                },
                name: 'Shultz Oriana 1720',
                id: 'h1720;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4074.6,
                  fv: '$4,075',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Tengwall',
                  'First Name': 'Dell',
                  ID: '9099',
                },
                name: 'Tengwall Dell 9099',
                id: 'h9099;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4139.65,
                  fv: '$4,140',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Thornton',
                  'First Name': 'Vashti',
                  ID: '1703',
                },
                name: 'Thornton Vashti 1703',
                id: 'h1703;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5469.3,
                  fv: '$5,469',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Trusty',
                  'First Name': 'Berny',
                  ID: '5789',
                },
                name: 'Trusty Berny 5789',
                id: 'h5789;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4100.7,
                  fv: '$4,101',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Valencia',
                  'First Name': 'Justine',
                  ID: '6240',
                },
                name: 'Valencia Justine 6240',
                id: 'h6240;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6300.15,
                  fv: '$6,300',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Varga',
                  'First Name': 'Pradeep',
                  ID: '6443',
                },
                name: 'Varga Pradeep 6443',
                id: 'h6443;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5531.8,
                  fv: '$5,532',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Vulgamora',
                  'First Name': 'Miriam',
                  ID: '1358',
                },
                name: 'Vulgamora Miriam 1358',
                id: 'h1358;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 6586.5,
                  fv: '$6,587',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Webb',
                  'First Name': 'Garnett',
                  ID: '4782',
                },
                name: 'Webb Garnett 4782',
                id: 'h4782;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4712.8,
                  fv: '$4,713',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: {
                  'Last Name': 'Wolin',
                  'First Name': 'Marian',
                  ID: '4164',
                },
                name: 'Wolin Marian 4164',
                id: 'h4164;8D679D3C11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5416.3,
                  fv: '$5,416',
                  mi: 0,
                },
              },
            },
          ],
        },
      },
    },
  },

  {
    id: '1D94908011E9343200690080EF95E8E9',
    name: '13_report_with_showing_id(OFF)',
    status: 1,
    instanceId: '7C36BB4411E935C362760080EF6588E9',
    result: {
      definition: {
        attributes: [{
          name: 'Category',
          id: '8D679D3711D3E4981000E787EC6DE8A4',
          type: 'Attribute',
          forms: [{
            id: 'CCFBE2A5EADB4F50941FB879CCF1721C', name: 'DESC', dataType: 'Char', baseFormType: 'Text',
          }, {
            id: '45C11FA478E745FEA08D781CEA190FE5', name: 'ID', dataType: 'Real', baseFormType: 'Number',
          }],
        }, {
          name: 'Subcategory',
          id: '8D679D4F11D3E4981000E787EC6DE8A4',
          type: 'Attribute',
          forms: [{
            id: 'CCFBE2A5EADB4F50941FB879CCF1721C', name: 'DESC', dataType: 'Char', baseFormType: 'Text',
          }],
        }],
        metrics: [{
          name: 'Units Received',
          id: '4C05185811D3E877C000B3B2D86C964F',
          type: 'Metric',
          min: 11460,
          max: 54445,
          numberFormatting: {
            category: 0, decimalPlaces: 0, formatString: '#,##0', negativeType: 1,
          },
        }],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 24, current: 24, offset: 0, limit: 1000, prev: null, next: null,
        },
        root: {
          isPartial: false,
          children: [{
            depth: 0,
            element: {
              attributeIndex: 0, formValues: { DESC: 'Books', ID: '1' }, name: 'Books 1', id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
            },
            isPartial: false,
            children: [{
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Art & Architecture' }, name: 'Art & Architecture', id: 'h11;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 28753, fv: '28,753', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Business' }, name: 'Business', id: 'h12;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 28405, fv: '28,405', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Literature' }, name: 'Literature', id: 'h13;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 38859, fv: '38,859', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Books - Miscellaneous' }, name: 'Books - Miscellaneous', id: 'h14;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 38666, fv: '38,666', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Science & Technology' }, name: 'Science & Technology', id: 'h15;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 25141, fv: '25,141', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Sports & Health' }, name: 'Sports & Health', id: 'h16;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 26945, fv: '26,945', mi: 0 } },
            }],
          }, {
            depth: 0,
            element: {
              attributeIndex: 0, formValues: { DESC: 'Electronics', ID: '2' }, name: 'Electronics 2', id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
            },
            isPartial: false,
            children: [{
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Audio Equipment' }, name: 'Audio Equipment', id: 'h21;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 15615, fv: '15,615', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Cameras' }, name: 'Cameras', id: 'h22;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 11460, fv: '11,460', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Computers' }, name: 'Computers', id: 'h23;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 16700, fv: '16,700', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Electronics - Miscellaneous' }, name: 'Electronics - Miscellaneous', id: 'h24;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 13310, fv: '13,310', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'TV\'s' }, name: 'TV\'s', id: 'h25;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 15275, fv: '15,275', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Video Equipment' }, name: 'Video Equipment', id: 'h26;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 11500, fv: '11,500', mi: 0 } },
            }],
          }, {
            depth: 0,
            element: {
              attributeIndex: 0, formValues: { DESC: 'Movies', ID: '3' }, name: 'Movies 3', id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
            },
            isPartial: false,
            children: [{
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Action' }, name: 'Action', id: 'h31;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 49435, fv: '49,435', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Comedy' }, name: 'Comedy', id: 'h32;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 52925, fv: '52,925', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Drama' }, name: 'Drama', id: 'h33;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 46600, fv: '46,600', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Horror' }, name: 'Horror', id: 'h34;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 50895, fv: '50,895', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Kids / Family' }, name: 'Kids / Family', id: 'h35;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 46655, fv: '46,655', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Special Interests' }, name: 'Special Interests', id: 'h36;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 39370, fv: '39,370', mi: 0 } },
            }],
          }, {
            depth: 0,
            element: {
              attributeIndex: 0, formValues: { DESC: 'Music', ID: '4' }, name: 'Music 4', id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
            },
            isPartial: false,
            children: [{
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Alternative' }, name: 'Alternative', id: 'h41;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 54445, fv: '54,445', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Country' }, name: 'Country', id: 'h42;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 52810, fv: '52,810', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Music - Miscellaneous' }, name: 'Music - Miscellaneous', id: 'h43;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 37035, fv: '37,035', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Pop' }, name: 'Pop', id: 'h44;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 48730, fv: '48,730', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Rock' }, name: 'Rock', id: 'h45;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 51715, fv: '51,715', mi: 0 } },
            }, {
              depth: 1,
              element: {
                attributeIndex: 1, formValues: { DESC: 'Soul / R&B' }, name: 'Soul / R&B', id: 'h46;8D679D4F11D3E4981000E787EC6DE8A4',
              },
              metrics: { 'Units Received': { rv: 32270, fv: '32,270', mi: 0 } },
            }],
          }],
        },
      },
    },
  },

  {
    id: '25F259BA11E94B25A45E0080EF251ED2',
    name: 'No attributes report',
    status: 1,
    instanceId: 'D803FDCE11E94BE916D30080EF85455B',
    result: {
      definition: {
        attributes: [],
        metrics: [
          {
            name: 'Cost',
            id: '7FD5B69611D5AC76C000D98A4CC5F24F',
            type: 'Metric',
            min: 29730084.52039946,
            max: 29730084.52039946,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Profit',
            id: '4C051DB611D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 5293623.629600862,
            max: 5293623.629600862,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0;("$"#,##0)',
              negativeType: 3,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 1,
          current: 1,
          offset: 0,
          limit: 5000,
          prev: null,
          next: null,
        },
        root: {
          metrics: {
            Cost: {
              rv: 29730084.52039946,
              fv: '$29,730,085',
              mi: 0,
            },
            Profit: {
              rv: 5293623.629600862,
              fv: '$5,293,624',
              mi: 1,
            },
          },
        },
      },
    },
  },

  {
    id: 'B570032611E94B25B9810080EF95B252',
    name: 'All data filtered Report',
    status: 1,
    instanceId: 'AEA0B8A911E94BEB16D30080EF45C55B',
    result: {
      definition: {
        attributes: [
          {
            name: 'Region',
            id: '8D679D4B11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
                baseFormType: 'Text',
              },
            ],
          },
          {
            name: 'Call Center',
            id: '8D679D3511D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
                baseFormType: 'Text',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Revenue',
            id: '4C05177011D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: '',
            max: '',
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Cost',
            id: '7FD5B69611D5AC76C000D98A4CC5F24F',
            type: 'Metric',
            min: '',
            max: '',
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 0,
          current: 0,
          offset: 0,
          limit: 5000,
          prev: null,
          next: null,
        },
        root: null,
      },
    },
  },
];
export const mockBadReports = [
  {
    id: '297AACE74346C3EEA17DC89CB3232C0A',
    name: 'Quarterly Revenue Forecast',
    instanceId: 'AB59525E11E8D6CF6DFF0080EF45B5C4',
    result: {
      definition: {
        attributes: [
          {
            name: 'Quarter',
            id: '8D679D4A11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Revenue',
            id: '4C05177011D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 1682656.0,
            max: 4512939.6499999445,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0;("$"#,##0)',
              negativeType: 3,
            },
          },
        ],
        thresholds: [],
        sorting: [],
      },
      data: {
        paging: {
          total: 16,
          current: 16,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2014 Q1', },
                name: '2014 Q1',
                id: 'h20141;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1682656.0,
                  fv: '$1,682,656',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2014 Q2', },
                name: '2014 Q2',
                id: 'h20142;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1985787.4999999984,
                  fv: '$1,985,788',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2014 Q3', },
                name: '2014 Q3',
                id: 'h20143;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2314294.5000000093,
                  fv: '$2,314,295',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2014 Q4', },
                name: '2014 Q4',
                id: 'h20144;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2664500.0999999717,
                  fv: '$2,664,500',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2015 Q1', },
                name: '2015 Q1',
                id: 'h20151;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2498756.0,
                  fv: '$2,498,756',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2015 Q2', },
                name: '2015 Q2',
                id: 'h20152;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2684763.600000007,
                  fv: '$2,684,764',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2015 Q3', },
                name: '2015 Q3',
                id: 'h20153;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3067019.00000001,
                  fv: '$3,067,019',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2015 Q4', },
                name: '2015 Q4',
                id: 'h20154;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3267067.399999965,
                  fv: '$3,267,067',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2016 Q1', },
                name: '2016 Q1',
                id: 'h20161;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3111989.0,
                  fv: '$3,111,989',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2016 Q2', },
                name: '2016 Q2',
                id: 'h20162;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3504479.1000000276,
                  fv: '$3,504,479',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2016 Q3', },
                name: '2016 Q3',
                id: 'h20163;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3729456.300000008,
                  fv: '$3,729,456',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2016 Q4', },
                name: '2016 Q4',
                id: 'h20164;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4512939.6499999445,
                  fv: '$4,512,940',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2017 Q1', },
                name: '2017 Q1',
                id: 'h20171;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: '',
                  fv: '',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2017 Q2', },
                name: '2017 Q2',
                id: 'h20172;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: '',
                  fv: '',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2017 Q3', },
                name: '2017 Q3',
                id: 'h20173;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: '',
                  fv: '',
                  mi: 0,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: '2017 Q4', },
                name: '2017 Q4',
                id: 'h20174;8D679D4A11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: '',
                  fv: '',
                  mi: 0,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    id: '19CA15ED451AA1BAAE68418A22793AA3',
    name: 'ATT SEL Category/ Subcategory',
    instanceId: '7B2E58F611E8D6D26DFF0080EF9556C6',
    result: {
      definition: {
        attributes: [
          {
            name: 'Category',
            id: '8D679D3711D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
          {
            name: 'Subcategory',
            id: '8D679D4F11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Revenue',
            id: '4C05177011D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 296228.8500000001,
            max: 5108463.5,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Rank',
            id: '0D222F604A751D4534222D8DCFC2377C',
            type: 'Metric',
            isDerived: true,
            min: 1.0,
            max: 6.0,
            numberFormatting: {
              category: 0,
              decimalPlaces: 0,
              formatString: '#,##0;(#,##0)',
            },
          },
        ],
        thresholds: [],
        sorting: [
          {
            type: 'form',
            attribute: {
              name: 'Category',
              id: '8D679D3711D3E4981000E787EC6DE8A4',
            },
            form: {
              name: 'ID',
              id: '45C11FA478E745FEA08D781CEA190FE5',
            },
            order: 'descending',
          },
          {
            type: 'metric',
            metric: {
              name: 'Revenue',
              id: '4C05177011D3E877C000B3B2D86C964F',
            },
            order: 'descending',
          },
          {
            type: 'form',
            attribute: {
              name: 'Subcategory',
              id: '8D679D4F11D3E4981000E787EC6DE8A4',
            },
            form: {
              name: 'DESC',
              id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
            },
            order: 'descending',
          },
        ],
      },
      data: {
        paging: {
          total: 24,
          current: 24,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Music', },
                name: 'Music',
                id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Country', },
                    name: 'Country',
                    id: 'h42;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 729298.9000000006,
                      fv: '$729,299',
                      mi: 0,
                    },
                    Rank: {
                      rv: 1.0,
                      fv: '1',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Alternative', },
                    name: 'Alternative',
                    id: 'h41;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 706129.5500000003,
                      fv: '$706,130',
                      mi: 0,
                    },
                    Rank: {
                      rv: 2.0,
                      fv: '2',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Rock', },
                    name: 'Rock',
                    id: 'h45;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 700755.6999999998,
                      fv: '$700,756',
                      mi: 0,
                    },
                    Rank: {
                      rv: 3.0,
                      fv: '3',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Pop', },
                    name: 'Pop',
                    id: 'h44;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 687861.4,
                      fv: '$687,861',
                      mi: 0,
                    },
                    Rank: {
                      rv: 4.0,
                      fv: '4',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Music - Miscellaneous', },
                    name: 'Music - Miscellaneous',
                    id: 'h43;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 597507.65,
                      fv: '$597,508',
                      mi: 0,
                    },
                    Rank: {
                      rv: 5.0,
                      fv: '5',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Soul / R&B', },
                    name: 'Soul / R&B',
                    id: 'h46;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 471814.1999999999,
                      fv: '$471,814',
                      mi: 0,
                    },
                    Rank: {
                      rv: 6.0,
                      fv: '6',
                      mi: 1,
                    },
                  },
                },
              ],
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Movies', },
                name: 'Movies',
                id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Special Interests', },
                    name: 'Special Interests',
                    id: 'h36;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 813946.2499999993,
                      fv: '$813,946',
                      mi: 0,
                    },
                    Rank: {
                      rv: 1.0,
                      fv: '1',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Drama', },
                    name: 'Drama',
                    id: 'h33;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 698840.3,
                      fv: '$698,840',
                      mi: 0,
                    },
                    Rank: {
                      rv: 2.0,
                      fv: '2',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Comedy', },
                    name: 'Comedy',
                    id: 'h32;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 669641.8000000007,
                      fv: '$669,642',
                      mi: 0,
                    },
                    Rank: {
                      rv: 3.0,
                      fv: '3',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Kids / Family', },
                    name: 'Kids / Family',
                    id: 'h35;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 664957.25,
                      fv: '$664,957',
                      mi: 0,
                    },
                    Rank: {
                      rv: 4.0,
                      fv: '4',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Horror', },
                    name: 'Horror',
                    id: 'h34;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 633992.8500000003,
                      fv: '$633,993',
                      mi: 0,
                    },
                    Rank: {
                      rv: 5.0,
                      fv: '5',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Action', },
                    name: 'Action',
                    id: 'h31;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 617565.0000000005,
                      fv: '$617,565',
                      mi: 0,
                    },
                    Rank: {
                      rv: 6.0,
                      fv: '6',
                      mi: 1,
                    },
                  },
                },
              ],
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Electronics', },
                name: 'Electronics',
                id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Video Equipment', },
                    name: 'Video Equipment',
                    id: 'h26;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 5108463.5,
                      fv: '$5,108,464',
                      mi: 0,
                    },
                    Rank: {
                      rv: 1.0,
                      fv: '1',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Cameras', },
                    name: 'Cameras',
                    id: 'h22;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 5061147.5,
                      fv: '$5,061,148',
                      mi: 0,
                    },
                    Rank: {
                      rv: 2.0,
                      fv: '2',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Electronics - Miscellaneous', },
                    name: 'Electronics - Miscellaneous',
                    id: 'h24;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 4671956.500000002,
                      fv: '$4,671,957',
                      mi: 0,
                    },
                    Rank: {
                      rv: 3.0,
                      fv: '3',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'TV\'s', },
                    name: 'TV\'s',
                    id: 'h25;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 3837905.8500000006,
                      fv: '$3,837,906',
                      mi: 0,
                    },
                    Rank: {
                      rv: 4.0,
                      fv: '4',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Audio Equipment', },
                    name: 'Audio Equipment',
                    id: 'h21;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 3782832.0,
                      fv: '$3,782,832',
                      mi: 0,
                    },
                    Rank: {
                      rv: 5.0,
                      fv: '5',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Computers', },
                    name: 'Computers',
                    id: 'h23;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 1928997.5000000002,
                      fv: '$1,928,998',
                      mi: 0,
                    },
                    Rank: {
                      rv: 6.0,
                      fv: '6',
                      mi: 1,
                    },
                  },
                },
              ],
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Books', },
                name: 'Books',
                id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
              },
              isPartial: false,
              children: [
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Science & Technology', },
                    name: 'Science & Technology',
                    id: 'h15;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 811786.9999999998,
                      fv: '$811,787',
                      mi: 0,
                    },
                    Rank: {
                      rv: 1.0,
                      fv: '1',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Art & Architecture', },
                    name: 'Art & Architecture',
                    id: 'h11;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 480172.8499999997,
                      fv: '$480,173',
                      mi: 0,
                    },
                    Rank: {
                      rv: 2.0,
                      fv: '2',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Business', },
                    name: 'Business',
                    id: 'h12;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 400870.8000000001,
                      fv: '$400,871',
                      mi: 0,
                    },
                    Rank: {
                      rv: 3.0,
                      fv: '3',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Sports & Health', },
                    name: 'Sports & Health',
                    id: 'h16;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 335105.8500000002,
                      fv: '$335,106',
                      mi: 0,
                    },
                    Rank: {
                      rv: 4.0,
                      fv: '4',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Books - Miscellaneous', },
                    name: 'Books - Miscellaneous',
                    id: 'h14;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 315929.1000000004,
                      fv: '$315,929',
                      mi: 0,
                    },
                    Rank: {
                      rv: 5.0,
                      fv: '5',
                      mi: 1,
                    },
                  },
                },
                {
                  depth: 1,
                  element: {
                    attributeIndex: 1,
                    formValues: { DESC: 'Literature', },
                    name: 'Literature',
                    id: 'h13;8D679D4F11D3E4981000E787EC6DE8A4',
                  },
                  metrics: {
                    Revenue: {
                      rv: 296228.8500000001,
                      fv: '$296,229',
                      mi: 0,
                    },
                    Rank: {
                      rv: 6.0,
                      fv: '6',
                      mi: 1,
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: '3F221CE44375CB91DD35EA9014778223',
    name: '20 Region',
    instanceId: 'AC8FA1AC11E8D6D26DFF0080EF2577C7',
    result: {
      definition: {
        attributes: [
          {
            name: 'Region',
            id: '8D679D4B11D3E4981000E787EC6DE8A4',
            type: 'Attribute',
            forms: [
              {
                id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                name: 'DESC',
                dataType: 'Char',
              },
            ],
          },
        ],
        metrics: [
          {
            name: 'Revenue',
            id: '4C05177011D3E877C000B3B2D86C964F',
            type: 'Metric',
            min: 1761187.1999999997,
            max: 8554414.549999997,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 1,
            },
          },
          {
            name: 'Standard Deviation of Revenue',
            id: '82F256FE432647176373C289AD3BA126',
            type: 'Metric',
            thresholds: [
              0,
            ],
            min: 2427.562126692,
            max: 16037.0517947014,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 0,
            },
          },
          {
            name: 'Max Revenue',
            id: '080A26DE4A288C0037452AA46DF92145',
            type: 'Metric',
            min: 23700,
            max: 102050,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 0,
            },
          },
          {
            name: 'Min Revenue',
            id: 'D623DEB3499902169FECFA8B57C06A5A',
            type: 'Metric',
            min: 45.2,
            max: 1163.25,
            numberFormatting: {
              category: 1,
              decimalPlaces: 0,
              thousandSeparator: true,
              currencySymbol: '$',
              currencyPosition: 0,
              formatString: '"$"#,##0',
              negativeType: 0,
            },
          },
          {
            name: 'Count Distinct (Items Sold)',
            id: 'A73DF7944B47BA98D23110A63FC17C90',
            type: 'Metric',
            min: 360,
            max: 360,
            numberFormatting: {
              category: 0,
              decimalPlaces: 0,
              formatString: '#,##0;(#,##0)',
            },
          },
        ],
        thresholds: [
          {
            id: '82F256FE432647176373C289AD3BA126#0',
            name: 'New Threshold',
            type: 'Metric',
            format: {},
            condition: '',
          },
        ],
        sorting: [],
      },
      data: {
        paging: {
          total: 8,
          current: 8,
          offset: 0,
          limit: 1000,
          prev: null,
          next: null,
        },
        root: {
          isPartial: false,
          children: [
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Central', },
                name: 'Central',
                id: 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5029366.25,
                  fv: '$5,029,366',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 5614.4767803597,
                  fv: '$5,614',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 45480,
                  fv: '$45,480',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 205.05,
                  fv: '$205',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Mid-Atlantic', },
                name: 'Mid-Atlantic',
                id: 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 4452615.050000004,
                  fv: '$4,452,615',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 3091.9888667382,
                  fv: '$3,092',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 33050,
                  fv: '$33,050',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 45.2,
                  fv: '$45',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Northeast', },
                name: 'Northeast',
                id: 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 8554414.549999997,
                  fv: '$8,554,415',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 7452.7014645208,
                  fv: '$7,453',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 64320,
                  fv: '$64,320',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 61.35,
                  fv: '$61',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Northwest', },
                name: 'Northwest',
                id: 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 1761187.1999999997,
                  fv: '$1,761,187',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 2646.8625699508,
                  fv: '$2,647',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 30360,
                  fv: '$30,360',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 131.55,
                  fv: '$132',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'South', },
                name: 'South',
                id: 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 5389280.299999999,
                  fv: '$5,389,280',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 7398.9820094164,
                  fv: '$7,399',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 51500,
                  fv: '$51,500',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 470.1,
                  fv: '$470',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Southeast', },
                name: 'Southeast',
                id: 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 2239951.0500000003,
                  fv: '$2,239,951',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 2427.562126692,
                  fv: '$2,428',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 23700,
                  fv: '$23,700',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 155.55,
                  fv: '$156',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Southwest', },
                name: 'Southwest',
                id: 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3694131.6999999983,
                  fv: '$3,694,132',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 3401.4196094712,
                  fv: '$3,401',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 33840,
                  fv: '$33,840',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 113.1,
                  fv: '$113',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
            {
              depth: 0,
              element: {
                attributeIndex: 0,
                formValues: { DESC: 'Web', },
                name: 'Web',
                id: 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
              },
              metrics: {
                Revenue: {
                  rv: 3902762.0500000026,
                  fv: '$3,902,762',
                  mi: 0,
                },
                'Standard Deviation of Revenue': {
                  rv: 16037.0517947014,
                  fv: '$16,037',
                  mi: 1,
                },
                'Max Revenue': {
                  rv: 102050,
                  fv: '$102,050',
                  mi: 2,
                },
                'Min Revenue': {
                  rv: 1163.25,
                  fv: '$1,163',
                  mi: 3,
                },
                'Count Distinct (Items Sold)': {
                  rv: 360,
                  fv: '360',
                  mi: 4,
                },
              },
            },
          ],
        },
      },
    },
  },
];
export const mstrTutorial = [{
  acg: 255, dateCreated: '2018-12-19T09:59:11.000+0000', dateModified: '2018-12-19T13:25:39.000+0000', extType: 0, id: 'BBA0AE1A11E9037408660080EFE5E0E3', name: '-OG_TESTING', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 2048, type: 8, version: '938FF1A211E9039100000080EFB57FE3',
}, {
  acg: 255, dateCreated: '2005-05-06T21:48:43.000+0000', dateModified: '2016-08-12T19:33:44.000+0000', description: 'These folders contain reports that are appropriate for individuals in different organizational roles.', extType: 0, id: '032A5E114A59D28267BDD8B6D9E58B22', name: 'Business Roles', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '97C25AEC4CD92391DD9AAEBEAB7ACA30',
}, {
  acg: 255, dateCreated: '2007-01-13T22:39:22.000+0000', dateModified: '2016-08-12T19:33:44.000+0000', description: 'This folder contains several examples of dashboards.', extType: 0, id: 'F025A94B4C03B6DCEE0F5D9DA825DA67', name: 'Documents and Scorecards', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '97C25AEC4CD92391DD9AAEBEAB7ACA30',
}, {
  acg: 255, dateCreated: '2003-09-08T20:35:27.000+0000', dateModified: '2016-08-12T19:33:44.000+0000', description: 'This folder contains various types of documents such as scorecards and dashboards, managed metrics reports, production and operational reports, invoices and statements, and business reports.', extType: 0, id: '92ADD0F84D07AC532AD03BA0F92A836B', name: 'Enterprise Reporting Documents', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '97C25AEC4CD92391DD9AAEBEAB7ACA30',
}, {
  acg: 255, dateCreated: '2016-02-02T16:46:17.000+0000', dateModified: '2018-02-06T20:29:04.000+0000', extType: 0, id: '7F16A4B811E58ED317D50080EFF554EA', name: 'Getting Started', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '5F5128C411E80B7C32DC0080EF758A60',
}, {
  acg: 255, dateCreated: '2018-12-19T10:56:43.000+0000', dateModified: '2018-12-19T11:06:17.000+0000', extType: 0, id: 'C54EB05811E9037C08660080EFB580E5', name: 'Kuba', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 2048, type: 8, version: '1B74E08211E9037EE4C00080EF553FAA',
}, {
  acg: 255, dateCreated: '2006-05-23T08:55:20.000+0000', dateModified: '2016-08-12T19:33:44.000+0000', description: 'This folder contains examples of many of the sophisticated capabilities within the MicroStrategy platform.', extType: 0, id: 'D64C532E4E7FBA74D29A7CA3576F39CF', name: 'MicroStrategy Platform Capabilities', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '97C25AEC4CD92391DD9AAEBEAB7ACA30',
}, {
  acg: 255, dateCreated: '2017-08-22T21:58:25.000+0000', dateModified: '2018-01-29T21:13:19.000+0000', extType: 0, hidden: true, id: 'C6C5ECF0B571448A9C31C653AB1D5E51', name: 'Sample Dashboards', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '3A94209811E80539D63E0080EF757F7A',
}, {
  acg: 255, dateCreated: '2017-09-19T16:39:15.000+0000', dateModified: '2018-02-02T21:16:55.000+0000', extType: 0, id: '12F7E26011E79D592D640080EFB5E3A2', name: 'Sample Dossiers', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 2048, type: 8, version: '653768BE11E8085EE8130080EFC5633C',
}, {
  acg: 255, dateCreated: '2006-05-22T15:42:06.000+0000', dateModified: '2016-08-12T19:33:44.000+0000', description: 'This folder contains reports that are categorized by topic. Topics include Customer Analysis, Enterprise Performance Management, Human Resource Analysis, Inventory and Supply Chain Analysis, Sales and Profitability Analysis, and Supplier Analysis.', extType: 0, id: '5B68C5AE433C728679340A91DC8F809C', name: 'Subject Areas', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 2048, type: 8, version: '97C25AEC4CD92391DD9AAEBEAB7ACA30',
}, {
  acg: 255, certifiedInfo: { certified: false }, dateCreated: '2018-12-19T09:59:27.000+0000', dateModified: '2018-12-19T09:59:27.000+0000', extType: 1, id: 'C536EA7A11E903741E640080EF55BFE2', name: 'TEST REPORT 1', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 768, type: 3, version: 'C5370B1811E90374E2BF0080EF553EA8', viewMedia: 134217728,
}, {
  acg: 255, certifiedInfo: { certified: false }, dateCreated: '2018-12-19T10:00:35.000+0000', dateModified: '2018-12-19T10:00:35.000+0000', extType: 1, id: 'EDBFC41C11E90374240C0080EF1541E6', name: 'TEST REPORT 2', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 768, type: 3, version: 'EDBFEC6211E9037400000080EF15C0AD', viewMedia: 134217728,
}, {
  acg: 255, certifiedInfo: { certified: false }, dateCreated: '2018-12-19T10:04:48.000+0000', dateModified: '2018-12-19T10:04:48.000+0000', extType: 1, id: '84C2592411E903751D0E0080EF9540E5', name: 'TEST REPORT 3', owner: { id: '7FC05A65473CE2FD845CE6A1D3F13233', name: 'MSTR User' }, subtype: 768, type: 3, version: '84C29A8811E9037500000080EF95BFAC', viewMedia: 134217728,
}, {
  acg: 255, certifiedInfo: { certified: false }, dateCreated: '2016-02-02T19:12:03.000+0000', dateModified: '2018-07-31T21:49:15.000+0000', extType: 0, id: 'D73B9F3411E5C9E00EE20080EFE55B9E', name: 'Tutorial Home', owner: { id: '54F3D26011D2896560009A8E67019608', name: 'Administrator' }, subtype: 14081, type: 55, version: 'BCB0031C11E891C0895C0080EF2585AF', viewMedia: 134217845,
}];

export const mstrTutorialFolder = [
  {
    name: 'Ad hoc Reporting',
    id: '13557B804DF35080B1704698620187E1',
    type: 8,
    description: 'These subfolders contain examples of MicroStrategy\'s ad hoc reporting capabilities, which enable users to manipulate reports for ad hoc analysis.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-09-08T13:17:07.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Advanced Analytics',
    id: '4C0516A811D3E877C000B3B2D86C964F',
    type: 8,
    description: 'Contains reports demonstrating MicroStrategy\'s powerful analytical capabilities, including built-in financial functions and statistics as well as linear regression analysis.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2001-01-02T20:43:19.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Advanced Metrics',
    id: '61BA3B0049EAFB09D70FC7B50082C4F5',
    type: 8,
    description: 'Examples of different types of capabilities available via metrics in MicroStrategy.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:42:44.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Advanced Reporting Guide',
    id: '8D58748149E753BADB0B21986A01ACD1',
    type: 8,
    description: 'Contains the sample reports referenced in the Advanced Reporting Guide.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-08-10T08:44:55.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Caching',
    id: '73A63F02445A8FC103A9C89B7B0332AD',
    type: 8,
    description: 'Examples of a single report with caching enabled and disabled.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:43:17.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Custom Groups and Consolidations',
    id: '4D7A3DE34E110F7E6E6D3D97FBCFFC0C',
    type: 8,
    description: 'Examples of custom groups and consolidations, which are effectively used to create new attributes using existing attributes in the data warehouse.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:41:39.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Dossiers',
    id: '4EFB95604A52B8037A1BAEB47D136305',
    type: 8,
    subtype: 2048,
    extType: 0,
    dateCreated: '2015-10-13T21:33:23.000+0000',
    dateModified: '2017-09-19T16:43:42.000+0000',
    version: 'B1CA4A5E11E79D5914F80080EF35642C',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Engine and Data Modeling',
    id: '5E027C5C4841D7D099EDA4B2769CD4DA',
    type: 8,
    description: 'Examples of Analytic and SQL Engine features such as Aggregate Awareness, Multipass SQL and Logical Views.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:31:01.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Extended Data Access',
    id: '58FEF6BF44F6A3AF2ADF65BC18ED3885',
    type: 8,
    description: 'Examples of reporting on data sources besides the main data warehouse, such as Excel and Text Files, via Freeform SQL and Query Builder.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:34:06.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Filters',
    id: 'D71D2FBB4C50B4AD0E0674B7F834279D',
    type: 8,
    description: 'Examples of the different types of filters available in MicroStrategy.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:41:30.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Graph Styles',
    id: '5CE619D64973E46639C911B65E566A8D',
    type: 8,
    description: 'Examples of the different graph styles available within MicroStrategy.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2005-11-30T14:40:37.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'Intro BI Class',
    id: 'BAC4ACA240377E1E8246E79D66E586C5',
    type: 8,
    description: 'This folder contains objects used for the MicroStrategy class "An Introduction to Business Intelligence with MicroStrategy".',
    subtype: 2048,
    extType: 0,
    dateCreated: '2008-11-18T10:44:04.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Data Mining Services',
    id: '0D542348448B99AD53D40484577E7ED4',
    type: 8,
    description: 'Contains reports demonstrating MicroStrategy\'s powerful data mining functionality.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-09-22T03:40:38.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Mobile',
    id: '5A95704D431A60D7EB90DDB7843FDBA8',
    type: 8,
    description: 'This folder contains reports used to demonstrate the functionality of MicroStrategy Mobile',
    subtype: 2048,
    extType: 0,
    dateCreated: '2007-07-06T15:40:08.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Multisource Option',
    id: 'BE089562406FCBC9A2D2B5A0A164629E',
    type: 8,
    description: 'This folder contains reports used to demonstrate the functionality of MicroStrategy Multisource Option.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2009-02-16T10:25:36.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Narrowcast Server',
    id: '3E3ADD7D11D4BB3610004594316DE8A4',
    type: 8,
    description: 'Components Objects used to demostrate MicroStrategy Narrowcast Server capabilites. Use the Welcome Screen to access MicroStrategy Narrowcast Server demonstrations.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2001-01-02T20:46:41.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Office',
    id: 'E05E69074C3F9FD1CED50A8B7EF36EF6',
    type: 8,
    description: 'Components Objects used to demostrate MicroStrategy Office capabilites. Use the Welcome Screen to access MicroStrategy Office demonstrations.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2004-12-29T19:37:57.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy OLAP Services',
    id: '632D66EF42224493F6C12F94F976610C',
    type: 8,
    description: 'Examples of different capabilities within MicroStrategy OLAP Services.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:38:44.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Report Services',
    id: '983F6F874157B008177CA49690DDC837',
    type: 8,
    description: 'Examples of report services documents, categorized according to document type or specialized functionality.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2006-05-23T09:31:49.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Repository Translation Wizard',
    id: '47EC24A649CAC840FCE3F2AE4AE08212',
    type: 8,
    description: 'This folder contains search objects used to extract translations using the MicroStrategy Repository Translation Wizard.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2010-04-12T11:07:00.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy SDK',
    id: 'F3BE21094BD559C84F7721A507E35030',
    type: 8,
    description: 'Components Objects used to demonstrate a simple MicroStrategy SDK application.',
    subtype: 2048,
    extType: 0,
    dateCreated: '2005-01-11T20:55:40.000+0000',
    dateModified: '2016-08-12T19:33:43.000+0000',
    version: 'CB475907483A4E3508BE62B4170C4D86',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
  {
    name: 'MicroStrategy Transaction Services',
    id: 'B219CE0E4AA4E63F0E48BC8FC9DFF8F2',
    type: 8,
    subtype: 2048,
    extType: 0,
    dateCreated: '2012-02-06T09:02:09.000+0000',
    dateModified: '2019-04-08T11:22:29.000+0000',
    version: '985BBD2811E959F09DEA0080EF65C15D',
    acg: 255,
    owner: {
      name: 'Administrator',
      id: '54F3D26011D2896560009A8E67019608',
    },
  },
];
