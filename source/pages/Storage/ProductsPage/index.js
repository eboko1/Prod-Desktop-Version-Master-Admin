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
    selectStoreProductsExcel,
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
    return (
        <Layout
            title={ <FormattedMessage id='navigation.products' /> }
            controls={
                <ButtonGroup>
                    <StyledButton type='secondary' icon='download' resetRadius>
                        <FormattedMessage id='storage.download_excel_template' />
                    </StyledButton>
                    <ExcelReader
                        importExcel={ props.productsExcelImport }
                        validateExcel={ props.productsExcelImportValidate }
                        key={ props.productsExcel }
                    />
                    <AddButton
                        type='link'
                        onClick={ () => props.setModal(MODALS.STORE_PRODUCT) }
                    >
                        <FormattedMessage id='add' />
                    </AddButton>
                </ButtonGroup>
            }
        >
            { _.isEmpty(props.productsExcel) ? (
                <StoreProductsTable />
            ) : (
                <ProductsExcelForm productsExcel={ props.productsExcel } />
            ) }
            <StoreProductModal visible={ props.modal } />
        </Layout>
    );
};

const mapStateToProps = state => ({
    modal:         selectModal(state),
    productsExcel: selectStoreProductsExcel(state),
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
