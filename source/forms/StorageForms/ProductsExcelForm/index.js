// vendor
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { Catcher } from 'commons';
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

const ProductsExcelFormComponent = memo(props => {
    const _submit = () => {
        props.form.validateFieldsAndScroll(
            { scroll: { offsetBottom: 50 } },
            // { scroll: { offsetBottom: 50 }, force: true },
            (err, values) => {
                console.log('→ submit values', values);
                if (!err) {
                    console.log('-> _.toPairs(values)', _.toPairs(values));
                    const fields = _.toPairs(values).reduce(
                        (result, [ name, value ]) => {
                            if (!value.alreadyExists) {
                                result.push(value);
                            }

                            return result;
                        },
                        [],
                    );
                    console.log('→ fields', fields);
                    const normalizedFields = fields.map(product => {
                        const { brandId, brandName } = product;
                        const isLikeNumber = !_.chain(brandId)
                            .toNumber()
                            .isNaN()
                            .value();
                        if (brandId === brandName) {
                            if (isLikeNumber) {
                                delete product.brandName;
                                product.brandId = _(brandId).toNumber();
                            } else {
                                delete product.brandId;
                            }
                        } else {
                            if (isLikeNumber) {
                                delete product.brandName;
                                product.brandId = _(brandId).toNumber();
                            }
                        }

                        return product;
                    });
                    console.log('→ normalizedFields', normalizedFields);
                    props.productsExcelImport(normalizedFields);
                }
            },
        );
    };

    const _renderButtonGroup = () => {
        return (
            <ButtonGroup>
                <SubmitButton type='primary' onClick={ () => _submit() }>
                    { props.intl.formatMessage({ id: 'submit' }) }
                </SubmitButton>
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
        <Catcher>
            <Form>
                { _renderButtonGroup() }
                <ProductsExcelTable form={ props.form } />
            </Form>
        </Catcher>
    );
});

export const ProductsExcelForm = injectIntl(
    connect(
        null,
        { productsExcelImport, productsExcelImportReset },
    )(Form.create()(ProductsExcelFormComponent)),
);
