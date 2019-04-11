// vendor
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import _ from "lodash";

// proj
import {
    productsExcelImport,
    productsExcelImportReset,
    selectStoreProducts,
    selectStoreProductsExcel,
} from "core/storage/products";

import { Layout, StyledButton } from "commons";
import {
    ExcelReader,
    ProductsExcelTable,
    StoreProductsTable,
} from "components";
import { ProductsExcelForm } from "forms";

const mapStateToProps = state => ({
    productsExcel: selectStoreProductsExcel(state),
    storeProducts: selectStoreProducts(state),
});

const mapDispatchToProps = {
    productsExcelImport,
    productsExcelImportReset,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class ProductsPage extends React.Component {
    render() {
        return (
            <Layout
                title={<FormattedMessage id="navigation.products" />}
                controls={
                    <ButtonGroup>
                        <StyledButton
                            type="secondary"
                            icon="download"
                            resetRadius
                            // onClick={ () => setModal(MODALS.SUPPLIER) }
                        >
                            <FormattedMessage id="storage.download_excel_template" />
                        </StyledButton>
                        <ExcelReader
                            importExcel={this.props.productsExcelImport}
                            key={this.props.productsExcel}
                        />
                        <AddButton type="link">
                            <FormattedMessage id="add" />
                        </AddButton>
                    </ButtonGroup>
                }
            >
                {_.isEmpty(this.props.productsExcel) ? (
                    <StoreProductsTable dataSource={this.props.storeProducts} />
                ) : (
                    <ProductsExcelForm
                        dataSource={this.props.productsExcel || []}
                        productsExcelImportReset={
                            this.props.productsExcelImportReset
                        }
                    />
                )}
            </Layout>
        );
    }
}

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const AddButton = styled(StyledButton)`
    margin-left: 32px;
`;
