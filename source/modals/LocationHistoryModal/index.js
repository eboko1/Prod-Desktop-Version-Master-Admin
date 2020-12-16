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
export default class LocationHistoryModal extends Component {
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
        };

        this.columns = [
            {
                key:       'key',
                dataIndex: 'key',
                width:     'min-content',
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
                        data ? moment(data).format('DD.MM.YYYY HH:MM') : <FormattedMessage id='long_dash'/>
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.departure'/>,
                key:       'departure',
                dataIndex: 'expenseDatetime',
                render:    (data, row)=> {
                    return (
                        data ? moment(data).format('DD.MM.YYYY HH:MM') : <FormattedMessage id='long_dash'/>
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
        const { locationId, fromDatetime, toDatetime } = this.state;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/movements?fromDatetime=${fromDatetime.format('YYYY-MM-DD')}&toDatetime=${toDatetime.format('YYYY-MM-DD')}&page=${page}&pageSize=10`;
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

    handleCancel = () => {
        this.setState({
            locationId: undefined,
            dataSource: [],
            loading: false,
            currentPage: 1,
            fromDatetime: moment().startOf('month'),
            toDatetime: moment(),
        });
        this.props.hideModal();
    }

    componentDidMount() {
        this.getLocations();
    }

    componentDidUpdate(prevProps) {
        if(this.props.visible && !prevProps.visible) {
            this.setState({
                locationId: this.props.selectedLocation,
            });
            this.fetchData(this.props.selectedLocation);
        }
    }


    render() {
        const { loading, dataSource, locations, locationId, currentPage, paginationTotal, fromDatetime, toDatetime } = this.state;
        const { visible, hideModal } = this.props;

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
            <Modal
                visible={visible}
                title={<FormattedMessage id='locations.vehicles_location_history'/>}
                width={'80%'}
                onCancel={this.handleCancel}
            >
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 24}}>
                    <div>
                        <Select
                            showSearch
                            value={locationId}
                            style={{width: 220}}
                            placeholder={this.props.intl.formatMessage({id: 'location'})}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
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
                            this.fetchData();
                        }}
                    />
                </div>
                <Table
                    loading={ loading }
                    columns={ this.columns }
                    dataSource={ dataSource }
                    pagination={ pagination }
                />
            </Modal>
        );
    }
}