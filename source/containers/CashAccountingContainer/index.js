// vendor
import React, { Component } from 'react';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

// proj
import { ResponsiveView } from 'commons';
import { CashAccountingTable } from 'components';
import { BREAKPOINTS } from 'utils';

// own
import Styles from './styles.m.css';

export default class CashAccountingContainer extends Component {
    render() {
        return (
            <div className={ Styles.tables }>
                <ResponsiveView view={ { min: null, max: BREAKPOINTS.xl.max } }>
                    <Tabs defaultActiveKey='1'>
                        <TabPane tab='Остатки' key='1'>
                            <CashAccountingTable />
                        </TabPane>
                        <TabPane tab='Движения' key='2'>
                            <CashAccountingTable />
                        </TabPane>
                    </Tabs>
                </ResponsiveView>
                <ResponsiveView view={ { min: BREAKPOINTS.xxl.min, max: null } }>
                    <CashAccountingTable />
                    <CashAccountingTable />
                </ResponsiveView>
            </div>
        );
    }
}
