// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import {
    TabsTwins,
    SubscriptionProTable,
    SubscriptionCarbookTable,
} from 'components';

// own

export default class SubscriptionHistoryPage extends Component {
    render() {
        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.subscription_history' />
                }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                <TabsTwins
                    primary={ {
                        title:   'cash-table.leftovers',
                        content: <SubscriptionProTable />,
                    } }
                    secondary={ {
                        title:   'cash-table.trace',
                        content: <SubscriptionCarbookTable />,
                    } }
                />
            </Layout>
        );
    }
}
