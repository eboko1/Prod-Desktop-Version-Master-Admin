// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

export default class ClientSearchTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='name' />,
                dataIndex: 'name',
                key:       'name',
            },
            {
                title:     <FormattedMessage id='surname' />,
                dataIndex: 'surname',
                key:       'surname',
            },
            {
                title:     <FormattedMessage id='add_order_form.phone' />,
                dataIndex: 'phones',
                key:       'phones',
            },
            {
                title:  <FormattedMessage id='vehicle' />,
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
                title:  <FormattedMessage id='add_order_form.vin' />,
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

        this.mobileColumns = [
            {
                title:     <FormattedMessage id='name' />,
                dataIndex: 'name',
                key:       'name',
                render: (_, {name, surname}) => {
                   return (
                       <div>
                           <div>{name}</div>
                           <div>{surname}</div>
                       </div>
                   )
                },
            },
            {
                title:     <FormattedMessage id='add_order_form.phone' />,
                dataIndex: 'phones',
                key:       'phones',
            },
            {
                title:  <FormattedMessage id='vehicle' />,
                key:    'vehicle',
                render: client => {
                    const vehicle = _.get(client, 'vehicles[0]');
                    if (!vehicle) {
                        return '';
                    }

                    return vehicle.model ? 
                    <div>
                        <div>{vehicle.make} {vehicle.model} {vehicle.year}</div>
                        <div>{vehicle.number}</div>
                    </div>
                        : '';
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
            isMobile,
        } = this.props;
        const columns = !isMobile ? this.columns : this.mobileColumns;

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
                    onRow={ client => {
                        return {
                            onClick: () => {
                                setClientSelection(client);
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
