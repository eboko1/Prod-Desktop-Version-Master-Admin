// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { Tabs, Table } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import {
    fetchCashOrdersLogsReceipt,
    setCashOrdersLogsPage
} from 'core/reports/reportCashOrdersLogs/duck';

// own
import mainTableColumnsConfig from './tableConfigs/mainTableConfig';
import paymentsTableColumnsConfig from './tableConfigs/paymetsTableConfig';
import productsTableColumnsConfig from './tableConfigs/productsTableConfig';
import Styles from './styles.m.css';

const { TabPane } = Tabs;

const mapStateToProps = state => ({
    cashdeskLogs: state.reportCashOrdersLogs.cashdeskLogs,
    stats: state.reportCashOrdersLogs.stats,
    page: state.reportCashOrdersLogs.filter.page,
});

const mapDispatchToProps = {
    fetchCashOrdersLogsReceipt,
    setCashOrdersLogsPage
};

@connect(
    mapStateToProps,
    mapDispatchToProps
)
@injectIntl
export class ReportCashOrdersLogsTable extends Component {
    constructor(props) {
        super(props);
        const {
            fetchCashOrdersLogsReceipt,
        } = props;
        this.mainTableColumns = mainTableColumnsConfig({ fetchCashOrdersLogsReceipt});
        this.paymentTableConfig = paymentsTableColumnsConfig();
        this.productsTableConfig = productsTableColumnsConfig();
    }

    paymentsTable(paymets) {

        return (
            <Table
                dataSource={ paymets }
                columns={ this.paymentTableConfig }
                pagination={false}
                rowKey={ () => v4() }
                bordered
            />
        );
    }

    productsTable(prducts) {

        return (
            <Table
                dataSource={ prducts }
                columns={ this.productsTableConfig }
                pagination={false}
                rowKey={ () => v4() }
                bordered
            />
        );
    }

    render() {
        const {
            cashdeskLogs,
            setCashOrdersLogsPage,
            stats,
            page
        } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(stats.totalRowsCount / 25) * 25,
            hideOnSinglePage: true,
            current:          page,
            onChange:         page => {
                setCashOrdersLogsPage({page});
            },
        };

        return (
            <div className={Styles.paper}>
                <Table
                    size='middle'
                    className={Styles.table}
                    columns={ this.mainTableColumns }
                    pagination={ pagination }
                    dataSource={ cashdeskLogs }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    expandedRowRender={(record) => {
                        return (<div style={{backgroundColor: 'rgb(240, 240,240)',padding: '8px'}}>
                            <Tabs tabPosition={"top"}>
                                <TabPane tab={<FormattedMessage id="report_cash_orders_logs_page.products"/>} key="products">
                                    {this.productsTable(record.products)}
                                </TabPane>

                                <TabPane tab={<FormattedMessage id="report_cash_orders_logs_page.payments"/>} key="payments">
                                    {this.paymentsTable(record.payments)}
                                </TabPane>
                            </Tabs>
                        </div>)
                    }}
                    scroll={ { x: 1800, y: '70vh' } }
                    rowKey={ () => v4() }
                    bordered
                />
            </div>
        );
    }
}
