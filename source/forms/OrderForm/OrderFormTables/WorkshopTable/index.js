// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Select, Popover, Input } from 'antd';
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
                title:     'Расчет',
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
                title:     'Реал.',
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
                title: <FormattedMessage id='order_form_table.status' />,
                key:       'agreement',
                dataIndex: 'agreement',
                 render:    (data, elem) => {
                    const key = elem.key;
                    const confirmed = data.toLowerCase();
                    let color;
                    switch (confirmed) {
                        case 'rejected':
                            color = 'rgb(255, 126, 126)';
                            break;
                        case 'agreed':
                            color = 'var(--green)';
                            break;
                        default:
                            color = null;
                    }

                    return (
                        <Select
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
                            ) }
                            style={ { color: color } }
                            value={ confirmed }
                            onChange={ value => {
                                elem.agreement = value.toUpperCase();
                                //elem.stage = value == 'rejected' ? CANCELED : INACTIVE;
                                this.updateLabor(key, elem);
                            } }
                        >
                            <Option key={ 0 } value={ 'undefined' }>
                                <FormattedMessage id='status.undefined' />
                            </Option>
                            <Option
                                key={ 1 }
                                value={ 'agreed' }
                                style={ { color: 'var(--green)' } }
                            >
                                <FormattedMessage id='status.agreed' />
                            </Option>
                            <Option
                                key={ 2 }
                                value={ 'rejected' }
                                style={ { color: 'rgb(255, 126, 126)' } }
                            >
                                <FormattedMessage id='status.rejected' />
                            </Option>
                        </Select>
                    );
                },
            },
            {
                title:     "Этап",
                key:       'stage',
                dataIndex: 'stage',
            },
            {
                title:      <Popover
                                overlayStyle={{zIndex: 9999}}
                                content={
                                    <LaborStageButtonsGroup
                                        stage={ALL}
                                        onClick={(value)=>{
                                            this.multipleChangeState(value);
                                        }}
                                    />
                                }
                                trigger="click"
                            >
                                <Button
                                    type='primary'
                                    style={{width: '100%', margin: 1}}
                                >
                                    Остальные
                                </Button>
                            </Popover>,
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
                                <p>Расчет</p>
                                <p>Реал.</p>
                            </div>,
                key:       'count',
                dataIndex: 'count',
                render:    (data, row) => {
                    return (
                        <div>
                            <p>{data || 0} <FormattedMessage id='order_form_table.hours_short' /></p>
                            <p>{row.workingTime ? Math.abs(row.workingTime.toFixed(2)) : 0} <FormattedMessage id='order_form_table.hours_short' /></p>
                        </div>
                    );
                },
            },
            {
                title:     "Этап",
                key:       'stage',
                dataIndex: 'stage',
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
        if(this.props.reloadOrderForm) this.props.reloadOrderForm(callback, 'labors');
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

        if (
            !isForbidden(
                this.props.user,
                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
            )
        ) {
            data.services[ 0 ].agreement = labor.agreement;
        }

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
        const { isMobile } = this.props;

        var filteredData = [...dataSource];
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
                        <div style={{width: '74%'}}>
                            <Input
                                allowClear
                                onChange={({target: {value}})=>{
                                    this.setState({
                                        fieldsFilter: value,
                                    })
                                }}
                            />
                        </div>
                        <div style={{width: '25%'}}>
                            <Select
                                allowClear
                                showSearch
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
                                            {value}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>
                }
                <Table
                    style={{overflowX: 'scroll'}}
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
            </Catcher>
        );
    }
}

class LaborStageButtonsGroup extends Component {
    render() {
        const { stage, onClick, buttonStyle, isMobile } = this.props;
        return (
            <div className={Styles.laborStageButtonsGroup} style={!isMobile ? {display: 'flex'} : {}}>
                <Button
                    style={buttonStyle}
                    className={Styles.greenButton}
                    disabled={stage != ALL && (stage == IN_PROGRESS || stage == CANCELED)}
                    onClick={ () => onClick(IN_PROGRESS) }
                >
                    Старт
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.greenButton}
                    disabled={stage != ALL && (stage == INACTIVE || stage == DONE || stage == CANCELED)}
                    onClick={ () => onClick(DONE) }
                >
                    Финиш
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.redButton}
                    type='danger'
                    disabled={stage != ALL && (stage == STOPPED || stage == DONE || stage == CANCELED)}
                    onClick={ () => onClick(STOPPED) }
                >
                    Стоп !!!
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.yellowButton}
                    disabled={stage != ALL && (stage == DONE || stage == CANCELED)}
                    onClick={ () => onClick(CANCELED) }
                >
                    Отмена
                </Button>
            </div>
        )
    }
}