// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
// own
import Styles from './styles.m.css';

const INACTIVE = 'INACTIVE',
      AGREED = 'AGREED',
      ORDERED = 'ORDERED',
      ACCEPTED = 'ACCEPTED',
      RESERVED = 'RESERVED',
      GIVEN = 'GIVEN',
      INSTALLED = 'INSTALLED',
      NO_SPARE_PART = 'NO_SPARE_PART',
      RETURNED = 'RETURNED',
      CANCELED = 'CANCELED';

export default class StockTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dataSource: [],
        };

        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                key:       'brandName',
                dataIndex: 'brandName',
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                key:       'detailCode',
                dataIndex: 'detailCode',
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'count',
                dataIndex: 'count',
                render:    data => {
                    return (
                        <span>
                            {data || 0} <FormattedMessage id='pc' />
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.status' />,
                key:       'stage',
                dataIndex: 'stage',
            },
            {
                key:       'actions',
                dataIndex: 'stage',
                render: (stage, elem)=>{
                    return (
                        <DetailsStageButtonsGroup
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

    updateDataSource() {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }
        const callback = (data) => {
            data.orderDetails.map((elem, index) => {
                elem.key = index;
            });
            this.setState({
                dataSource: data.orderDetails,
                fetched: true,
            });
        }
        this.props.reloadOrderForm(callback, 'details');
    }

    async updateLabor(key, detail) {
        this.state.dataSource[ key ] = detail;
        const data = {
            updateMode: true,
            details:   [
                {
                    id: detail.id,
                    stage: detail.stage,
                },
            ],
        };

        console.log(data);

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
        let tmp = [ ...this.props.orderDetails ];
        tmp.map((elem, i) => elem.key = i);
        this.setState({
            dataSource: tmp,
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.activeKey != 'stock' && this.props.activeKey == 'stock') {
            let tmp = [ ...this.props.orderDetails ];
            tmp = tmp.filter((elem)=>elem.id)
            tmp.map((elem, i) => elem.key = i);
            this.setState({
                dataSource: tmp,
            });
        }
    }

    render() {
        const { dataSource, loading } = this.state;

        return (
            <Catcher>
                <Table
                    loading={ loading }
                    columns={ this.columns }
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

class DetailsStageButtonsGroup extends Component {
    render() {
        const { stage, onClick } = this.props;
        return (
            <div className={Styles.detailStageButtonsGroup}>
                <div className={Styles.buttonsRow}>
                    <Button
                        type='primary'
                        disabled={stage != INACTIVE}
                        onClick={ () => onClick(AGREED) }
                    >
                        Согласовать
                    </Button>
                    <Button
                        type='primary'
                        disabled={!(stage == AGREED || stage == NO_SPARE_PART)}
                        onClick={ () => onClick(ORDERED) }
                    >
                        Заказать
                    </Button>
                    <Button
                        type='primary'
                        disabled={!(stage == AGREED || stage == NO_SPARE_PART || stage == ORDERED)}
                        onClick={ () => onClick(ACCEPTED) }
                    >
                        Принять
                    </Button>
                </div>
                <div className={Styles.buttonsRow}>
                    <Button
                        className={Styles.greenButton}
                        disabled={!(stage == AGREED || stage == NO_SPARE_PART || stage == ORDERED || stage == ACCEPTED)}
                        onClick={ () => onClick(RESERVED) }
                    >
                        Резерв
                    </Button>
                    <Button
                        className={Styles.greenButton}
                        disabled={!(stage == INACTIVE || stage == AGREED || stage == NO_SPARE_PART || stage == ORDERED || stage == ACCEPTED)}
                        onClick={ () => onClick(GIVEN) }
                    >
                        Получить
                    </Button>
                    <Button
                        className={Styles.greenButton}
                        disabled={!(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                        onClick={ () => onClick(INSTALLED) }
                    >
                        Установить
                    </Button>
                </div>
                <div className={Styles.buttonsRow}>
                    <Button
                        className={Styles.redButton}
                        disabled={!(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                        onClick={ () => onClick(NO_SPARE_PART) }
                    >
                        Нет з/ч
                    </Button>
                    <Button
                        className={Styles.yellowButton}
                        disabled={!(stage == GIVEN || stage == CANCELED)}
                        onClick={ () => onClick(RETURNED) }
                    >
                        Вернуть
                    </Button>
                    <Button
                        className={Styles.yellowButton}
                        onClick={ () => onClick(CANCELED) }
                    >
                        Омена
                    </Button>
                </div>
            </div>
        )
    }
}