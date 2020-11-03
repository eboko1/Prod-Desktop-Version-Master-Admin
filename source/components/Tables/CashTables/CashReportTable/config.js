// vendor
import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';
import book from 'routes/book';

/* eslint-disable complexity */
export function columnsConfig() {

    const clientNameCol = {
        title:     <FormattedMessage id="cash_clients_debts_page.client_name" />,
        dataIndex: 'clientName',
        width:     '10%',
        render:    (clientName, report) => {             
            if(clientName) {return (
                <Link to={ `${book.client}/${report.id}` }>
                    {clientName}
                </Link>
            )} else "<NAME MISSING>";
        }
    };

    const clientPhoneCol = {
        title:     <FormattedMessage id="cash_clients_debts_page.phone" />,
        dataIndex: 'phones',
        width:     '10%',
        render:    phones => {
            return _.get(phones, '0', '<PHONE MISSING>');
        }
    };

    const clientPaymentRespite = {
        title:     <FormattedMessage id="cash_clients_debts_page.payment_respite" />,
        dataIndex: 'paymentRespite',
        width:     '10%',
        render:    paymentRespite => {
            return <Numeral>{paymentRespite}</Numeral>;
        }
    };

    const clientCurrentDebtCol = {
        title:     <FormattedMessage id="cash_clients_debts_page.current_debt" />,
        dataIndex: 'currentDebt',
        width:     '10%',
        render:    currentDebt => {
            return <Numeral>{currentDebt}</Numeral>;
        }
    };

    return [
        clientNameCol,
        clientPhoneCol,
        clientPaymentRespite,
        clientCurrentDebtCol
    ];
}
