// vendor
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

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
    useEffect(() => {
        props.fetchStoreGroups();
    }, []);

    const _submit = event => {
        event.preventDefault();
        props.form.validateFieldsAndScroll(
            { scroll: { offsetBottom: 50 } },
            // { scroll: { offsetBottom: 50 }, force: true },
            (err, values) => {
                if (!err) {
                    const normalizedFields = _.toPairs(values).reduce(
                        (result, [ name, value ]) => {
                            return _.set(result, name, value);
                        },
                        [],
                    );
                }
            },
        );
    };

    const _renderButtonGroup = () => {
        return (
            <ButtonGroup>
                { !_.isEmpty(props.dataSource) && (
                    <SubmitButton type='primary' htmlType='submit'>
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
        <Form onSubmit={ _submit }>
            { _renderButtonGroup() }
            <ProductsExcelTable
                dataSource={ props.dataSource }
                getFieldDecorator={ props.form.getFieldDecorator }
                storeGroups={ props.storeGroups }
            />
            { props.dataSource && props.dataSource.length >= 15 ? (
                <SubmitButton type='primary' htmlType='submit'>
                    { props.intl.formatMessage({ id: 'submit' }) }
                </SubmitButton>
            ) : null }
        </Form>
    );
};

export const ProductsExcelForm = injectIntl(
    Form.create()(ProductsExcelFormComponent),
);
