// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, InputNumber, Table, Select, Popover, Input, notification, Menu, Dropdown } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden } from 'utils';
// own
import Styles from './styles.m.css';
const Option = Select.Option;

const INACTIVE = 'INACTIVE',
      IN_PROGRESS = 'IN_PROGRESS',
      STOPPED = 'STOPPED',
      DONE = 'DONE',
      CANCELED = 'CANCELED',
      ALL = 'ALL';
const stageArr = [INACTIVE, IN_PROGRESS, STOPPED, DONE, CANCELED];

@injectIntl
export default class WorkshopTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dataSource: [],
            stageFilter: undefined,
            fieldsFilter: undefined,
            selectedRows: [],
        };

        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.service_type' />,
                key:       'defaultName',
                dataIndex: 'defaultName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'serviceName',
                dataIndex: 'serviceName',
            },
            {
                title:     <FormattedMessage id='order_form_table.calculation' />,
                key:       'count',
                dataIndex: 'count',
                render:    data => {
                    return (
                        <span>
                            {data || 0} <FormattedMessage id='order_form_table.hours_short' />
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.workingTime' />,
                key:       'workingTime',
                dataIndex: 'workingTime',
                render:    data => {
                    return (
                        <span>
                            {data ? Math.abs(data.toFixed(2)) : 0} <FormattedMessage id='order_form_table.hours_short' />
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.stoppedTime' />,
                key:       'stoppedTime',
                dataIndex: 'stoppedTime',
                render:    data => {
                    return (
                        <span>
                            <span style={{fontWeight: 700}}>{data ? Math.abs(data.toFixed(2)) : 0}</span> <FormattedMessage id='order_form_table.hours_short' />
                        </span>
                    );
                },
            },
            {
                title: <FormattedMessage id='order_form_table.PD' />,
                key:       'agreement',
                dataIndex: 'agreement',
                render:     (data, row) => {
                    const key = row.key;
                    const confirmed = data.toLowerCase();
                    let color, icon;
                    switch (confirmed) {
                        case 'rejected':
                            color = 'rgb(255, 126, 126)';
                            icon = 'close-circle';
                            break;
                        case 'agreed':
                            color = 'var(--green)';
                            icon = 'check-circle';
                            break;
                        default:
                            color = null;
                            icon = 'question-circle';
                    }
                    const updateAgreement = (value) => {
                        row.agreement = value.toUpperCase();
                        this.updateLabor(key, row);
                    }
                    const menu = (
                        <Menu onClick={this.handleMenuClick}>
                            <Menu.Item
                                key="undefined"
                                onClick={()=>{
                                    updateAgreement('undefined')
                                }}
                            >
                                <Icon
                                    type={'question-circle'}
                                    style={{
                                        fontSize: 18,
                                        verticalAlign: 'sub',
                                        marginRight: 8
                                    }}
                                />
                                <FormattedMessage id='agreement.undefined' />
                            </Menu.Item>
                            <Menu.Item
                                key="agreed"
                                style={{color: 'var(--green)'}}
                                onClick={()=>{
                                    updateAgreement('agreed')
                                }}
                            >
                                <Icon
                                    type={'check-circle'}
                                    style={{
                                        fontSize: 18,
                                        verticalAlign: 'sub',
                                        marginRight: 8,
                                    }}
                                />
                                <FormattedMessage id='agreement.agreed' />
                            </Menu.Item>
                            <Menu.Item
                                key="rejected"
                                style={{color: 'rgb(255, 126, 126)'}}
                                onClick={()=>{
                                    updateAgreement('rejected')
                                }}
                            >
                                <Icon
                                    type={'close-circle'}
                                    style={{
                                        fontSize: 18,
                                        marginRight: 8,
                                    }}
                                />
                                <FormattedMessage id='agreement.rejected' />
                            </Menu.Item>
                        </Menu>
                    );
                    return isForbidden(this.props.user, permissions.ACCESS_ORDER_DETAILS_CHANGE_STATUS) ? (
                        <Icon
                            type={icon}
                            style={{
                                fontSize: 24,
                                color,
                            }}
                        />
                    ) : (
                        <div>
                            <Dropdown
                                overlay={menu}
                            >
                                <Icon
                                    type={icon}
                                    style={{
                                        fontSize: 24,
                                        color,
                                    }}
                                />
                            </Dropdown>
                        </div>
                    )
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.status' />,
                key:       'stage',
                dataIndex: 'stage',
                render:    (data) => {
                    return (
                        <FormattedMessage id={`workshop_table.${data}`}/>
                    );
                },
            },
            {
                title:  <LaborStageButtonsGroup
                            stage={ALL}
                            onClick={(value)=>{
                                this.multipleChangeState(value);
                            }}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_ORDER_TABS_WORKSHOP_BUTTONS)}
                        />,                        
                key:       'actions',
                dataIndex: 'stage',
                width: 'fit-content',
                render: (stage, elem)=>{
                    return (
                        <LaborStageButtonsGroup
                            stage={stage}
                            onClick={(value)=>{
                                elem.stage = value;
                                this.updateLabor(elem.key, elem);
                            }}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_ORDER_TABS_WORKSHOP_BUTTONS)}
                        />
                    )
                }
            },
        ];

        this.mobileColumns = [
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'serviceName',
                dataIndex: 'serviceName',
            },
            {
                title:      <div>
                                <p><FormattedMessage id='order_form_table.calculation' /></p>
                                <p><FormattedMessage id='order_form_table.workingTime' /></p>
                                <p><FormattedMessage id='order_form_table.stoppedTime' /></p>
                            </div>,
                key:       'count',
                dataIndex: 'count',
                render:    (data, row) => {
                    return (
                        <div>
                            <p>{data || 0} <FormattedMessage id='order_form_table.hours_short' /></p>
                            <p>{row.workingTime ? Math.abs(row.workingTime.toFixed(2)) : 0} <FormattedMessage id='order_form_table.hours_short' /></p>
                            <span style={{fontWeight: 700}}>{row.stoppedTime ? Math.abs(row.stoppedTime.toFixed(2)) : 0}</span> <FormattedMessage id='order_form_table.hours_short' />
                        </div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.stage' />,
                key:       'stage',
                dataIndex: 'stage',
                render:    (data) => {
                    return (
                        this.props.intl.formatMessage({id: `workshop_table.${data}`}).substring(0, 5) + "."
                    );
                },
            },
            {
                key:       'actions',
                dataIndex: 'stage',
                render: (stage, elem)=>{
                    return (
                        <LaborStageButtonsGroup
                            isMobile
                            buttonStyle={{width: '100%', margin: '1px 0'}}
                            stage={stage}
                            onClick={(value)=>{
                                elem.stage = value;
                                this.updateLabor(elem.key, elem);
                            }}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_ORDER_TABS_WORKSHOP_BUTTONS)}
                        />
                    )
                }
            },
        ];
    }

    async multipleChangeState(value) {
        const {selectedRows, dataSource} = this.state;
        const data = {
            updateMode: true,
            services:   [],
        };

       selectedRows.map((key)=>{
            dataSource[key].stage == value;
            data.services.push(
                {
                    id: dataSource[key].id,
                    stage: value,
                },
            )
        });

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/${this.props.orderId}`;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                
            } else {
                console.log('BAD', result);
            }
            this.updateDataSource();
        } catch (error) {
            console.error('ERROR:', error);
            this.updateDataSource();
        }
    }

    async updateDataSource() {
        const callback = (data) => {
            data.orderServices.map((elem, index) => {
                elem.key = index;
            });
            this.setState({
                dataSource: data.orderServices,
                fetched: true,
            });
        }
        if(this.props.reloadOrderForm) this.props.reloadOrderForm(callback, 'labors', true);
        else {
            let token = localStorage.getItem('_my.carbook.pro_token');
            let url = __API_URL__ + `/orders/${this.props.orderId}/labors`;
            try {
                const response = await fetch(url, {
                    method:  'GET',
                    headers: {
                        Authorization:  token,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                this.setState({
                    dataSource: result.labors,
                })
            } catch (error) {
                console.error('ERROR:', error);
            }
        }
    }

    async updateLabor(key, labor) {
        this.state.dataSource[ key ] = labor;
        const data = {
            updateMode: true,
            services:   [
                {
                    id: labor.id,
                    stage: labor.stage,
                },
            ],
        };

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/${this.props.orderId}`;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                
            } else {
                console.log('BAD', result);
            }
            this.updateDataSource();
        } catch (error) {
            console.error('ERROR:', error);
            this.updateDataSource();
        }
    }

    sendSms() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/${this.props.orderId}/send_message?type=finish_labors`;
        fetch(url, {
            method:  'GET',
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
            notification.success({
                message: that.props.intl.formatMessage({
                    id: `message_sent`,
                }),
            });
        })
        .catch(function(error) {
            console.log('error', error);
        });
    }

    componentDidMount() {
        let tmp = [ ...this.props.orderServices ];
        tmp.map((elem, i) => elem.key = i);
        this.setState({
            dataSource: tmp,
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.activeKey != 'workshop' && this.props.activeKey == 'workshop') {
            let tmp = [ ...this.props.orderServices ];
            tmp = tmp.filter((elem)=>elem.id)
            tmp.map((elem, i) => elem.key = i);
            this.setState({
                dataSource: tmp,
                stageFilter: undefined,
                fieldsFilter: undefined,
                selectedRows: [],
            });
        }
    }

    render() {
        const { dataSource, loading, fieldsFilter, stageFilter } = this.state;
        const { isMobile, user } = this.props;
        var calcTime = 0, realTime = 0, stoppedTime = 0;
        dataSource.map((elem)=>{
            if(elem.count) calcTime += elem.count;
            if(elem.workingTime) realTime += elem.workingTime;
            if(elem.stoppedTime) calcTime += elem.stoppedTime;
        })

        var filteredData = [...dataSource];
        filteredData = filteredData.filter((elem)=>elem.agreement != 'REJECTED');
        if(fieldsFilter) {
            filteredData = dataSource.filter((elem)=>(
                String(elem.serviceName).toLowerCase().includes(fieldsFilter.toLowerCase()) ||
                String(elem.defaultName).toLowerCase().includes(fieldsFilter.toLowerCase())
            ))
        }

        if(stageFilter) {
            filteredData = dataSource.filter((elem)=>(
                elem.stage == stageFilter
            ))
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRowKeys,
                })
            },
        };

        return (
            <Catcher>
                {!isMobile && 
                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '12px 0'}}>
                        <div style={{width: '70%'}}>
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.fields_filter'})}
                                onChange={({target: {value}})=>{
                                    this.setState({
                                        fieldsFilter: value,
                                    })
                                }}
                            />
                        </div>
                        <div style={{width: '20%'}}>
                            <Select
                                allowClear
                                showSearch
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.stage'})}
                                onChange={(value)=>{
                                    this.setState({
                                        stageFilter: value,
                                    })
                                }}
                            >
                                {stageArr.map((value, key)=>{
                                    return (
                                        <Option
                                            value={value}
                                            key={key}
                                        >
                                            <FormattedMessage id={`workshop_table.${value}`}/>
                                        </Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div>
                            <Button
                                type='primary'
                                onClick={ () => {
                                    this.sendSms()
                                } }
                                disabled={isForbidden(user, permissions.ACCESS_ORDER_TABS_WORKSHOP_FINISH)}
                            >
                                <FormattedMessage id="end" />
                            </Button>
                        </div>
                    </div>
                }
                <Table
                    style={isMobile ? {} : {overflowX: 'scroll'}}
                    loading={ loading }
                    columns={ isMobile ? this.mobileColumns : this.columns }
                    dataSource={ filteredData }
                    pagination={ false }
                    rowClassName={(record)=>{
                        const stage = record.stage;
                        return Styles[stage];
                    }}
                    rowSelection={isMobile ? null : rowSelection}
                />
                <div
                    style={isMobile ? 
                        {
                            textAlign: 'end',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '8px 0 0 0',
                        } :
                        {
                            textAlign: 'end',
                        }
                    }
                >
                    <span style={{marginLeft: 24, fontWeight: 500}}>
                        <FormattedMessage id='workshop_table.footer.calculationTime' /> <InputNumber value={calcTime.toFixed(2)} disabled style={{color: 'black', marginLeft: 6}}/>
                    </span>
                    <span style={{marginLeft: 24, fontWeight: 500}}>
                        <FormattedMessage id='workshop_table.footer.realTime' /> <InputNumber value={realTime.toFixed(2)} disabled style={{color: 'black', marginLeft: 6}}/>
                    </span>
                    <span style={{marginLeft: 24, fontWeight: 500}}>
                        <FormattedMessage id='workshop_table.footer.stoppedTime' /> <InputNumber value={stoppedTime.toFixed(2)} disabled style={{color: 'black', marginLeft: 6}}/>
                    </span>
                </div>
            </Catcher>
        );
    }
}

class LaborStageButtonsGroup extends Component {
    render() {
        const { stage, onClick, buttonStyle, isMobile, disabled } = this.props;
        return (
            <div className={Styles.laborStageButtonsGroup} style={!isMobile ? {display: 'flex'} : {}}>
                {stage == CANCELED || stage == DONE ?
                    <Button
                        type='primary'
                        style={{width: '100%'}}
                        onClick={ () => onClick(INACTIVE) }
                    >
                        <FormattedMessage id='workshop_table.button.change' />
                    </Button> :
                    <>
                        <Button
                            style={buttonStyle}
                            className={Styles.greenButton}
                            disabled={disabled || stage != ALL && (stage == IN_PROGRESS || stage == CANCELED)}
                            onClick={ () => onClick(IN_PROGRESS) }
                        >
                            <FormattedMessage id='workshop_table.button.start'/>
                        </Button>
                        <Button
                            style={buttonStyle}
                            className={Styles.greenButton}
                            disabled={disabled || stage != ALL && (stage == INACTIVE || stage == DONE || stage == CANCELED)}
                            onClick={ () => onClick(DONE) }
                        >
                            <FormattedMessage id='workshop_table.button.finish'/>
                        </Button>
                        <Button
                            style={buttonStyle}
                            className={Styles.redButton}
                            type='danger'
                            disabled={disabled || stage != ALL && (stage == STOPPED || stage == DONE || stage == CANCELED)}
                            onClick={ () => onClick(STOPPED) }
                        >
                            <FormattedMessage id='workshop_table.button.stop'/>
                        </Button>
                        <Button
                            style={buttonStyle}
                            className={Styles.yellowButton}
                            disabled={disabled || stage != ALL && (stage == DONE || stage == CANCELED)}
                            onClick={ () => onClick(CANCELED) }
                        >
                            <FormattedMessage id='workshop_table.button.cancel'/>
                        </Button>
                    </>
                }
            </div>
        )
    }
}