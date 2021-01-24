// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, InputNumber, Checkbox, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';

// own
import Styles from './styles.m.css';
const Option = Select.Option;
const   WORK_POST = 'WORK_POST',
        INTERNAL_PARKING = 'INTERNAL_PARKING', 
        EXTERNAL_PARKING = 'EXTERNAL_PARKING',
        TEST_DRIVE = 'TEST_DRIVE',
        OTHER = 'OTHER';
const TYPES = [WORK_POST, INTERNAL_PARKING, EXTERNAL_PARKING, TEST_DRIVE, OTHER];

export default class LocationSettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            locations: [],
            loading: false,
            editMode: false,
            location: undefined,
        };

        this.getLocations = this.getLocations.bind(this);

        this.columns = [
            {
                title:     '№',
                key:       'key',
                dataIndex: 'key',
                width:     '5%',
                render:     (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:      <FormattedMessage id='locations.name'/>,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
            },
            {
                title:     <FormattedMessage id='locations.type'/>,
                key:       'type',
                dataIndex: 'type',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        data ? <FormattedMessage id={`locations.${data}`}/> : <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:  <div className={ Styles.numberColumn }>
                            <FormattedMessage id='locations.volume' />
                            
                        </div>,
                className: Styles.numberColumn,
                key:       'volume',
                dataIndex: 'volume',
                width:     'auto',
                render:    (data, elem)=>{
                    const volume = Number(data || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    return volume;
                }
            },
            {
                title:  <div className={ Styles.numberColumn }>
                            <FormattedMessage id='locations.price' />
                            
                        </div>,
                className: Styles.numberColumn,
                key:       'price',
                dataIndex: 'price',
                width:     'auto',
                render:    (data, elem)=>{
                    const price = Number(data || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    return price;
                }
            },
            {
                key:       'edit',
                width:     '5%',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='edit'
                            style={{fontSize: 18}}
                            onClick={()=>{
                                this.setState({
                                    editMode: true,
                                    location: elem,
                                })
                            }}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '5%',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='delete'
                            style={{fontSize: 18}}
                            onClick={()=>{
                                this.deleteLocation(elem.id)
                            }}
                        />
                    )
                }
            },
        ]
    }

    deleteLocation(id) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/${id}`;
        fetch(url, {
            method: 'DELETE',
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
            that.getLocations()
        })
        .catch(function (error) {
            console.log('error', error);
            notification.error({
                message: that.props.intl.formatMessage({id: 'locations.delete_error'}),
            });
        });
    }

    getLocations() {
        this.setState({loading: true})
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
                loading: false,
                editMode: false,
                location: undefined,
            })
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({loading: false})
        });
    }

    componentDidMount() {
        this.getLocations();
    }

    render() {
        const { locations, loading, editMode, location } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.locations_settings' /> }
                controls={
                    <AddLocationModal
                        getLocations={this.getLocations}
                        editMode={editMode}
                        location={location}
                        unsetVisible={()=>{
                            this.setState({
                                editMode: false,
                                location: undefined,
                            })
                        }}
                    />
                }
            >
                 <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={locations}
                    pagination={false}
                />
            </Layout>
        );
    }
}

@injectIntl
class AddLocationModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            name: undefined,
            type: undefined,
            volume: 0,
            price: 0,
        }
    }

    postLocation() {
        const { name, type, volume, price } = this.state;
        const { getLocations } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/business_locations';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify({
                name: name,
                type: type || null,
                volume: volume,
                price: price,
            })
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
            getLocations();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    editLocation() {
        const { name, type, volume, price } = this.state;
        const { getLocations, location } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/${location.id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify({
                name: name,
                type: type || null,
                volume: volume,
                price: price,
            })
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
            getLocations();
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    handleOk = () => {
        if(this.props.editMode) {
            this.editLocation();
        }
        else {
            this.postLocation();
        }
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            name: undefined,
            type: undefined,
            volume: 0,
            price: 0,
        });
        this.props.unsetVisible();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.editMode && this.props.editMode) {
            const { location } = this.props;
            this.setState({
                visible: true,
                name: location.name,
                type: location.type,
                volume: location.volume,
                price: location.price,
            })
        } 
    }


    render() {
        const { intl: {formatMessage}, editMode } = this.props;
        const { visible, name, type, volume, price } = this.state;
        return (
            <>
            <Button
                type="primary"
                onClick={()=>{
                    this.setState({
                        visible: true
                    })
                }}
            >
                <FormattedMessage id='add' />
            </Button>
            <Modal
                visible={visible}
                title={`${formatMessage({id: editMode ? 'edit' : 'add'})} ${formatMessage({id: 'navigation.locations'}).toLowerCase()}`}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                okButtonProps={{
                    disabled: !name || !type
                }}
                maskClosable={false}
            >
                <div>
                    <div style={{margin: '0 0 8px 0'}}>
                        <span style={{color: 'red'}}>*</span> <FormattedMessage id='locations.name'/>: 
                        <Input
                            value={name}
                            onChange={(event)=>{
                                this.setState({
                                    name: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{margin: '8px 0'}}>
                        <span style={{color: 'red'}}>*</span> <FormattedMessage id='locations.type'/>: 
                        <Select
                            allowClear
                            value={type}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    type: value
                                })
                            }}
                        >
                            {TYPES.map((type, key)=>(
                                <Option
                                    key={key}
                                    value={type}
                                >
                                    <FormattedMessage id={`locations.${type}`}/>
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div
                        style={{
                            margin: '12px 0 0 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <FormattedMessage id='locations.volume'/>: 
                            <InputNumber
                                value={volume}
                                style={{margin: '0 0 0 12px'}}
                                min={0}
                                step={1}
                                onChange={(value)=>{
                                    this.setState({
                                        volume: value
                                    })
                                }}
                            />
                        </div>
                        <div>
                            <FormattedMessage id='storage.price'/>: 
                            <InputNumber
                                value={price}
                                style={{margin: '0 0 0 12px'}}
                                min={0}
                                onChange={(value)=>{
                                    this.setState({
                                        price: value
                                    })
                                }}
                            />
                        </div>
                    </div>
                    
                </div>
            </Modal>
            </>
        );
    }
}