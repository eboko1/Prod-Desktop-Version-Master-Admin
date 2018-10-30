// vendor
import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';

// proj

export default class ServicesTable extends Component {
    constructor(props) {
        super(props);

        const {
            intl: { formatMessage },
        } = this.props;

        this.columns = [
            {
                title: formatMessage({
                    id: 'business-package-container.business_name',
                }),
                dataIndex: 'businessName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(
                    this.props.sort,
                    'businessName',
                ),
                width: '15%',
            },
            {
                title: formatMessage({
                    id: 'business-package-container.business_address',
                }),
                dataIndex: 'businessAddress',
                width:     '20%',
            },
            {
                title: formatMessage({
                    id: 'business-package-container.activation_datetime',
                }),
                dataIndex: 'activationDatetime',
                sorter:    true,
                sortOrder: this._handleColumnOrder(
                    this.props.sort,
                    'activationDatetime',
                ),
                width:  '15%',
                render: (name, record) =>
                    moment(record.activationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: formatMessage({
                    id: 'business-package-container.expiration_datetime',
                }),
                dataIndex: 'expirationDatetime',
                sorter:    true,
                sortOrder: this._handleColumnOrder(
                    this.props.sort,
                    'expirationDatetime',
                ),
                width:  '15%',
                render: (name, record) =>
                    moment(record.expirationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: formatMessage({
                    id: 'business-package-container.package_name',
                }),
                dataIndex: 'packageName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(
                    this.props.sort,
                    'packageName',
                ),
                width: '20%',
            },

            {
                width:  '15%',
                render: record => (
                    <Icon
                        className={ Styles.businessEditIcon }
                        onClick={ () => setShowUpdateServiceForm(record) }
                        type='edit'
                    />
                ),
            },
        ];
    }

    render() {
        const { data } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.page,
            onChange:         page => this.props.setPage(page),
        };

        return (
            <Table
                size='small'
                // pagination={ pagination }
                dataSource={ data }
                columns={ this.columns }
            />
        );
    }
}
