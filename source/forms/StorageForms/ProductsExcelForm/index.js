// vendor
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    productsExcelImport,
    productsExcelImportReset,
} from 'core/storage/products';

// own
import { ProductsExcelTable } from 'components';

const ButtonGroup = styled.div`
    display: flex;
    margin: 8px 0;
    justify-content: flex-end;
`;

const SubmitButton = styled(Button)`
    width: 30%;
    margin: 0 auto;
`;

const ProductsExcelFormComponent = props => {
    const _submit = () => {
        console.log('→ submit');
        props.form.validateFieldsAndScroll(
            { scroll: { offsetBottom: 50 } },
            // { scroll: { offsetBottom: 50 }, force: true },
            (err, values) => {
                console.log('→ submit values', values);
                if (!err) {
                    const normalizedFields = _.toPairs(values).reduce(
                        (result, [ name, value ]) => {
                            return _.set(result, name, value);
                        },
                        [],
                    );
                    console.log('→ normalizedFields', normalizedFields);
                    props.productsExcelImport(normalizedFields);
                }
            },
        );
    };

    const _renderButtonGroup = () => {
        return (
            <ButtonGroup>
                { !_.isEmpty(props.productsExcel) && (
                    <SubmitButton type='primary' onClick={ () => _submit() }>
                        { props.intl.formatMessage({ id: 'submit' }) }
                    </SubmitButton>
                ) }
                <Button
                    icon='rollback'
                    onClick={ () => props.productsExcelImportReset() }
                >
                    { props.intl.formatMessage({ id: 'back' }) }
                </Button>
            </ButtonGroup>
        );
    };

    return (
        <Form>
            { _renderButtonGroup() }
            <ProductsExcelTable
                dataSource={ props.productsExcel }
                form={ props.form }
                storeGroups={ props.storeGroups }
            />
            { props.productsExcel && props.productsExcel.length >= 15
                ? _renderButtonGroup()
                : null }
        </Form>
    );
};

export const ProductsExcelForm = injectIntl(
    connect(
        null,
        { productsExcelImport, productsExcelImportReset },
    )(Form.create()(ProductsExcelFormComponent)),
);
