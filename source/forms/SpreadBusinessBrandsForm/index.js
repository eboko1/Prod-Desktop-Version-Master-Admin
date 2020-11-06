//vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Button, Select } from "antd";
import _ from "lodash";

// proj
import {
    onChangeSpreadBusinessBrandsForm,
    searchBusinesses,
    submitSpreadBusinessBrands,
} from "core/forms/spreadBusinessBrands/duck";

import { DecoratedSelect } from "forms/DecoratedFields";

import { withReduxForm } from "utils";

// own
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name: "spreadBusinessBrandsForm",
    actions: {
        change: onChangeSpreadBusinessBrandsForm,
        searchBusinesses,
        submitSpreadBusinessBrands,
    },
})
export class SpreadBusinessBrandsForm extends Component {
    getSelect(getFieldDecorator, search, name, options) {
        return (
            <DecoratedSelect
                {...options}
                formItem
                getPopupContainer={trigger => trigger.parentNode}
                getFieldDecorator={getFieldDecorator}
                key={name}
                field={name}
                showSearch
                onFocus={() =>
                    _.isNil(_.get(search, name)) &&
                    this.props.searchBusinesses(name, "")
                }
                onSearch={query => this.props.searchBusinesses(name, query)}
                filterOption={false}
            >
                {_.get(search, [name], []).map(({ businessId, name }) => (
                    <Option value={businessId} key={String(businessId)}>
                        {name}
                    </Option>
                ))}
            </DecoratedSelect>
        );
    }

    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { search } = this.props;
        const fields = getFieldsValue();

        const { businessId, businessIds } = fields;

        return (
            <Form>
                {this.getSelect(getFieldDecorator, search, "businessId", {
                    label: (
                        <FormattedMessage id="spread_business_brands.source" />
                    ),
                })}
                {this.getSelect(getFieldDecorator, search, "businessIds", {
                    label: (
                        <FormattedMessage id="spread_business_brands.target" />
                    ),
                    mode: "multiple",
                })}
                <Button
                    type="primary"
                    style={{ width: "100%" }}
                    disabled={!businessId || !businessIds}
                    onClick={() =>
                        this.props.submitSpreadBusinessBrands(
                            businessId,
                            businessIds,
                        )
                    }
                >
                    <FormattedMessage id="submit" />
                </Button>
            </Form>
        );
    }
}
