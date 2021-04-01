// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { Tabs, Table } from 'antd';
import _ from 'lodash';

// proj
import {fetchCashOrdersLogsReceipt} from 'core/reports/reportCashOrdersLogs/duck';

// own
import mainTableColumnsConfig from './tableConfigs/mainTableConfig';
import paymentsTableColumnsConfig from './tableConfigs/paymetsTableConfig';
import productsTableColumnsConfig from './tableConfigs/productsTableConfig';
import Styles from './styles.m.css';

const { TabPane } = Tabs;

const mapStateToProps = state => ({
    cashdeskLogs: state.reportCashOrdersLogs.cashdeskLogs,
});

const mapDispatchToProps = {
    fetchCashOrdersLogsReceipt
};

@connect(
    mapStateToProps,
    mapDispatchToProps
)
@injectIntl
export class ReportCashOrdersLogsTable extends Component {
    constructor(props) {
        super(props);
        const {fetchCashOrdersLogsReceipt} = props;
        this.mainTableColumns = mainTableColumnsConfig({fetchCashOrdersLogsReceipt});
        this.paymentTableConfig = paymentsTableColumnsConfig();
        this.productsTableConfig = productsTableColumnsConfig();
    }

    paymentsTable(paymets) {

        return (
            <Table
                dataSource={ paymets }
                columns={ this.paymentTableConfig }
                pagination={false}
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
                bordered
            />
        );
    }

    render() {
        const {
            cashdeskLogs,
            fetchCashOrdersLogsReceipt
        } = this.props;

        //We need to upade props (needed for child components)
        this.mainTableColumns = mainTableColumnsConfig({fetchCashOrdersLogsReceipt});
        this.paymentTableConfig = paymentsTableColumnsConfig();
        this.productsTableConfig = productsTableColumnsConfig();


        const pagination = {
            pageSize:         25,
            size:             'large',
            // total:            Math.ceil(stats.totalRowsCount / 25) * 25,
            total:            100,
            hideOnSinglePage: true,
            // current:          filter.page,
            current:          1,
            // onChange:         page => {
            //     filterControls.setReportOrdersPage(page);
            //     filterControls.fetchReportOrders();
            // },
        };

        const testData = [];

        for(let i = 0; i < 10; i++) {
            testData.push({
                id: 15342,
                cashOrderNumber: '123',
                orderNumber: 'MRD-1234-1234',

                data: '12.10.2020',
                sum: 100,
                fiscal: 1234567890
            });
        }

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
                                <TabPane tab="Products" key="products">
                                    {this.productsTable(record.products)}
                                </TabPane>

                                <TabPane tab="Payments" key="payments">
                                    {this.paymentsTable(record.payments)}
                                </TabPane>
                            </Tabs>
                        </div>)
                    }}
                    scroll={ { x: 1800, y: '70vh' } }
                    rowKey={ record => record.orderId }
                    bordered
                />
            </div>
        );
    }
}
