// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown, Icon } from 'antd';

// proj
import book from 'routes/book';
import {
    getDiagnosticsReport,
    getDiagnosticsAct,
} from 'core/forms/orderDiagnosticForm/saga';
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
        const { user, orderId, orderStatus } = props;

        if (!orderStatus) {
            return [];
        }

        const all = [
            ACT_OF_ACCEPTANCE_REPORT,
            BUSINESS_ORDER_REPORT,
            CALCULATION_REPORT,
            CLIENT_ORDER_REPORT,
            COMPLETED_WORK_REPORT,
            INVOICE_REPORT,
        ];

        const selectedReports = [ ACT_OF_ACCEPTANCE_REPORT, BUSINESS_ORDER_REPORT, DIAGNOSTICS_ACT_REPORT ];

        const limitedPrint = isForbidden(user, permissions.LIMITED_PRINT);

        const statusToReportsMap = {
            not_complete: limitedPrint ? [] : [ CALCULATION_REPORT ], // eslint-disable-line camelcase
            required:     limitedPrint ? [] : [ CALCULATION_REPORT ],
            reserve:      limitedPrint ? [] : [ CALCULATION_REPORT ],
            call:         limitedPrint ? [] : [ CALCULATION_REPORT ],
            approve:      limitedPrint ? selectedReports : all,
            progress:     limitedPrint ? selectedReports : all,
            success:      [
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
        const { isMobile, orderId } = this.props;

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
                <Menu.Item
                    key={ `${this.reports.length}` }
                    className={ `${Styles.itemDisabled}` }
                    onClick={()=>{getDiagnosticsAct(orderId)}}
                >
                    <FormattedMessage id='diagnosticAct' />
                </Menu.Item>
                <Menu.Item
                    key={ `${this.reports.length}` }
                    className={ `${Styles.itemDisabled}` }
                    onClick={()=>{getDiagnosticsReport(orderId)}}
                >
                    <FormattedMessage id='diagnosticResult' />
                </Menu.Item>
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
                        fontSize: isMobile ? 14 : 24,
                        cursor:   'pointer',
                        margin:   '0 10px',
                    } }
                />
            </Dropdown>
        );
    }
}

export default ReportsDropdown;
