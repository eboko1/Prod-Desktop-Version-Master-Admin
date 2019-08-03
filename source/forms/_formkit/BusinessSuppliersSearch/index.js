// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Spin } from "antd";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

// proj
import {
    setBusinessSuppliersSearchQuery,
    selectBusinessSuppliersFetching,
    selectBusinessSuppliersByQuery,
} from "core/search/duck";

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    businessSuppliers: selectBusinessSuppliersByQuery(state),
    isFetching: selectBusinessSuppliersFetching(state),
});

const mapDispatchToProps = {
    setBusinessSuppliersSearchQuery,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class BusinessSuppliersSearch extends Component {
    render() {
        const { onSelect, setBusinessSuppliersSearchQuery } = this.props;
        const { businessSuppliers, isFetching, id } = this.props;

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
                    isFetching ? (
                        <Spin size="small" />
                    ) : (
                        <FormattedMessage id="not_found" />
                    )
                }
                onSearch={item => setBusinessSuppliersSearchQuery(item)}
                onChange={id => onSelect(id)}
                //value={null}
            >
                {isFetching
                    ? []
                    : businessSuppliers.map(({ id, name }) => (
                          <Option key={id} value={id}>
                              {name}
                          </Option>
                      ))}
            </Select>
        );
    }
}
