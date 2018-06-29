// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';

class ReportsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.reports = ReportsDropdown.getReports(props);
    }

    static getReports(props) {
        const { orderId, orderStatus } = props;
        if (!orderStatus) {
            return [];
        }

        // calculationReport - калькуляция
        // businessOrderReport -> наряд заказ в цех
        // clientOrderReport -> наряд заказ
        // diagnosticsActReport -> акт диагностики
        // actOfAcceptanceReport -> акт приема работ
        const statusToReportsMap = {
            not_complete: ["calculationReport"], // eslint-disable-line
            required:     [ 'calculationReport' ],
            reserve:      [ 'calculationReport' ],
            call:         [ 'calculationReport' ],
            approve:      [ 'calculationReport', 'actOfAcceptanceReport', 'diagnosticsActReport', 'businessOrderReport' ],
            progress:     [ 'actOfAcceptanceReport', 'diagnosticsActReport', 'businessOrderReport', 'clientOrderReport' ],
            success:      [ 'clientOrderReport' ],
            review:       [ 'clientOrderReport' ],
            invite:       [ 'calculationReport' ],
            cancel:       [ 'calculationReport' ],
        };
        const reports = statusToReportsMap[ orderStatus ].map(name => {
            return {
                name,
                link: `${book.reports}/${name}/${orderId}`,
            };
        });

        return reports;
    }

    render() {
        const menu = (
            <Menu>
                { this.reports.map((item, index) => (
                    <Menu.Item
                        key={ `${index}-${item.name}` }
                        className={ `${item.disabled && Styles.itemDisabled}` }
                        onClick={ () => this.props.download(item) }
                    >
                        { item.icon && <Icon type={ item.icon } /> }
                        <FormattedMessage id={ item.name } />
                    </Menu.Item>
                )) }
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                <Icon type='printer' />
            </Dropdown>
        );
    }
}

export default ReportsDropdown;
