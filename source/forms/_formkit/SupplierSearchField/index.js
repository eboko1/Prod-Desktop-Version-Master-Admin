// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Spin } from "antd";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

// proj
import { setSupplierSearchQuery } from "core/search/duck";

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    suppliers: state.search.suppliers,
    isFetchingSuppliers: state.search.isFetchingSuppliers,
});

const mapDispatchToProps = {
    setSupplierSearchQuery,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class SupplierSearchField extends Component {
    render() {
        const { onSelect, setSupplierSearchQuery } = this.props;
        const { suppliers, isFetchingSuppliers, supplierId } = this.props;

        return (
            <Select
                placeholder={this.props.intl.formatMessage({
                    id: "supplier_placeholder",
                })}
                style={this.props.selectStyles}
                showSearch
                allowClear
                filterOption={false}
                notFoundContent={
                    isFetchingSuppliers ? (
                        <Spin size="small" />
                    ) : (
                        <FormattedMessage id="not_found" />
                    )
                }
                onSearch={item => setSupplierSearchQuery(item)}
                onChange={supplierId => onSelect(supplierId)}
                value={supplierId}
            >
                {isFetchingSuppliers
                    ? []
                    : suppliers.map(({ supplierId, name }) => (
                          <Option key={supplierId} value={supplierId}>
                              {name}
                          </Option>
                      ))}
            </Select>
        );
    }
}
