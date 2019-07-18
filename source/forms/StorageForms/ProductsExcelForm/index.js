// vendor
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { Catcher } from 'commons';

import {
    selectImportTooManyInvalids,
    selectImportInvalidProducts,
} from 'core/storage/products';
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

const DuplicateSquare = styled.span`
    width: 24px;
    height: 24px;
    background-color: rgba(255, 45, 45, 0.28);
`;

const ProductsExcelFormComponent = memo(props => {
    const _submit = () => {
        props.form.validateFieldsAndScroll(
            { scroll: { offsetBottom: 50 } },
            // { scroll: { offsetBottom: 50 }, force: true },
            (err, values) => {
                if (!err) {
                    const fields = _.toPairs(values).reduce(
                        (result, [ name, value ]) => {
                            if (!value.alreadyExists) {
                                result.push(value);
                            }

                            return result;
                        },
                        [],
                    );

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

                    props.productsExcelImport(normalizedFields);
                }
            },
        );
    };

    const _renderButtonGroup = () => {
        return (
            <ButtonGroup>
                { !_.isEmpty(props.invalidProductsExcel) ? (
                    <div>
                        <div>
                            { props.tooManyInvalids ? (
                                <FormattedMessage id='storage.validation_too_many_errors' />
                            ) : (
                                <FormattedMessage id='storage.validation_with_errors' />
                            ) }
                        </div>
                        <div>
                            <DuplicateSquare /> -{ ' ' }
                            <FormattedMessage id='storage.validation_duplicate' />
                        </div>
                        { props.invalidProductsExcel.filter(
                            product => !product.alreadyExists,
                        ) && (
                            <SubmitButton
                                type='primary'
                                onClick={ () => _submit() }
                            >
                                { props.intl.formatMessage({ id: 'submit' }) }
                            </SubmitButton>
                        ) }
                    </div>
                ) : null }
                <Button
                    icon='rollback'
                    onClick={ () => props.productsExcelImportReset() }
                >
                    { props.intl.formatMessage({ id: 'back' }) }
                </Button>
            </ButtonGroup>
        );
    };

    console.log('→FORM props', props);

    return (
        <Catcher>
            <Form>
                { _renderButtonGroup() }
                <ProductsExcelTable
                    form={ props.form }
                    invalidProductsExcel={ props.invalidProductsExcel }
                />
            </Form>
        </Catcher>
    );
});

const mapStateToProps = state => ({
    tooManyInvalids:      selectImportTooManyInvalids(state),
    invalidProductsExcel: selectImportInvalidProducts(state),
});

export const ProductsExcelForm = injectIntl(
    connect(
        mapStateToProps,
        { productsExcelImport, productsExcelImportReset },
    )(Form.create()(ProductsExcelFormComponent)),
);
