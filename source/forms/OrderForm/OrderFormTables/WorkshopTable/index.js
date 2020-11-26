// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Select } from 'antd';
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
      CANCELED = 'CANCELED';

export default class WorkshopTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dataSource: [],
        };

        this.columns = [
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
                title:     "Этап",
                key:       'stage',
                dataIndex: 'stage',
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
                                elem.stage = value == 'rejected' ? CANCELED : INACTIVE;
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
                key:       'actions',
                dataIndex: 'stage',
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
            });
        }
    }

    render() {
        const { dataSource, loading } = this.state;
        const { isMobile } = this.props;

        return (
            <Catcher>
                <Table
                    style={{overflowX: 'scroll'}}
                    loading={ loading }
                    columns={ isMobile ? this.mobileColumns : this.columns }
                    dataSource={ dataSource }
                    pagination={ false }
                    rowClassName={(record)=>{
                        const stage = record.stage;
                        return Styles[stage];
                    }}
                />
            </Catcher>
        );
    }
}

class LaborStageButtonsGroup extends Component {
    render() {
        const { stage, onClick, buttonStyle } = this.props;
        return (
            <div className={Styles.laborStageButtonsGroup}>
                <Button
                    style={buttonStyle}
                    className={Styles.greenButton}
                    disabled={stage == IN_PROGRESS || stage == CANCELED}
                    onClick={ () => onClick(IN_PROGRESS) }
                >
                    Старт
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.greenButton}
                    disabled={stage == INACTIVE || stage == DONE || stage == CANCELED}
                    onClick={ () => onClick(DONE) }
                >
                    Финиш
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.redButton}
                    type='danger'
                    disabled={stage == STOPPED || stage == DONE || stage == CANCELED}
                    onClick={ () => onClick(STOPPED) }
                >
                    Стоп !!!
                </Button>
                <Button
                    style={buttonStyle}
                    className={Styles.yellowButton}
                    disabled={stage == DONE || stage == CANCELED}
                    onClick={ () => onClick(CANCELED) }
                >
                    Отмена
                </Button>
            </div>
        )
    }
}