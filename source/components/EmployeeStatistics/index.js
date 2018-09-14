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
                    <FormattedMessage id='add' className={ Styles.title } />
                    <Numeral className={ Styles.count }>{ ordersCount }</Numeral>
                </div>
                <div>
                    <FormattedMessage id='add' className={ Styles.title } />
                    <Numeral className={ Styles.count }>
                        { Math.round(labourHours) }
                    </Numeral>
                </div>
            </Catcher>
        );
    }
}
