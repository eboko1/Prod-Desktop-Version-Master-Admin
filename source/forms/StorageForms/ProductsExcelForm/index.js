// vendor
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { Catcher } from 'commons';
import { selectImportTooManyInvalids } from 'core/storage/products';
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
                { props.tooManyInvalids ? (
                    <FormattedMessage id='storage.validation_success' />
                ) : (
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

    console.log('→FORM props', props);

    return (
        <Catcher>
            <Form>
                { _renderButtonGroup() }
                <ProductsExcelTable form={ props.form } />
            </Form>
        </Catcher>
    );
});

const mapStateToProps = state => ({
    tooManyInvalids: selectImportTooManyInvalids(state),
});

export const ProductsExcelForm = injectIntl(
    connect(
        mapStateToProps,
        { productsExcelImport, productsExcelImportReset },
    )(Form.create()(ProductsExcelFormComponent)),
);
