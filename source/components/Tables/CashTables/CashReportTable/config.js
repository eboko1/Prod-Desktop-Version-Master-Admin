// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';
import book from 'routes/book';

/* eslint-disable complexity */
export function columnsConfig() {

    const clientNameCol = {
        title:     <FormattedMessage id="cash_report_table.client_name" />,
        dataIndex: 'clientName',
        key: 'clientName',
        width:     '10%',
        align: 'right',
        render:    (clientName, report) => {             
            if(clientName) {return (
                <Link to={{ 
                        pathname: `${book.client}/${report.id}`,
                        state: {
                            specificTab: 'clientDebt'
                        }
                    }}
                >
                    {clientName}
                </Link>
            )} else "<NAME MISSING>";
        }
    };

    const clientPhoneCol = {
        title:     <FormattedMessage id="cash_report_table.phone" />,
        dataIndex: 'phones',
        key: 'phones',
        width:     '10%',
        align: 'right',
        render:    phones => {
            return _.get(phones, '0', '<PHONE MISSING>');
        }
    };

    const clientPaymentRespite = {
        title:     <FormattedMessage id="cash_report_table.payment_respite" />,
        dataIndex: 'paymentRespite',
        key: 'paymentRespite',
        width:     '10%',
        align: 'right',
        render:    paymentRespite => {
            return <Numeral>{paymentRespite}</Numeral>;
        }
    };

    const clientCurrentDebtCol = {
        title:     <FormattedMessage id="cash_report_table.current_debt" />,
        dataIndex: 'currentDebt',
        key: 'currentDebt',
        width:     '10%',
        align: 'right',
        render: currentDebt => {
            let strVal = Number(currentDebt).toFixed(2);

            return (
                <span>
                    { currentDebt ? 
                        `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        : 0
                    }
                </span>
            );
        },
    };

    const clientOverdueDebtCol = {
        title:     <FormattedMessage id="cash-table.overdue_debt" />,
        dataIndex: 'overdueDebt',
        key: 'overdueDebt',
        width:     '10%',
        align: 'right',
        render: overdueDebt => {
            let strVal = Number(overdueDebt).toFixed(2);

            return (
                <span>
                    { overdueDebt ? 
                        `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        : 0
                    }
                </span>
            );
        },
    };

    const clientNotOverdueDebtCol = {
        title:     <FormattedMessage id="cash-table.not_overdue_debt" />,
        dataIndex: 'overdueDebt',
        key: 'notOverdueDebt',
        width:     '10%',
        align: 'right',
        render: (overdueDebt, report) => {
            const notOverdueDebt = (report.currentDebt ? report.currentDebt: 0) - overdueDebt;
            let strVal = Number(notOverdueDebt).toFixed(2);

            return (
                <span>
                    { notOverdueDebt ? 
                        `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        : 0
                    }
                </span>
            );
        },
    };

    return [
        clientNameCol,
        clientPhoneCol,
        clientPaymentRespite,
        clientCurrentDebtCol,
        clientOverdueDebtCol,
        clientNotOverdueDebtCol
    ];
}
