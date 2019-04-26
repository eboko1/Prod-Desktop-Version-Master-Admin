// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';
import _ from 'lodash';

// proj
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

// own
import config from './config';
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
        const businessId = _.get(props, 'user.businessId');
        if (!orderStatus) {
            return [];
        }

        const all = [
            ACT_OF_ACCEPTANCE_REPORT,
            BUSINESS_ORDER_REPORT,
            CALCULATION_REPORT,
            CLIENT_ORDER_REPORT,
            COMPLETED_WORK_REPORT,
            DIAGNOSTICS_ACT_REPORT,
            INVOICE_REPORT,
        ];

        const selectedReports = [ ACT_OF_ACCEPTANCE_REPORT, BUSINESS_ORDER_REPORT, DIAGNOSTICS_ACT_REPORT ];

        const statusToReportsMap = {
            not_complete: config.avtostop.includes(businessId)
                ? []
                : [ CALCULATION_REPORT ], // eslint-disable-line camelcase
            required: config.avtostop.includes(businessId)
                ? []
                : [ CALCULATION_REPORT ],
            reserve: config.avtostop.includes(businessId)
                ? []
                : [ CALCULATION_REPORT ],
            call: config.avtostop.includes(businessId)
                ? []
                : [ CALCULATION_REPORT ],
            approve: config.avtostop.includes(businessId)
                ? selectedReports
                : all,
            progress: config.avtostop.includes(businessId)
                ? selectedReports
                : all,
            success: [
                CALCULATION_REPORT,
                CLIENT_ORDER_REPORT,
                COMPLETED_WORK_REPORT,
                INVOICE_REPORT,
            ],
            invite: [ CALCULATION_REPORT ],
            cancel: [ CALCULATION_REPORT ],
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
        console.log('→ this.props.user', this.props.user);
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
