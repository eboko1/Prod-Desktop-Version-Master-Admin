// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, InputNumber, Checkbox, Table, notification, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import book from 'routes/book';
import { SingleDatePicker } from 'components';
import { VehicleLocationModal, LocationHistoryModal } from 'modals';
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const   WORK_POST = 'WORK_POST',
        INTERNAL_PARKING = 'INTERNAL_PARKING', 
        EXTERNAL_PARKING = 'EXTERNAL_PARKING', 
        OTHER = 'OTHER';
const TYPES = [WORK_POST, INTERNAL_PARKING, EXTERNAL_PARKING, OTHER];

export default class LocationsPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            dataSource: [],
            includeExternal: true,
            historyModalVisible: false,
            actionModalVisible: false,
            modalLocation: undefined,
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
                title:      <FormattedMessage id='location'/>,
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
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='locations.count' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'usedCount',
                dataIndex: 'usedCount',
                width:     'auto',
                render: (data, row)=>{
                    return (
                        <Link
                            className={Styles.countLink}
                            to={ {
                                pathname: book.locationsVehicles,
                                state:    {locationId: row.id},
                            } }
                        >
                            {data || 0}
                        </Link>
                        
                    )
                }
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='locations.volume' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'volume',
                dataIndex: 'volume',
                width:     'auto',
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='locations.percent' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'percent',
                width:     'auto',
                render:    (row)=>{
                    const percent = (row.usedCount || 0) / row.volume;
                    return (
                        Math.round(percent*100) + '%'
                    )
                }
            },
            {
                key:       'accept',
                width:     'min-content',
                render: (data)=>{
                    return (
                        <Button
                            type={'primary'}
                            onClick={()=>{
                                this.setState({
                                    actionModalVisible: true,
                                    modalLocation: data.id,
                                })
                            }}
                        >
                            <FormattedMessage id='locations.accept'/>
                        </Button>
                    )
                }
            },
            {
                key:       'history',
                width:     'min-content',
                render: (data)=>{
                    return (
                        <Button
                            type={'primary'}
                            onClick={()=>{
                                this.setState({
                                    historyModalVisible: true,
                                    modalLocation: data.id,
                                })
                            }}
                        >
                            <FormattedMessage id='locations.history'/>
                        </Button>
                    )
                }
            },
        ];
    }

    getLocations() {
        this.setState({loading: true})
        const { toDatetime } = this.state;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations?toDatetime=${toDatetime.format('YYYY-MM-DD')}`;
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
                dataSource: data,
                loading: false,
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
        const { dataSource, loading, includeExternal, historyModalVisible, actionModalVisible, modalLocation, toDatetime } = this.state;
        let totalCount = 0, totalVolume = 0;
        dataSource.map((elem)=>{
            if(includeExternal || elem.type != EXTERNAL_PARKING) {
                totalCount += (elem.usedCount || 0);
                totalVolume += elem.volume;
            }
        })
        return (
            <Layout
                title={ <FormattedMessage id='navigation.locations' /> }
                controls={
                    <div>
                        <SingleDatePicker
                            date={toDatetime}
                            onDateChange={async (date)=>{
                                await this.setState({
                                    toDatetime: date,
                                });
                                this.getLocations();
                            }}
                            style={{margin: '0 8px'}}
                        />
                    </div>
                }
            >
                <div className={Styles.header}>
                    <div className={Styles.headerBlock}>
                        <FormattedMessage id='locations.include_external_locations'/>
                        <div>
                            <Checkbox
                                checked={includeExternal}
                                style={{margin: '0 0 0 8px'}}
                                onChange={({target})=>{
                                    this.setState({
                                        includeExternal: target.checked,
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <div className={Styles.headerBlock}>
                        <FormattedMessage id='locations.total_count'/>
                        <div>
                            <Link
                                className={Styles.countLink}
                                to={ {
                                    pathname: book.locationsVehicles,
                                } }
                            >
                                {totalCount}
                            </Link>
                            
                        </div>
                    </div>
                    <div className={Styles.headerBlock}>
                        <FormattedMessage id='locations.total_volume'/>
                        <div>
                            {totalVolume}
                        </div>
                    </div>
                    <div className={Styles.headerBlock}>
                        <FormattedMessage id='locations.percent'/>
                        <div>
                            {Math.round(totalCount*100/totalVolume)}%
                        </div>
                    </div>
                </div>
                <Table
                    loading={ loading }
                    columns={ this.columns }
                    dataSource={ dataSource }
                    pagination={ false }
                    rowClassName={(row) => !includeExternal && row.type == EXTERNAL_PARKING ? Styles.disabledRow : null}
                    style={{padding: 12}}
                />
                <VehicleLocationModal
                    modalVisible={actionModalVisible}
                    receiveMode
                    selectedLocation={modalLocation}
                    onConfirm={()=>this.getLocations()}
                    hideModal={()=>{
                        this.setState({
                            actionModalVisible: false,
                            modalLocation: undefined
                        })
                    }}
                />
                <LocationHistoryModal
                    visible={historyModalVisible}
                    selectedLocation={modalLocation}
                    hideModal={()=>{
                        this.setState({
                            historyModalVisible: false,
                            modalLocation: undefined
                        })
                    }}
                />
            </Layout>
        );
    }
}