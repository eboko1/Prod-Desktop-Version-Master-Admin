// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// proj
import {
    productsExcelImport,
    productsExcelImportValidate,
    setStoreProductsFilters,
    selectProductsImporting,
} from 'core/storage/products';
import { MODALS, setModal } from 'core/modals/duck';

import { Layout, StyledButton } from 'commons';
import { ExcelReader, StoreProductsTable } from 'components';
import { ProductsExcelForm } from 'forms';
import { StoreProductModal } from 'modals';
import { withErrorMessage, permissions, isForbidden } from 'utils';
import { SearchField } from 'forms/_formkit';

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const AddButton = styled(StyledButton)`
    margin-left: 32px;
`;

const StoreProducts = withErrorMessage()(props => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.products' /> }
            controls={
                <>
                    <SearchField setFilters={ props.setStoreProductsFilters } />
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
                            <div>
                                <FormattedMessage id='storage.please_finish.import' />
                            </div>
                        ) }
                    </ButtonGroup>
                </>
            }
        >
            { props.importing ? <ProductsExcelForm /> : <StoreProductsTable /> }
            <StoreProductModal />
        </Layout>
    );
});

const mapStateToProps = state => ({
    importing: selectProductsImporting(state),
});

const mapDispatchToProps = {
    productsExcelImport,
    productsExcelImportValidate,
    setModal,
    setStoreProductsFilters,
};

export const ProductsPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StoreProducts);
