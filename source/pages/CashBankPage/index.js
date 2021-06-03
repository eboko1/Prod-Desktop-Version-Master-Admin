// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

// proj
import { Layout } from 'commons';
import { CashBalanceTable, CashActivityTable } from 'components';

/**
 * This page contains modules needed to work with cash boxes and get information and statistics using them.
 * For example open, close cash boxes with connected RST, see profit, expenses and other.
 */
export default class CashBankPage extends Component {
    render() {
        return (
            <Layout title={ <FormattedMessage id='navigation.cash_bank' /> }>
                <Tabs type='cards' defaultActiveKey='1'>
                    <TabPane
                        tab={ <FormattedMessage id={ 'cash-table.leftovers' } /> }
                        key='1'
                    >
                        <CashBalanceTable />
                    </TabPane>

                    <TabPane
                        tab={ <FormattedMessage id={ 'cash-table.trace' } /> }
                        key='2'
                    >
                        <CashActivityTable />
                    </TabPane>
                </Tabs>
            </Layout>
        );
    }
}
