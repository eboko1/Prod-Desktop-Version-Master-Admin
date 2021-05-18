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

/**
 * Makes very useful and view responsive component of two tabs, the firts and the second
 * with its own title and content. If we have anough amount space we place them one near another,
 * else we create tabs for each component.
 * @param {*} props.primary First tab element
 * @param {*} props.primary.title Title of the tab of this element
 * @param {*} props.primary.content Content of the tab of this element
 * 
 * @param {*} props.secondary Second tab element 
 * @param {*} props.secondary.title Title of the tab of this element
 * @param {*} props.secondary.content Content of the tab of this element
 * @returns node
 */
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
