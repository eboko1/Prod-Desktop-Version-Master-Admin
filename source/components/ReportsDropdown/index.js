// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';

// proj
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const ACT_OF_ACCEPTANCE_REPORT = 'actOfAcceptanceReport'; // actOfAcceptanceReport -> акт приема работ
const BUSINESS_ORDER_REPORT = 'businessOrderReport'; // businessOrderReport -> наряд заказ в цех
const CALCULATION_REPORT = 'calculationReport'; // calculationReport - калькуляция
const CLIENT_ORDER_REPORT = 'clientOrderReport'; // clientOrderReport -> наряд заказ
const COMPLETED_WORK_REPORT = 'completedWorkReport'; // completedWorkReport -> акт выполненых работ
const DIAGNOSTICS_ACT_REPORT = 'diagnosticsActReport'; // diagnosticsActReport -> акт диагностики
const INVOICE_REPORT = 'invoiceReport'; // invoiceReport -> счет-фактура

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

        const statusToReportsMap = {
            not_complete: [ CALCULATION_REPORT ], // eslint-disable-line camelcase
            required:     [ CALCULATION_REPORT ],
            reserve:      [ INVOICE_REPORT, COMPLETED_WORK_REPORT, CALCULATION_REPORT, ACT_OF_ACCEPTANCE_REPORT, DIAGNOSTICS_ACT_REPORT, BUSINESS_ORDER_REPORT ],
            call:         [ CALCULATION_REPORT ],
            approve:      [ INVOICE_REPORT, COMPLETED_WORK_REPORT, CALCULATION_REPORT, ACT_OF_ACCEPTANCE_REPORT, DIAGNOSTICS_ACT_REPORT, BUSINESS_ORDER_REPORT ],
            progress:     [ INVOICE_REPORT, COMPLETED_WORK_REPORT, ACT_OF_ACCEPTANCE_REPORT, DIAGNOSTICS_ACT_REPORT, BUSINESS_ORDER_REPORT ],
            success:      [ CLIENT_ORDER_REPORT, COMPLETED_WORK_REPORT, CALCULATION_REPORT ],
            review:       [ CLIENT_ORDER_REPORT ],
            invite:       [ CALCULATION_REPORT ],
            cancel:       [ CALCULATION_REPORT ],
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
        const { isMobile } = this.props;
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

        const forbidden = isForbidden(
            this.props.user,
            permissions.PRINT_ORDERS,
        );

        return (
            <Dropdown overlay={ menu } disabled={ forbidden }>
                <Icon
                    className={ forbidden ? Styles.forbiddenPrint : '' }
                    type='printer'
                    style={ {
                        fontSize: isMobile ? 12 : 24,
                        cursor:   'pointer',
                        margin:   '0 10px',
                    } }
                />
            </Dropdown>
        );
    }
}

export default ReportsDropdown;
