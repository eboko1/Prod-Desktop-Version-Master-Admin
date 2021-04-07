// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Icon, Button } from 'antd';

// proj
import {
    productsExcelImport,
    productsExcelImportValidate,
    setStoreProductsFilters,
    selectProductsImporting,
    downloadExcelTemplate,
} from 'core/storage/products';
import { MODALS, setModal } from 'core/modals/duck';

import { Layout, StyledButton, Paper } from 'commons';
import { ExcelReader, StoreProductsTable, Barcode } from 'components';
import { ProductsExcelForm } from 'forms';
import { StoreProductModal } from 'modals';
import { withErrorMessage, permissions, isForbidden } from 'utils';
import { SearchField } from 'forms/_formkit';

// own
import Styles from './styles.m.css';

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const AddButton = styled(StyledButton)`
    margin-left: 18px;
`;

const StoreProducts = withErrorMessage()(props => {
    if(props.location.state && props.location.state.showForm) props.setModal(MODALS.STORE_PRODUCT);

    return (
        <Layout
            title={ <FormattedMessage id='navigation.products' /> }
            paper={false}
            controls={
                <> 
                        
                        { !props.importing ? (
                            <>
                                
                                <AddButton
                                    type='link'
                                    onClick={ () =>
                                        props.setModal(MODALS.STORE_PRODUCT)
                                    }
                                    disabled={ isForbidden(
                                        props.user,
                                        permissions.ACCESS_STORE_PRODUCTS,
                                    ) }
                                >
                                    <FormattedMessage id='add' />
                                </AddButton>
                            </>
                        ) : (
                            <div>
                                <FormattedMessage id='storage.please_finish.import' />
                            </div>
                        ) }
                </>
            }
        >
            <Paper>
                <SearchField setFilters={ props.setStoreProductsFilters } style={{width: "100%"}}/>
            </Paper>
            <Paper>
                { props.importing ? <ProductsExcelForm /> : <StoreProductsTable /> }
            </Paper>
            <StoreProductModal />
        </Layout>
    );
});

const mapStateToProps = state => ({
    user:      state.auth,
    importing: selectProductsImporting(state),
});

const mapDispatchToProps = {
    productsExcelImport,
    productsExcelImportValidate,
    setModal,
    setStoreProductsFilters,
    downloadExcelTemplate,
};

export const ProductsPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StoreProducts);
