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
import book from 'routes/book';
import { SingleDatePicker } from 'components';
import { VehicleLocationModal } from 'modals';
// own
const Option = Select.Option;

@injectIntl
export default class LocationsVehiclesPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            locations: [],
            locationId: undefined,
            dataSource: [],
            loading: false,
            currentPage: 1,
            paginationTotal: 0,
            modalVisible: false,
            modalVehicleId: undefined,
            modalClientId: undefined,
            modalCurrentLocation: undefined,
            toDatetime: moment(),
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
                title:     <FormattedMessage id='locations.time'/>,
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
            {
                key:       'history',
                width:     'min-content',
                render: (row)=>{
                    return (
                        <Link
                            to={ {
                                pathname: book.locationsMovement,
                                state:    {vehicleId: row.clientVehicleId},
                            } }
                        >
                            <Button
                                type={'primary'}
                            >
                                <FormattedMessage id='locations.history'/>
                            </Button>
                        </Link>
                    )
                }
            },
        ];
    }

    getLocations() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations`;
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
            data.map((elem, key)=>{
                elem.key = key;
            })
            that.setState({
                locations: data,
            })
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    fetchData(id, page = 1) {
        const { locationId, toDatetime } = this.state;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/movements/vehicles?toDatetime=${toDatetime.format('YYYY-MM-DD')}&page=${page}&pageSize=10`;
        if(id || locationId) url += `&businessLocationId=${id || locationId}`;
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
            console.log(data);
            data.list.map((elem, key)=>{
                elem.key = key;
                elem.client = elem.movement.client;
                elem.businessLocation = elem.movement.businessLocation;
                elem.clientsVehicle = elem.movement.clientsVehicle;
                elem.duration = elem.movement.duration;
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
        this.getLocations();
        if(this.props.location.state) {
            this.setState({
                locationId: this.props.location.state.locationId,
            });
            this.fetchData(this.props.location.state.locationId);
        } else {
            this.fetchData();
        }
    }

    render() {
        const { loading, locations, locationId, dataSource, currentPage, paginationTotal, modalVisible, modalVehicleId, modalClientId, modalCurrentLocation, toDatetime } = this.state;

        const pagination = {
            total: paginationTotal,
            current: currentPage,
            onChange: (page)=>{
                this.setState({
                    currentPage: page
                })
                this.fetchData(locationId, page);
            },
        }

        return (
            <Layout
                title={ <FormattedMessage id='navigation.locations_vehicles' /> }
                description={
                    <div>
                        {toDatetime.format('DD.MM.YY')}
                    </div>
                }
                controls={
                    <div style={{display: 'flex'}}>
                        <SingleDatePicker
                            date={toDatetime}
                            onDateChange={async (date)=>{
                                await this.setState({
                                    toDatetime: date,
                                });
                                this.fetchData();
                            }}
                            style={{margin: '0 8px'}}
                        />
                        <Select
                            showSearch
                            value={locationId}
                            style={{width: 220}}
                            placeholder={this.props.intl.formatMessage({id: 'location'})}
                            onChange={(value)=>{
                                this.setState({
                                    locationId: value,
                                    currentPage: 1,
                                });
                                this.fetchData(value);
                            }}
                        >
                            {locations.map(({id, name}, key)=>
                                <Option
                                    key={key}
                                    value={id}
                                >
                                    {name}
                                </Option>
                            )}
                        </Select>
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