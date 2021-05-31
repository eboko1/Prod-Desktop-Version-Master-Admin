// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';
import { Numeral } from "commons";
import { permissions, isForbidden } from 'utils';

//Own
import Styles from './styles.m.css';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    client_full_name: 'auto',
    client_phones: '30%',
    client_debts: '30%',
}

export function columnsConfig(props) {

    const {
        user,
    } = props;

    const clientFullNameCol = {
        title:     <FormattedMessage id='name' />,
        width:     defWidth.client_full_name,
        key:       v4(),
        render: (val, obj) => {
            return (
                <div>
                    { `${obj.name || ""} ${obj.surname || ""}` }
                </div>
            );
        }
    };
    
    const phonesCol = {
        title:      <FormattedMessage id='add_order_form.phone' />,
        width:      defWidth.client_phones,
        dataIndex:  'phones',
        key:        'phones',
        render: (phones) => {
            return (
                phones.map(phone => (
                    <a
                        className={ Styles.clientPhone }
                        href={ `tel:${phone}` }
                        key={v4()}
                    >
                        { phone }
                    </a>
                ))
                
            );
        }
    };

    const debtsCol = {
        title:     <FormattedMessage id='client_hot_operations_page.debt' />,
        width:     defWidth.client_debts,
        dataIndex: 'totalDebtWithTaxes',
        key:       'totalDebtWithTaxes',
        render:    (totalDebtWithTaxes, client) => {
            
            const debt = totalDebtWithTaxes ? totalDebtWithTaxes : 0;

            const debtText = (
                <Numeral
                    className={Styles.debt}
                    nullText='0'
                    mask='0,0.00'
                >
                    {debt}
                </Numeral>
            );

            return !isForbidden(user, permissions.GET_CLIENTS_BASIC_INFORMATION) ? (
                <Link
                    to={{
                        pathname: `${book.client}/${client.clientId}`,
                        state:{
                            specificTab: 'clientDebt'
                        },
                    }}
                >
                    {debtText}
                </Link>
            ) : debtText
        },
    };

    return [
        clientFullNameCol,
        phonesCol,
        debtsCol,
    ];
}