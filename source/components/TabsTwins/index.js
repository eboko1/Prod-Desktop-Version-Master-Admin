// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

// proj
import { ResponsiveView } from 'commons';
import { BREAKPOINTS } from 'utils';

// own
import Styles from './styles.m.css';

export const TabsTwins = props => {
    const { primary, secondary } = props;

    return (
        <div className={ Styles.tables }>
            <ResponsiveView view={ { min: null, max: BREAKPOINTS.xl.max } }>
                <Tabs type='cards' defaultActiveKey='1'>
                    <TabPane
                        tab={ <FormattedMessage id={ primary.title } /> }
                        key='1'
                    >
                        { primary.content }
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id={ secondary.title } /> }
                        key='2'
                    >
                        { secondary.content }
                    </TabPane>
                </Tabs>
            </ResponsiveView>
            <ResponsiveView view={ { min: BREAKPOINTS.xxl.min, max: null } }>
                { primary.content }
                { secondary.content }
            </ResponsiveView>
        </div>
    );
};
