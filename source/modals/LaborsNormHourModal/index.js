import React, { Component } from 'react';
import { Button, Modal, Icon, Input, Table, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { permissions, isForbidden } from "utils";
// own
import Styles from './styles.m.css';
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class LaborsNormHourModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            fetched: false,
            filterValue: undefined,
        };

        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.service_type" />,
                key:       'kortext',
                dataIndex: 'kortext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  () => (
                            <div>
                                <FormattedMessage id="services_table.service_type" />
                                <Input
                                    value={this.state.filterValue}
                                    placeholder={this.props.intl.formatMessage({id: 'services_table.service_type'})}
                                    onChange={(event)=>{
                                        this.setState({
                                            filterValue: event.target.value
                                        })
                                    }}
                                />
                            </div>
                        ),
                key:       'itemmptext',
                dataIndex: 'itemmptext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'qualcoltext',
                dataIndex: 'qualcoltext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {data} <FormattedMessage id="cur" />
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.norm_hours" />,
                key:       'worktime',
                dataIndex: 'worktime',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {data} <FormattedMessage id="order_form_table.hours_short" />
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="sum" />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {Math.round((elem.price*elem.worktime)*10)/10} <FormattedMessage id="cur" />
                        </span>
                    )
                }
            },
            {
                key:       'select',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.worktime);
                                this.handleCancel();
                            }}
                        >
                            <FormattedMessage id="select" />
                        </Button>
                    )
                }
            }
        ]
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/labor_times?modificationId=${this.props.tecdocId}&storeGroupId=${this.props.storeGroupId}`;
        url += params;
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
            data.laborTimes.map((elem, i)=>{
                elem.key = i;
                elem.price = data.priceOfNormHour;
                elem.worktime = Math.ceil((elem.worktime)*10)/10;
            });
            that.setState({
                dataSource: data.laborTimes,
                fetched: true,
            });

        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                fetched: true,
            });
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    componentDidUpdate() {
        if(!this.state.fetched && this.state.visible) {
            this.fetchData();
        } 
    }

    render() { 
        const { hours } = this.props;
        const { dataSource, filterValue } = this.state;
        let tblData = [...dataSource];

        if(filterValue) tblData = tblData.filter((elem)=>elem.itemmptext.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 );

        return (
            <>
                <Button
                    disabled={isForbidden(this.props.user, permissions.ACCESS_NORM_HOURS_MODAL_WINDOW)}
                    type={hours ? null : 'primary'}
                    onClick={()=>{
                        this.setState({visible: true})
                    }}
                    title={this.props.intl.formatMessage({id: "labors_table.check_labor_hours"})}
                >
                    { hours ? 
                    <>{hours} <FormattedMessage id="order_form_table.hours_short" /></> :
                    <Icon type="clock-circle" />}
                </Button>
                <Modal
                    width="75%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="services_table.norm_hours" />}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.state.fetched ? 
                        <Table
                            dataSource={tblData}
                            columns={this.columns}
                            pagination={false}
                        />
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </>
    )}
}

export default LaborsNormHourModal;