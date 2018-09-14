// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher, Numeral } from 'commons';

// own
import Styles from './styles.m.css';

export default class EmployeeStatistics extends Component {
    render() {
        const { ordersCount, labourHours } = this.props;

        return (
            <Catcher>
                <div>
                    <span className={ Styles.title }>
                        <FormattedMessage id='employee-statistics.orders' />
                    </span>
                    <Numeral className={ Styles.count }>{ ordersCount }</Numeral>
                </div>
                <div>
                    <span className={ Styles.title }>
                        <FormattedMessage id='employee-statistics.labour_hours' />
                    </span>
                    <Numeral className={ Styles.count }>
                        { Math.round(labourHours) }
                    </Numeral>
                </div>
            </Catcher>
        );
    }
}
