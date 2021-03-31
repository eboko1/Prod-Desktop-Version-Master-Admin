// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { Tabs, Table } from 'antd';
import _ from 'lodash';

// proj

// own
import mainTableColumnsConfig from './tableConfigs/mainTableConfig';
import paymentsTableColumnsConfig from './tableConfigs/paymetsTableConfig';
import productsTableColumnsConfig from './tableConfigs/productsTableConfig';
import Styles from './styles.m.css';

const { TabPane } = Tabs;

const mapStateToProps = state => ({
    cashdeskLogs: state.reportCashOrdersLogs.cashdeskLogs,
});

// const mapDispatchToProps = {};

@connect(
    mapStateToProps,
    null
)
@injectIntl
export class ReportCashOrdersLogsTable extends Component {
    constructor(props) {
        super(props);
        this.mainTableColumns = mainTableColumnsConfig();
        this.paymentTableConfig = paymentsTableColumnsConfig();
        this.productsTableConfig = productsTableColumnsConfig();
    }

    paymentsTable(paymets) {

        return (
            <Table
                dataSource={ paymets }
                columns={ this.paymentTableConfig }
            />
        );
    }

    productsTable(prducts) {

        return (
            <Table
                dataSource={ prducts }
                columns={ this.productsTableConfig }
            />
        );
    }

    render() {
        const {
            cashdeskLogs
        } = this.props;

        //We need to upade props (needed for child components)
        this.mainTableColumns = mainTableColumnsConfig();
        this.paymentTableConfig = paymentsTableColumnsConfig();
        this.productsTableConfig = productsTableColumnsConfig();

        console.log("\n\n\nMy data: ", cashdeskLogs);
        

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
                    dataSource={ testData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    expandedRowRender={() => {
                        return (<div>
                            <Tabs tabPosition={"top"}>
                                <TabPane tab="Products" key="products">
                                    {this.productsTable(testData)}
                                </TabPane>

                                <TabPane tab="Payments" key="payments">
                                    {this.productsTable(testData)}
                                </TabPane>
                            </Tabs>
                        </div>)
                    }}
                    scroll={ { x: 1800, y: '50vh' } }
                    rowKey={ record => record.orderId }
                    bordered
                />
            </div>
        );
    }
}
