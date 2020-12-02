// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj
import { Loader } from 'commons';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

export class ReportOrdersTable extends Component {
    constructor(props) {
        super(props);

        const {
            setIncludeServicesDiscount,
            includeServicesDiscount
        } = props;

        this.columns = columnsConfig({
            setIncludeServicesDiscount,
            includeServicesDiscount,
            // openPrint: props.openPrint,
            // openEdit:  props.openEdit,
            // cashOrderEntity: this.state.cashOrderEntity,
        });
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    render() {
        // const { cashOrders, cashOrdersFetching, totalCount } = this.props;
        const {
            tableData,
        } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            // total:            Math.ceil(this.props.totalCount / 25) * 25,
            total:            100,
            hideOnSinglePage: true,
            // current:          this.props.filters.page,
            // onChange:         page => {
            //     this.props.setCashOrdersPage({ page });
            //     this.props.fetchCashOrders();
            // },
        };

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ this.columns }
                pagination={ pagination }
                dataSource={ tableData }
                // loading={ cashOrdersFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                scroll={ { x: 1000 } }
                rowKey={ record => record.id }
                bordered
            />
        );
    }
}
