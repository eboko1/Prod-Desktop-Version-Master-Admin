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
import { StorageDateFilter } from 'components';
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
            },
            {
                title:     <FormattedMessage id='locations.vehicle'/>,
                key:       'vehicle',
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
                render:    (data, row)=> {
                    return (
                        moment().format('DD HH')
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.departure'/>,
                key:       'departure',
                render:    (data, row)=> {
                    return (
                        moment().format('DD HH')
                    )
                }
            },
            {
                title:     <FormattedMessage id='locations.duration'/>,
                key:       'duration',
                render:    (data, row)=> {
                    return (
                        moment().format('DD HH')
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
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/movements?page=${page}`;
        if(id) url += `&businessLocationId=${id}`;
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
        const { loading, dataSource, locations, locationId, currentPage, paginationTotal } = this.state;
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
                    <StorageDateFilter
                        // dateRange={}
                        // onDateChange={}
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