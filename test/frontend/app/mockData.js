export let environmentProjectList = [
    {
        'id': 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        'name': 'MicroStrategy Tutorial',
        'alias': '',
        'description': 'MicroStrategy Tutorial project and application set designed to illustrate the platform\'s rich functionality. The theme is an Electronics, Books, Movies and Music store. Employees, Inventory, Finance, Product Sales and Suppliers are analyzed.',
        'status': 0,
    },
    {
        'id': '163613BB4B34BD0B08CE8AB4828EBE97',
        'name': 'Usher Analytics Self Service',
        'alias': '',
        'description': 'Usher Analytics Self Service (10.8.0)',
        'status': 0,
    },
    {
        'id': 'CE52831411E696C8BD2F0080EFD5AF44',
        'name': 'Consolidated Education Project',
        'alias': '',
        'description': '',
        'status': 0,
    },
    {
        'id': 'B3FEE61A11E696C8BD0F0080EFC58F44',
        'name': 'Hierarchies Project',
        'alias': '',
        'description': '',
        'status': 0,
    },
    {
        'id': '4BAE16A340B995CAD24193AA3AC15D29',
        'name': 'Human Resources Analysis Module',
        'alias': '',
        'description': 'The Human Resources Analysis Module analyses workforce headcount, trends and profiles, employee attrition and recruitment, compensation and benefit costs and employee qualifications, performance and satisfaction.',
        'status': 0,
    },
    {
        'id': '4C09350211E69712BAEE0080EFB56D41',
        'name': 'Relationships Project',
        'alias': '',
        'description': '',
        'status': 0,
    },
    {
        'id': '85C3FE7E11E7028A06660080EFB5E5D4',
        'name': 'Enterprise Manager',
        'alias': '',
        'description': '',
        'status': 0,
    },
];
export let mockReports = [
    {
        'id': 'F9E139BE11E85E842B520080EFC5C210',
        'name': 'MediumReport',
        'instanceId': '88C04DF411E85E8646090080EFD5E10E',
        'result': {
            'definition': {
                'attributes': [
                    {
                        'name': 'Country',
                        'id': '8D679D3811D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                    {
                        'name': 'Region',
                        'id': '8D679D4B11D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                    {
                        'name': 'Age Range',
                        'id': '5603951E4FE1BC04A44E44B85BBB8ED2',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                ],
                'metrics': [
                    {
                        'name': 'Count of Customers',
                        'id': '82156AB211D40978C000C7906B98494F',
                        'type': 'Metric',
                        'min': 851,
                        'max': 8168,
                        'numberFormatting': {
                            'category': 0,
                            'decimalPlaces': 0,
                            'formatString': '#,##0',
                        },
                    },
                ],
                'thresholds': [],
                'sorting': [],
            },
            'data': {
                'paging': {
                    'total': 40,
                    'current': 40,
                    'offset': 0,
                    'limit': 1000,
                    'prev': null,
                    'next': null,
                },
                'root': {
                    'isPartial': false,
                    'children': [
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'USA',
                                },
                                'name': 'USA',
                                'id': 'h1;8D679D3811D3E4981000E787EC6DE8A4',
                            },
                            'isPartial': false,
                            'children': [
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Central',
                                        },
                                        'name': 'Central',
                                        'id': 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Mid-Atlantic',
                                        },
                                        'name': 'Mid-Atlantic',
                                        'id': 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Northeast',
                                        },
                                        'name': 'Northeast',
                                        'id': 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Northwest',
                                        },
                                        'name': 'Northwest',
                                        'id': 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'South',
                                        },
                                        'name': 'South',
                                        'id': 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Southeast',
                                        },
                                        'name': 'Southeast',
                                        'id': 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Southwest',
                                        },
                                        'name': 'Southwest',
                                        'id': 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1702,
                                                    'fv': '1,702',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3260,
                                                    'fv': '3,260',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3436,
                                                    'fv': '3,436',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 3434,
                                                    'fv': '3,434',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 8168,
                                                    'fv': '8,168',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Web',
                                },
                                'name': 'Web',
                                'id': 'h7;8D679D3811D3E4981000E787EC6DE8A4',
                            },
                            'isPartial': false,
                            'children': [
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Web',
                                        },
                                        'name': 'Web',
                                        'id': 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '24 and under',
                                                },
                                                'name': '24 and under',
                                                'id': 'h1;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 851,
                                                    'fv': '851',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '25 to 34',
                                                },
                                                'name': '25 to 34',
                                                'id': 'h2;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1630,
                                                    'fv': '1,630',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '35 to 44',
                                                },
                                                'name': '35 to 44',
                                                'id': 'h3;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1718,
                                                    'fv': '1,718',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '45 to 54',
                                                },
                                                'name': '45 to 54',
                                                'id': 'h4;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 1717,
                                                    'fv': '1,717',
                                                    'mi': 0,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': '55 and over',
                                                },
                                                'name': '55 and over',
                                                'id': 'h5;5603951E4FE1BC04A44E44B85BBB8ED2',
                                            },
                                            'metrics': {
                                                'Count of Customers': {
                                                    'rv': 4084,
                                                    'fv': '4,084',
                                                    'mi': 0,
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
        'id': 'BD1E844211E85FF536AB0080EFB5F215',
        'name': 'SimpleReport',
        'instanceId': '56A59BE011E85FF751620080EFD53213',
        'result': {
            'definition': {
                'attributes': [
                    {
                        'name': 'Region',
                        'id': '8D679D4B11D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                ],
                'metrics': [
                    {
                        'name': '# of Customers',
                        'id': 'CAAC011C4617A0267D5C0C88039B6916',
                        'type': 'Metric',
                        'min': 554,
                        'max': 7981,
                        'numberFormatting': {
                            'category': 0,
                            'decimalPlaces': 0,
                            'thousandSeparator': true,
                            'currencySymbol': '$',
                            'currencyPosition': 0,
                            'formatString': '#,##0',
                            'negativeType': 1,
                        },
                    },
                ],
                'thresholds': [],
                'sorting': [],
            },
            'data': {
                'paging': {
                    'total': 8,
                    'current': 8,
                    'offset': 0,
                    'limit': 1000,
                    'prev': null,
                    'next': null,
                },
                'root': {
                    'isPartial': false,
                    'children': [
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Central',
                                },
                                'name': 'Central',
                                'id': 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 1620,
                                    'fv': '1,620',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Mid-Atlantic',
                                },
                                'name': 'Mid-Atlantic',
                                'id': 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 1432,
                                    'fv': '1,432',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Northeast',
                                },
                                'name': 'Northeast',
                                'id': 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 2701,
                                    'fv': '2,701',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Northwest',
                                },
                                'name': 'Northwest',
                                'id': 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 554,
                                    'fv': '554',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'South',
                                },
                                'name': 'South',
                                'id': 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 1726,
                                    'fv': '1,726',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Southeast',
                                },
                                'name': 'Southeast',
                                'id': 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 731,
                                    'fv': '731',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Southwest',
                                },
                                'name': 'Southwest',
                                'id': 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 1206,
                                    'fv': '1,206',
                                    'mi': 0,
                                },
                            },
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Web',
                                },
                                'name': 'Web',
                                'id': 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
                            },
                            'metrics': {
                                '# of Customers': {
                                    'rv': 7981,
                                    'fv': '7,981',
                                    'mi': 0,
                                },
                            },
                        },
                    ],
                },
            },
        },
    },

    {
        'id': '3FC4A93A11E85FF62EB70080EFE55315',
        'name': 'ComplexReport',
        'instanceId': 'BE18079011E85FF751620080EFD53417',
        'result': {
            'definition': {
                'attributes': [
                    {
                        'name': 'Country',
                        'id': '8D679D3811D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                    {
                        'name': 'Region',
                        'id': '8D679D4B11D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                    {
                        'name': 'Category',
                        'id': '8D679D3711D3E4981000E787EC6DE8A4',
                        'type': 'Attribute',
                        'forms': [
                            {
                                'id': 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                'name': 'DESC',
                                'dataType': 'Char',
                            },
                        ],
                    },
                ],
                'metrics': [
                    {
                        'name': '# of Customers',
                        'id': 'CAAC011C4617A0267D5C0C88039B6916',
                        'type': 'Metric',
                        'min': 537,
                        'max': 7269,
                        'numberFormatting': {
                            'category': 0,
                            'decimalPlaces': 0,
                            'thousandSeparator': true,
                            'currencySymbol': '$',
                            'currencyPosition': 0,
                            'formatString': '#,##0',
                            'negativeType': 1,
                        },
                    },
                    {
                        'name': 'Average Revenue',
                        'id': '971752994EFBAE6CF37A26A03FDA9813',
                        'type': 'Metric',
                        'min': 13.6780124947,
                        'max': 299.9392518824,
                        'numberFormatting': {
                            'category': 0,
                            'formatString': '#,##0;(#,##0)',
                        },
                    },
                    {
                        'name': 'Cost',
                        'id': '7FD5B69611D5AC76C000D98A4CC5F24F',
                        'type': 'Metric',
                        'min': 101145.1220000004,
                        'max': 4909403.682000001,
                        'numberFormatting': {
                            'category': 1,
                            'decimalPlaces': 0,
                            'thousandSeparator': true,
                            'currencySymbol': '$',
                            'currencyPosition': 0,
                            'formatString': '"$"#,##0',
                            'negativeType': 1,
                        },
                    },
                    {
                        'name': 'Profit',
                        'id': '4C051DB611D3E877C000B3B2D86C964F',
                        'type': 'Metric',
                        'min': 9154.9188999992,
                        'max': 1053304.9179999968,
                        'numberFormatting': {
                            'category': 1,
                            'decimalPlaces': 0,
                            'thousandSeparator': true,
                            'currencySymbol': '$',
                            'currencyPosition': 0,
                            'formatString': '"$"#,##0;("$"#,##0)',
                            'negativeType': 3,
                        },
                    },
                ],
                'thresholds': [],
                'sorting': [],
            },
            'data': {
                'paging': {
                    'total': 32,
                    'current': 32,
                    'offset': 0,
                    'limit': 1000,
                    'prev': null,
                    'next': null,
                },
                'root': {
                    'isPartial': false,
                    'children': [
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'USA',
                                },
                                'name': 'USA',
                                'id': 'h1;8D679D3811D3E4981000E787EC6DE8A4',
                            },
                            'isPartial': false,
                            'children': [
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Central',
                                        },
                                        'name': 'Central',
                                        'id': 'h4;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1609,
                                                    'fv': '1,609',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.6896846732,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 295504.8720000021,
                                                    'fv': '$295,505',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 81331.0779999979,
                                                    'fv': '$81,331',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1582,
                                                    'fv': '1,582',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 294.0833962422,
                                                    'fv': '294',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 2886348.2690000017,
                                                    'fv': '$2,886,348',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 619713.9809999986,
                                                    'fv': '$619,714',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1616,
                                                    'fv': '1,616',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.4886913981,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 552347.5284999979,
                                                    'fv': '$552,348',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 37008.9715000021,
                                                    'fv': '$37,009',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1609,
                                                    'fv': '1,609',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.9263961104,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 530842.8114000006,
                                                    'fv': '$530,843',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 26268.7385999994,
                                                    'fv': '$26,269',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Mid-Atlantic',
                                        },
                                        'name': 'Mid-Atlantic',
                                        'id': 'h2;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1425,
                                                    'fv': '1,425',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8417643683,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 264862.2730000005,
                                                    'fv': '$264,862',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 72793.7269999995,
                                                    'fv': '$72,794',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1401,
                                                    'fv': '1,401',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 294.5246279268,
                                                    'fv': '295',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 2561246.8938,
                                                    'fv': '$2,561,247',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 545693.4062000001,
                                                    'fv': '$545,693',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1427,
                                                    'fv': '1,427',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.4422928146,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 486673.7369999974,
                                                    'fv': '$486,674',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 32295.6130000025,
                                                    'fv': '$32,296',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1429,
                                                    'fv': '1,429',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8847708818,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 466748.5707000013,
                                                    'fv': '$466,749',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 22300.8292999988,
                                                    'fv': '$22,301',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Northeast',
                                        },
                                        'name': 'Northeast',
                                        'id': 'h1;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 2683,
                                                    'fv': '2,683',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8931664804,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 506489.6980000046,
                                                    'fv': '$506,490',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 139931.5519999956,
                                                    'fv': '$139,932',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 2640,
                                                    'fv': '2,640',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 291.2901123596,
                                                    'fv': '291',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 4909403.682000001,
                                                    'fv': '$4,909,404',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 1053304.9179999968,
                                                    'fv': '$1,053,305',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 2691,
                                                    'fv': '2,691',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.4439948948,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 938490.503500001,
                                                    'fv': '$938,491',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 63070.5464999987,
                                                    'fv': '$63,071',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 2691,
                                                    'fv': '2,691',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.9138921652,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 899298.9746999989,
                                                    'fv': '$899,299',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 44424.6753000012,
                                                    'fv': '$44,425',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Northwest',
                                        },
                                        'name': 'Northwest',
                                        'id': 'h6;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 550,
                                                    'fv': '550',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.6780124947,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 101145.1220000004,
                                                    'fv': '$101,145',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 28030.0279999996,
                                                    'fv': '$28,030',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 537,
                                                    'fv': '537',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 299.9392518824,
                                                    'fv': '300',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 1017538.676,
                                                    'fv': '$1,017,539',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 217311.2240000001,
                                                    'fv': '$217,311',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 551,
                                                    'fv': '551',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.3793321881,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 188404.3144999988,
                                                    'fv': '$188,404',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 12489.3355000013,
                                                    'fv': '$12,489',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 553,
                                                    'fv': '553',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.9148174406,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 187113.5811000008,
                                                    'fv': '$187,114',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 9154.9188999992,
                                                    'fv': '$9,155',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'South',
                                        },
                                        'name': 'South',
                                        'id': 'h5;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1716,
                                                    'fv': '1,716',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8005946919,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 319304.5700000016,
                                                    'fv': '$319,305',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 86805.5299999984,
                                                    'fv': '$86,806',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1683,
                                                    'fv': '1,683',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 290.2833708301,
                                                    'fv': '290',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 3087772.6412000023,
                                                    'fv': '$3,087,773',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 653980.0087999986,
                                                    'fv': '$653,980',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1723,
                                                    'fv': '1,723',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.405676851,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 597212.8049999985,
                                                    'fv': '$597,213',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 38841.0450000012,
                                                    'fv': '$38,841',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1719,
                                                    'fv': '1,719',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8902230279,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 578034.2717999995,
                                                    'fv': '$578,034',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 27329.4282000006,
                                                    'fv': '$27,329',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Southeast',
                                        },
                                        'name': 'Southeast',
                                        'id': 'h3;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 724,
                                                    'fv': '724',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.7989515868,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 133825.2890000012,
                                                    'fv': '$133,825',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 36619.3609999988,
                                                    'fv': '$36,619',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 705,
                                                    'fv': '705',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 287.4620114836,
                                                    'fv': '287',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 1280174.341999999,
                                                    'fv': '$1,280,174',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 271833.058000001,
                                                    'fv': '$271,833',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 728,
                                                    'fv': '728',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.3797731106,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 247948.680499998,
                                                    'fv': '$247,949',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 16337.169500002,
                                                    'fv': '$16,337',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 726,
                                                    'fv': '726',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8686137584,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 241327.407600002,
                                                    'fv': '$241,327',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 11885.742399998,
                                                    'fv': '$11,886',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Southwest',
                                        },
                                        'name': 'Southwest',
                                        'id': 'h7;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1193,
                                                    'fv': '1,193',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.7983513514,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 220099.4510000013,
                                                    'fv': '$220,099',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 60696.9989999989,
                                                    'fv': '$60,697',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1180,
                                                    'fv': '1,180',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 292.0059038067,
                                                    'fv': '292',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 2108086.307200002,
                                                    'fv': '$2,108,086',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 453973.4927999981,
                                                    'fv': '$453,973',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1196,
                                                    'fv': '1,196',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.4137285053,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 408297.0030000042,
                                                    'fv': '$408,297',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 27574.1469999957,
                                                    'fv': '$27,574',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 1201,
                                                    'fv': '1,201',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8528128856,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 396317.7296999956,
                                                    'fv': '$396,318',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 19086.5703000043,
                                                    'fv': '$19,087',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'depth': 0,
                            'element': {
                                'attributeIndex': 0,
                                'formValues': {
                                    'DESC': 'Web',
                                },
                                'name': 'Web',
                                'id': 'h7;8D679D3811D3E4981000E787EC6DE8A4',
                            },
                            'isPartial': false,
                            'children': [
                                {
                                    'depth': 1,
                                    'element': {
                                        'attributeIndex': 1,
                                        'formValues': {
                                            'DESC': 'Web',
                                        },
                                        'name': 'Web',
                                        'id': 'h12;8D679D4B11D3E4981000E787EC6DE8A4',
                                    },
                                    'isPartial': false,
                                    'children': [
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Books',
                                                },
                                                'name': 'Books',
                                                'id': 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 6661,
                                                    'fv': '6,661',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.9266631769,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 229584.823,
                                                    'fv': '$229,585',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 63070.0770000001,
                                                    'fv': '$63,070',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Electronics',
                                                },
                                                'name': 'Electronics',
                                                'id': 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 4919,
                                                    'fv': '4,919',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 292.5305367687,
                                                    'fv': '293',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 2251129.2412,
                                                    'fv': '$2,251,129',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 473792.7088,
                                                    'fv': '$473,793',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Movies',
                                                },
                                                'name': 'Movies',
                                                'id': 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 7269,
                                                    'fv': '7,269',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 14.3727794562,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 424870.4014999995,
                                                    'fv': '$424,870',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 27081.6485000001,
                                                    'fv': '$27,082',
                                                    'mi': 3,
                                                },
                                            },
                                        },
                                        {
                                            'depth': 2,
                                            'element': {
                                                'attributeIndex': 2,
                                                'formValues': {
                                                    'DESC': 'Music',
                                                },
                                                'name': 'Music',
                                                'id': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                                            },
                                            'metrics': {
                                                '# of Customers': {
                                                    'rv': 7253,
                                                    'fv': '7,253',
                                                    'mi': 0,
                                                },
                                                'Average Revenue': {
                                                    'rv': 13.8896845244,
                                                    'fv': '14',
                                                    'mi': 1,
                                                },
                                                'Cost': {
                                                    'rv': 413640.0494999996,
                                                    'fv': '$413,640',
                                                    'mi': 2,
                                                },
                                                'Profit': {
                                                    'rv': 19593.1005000006,
                                                    'fv': '$19,593',
                                                    'mi': 3,
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
];

export let mstrTutorial = [
    {
        'name': 'Business Roles',
        'id': '032A5E114A59D28267BDD8B6D9E58B22',
        'type': 8,
        'description': 'These folders contain reports that are appropriate for individuals in different organizational roles.',
        'subtype': 2048,
        'dateCreated': '2005-05-06T21:48:43.000+0000',
        'dateModified': '2016-08-12T19:33:44.000+0000',
        'version': '97C25AEC4CD92391DD9AAEBEAB7ACA30',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'Documents and Scorecards',
        'id': 'F025A94B4C03B6DCEE0F5D9DA825DA67',
        'type': 8,
        'description': 'This folder contains several examples of dashboards.',
        'subtype': 2048,
        'dateCreated': '2007-01-13T22:39:22.000+0000',
        'dateModified': '2016-08-12T19:33:44.000+0000',
        'version': '97C25AEC4CD92391DD9AAEBEAB7ACA30',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'Enterprise Reporting Documents',
        'id': '92ADD0F84D07AC532AD03BA0F92A836B',
        'type': 8,
        'description': 'This folder contains various types of documents such as scorecards and dashboards, managed metrics reports, production and operational reports, invoices and statements, and business reports.',
        'subtype': 2048,
        'dateCreated': '2003-09-08T20:35:27.000+0000',
        'dateModified': '2016-08-12T19:33:44.000+0000',
        'version': '97C25AEC4CD92391DD9AAEBEAB7ACA30',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'Getting Started',
        'id': '7F16A4B811E58ED317D50080EFF554EA',
        'type': 8,
        'subtype': 2048,
        'dateCreated': '2016-02-02T16:46:17.000+0000',
        'dateModified': '2018-02-06T20:29:04.000+0000',
        'version': '5F5128C411E80B7C32DC0080EF758A60',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'MicroStrategy Platform Capabilities',
        'id': 'D64C532E4E7FBA74D29A7CA3576F39CF',
        'type': 8,
        'description': 'This folder contains examples of many of the sophisticated capabilities within the MicroStrategy platform.',
        'subtype': 2048,
        'dateCreated': '2006-05-23T08:55:20.000+0000',
        'dateModified': '2016-08-12T19:33:44.000+0000',
        'version': '97C25AEC4CD92391DD9AAEBEAB7ACA30',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'Sample Dashboards',
        'id': 'C6C5ECF0B571448A9C31C653AB1D5E51',
        'type': 8,
        'hidden': true,
        'subtype': 2048,
        'dateCreated': '2017-08-22T21:58:25.000+0000',
        'dateModified': '2018-01-29T21:13:19.000+0000',
        'version': '3A94209811E80539D63E0080EF757F7A',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'Sample Dossiers',
        'id': '12F7E26011E79D592D640080EFB5E3A2',
        'type': 8,
        'subtype': 2048,
        'dateCreated': '2017-09-19T16:39:15.000+0000',
        'dateModified': '2018-02-02T21:16:55.000+0000',
        'version': '653768BE11E8085EE8130080EFC5633C',
        'acg': 255,
        'owner': {
            'name': 'MSTR User',
            'id': '7FC05A65473CE2FD845CE6A1D3F13233',
        },
    },
    {
        'name': 'Subject Areas',
        'id': '5B68C5AE433C728679340A91DC8F809C',
        'type': 8,
        'description': 'This folder contains reports that are categorized by topic. Topics include Customer Analysis, Enterprise Performance Management, Human Resource Analysis, Inventory and Supply Chain Analysis, Sales and Profitability Analysis, and Supplier Analysis.',
        'subtype': 2048,
        'dateCreated': '2006-05-22T15:42:06.000+0000',
        'dateModified': '2016-08-12T19:33:44.000+0000',
        'version': '97C25AEC4CD92391DD9AAEBEAB7ACA30',
        'acg': 255,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
    },
    {
        'name': 'ComplexReport',
        'id': '3FC4A93A11E85FF62EB70080EFE55315',
        'type': 3,
        'subtype': 768,
        'dateCreated': '2018-05-25T08:33:07.000+0000',
        'dateModified': '2018-05-25T08:36:24.000+0000',
        'version': 'B55FC94A11E85FF62E390080EF15B316',
        'acg': 255,
        'viewMedia': 134217728,
        'owner': {
            'name': 'MSTR User',
            'id': '7FC05A65473CE2FD845CE6A1D3F13233',
        },
        'certifiedInfo': {
            'certified': false,
        },
    },
    {
        'name': 'SimpleReport',
        'id': 'BD1E844211E85FF536AB0080EFB5F215',
        'type': 3,
        'subtype': 768,
        'dateCreated': '2018-05-25T08:29:28.000+0000',
        'dateModified': '2018-05-25T08:29:28.000+0000',
        'version': 'BD237A5611E85FF53EEF0080EFB5F215',
        'acg': 255,
        'viewMedia': 134217728,
        'owner': {
            'name': 'MSTR User',
            'id': '7FC05A65473CE2FD845CE6A1D3F13233',
        },
        'certifiedInfo': {
            'certified': false,
        },
    },
    {
        'name': 'TestReport',
        'id': 'F9E139BE11E85E842B520080EFC5C210',
        'type': 3,
        'subtype': 768,
        'dateCreated': '2018-05-23T12:29:46.000+0000',
        'dateModified': '2018-05-23T12:29:46.000+0000',
        'version': 'F9E43BAA11E85E8446740080EFC5C210',
        'acg': 255,
        'viewMedia': 134217728,
        'owner': {
            'name': 'MSTR User',
            'id': '7FC05A65473CE2FD845CE6A1D3F13233',
        },
        'certifiedInfo': {
            'certified': false,
        },
    },
    {
        'name': 'Tutorial Home',
        'id': 'D73B9F3411E5C9E00EE20080EFE55B9E',
        'type': 55,
        'subtype': 14081,
        'dateCreated': '2016-02-02T19:12:03.000+0000',
        'dateModified': '2018-02-06T20:29:07.000+0000',
        'version': '0E26EFBB405E7938497EE288C8ABE022',
        'acg': 255,
        'viewMedia': 134217845,
        'owner': {
            'name': 'Administrator',
            'id': '54F3D26011D2896560009A8E67019608',
        },
        'certifiedInfo': {
            'certified': false,
        },
    },
];
