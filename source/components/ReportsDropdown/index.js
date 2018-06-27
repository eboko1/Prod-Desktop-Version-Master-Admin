// vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Menu, Dropdown, Icon, message} from 'antd';
import {saveAs} from 'file-saver'

// proj
import book from 'routes/book';
import {fetchAPI} from 'utils';

// own
import Styles from './styles.m.css';

class ReportsDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.reports = ReportsDropdown.getReports(props);
    }

    async downloadReport(item) {
        const response = await fetchAPI('GET', item.link, null, null, true);
        const reportFile = await response.blob();
        const contentDispositionHeader = response.headers.get('content-disposition');
        const fileName = contentDispositionHeader.match(/^attachment; filename="(.*)"/)[ 1 ];
        saveAs(reportFile, fileName);
    }

    static getReports(props) {
        const {orderId, orderStatus} = props
        if (!orderStatus) {
            return [];
        }

        // calculationReport - калькуляция
        // businessOrderReport -> наряд заказ в цех
        // clientOrderReport -> наряд заказ
        // diagnosticsActReport -> акт диагностики
        // actOfAcceptanceReport -> акт приема работ
        const statusToReportsMap = {
            not_complete: [ 'calculationReport' ],
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
        const reports = statusToReportsMap[ orderStatus ].map((name) => {
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
                { this.reports.map((item, i) => (
                    <Menu.Item key={ `${i}-${item.name}` }
                        className={ `${item.disabled && Styles.itemDisabled}` }
                        onClick={ async () => {
                            await this.downloadReport(item)
                        } }>
                        { item.icon && <Icon type={ item.icon }/> }
                        <FormattedMessage
                            id={ item.name }
                        />
                    </Menu.Item>
                )) }
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                <Icon type='printer'/>
            </Dropdown>
        );
    }
}

export default ReportsDropdown;
