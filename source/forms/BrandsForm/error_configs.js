export default intl => [
    {
        status:   400,
        response: {
            error:      'Bad Request',
            message:    'UNIQUE_CONSTRAINT_VIOLATION',
            statusCode: 400,
        },
        description: intl.formatMessage({
            id: 'brands.unique_constraint_violation',
        }),
    },
];
