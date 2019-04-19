// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import {
    productsExcelImport,
    productsExcelImportValidate,
    selectProductsImporting,
} from 'core/storage/products';
import { MODALS, setModal, selectModal } from 'core/modals/duck';

import { Layout, StyledButton } from 'commons';
import { ExcelReader, StoreProductsTable } from 'components';
import { ProductsExcelForm } from 'forms';
import { StoreProductModal } from 'modals';

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const AddButton = styled(StyledButton)`
    margin-left: 32px;
`;

const StoreProducts = props => {
    console.log('→ RENDER PAGE');
    console.log('→ PAGE productsExcel', props.productsExcel);

    return (
        <Layout
            title={ <FormattedMessage id='navigation.products' /> }
            controls={
                <ButtonGroup>
                    { !props.importing ? (
                        <>
                            <StyledButton
                                type='secondary'
                                icon='download'
                                resetRadius
                            >
                                <FormattedMessage id='storage.download_excel_template' />
                            </StyledButton>
                            <ExcelReader
                                importExcel={ props.productsExcelImport }
                                validateExcel={
                                    props.productsExcelImportValidate
                                }
                                key={ props.productsExcel }
                            />
                            <AddButton
                                type='link'
                                onClick={ () =>
                                    props.setModal(MODALS.STORE_PRODUCT)
                                }
                            >
                                <FormattedMessage id='add' />
                            </AddButton>
                        </>
                    ) : (
                        <div>Please finish import</div>
                    ) }
                </ButtonGroup>
            }
        >
            { props.importing ? <ProductsExcelForm /> : <StoreProductsTable /> }
            <StoreProductModal visible={ props.modal } />
        </Layout>
    );
};

const mapStateToProps = state => ({
    modal:     selectModal(state),
    importing: selectProductsImporting(state),
});

const mapDispatchToProps = {
    productsExcelImport,
    productsExcelImportValidate,
    setModal,
};

export const ProductsPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StoreProducts);
