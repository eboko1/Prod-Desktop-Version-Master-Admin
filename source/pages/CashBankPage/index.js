// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { TabsTwins, CashBalanceTable, CashActivityTable } from 'components';
// import { CashAccountingContainer } from 'containers';

// own

export default class CashBankPage extends Component {
    render() {
        return (
            <Layout title={ <FormattedMessage id='navigation.cash_bank' /> }>
                <TabsTwins
                    primary={ {
                        title:   'cash-table.leftovers',
                        content: <CashBalanceTable />,
                    } }
                    secondary={ {
                        title:   'cash-table.trace',
                        content: <CashActivityTable />,
                    } }
                />
            </Layout>
        );
    }
}
