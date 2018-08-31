// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

class DetailsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                // title:     <FormattedMessage id='order_form_table.detail_name' />,
                title:     'client name',
                dataIndex: 'name',
                key:       'name',
            },
            {
                title:     'client surname',
                dataIndex: 'surname',
                key:       'surname',
            },
            {
                title:     'client phone',
                dataIndex: 'phones',
                key:       'phones',
            },
            {
                title:  'vehicle',
                key:    'vehicle',
                render: client => {
                    const vehicle = _.get(client, 'vehicles[0]');
                    if (!vehicle) {
                        return '';
                    }

                    return vehicle.model
                        ? `${vehicle.make} ${vehicle.model} (${vehicle.year})`
                        : '';
                },
            },
            {
                title:  'vehicle',
                key:    'vin',
                render: client => {
                    const vehicle = _.get(client, 'vehicles[0]');
                    if (!vehicle) {
                        return '';
                    }

                    const vin = vehicle.vin || '';

                    return vehicle.number
                        ? vehicle.number + ' ' + vin
                        : vehicle.vin;
                },
            },
        ];
    }

    render() {
        const {
            clients,
            visible,
            setClientSelection,
            clientsSearching,
        } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ clients }
                    className={
                        visible
                            ? Styles.clientsSearchTable
                            : Styles.clientsSearchTableHidden
                    }
                    columns={ columns }
                    pagination={ false }
                    loading={ clientsSearching }
                    onRow={ record => {
                        return {
                            onClick: () => {
                                setClientSelection(record);
                            },
                        };
                    } }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    // scroll={ { y: 200 } }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;
