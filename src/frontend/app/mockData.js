export let projects = {
    projectsArray: [
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
    ],
};

export let testReport = {
    'id': 'F9E139BE11E85E842B520080EFC5C210',
    'name': 'TestReport',
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
};
