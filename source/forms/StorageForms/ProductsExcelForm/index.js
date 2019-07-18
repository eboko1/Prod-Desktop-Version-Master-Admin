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
    selectImportValidationError,
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
    justify-content: space-between;
`;

const SubmitButton = styled(Button)`
    width: 30%;
    margin: 0 auto;
`;

const Flex = styled.div`
    display: flex;
`;

const ValidationMessage = styled.div`
    display: flex;
    margin-right: 16px;
    white-space: nowrap;
`;

const DuplicateSquare = styled.div`
    margin-left: 16px;
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
        const availableToSubmit = !_.isEmpty(
            props.invalidProductsExcel.filter(
                product => !product.alreadyExists,
            ),
        );

        return (
            <ButtonGroup>
                { !_.isEmpty(props.invalidProductsExcel) ? (
                    <Flex>
                        <ValidationMessage>
                            { props.tooManyInvalids ? (
                                <FormattedMessage id='storage.validation_too_many_errors' />
                            ) : (
                                <FormattedMessage id='storage.validation_with_errors' />
                            ) }{ ' ' }
                            <Flex>
                                <DuplicateSquare /> -{ ' ' }
                                <FormattedMessage id='storage.validation_duplicate' />
                            </Flex>
                        </ValidationMessage>
                        { availableToSubmit ? (
                            <SubmitButton
                                type='primary'
                                onClick={ () => _submit() }
                            >
                                { props.intl.formatMessage({ id: 'submit' }) }
                            </SubmitButton>
                        ) : null }
                        { props.validationError && <div>Validation Failed!</div> }
                    </Flex>
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
                    validationError={ props.validationError }
                    invalidProductsExcel={ props.invalidProductsExcel }
                />
            </Form>
        </Catcher>
    );
});

const mapStateToProps = state => ({
    tooManyInvalids:      selectImportTooManyInvalids(state),
    invalidProductsExcel: selectImportInvalidProducts(state),
    validationError:      selectImportValidationError(state),
});

export const ProductsExcelForm = injectIntl(
    connect(
        mapStateToProps,
        { productsExcelImport, productsExcelImportReset },
    )(Form.create()(ProductsExcelFormComponent)),
);
