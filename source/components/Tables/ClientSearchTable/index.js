// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Modal, Input, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from "commons";
// own
import Styles from './styles.m.css';

export default class ClientSearchTable extends Component {
    constructor(props) {
        super(props);
        this.state={
            clients: [],
        };

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

        this.handleClientsSearch = _.debounce(query => {
            this.fetchClientsList(query);
        }, 1000);
    }

    duplicate(clients) {
        return _.flatten(
            _.map(clients, client => {
                const { vehicles } = client;
                const hasVehicles = _.isArray(vehicles) && vehicles.length;
                if (!hasVehicles) {
                    return client;
                }

                return vehicles.map((vehicle, index) => {
                    const duplicatedVehicles = _.cloneDeep(vehicles);
                    duplicatedVehicles.splice(index, 1);

                    return {
                        ...client,
                        vehicles: [ vehicles[ index ], ...duplicatedVehicles ],
                    };
                });
            }),
        );
    }

    fetchClientsList(query) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/clients/search?query=${query}`;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
            return Promise.resolve(response);
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
            that.setState({
                clients: that.duplicate(data.clients),
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    componentDidUpdate(prevProps) {
        const { searchQuery } = this.props;
        if(prevProps.searchQuery != searchQuery && searchQuery.length > 2) {
            this.handleClientsSearch(searchQuery);
        }
    }

    render() {
        const { visible, onSelect, loading } = this.props;
        const { clients } = this.state;
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
                    loading={ loading }
                    onRow={ client => {
                        console.log(client)
                        return {
                            onClick: () => {
                                onSelect(client);
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