// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification, InputNumber, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'tireFitting';
import { permissions, isForbidden } from 'utils';
import { fetchVehicleTypes } from 'core/vehicleTypes/duck';

// own
const Option = Select.Option;

const mapStateToProps = state => {
    return {
        user: state.auth,
        vehicleTypes: state.vehicleTypes.vehicleTypes,
    };
};

const mapDispatchToProps = {
    fetchVehicleTypes,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleTypesPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
        }

        this.fetchData = this.fetchData.bind(this);

        this.columns = [
            {
                title:      <FormattedMessage id='tire.name'/>,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
            },
            {
                title:     <FormattedMessage id='tire.minRadius'/>,
                key:       'minRadius',
                dataIndex: 'minRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={0}
                            max={Number(elem.maxRadius)}
                            value={Math.round(data)}
                            onChange={(value)=>{
                                elem.minRadius = value || 0;
                                this.updateType(elem);
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='tire.maxRadius'/>,
                key:       'maxRadius',
                dataIndex: 'maxRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={Number(elem.minRadius)}
                            value={Math.round(data)}
                            onChange={(value)=>{
                                elem.maxRadius = value || 0;
                                this.updateType(elem);
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='tire.defaultRadius'/>,
                key:       'defaultRadius',
                dataIndex: 'defaultRadius',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            min={Number(elem.minRadius)}
                            max={Number(elem.maxRadius)}
                            value={Math.round(data)}
                            onChange={(value)=>{
                                elem.defaultRadius = value || 0;
                                this.updateType(elem);
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='supplier.show'/>,
                key:       'visible',
                dataIndex: 'visible',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <Switch
                            checked={data}
                            onChange={(checked)=>{
                                elem.visible = checked;
                                this.updateType(elem);
                            }}
                        />
                    )
                }
            },
            {
                key:       'undo',
                width:     'auto',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='undo'
                            style={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD) ? {
                                fontSize: 18,
                                color: 'var(--text2)',
                                pointerEvents: 'none',
                            } : {
                                fontSize: 18
                            }}
                            onClick={()=>{
                                if(!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD))
                                    this.deleteType(elem.id)
                            }}
                        />
                    )
                }
            },
        ]
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/vehicle_types';
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
            that.setState({
                dataSource: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    updateType({id, visible, minRadius, maxRadius, defaultRadius}) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/vehicle_types?id=${id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify([{
                id,
                visible,
                minRadius,
                maxRadius,
                defaultRadius,
            }])
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
            that.fetchData()
        })
        .catch(function (error) {
            console.log('error', error);
            notification.error({
                message: 'Error!',
            });
        });
    }

    deleteType(id) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/vehicle_types?ids=[${id}]`;
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
            that.fetchData()
        })
        .catch(function (error) {
            console.log('error', error);
            notification.error({
                message: 'Error!',
            });
        });
    }

    componentDidMount() {
        this.fetchData()
        //this.props.fetchVehicleTypes();
        
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.vehicle_types' /> }
                controls={
                    <div>

                    </div>
                }
            >
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </Layout>
        );
    }
}