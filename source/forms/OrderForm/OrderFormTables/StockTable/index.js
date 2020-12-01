// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Select, Popover, Input } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { permissions, isForbidden } from 'utils';
import { Catcher } from 'commons';
// own
import Styles from './styles.m.css';
const Option = Select.Option;

const INACTIVE = 'INACTIVE',
      AGREED = 'AGREED',
      ORDERED = 'ORDERED',
      ACCEPTED = 'ACCEPTED',
      RESERVED = 'RESERVED',
      GIVEN = 'GIVEN',
      INSTALLED = 'INSTALLED',
      NO_SPARE_PART = 'NO_SPARE_PART',
      RETURNED = 'RETURNED',
      CANCELED = 'CANCELED',
      ALL = 'ALL';
const stageArr = [INACTIVE, AGREED, ORDERED, ACCEPTED, RESERVED, GIVEN, INSTALLED, NO_SPARE_PART, RETURNED, CANCELED];

@injectIntl
export default class StockTable extends Component {
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
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                key:       'brandName',
                dataIndex: 'brandName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                key:       'detailCode',
                dataIndex: 'detailCode',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.supplier' />,
                key:       'supplierName',
                dataIndex: 'supplierName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='storage.RESERVE' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'reserve',
                render:    elem => {
                    return (
                        <span>{elem.reservedCount || 0} <FormattedMessage id='pc' /></span>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.purchasePrice' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                ) : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.price' />
                        <p style={{
                            color: 'var(--text2)',
                            fontSize: 12,
                            fontWeight: 400,
                        }}>
                            <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                        </p>
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'price',
                dataIndex: 'price',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.count' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'count',
                dataIndex: 'count',
                render:    data => {
                    return (
                        <span>
                            { data
                                ? `${data}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : 0 }{ ' ' }
                            <FormattedMessage id='pc' />
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.status' />,
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
                                this.updateDetail(key, elem);
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
                title:     <FormattedMessage id='order_form_table.stage' />,
                key:       'stage',
                dataIndex: 'stage',
                render:    (data) => {
                    return (
                        <FormattedMessage id={`stock_table.${data}`}/>
                    );
                },
            },
            {
                title:      <Popover
                                overlayStyle={{zIndex: 9999}}
                                content={
                                    <DetailsStageButtonsGroup
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
                                    <FormattedMessage id='order_form_table.other' />
                                </Button>
                            </Popover>,
                key:       'actions',
                dataIndex: 'stage',
                render: (stage, elem)=>{
                    return (
                        <DetailsStageButtonsGroup
                            stage={stage}
                            onClick={(value)=>{
                                elem.stage = value;
                                this.updateDetail(elem.key, elem);
                            }}
                        />
                    )
                }
            },
        ];

        this.mobileColumns = [
            {
                title:      <div>
                                <p><FormattedMessage id='order_form_table.detail_name' /></p>
                                <p><FormattedMessage id='order_form_table.detail_code' /></p>
                            </div>,
                key:       'detailName',
                dataIndex: 'detailName',
                render:    (data, row) => {
                    return (
                        <div>
                            <p>{data}</p>
                            <p>{row.detailCode}</p>
                        </div>
                    );
                },
            },
            {
                title:     <div>
                                <p><FormattedMessage id='order_form_table.brand' /></p>
                                <p><FormattedMessage id='order_form_table.stage' /></p>
                            </div>,
                key:       'brandName',
                dataIndex: 'brandName',
                render:    (data, row) => {
                    return (
                        <div>
                            <p>{data || <FormattedMessage id='long_dash' />}</p>
                            <p><FormattedMessage id={`stock_table.${row.stage}`}/></p>
                        </div>
                    );
                },
            },
            {
                key:       'actions',
                dataIndex: 'stage',
                render: (stage, elem)=>{
                    return (
                        <div>
                            <Button
                                style={{width: '100%', margin: 1}}
                                className={Styles.greenButton}
                                disabled={!(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                                onClick={ () => {
                                    elem.stage = INSTALLED;
                                    this.updateDetail(elem.key, elem);
                                } }
                            >
                                <FormattedMessage id='stock_table.button.install' />
                            </Button>
                            <Button
                                style={{width: '100%', margin: 1}}
                                className={Styles.redButton}
                                disabled={!(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                                onClick={ () => {
                                    elem.stage = NO_SPARE_PART;
                                    this.updateDetail(elem.key, elem);
                                } }
                            >
                                <FormattedMessage id='stock_table.button.no_spare_part' />
                            </Button>
                            <Popover
                                overlayStyle={{zIndex: 9999}}
                                content={
                                    <DetailsStageButtonsGroup
                                        stage={stage}
                                        onClick={(value)=>{
                                            elem.stage = value;
                                            this.updateDetail(elem.key, elem);
                                        }}
                                    />
                                }
                                trigger="click"
                            >
                                <Button
                                    type='primary'
                                    style={{width: '100%', margin: 1}}
                                >
                                    <FormattedMessage id='order_form_table.other' />
                                </Button>
                            </Popover>
                        </div>
                    )
                }
            },
        ];
    }

    async multipleChangeState(value) {
        const {selectedRows, dataSource} = this.state;
        const data = {
            updateMode: true,
            details:   [],
        };

       selectedRows.map((key)=>{
            dataSource[key].stage == value;
            data.details.push(
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
            data.orderDetails.map((elem, index) => {
                elem.key = index;
            });
            this.setState({
                dataSource: data.orderDetails,
                fetched: true,
            });
        }

        if(this.props.reloadOrderForm) this.props.reloadOrderForm(callback, 'details');
        else {
            let token = localStorage.getItem('_my.carbook.pro_token');
            let url = __API_URL__ + `/orders/${this.props.orderId}/details`;
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
                    dataSource: result.details,
                })
            } catch (error) {
                console.error('ERROR:', error);
            }
        }
    }

    async updateDetail(key, detail) {
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

        if (
            !isForbidden(
                this.props.user,
                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
            )
        ) {
            data.details[ 0 ].agreement = detail.agreement;
        }

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
                String(elem.detailName).toLowerCase().includes(fieldsFilter.toLowerCase()) ||
                String(elem.brandName).toLowerCase().includes(fieldsFilter.toLowerCase()) ||
                String(elem.detailCode).toLowerCase().includes(fieldsFilter.toLowerCase()) ||
                String(elem.supplierName).toLowerCase().includes(fieldsFilter.toLowerCase())
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
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.fields_filter'})}
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
                                            <FormattedMessage id={`stock_table.${value}`}/>
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

class DetailsStageButtonsGroup extends Component {
    render() {
        const { stage, onClick } = this.props;
        return (
            <div className={Styles.detailStageButtonsGroup}>
                <div className={Styles.buttonsRow}>
                    <Button
                        type='primary'
                        disabled={stage != ALL && !(stage == INACTIVE || stage == NO_SPARE_PART)}
                        onClick={ () => onClick(AGREED) }
                    >
                        <FormattedMessage id='stock_table.button.agree' />
                    </Button>
                    <Button
                        type='primary'
                        disabled={stage != ALL && !(stage == AGREED || stage == NO_SPARE_PART)}
                        onClick={ () => onClick(ORDERED) }
                    >
                        <FormattedMessage id='stock_table.button.order' />
                    </Button>
                    <Button
                        type='primary'
                        disabled={stage != ALL && !(stage == AGREED || stage == NO_SPARE_PART || stage == ORDERED)}
                        onClick={ () => onClick(ACCEPTED) }
                    >
                        <FormattedMessage id='stock_table.button.accept' />
                    </Button>
                </div>
                <div className={Styles.buttonsRow}>
                    <Button
                        className={Styles.greenButton}
                        disabled={stage != ALL && !(stage == AGREED || stage == NO_SPARE_PART || stage == ORDERED || stage == ACCEPTED)}
                        onClick={ () => onClick(RESERVED) }
                    >
                        <FormattedMessage id='stock_table.button.reserve' />
                    </Button>
                    <Button
                        className={Styles.greenButton}
                        disabled={stage != ALL && !(stage == INACTIVE || stage == AGREED || stage == NO_SPARE_PART || stage == RESERVED || stage == ORDERED || stage == ACCEPTED)}
                        onClick={ () => onClick(GIVEN) }
                    >
                        <FormattedMessage id='stock_table.button.get' />
                    </Button>
                    <Button
                        className={Styles.greenButton}
                        disabled={stage != ALL && !(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                        onClick={ () => onClick(INSTALLED) }
                    >
                        <FormattedMessage id='stock_table.button.install' />
                    </Button>
                </div>
                <div className={Styles.buttonsRow}>
                    <Button
                        className={Styles.redButton}
                        disabled={stage != ALL && !(stage == INACTIVE || stage == AGREED || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                        onClick={ () => onClick(NO_SPARE_PART) }
                    >
                        <FormattedMessage id='stock_table.button.no_spare_part' />
                    </Button>
                    <Button
                        className={Styles.yellowButton}
                        disabled={stage != ALL && !(stage == GIVEN || stage == CANCELED)}
                        onClick={ () => onClick(RETURNED) }
                    >
                        <FormattedMessage id='stock_table.button.return' />
                    </Button>
                    <Button
                        className={Styles.yellowButton}
                        onClick={ () => onClick(CANCELED) }
                    >
                        <FormattedMessage id='stock_table.button.cancel' />
                    </Button>
                </div>
            </div>
        )
    }
}