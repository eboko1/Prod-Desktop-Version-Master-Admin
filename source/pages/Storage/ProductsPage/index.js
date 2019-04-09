// vendor
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

// proj
import { productsExcelImport } from "core/storage/duck";

import { Layout, StyledButton } from "commons";
import { ExcelReader, ProductsExcelTable } from "components";
import { ProductsExcelForm } from "forms";

const mapStateToProps = state => ({
    productsExcel: state.storage.productsExcel,
});

const mapDispatchToProps = {
    productsExcelImport,
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
                    <div>
                        <StyledButton
                            type="secondary"
                            icon="download"
                            // onClick={ () => setModal(MODALS.SUPPLIER) }
                        >
                            Download Excel template
                        </StyledButton>
                        <ExcelReader
                            importExcel={this.props.productsExcelImport}
                        />
                    </div>
                }
            >
                <ProductsExcelTable
                    dataSource={this.props.productsExcel}
                    importExcel={this.props.productsExcelImport}
                />
                {/* <ProductsExcelForm /> */}
            </Layout>
        );
    }
}
