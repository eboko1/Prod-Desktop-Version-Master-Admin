// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { DateRangePicker } from 'components';
import { VehicleLocationModal } from 'modals';
// own
const Option = Select.Option;

@injectIntl
export default class LocationsMovementPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            locations: [],
            locationId: undefined,
            dataSource: [],
            loading: false,
            currentPage: 1,
            fromDatetime: moment().startOf('month'),
            toDatetime: moment(),
            modalVisible: false,
            modalVehicleId: undefined,
            modalClientId: undefined,
            modalCurrentLocation: undefined,
        };

        this.columns = [
            {
                key:       'key',
                dataIndex: 'key',
                render:    (data, row)=> {
                    return (
                        data + 1
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.number' />,
                key:       'number',
                dataIndex: 'clientsVehicle',
                render:    ({number}, row)=> {
                    return (
                        number || <FormattedMessage id='long_dash'/>
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.vehicle'/>,
                key:       'vehicle',
                dataIndex: 'clientsVehicle',
                render:    ({make, model, modification, year}, row)=> {
                    return (
                        `${make} ${model} ${modification} (${year})`
                    )
                }
            },
            {
                title:     <FormattedMessage id='location' />,
                key:       'location',
                dataIndex: 'businessLocation',
                render:    ({name}, row)=> {
                    return (
                        name
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.arrival'/>,
                key:       'arrival',
                dataIndex: 'incomeDatetime',
                render:    (data, row)=> {
                    return (
                        data ? moment(data).format('DD.MM.YYYY HH:mm') : <FormattedMessage id='long_dash'/>
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.departure'/>,
                key:       'departure',
                dataIndex: 'expenseDatetime',
                render:    (data, row)=> {
                    return (
                        data ? moment(data).format('DD.MM.YYYY HH:mm') : <FormattedMessage id='long_dash'/>
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.duration'/>,
                key:       'duration',
                dataIndex: 'duration',
                render:    (data, row)=> {
                    const days = Math.floor(data/24);
                    const hours = Math.floor(data%24);
                    return (
                        <div>
                            {days ? <span>{days} <FormattedMessage id='locations.days'/></span> : null} {hours} <FormattedMessage id='locations.hours' />
                        </div>
                    )
                }
            },
            {
                key:       'action',
                width:     'min-content',
                render: (data)=>{
                    return (
                        <Button
                            type={'primary'}
                            disabled={data.count < 1}
                            onClick={()=>{
                                this.setState({
                                    modalVisible: true,
                                    modalVehicleId: data.clientsVehicle.id,
                                    modalClientId: data.client.id,
                                    modalCurrentLocation: data.businessLocation.id,
                                })
                            }}
                        >
                            <FormattedMessage id='locations.action'/>
                        </Button>
                    )
                }
            },
        ];
    }

    fetchData(id, page = 1) {
        const { clientVehicleId, fromDatetime, toDatetime } = this.state;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/movements?fromDatetime=${fromDatetime.format('YYYY-MM-DD')}&toDatetime=${toDatetime.format('YYYY-MM-DD')}&page=${page}&pageSize=10`;
        if(id || clientVehicleId) url += `&clientVehicleId=${id || clientVehicleId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            data.list.map((elem, key)=>{
                elem.key = key;
            })
            that.setState({
                paginationTotal: Number(data.stats.count),
                dataSource: data.list,
            })
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    componentDidMount() {
        if(this.props.location.state) {
            this.setState({
                clientVehicleId: this.props.location.state.vehicleId,
            });
            this.fetchData(this.props.location.state.vehicleId);
        } else {
            this.fetchData();
        }
    }

    render() {
        const { loading, dataSource, clientVehicleId, currentPage, paginationTotal, fromDatetime, toDatetime, modalVisible, modalVehicleId, modalClientId, modalCurrentLocation } = this.state;

        const pagination = {
            total: paginationTotal,
            current: currentPage,
            onChange: (page)=>{
                this.setState({
                    currentPage: page
                })
                this.fetchData(clientVehicleId, page);
            },
        }

        return (
            <Layout
                title={ <FormattedMessage id='navigation.locations_movement' /> }
                controls={
                    <div style={{display: 'flex'}}>
                        <DateRangePicker
                            dateRange={[
                                fromDatetime,
                                toDatetime,
                            ]}
                            onDateChange={async ([fromDatetime, toDatetime])=>{
                                await this.setState({
                                    fromDatetime: fromDatetime,
                                    toDatetime: toDatetime,
                                });
                                this.fetchData(clientVehicleId);
                            }}
                        />
                    </div>
                }
            >

                <Table
                    loading={ loading }
                    columns={ this.columns }
                    dataSource={ dataSource }
                    pagination={ pagination }
                />
                <VehicleLocationModal
                    modalVisible={modalVisible}
                    transferMode
                    vehicleId={modalVehicleId}
                    clientId={modalClientId}
                    currentLocation={modalCurrentLocation}
                    onConfirm={()=>this.fetchData()}
                    hideModal={()=>{
                        this.setState({
                            modalVisible: false,
                            modalVehicleId: undefined,
                            modalClientId: undefined,
                            modalCurrentLocation: undefined,
                        })
                    }}
                />
            </Layout>
        );
    }
}