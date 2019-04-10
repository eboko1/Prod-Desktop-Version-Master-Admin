// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table, Button } from "antd";
import _ from "lodash";

// own
import { columnsConfig } from "./config";

@injectIntl
export class ProductsExcelTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig(
            props.dataSource,
            props.getFieldDecorator,
            props.intl.formatMessage,
        );
    }

    render() {
        return (
            <Table
                size="small"
                columns={this.columns}
                dataSource={this.props.dataSource}
                pagination={false}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
            />
        );
    }
}
