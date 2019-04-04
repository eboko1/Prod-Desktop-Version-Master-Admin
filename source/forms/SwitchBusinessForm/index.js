//vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, List } from "antd";

// proj
import {
    setSearchQuery,
    onChangeSwitchBusinessForm,
} from "core/forms/switchBusinessForm/duck";

import { DecoratedInput } from "forms/DecoratedFields";
import { withReduxForm } from "utils";

// own
import Styles from "./styles.m.css";

@injectIntl
@withReduxForm({
    name: "switchBusinessForm",
    actions: {
        change: onChangeSwitchBusinessForm,
        setSearchQuery,
    },
})
export class SwitchBusinessForm extends Component {
    constructor(props) {
        super(props);
        this.searchInputRef = React.createRef();
    }

    componentDidMount() {
        if (this.searchInputRef) this.searchInputRef.current.focus();
    }

    _handleClick = business => {
        this.props.setBusiness(business.businessId);
        this.props.resetModal();
    };

    _handleEnter = () => {
        if (this.props.businesses.length === 1) {
            this.props.setBusiness(this.props.businesses[0].businessId);
            this.props.resetModal();
        }
    };

    render() {
        const {
            setBusiness,
            setSearchQuery,
            businesses,
            form: { getFieldDecorator },
            intl: { formatMessage },
            loading,
        } = this.props;

        return (
            <Form layout="vertical">
                <DecoratedInput
                    ref={this.searchInputRef}
                    formItem
                    field="searchQuery"
                    onChange={event => setSearchQuery(event.target.value)}
                    getFieldDecorator={getFieldDecorator}
                    placeholder={formatMessage({ id: "search_business" })}
                    onPressEnter={() => this._handleEnter()}
                />
                <List
                    bordered
                    className={Styles.switchBusinessList}
                    locale={{ emptyText: formatMessage({ id: "no_data" }) }}
                    dataSource={businesses}
                    loading={loading}
                    renderItem={business => (
                        <List.Item onClick={() => this._handleClick(business)}>
                            <List.Item.Meta
                                className={Styles.switchBusinessListItem}
                                title={business.name}
                                description={business.address}
                            />
                        </List.Item>
                    )}
                />
            </Form>
        );
    }
}
