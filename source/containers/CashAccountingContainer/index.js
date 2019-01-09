// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

// proj
import { ResponsiveView } from 'commons';
import { CashBalanceTable, CashActivityTable } from 'components';
import { BREAKPOINTS } from 'utils';

// own
import Styles from './styles.m.css';

export default class CashAccountingContainer extends Component {
    render() {
        return (
            <div className={ Styles.tables }>
                <ResponsiveView view={ { min: null, max: BREAKPOINTS.xl.max } }>
                    <Tabs defaultActiveKey='1'>
                        <TabPane
                            tab={ <FormattedMessage id='cash-table.leftovers' /> }
                            key='1'
                        >
                            <CashBalanceTable />
                        </TabPane>
                        <TabPane
                            tab={ <FormattedMessage id='cash-table.trace' /> }
                            key='2'
                        >
                            <CashActivityTable />
                        </TabPane>
                    </Tabs>
                </ResponsiveView>
                <ResponsiveView view={ { min: BREAKPOINTS.xxl.min, max: null } }>
                    <CashBalanceTable />
                    <CashActivityTable />
                </ResponsiveView>
            </div>
        );
    }
}
