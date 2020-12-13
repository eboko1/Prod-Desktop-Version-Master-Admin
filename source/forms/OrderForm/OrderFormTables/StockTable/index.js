// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table, Select, Popover, Input, notification, Modal } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { permissions, isForbidden } from 'utils';
import { Catcher } from 'commons';
// own
import Styles from './styles.m.css';
const { confirm, warning } = Modal;
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
            reserveWarehouseId: undefined,
            mainWarehouseId: undefined,
        };

        this.updateDetail = this.updateDetail.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.orderOrAcceptDetails = this.orderOrAcceptDetails.bind(this);

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
                                        onClick={(stage)=>{
                                            this.multipleChangeState(stage);
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
                            agreedAction={(value)=>{
                                elem.agreement=value,
                                this.updateDetail(elem.key, elem);
                            }}
                            detail={elem}
                            updateDetail={this.updateDetail}
                            mainWarehouseId={this.state.mainWarehouseId}
                            reserveWarehouseId={this.state.reserveWarehouseId}
                            orderOrAcceptDetails={this.orderOrAcceptDetails}
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
                        <DetailsStageButtonsGroup
                            stage={stage}
                            isMobile
                            detail={elem}
                            updateDetail={this.updateDetail}
                            mainWarehouseId={this.state.mainWarehouseId}
                            reserveWarehouseId={this.state.reserveWarehouseId}
                            onClick={(value)=>{
                                elem.stage = value;
                                this.updateDetail(elem.key, elem);
                            }}
                        />
                    )
                }
            },
        ];
    }

    async multipleChangeState(stage) {
        const {selectedRows, dataSource} = this.state;
        const data = {
            updateMode: true,
            details:   [],
        };

        const toReserve = [], toUnreserve = [];

       selectedRows.map((key)=>{
            dataSource[key].stage == stage || dataSource[key].stage;
            data.details.push(
                {
                    id: dataSource[key].id,
                    stage: stage,
                },
            );
            if(stage == RESERVED || stage == GIVEN) {
                toReserve.push(dataSource[key].id);
            }
            if(stage == CANCELED || stage == RETURNED) {
                toUnreserve.push(dataSource[key].id);
            }
        });
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

        if(toReserve.length) {
            url = __API_URL__ + `/store_docs/reserve_all_possible?ordersAppurtenanciesIds=[${toReserve}]`;
            try {
                const response = await fetch(url, {
                    method:  'POST',
                    headers: {
                        Authorization:  token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                this.updateDataSource();
            } catch (error) {
                console.error('ERROR:', error);
            }
        }
        if(toUnreserve.length) {
            url = __API_URL__ + `/store_docs/unreserve_all_possible?ordersAppurtenanciesIds=[${toUnreserve}]`;
            try {
                const response = await fetch(url, {
                    method:  'POST',
                    headers: {
                        Authorization:  token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                this.updateDataSource();
            } catch (error) {
                console.error('ERROR:', error);
            }
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

    orderOrAcceptDetails(supplierId, supplierName, stage, operation) {
        const { orderId, intl:{formatMessage} } = this.props;
        const { dataSource, mainWarehouseId } = this.state;
        const { updateDataSource } = this;
        const resultData = {
            updateMode: true,
            details:   [],
        };

        const orderData = {
            status: "DONE",
            context: "ORDER",
            type: operation == 'ORDER' ? "INCOME" : "EXPENSE",
            documentType: "SUPPLIER",
            supplierDocNumber: orderId,
            payUntilDatetime: null,
            docProducts:[],
            orderId: orderId,
            warehouseId: mainWarehouseId,
            counterpartBusinessSupplierId: supplierId,
        };

        dataSource.map((elem)=>{
            if(elem.supplierId == supplierId) {
                resultData.details.push({
                    id: elem.id,
                    stage: stage,
                });
                if(elem.productId) {
                    orderData.docProducts.push({
                        productId: elem.productId,
                        quantity: elem.count,
                        stockPrice: elem.purchasePrice,
                    })
                } else {
                    orderData.docProducts.push({
                        addToStore: true,
                        groupId: elem.storeGroupId,
                        code: elem.detailCode,
                        name: elem.detailName || elem.detailCode,
                        brandId: elem.supplierBrandId,
                        quantity: elem.quantity || 1,
                        stockPrice: elem.purchasePrice,
                    })
                }
            }
        })

        console.log(orderData);

        confirm({
            title: operation == 'ORDER' ? 
                    `${formatMessage({id: 'stock_table.create_order_to_supplier'}, {name: supplierName})}` :
                    `${formatMessage({id: 'stock_table.create_order_income'}, {name: supplierName})}`,
            content: ``,
            async onOk() {
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + `/orders/${orderId}`;
                try {
                    const response = await fetch(url, {
                        method:  'PUT',
                        headers: {
                            Authorization:  token,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(resultData),
                    });
                    const result = await response.json();
                    if (result.success) {
                        
                    } else {
                        console.log('BAD', result);
                    }
                    updateDataSource();
                } catch (error) {
                    console.error('ERROR:', error);
                    updateDataSource();
                }

                url = __API_URL__ + `/store_docs`;
                try {
                    const response = await fetch(url, {
                        method:  'POST',
                        headers: {
                            Authorization:  token,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderData),
                    });
                    const result = await response.json();
                } catch (error) {
                    console.error('ERROR:', error);
                }
            },
            onCancel() {

            }
        });
    }

    async updateDetail(key, detail) {
        this.state.dataSource[ key ] = detail;
        const data = {
            updateMode: true,
            details:   [
                {
                    id: detail.id,
                    stage: detail.stage,
                    reservedCount: detail.reservedCount,
                    reserved: detail.reserved,
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

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/warehouses`;
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
            const warehousesData = {};
            data.map((warehouse)=>{
                if(warehouse.attribute == 'MAIN') {
                    warehousesData.main = warehouse.id;
                }
                if(warehouse.attribute == 'RESERVE') {
                    warehousesData.reserve = warehouse.id;
                }
            })
            that.setState({
                mainWarehouseId: warehousesData.main,
                reserveWarehouseId: warehousesData.reserve,
                fetched: true,
            })
        })
        .catch(function(error) {
            console.log('error', error);
        });
    }

    componentDidMount() {
        this.fetchData();
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
            </Catcher>
        );
    }
}

@injectIntl
class DetailsStageButtonsGroup extends Component {
    getStoreProduct = (detailCode, brandId) => {
        const { detail, updateDetail } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_products?all=true`;
        fetch(url, {
            method: "GET",
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

            const product = data.list.find((product)=>product.code == detailCode && product.brandId == brandId);
            if(product) {
                detail.productId = product.id;
                detail.defaultWarehouseId = product.defaultWarehouseId;
                updateDetail(detail.key, detail);
            }
        })
        .catch(function(error) {
            console.log("error", error);
            that.setState({
                fetched: true,
                codeFilter: that.props.codeFilter,
            })
        });
    }

    reserveProduct = (stage) => {
        const { detail, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, intl:{formatMessage} } = this.props;
        if(detail.reserved) {
            detail.stage = stage;
            updateDetail(detail.key, detail);
            return;
        }
        const data = {
            status: "DONE",
            documentType: "TRANSFER",
            type: "EXPENSE",
            supplierDocNumber: orderId,
            payUntilDatetime: null,
            docProducts:[
                {
                    productId: detail.productId,
                    quantity: detail.count,
                    stockPrice: detail.purchasePrice || 0,
                }
            ],
            warehouseId: detail.reservedFromWarehouseId || mainWarehouseId,
            counterpartWarehouseId: reserveWarehouseId,
            orderId: orderId,
        };
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs`;
        fetch(url, {
            method:  'POST',
            headers: {
                Authorization: token,
            },
            body: JSON.stringify(data),
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
        .then(function(response) {
            if(response.created) {
                notification.success({
                    message: formatMessage({id: 'storage_document.notification.reserved'}, {count: data.docProducts[0].quantity}),
                    description: `${formatMessage({id: 'storage'})} ${detail.reservedFromWarehouseName}`,
                });
                detail.reservedCount = detail.count;
                detail.reserved = true;
                detail.stage = stage;
                updateDetail(detail.key, detail);
            }
            else {
                const availableCount = response.notAvailableProducts[0].available,
                      reservedCount = response.notAvailableProducts[0].reservedCount;
                confirm({
                    title: `${formatMessage({id: 'storage_document.error.available'})}. ${formatMessage({id: 'storage_document.warning.continue'})}`,
                    content: `${formatMessage({id: 'storage_document.notification.available_from_warehouse'}, {name: detail.reservedFromWarehouseName})}: ${availableCount} / ${availableCount - reservedCount} ${formatMessage({id: 'pc'})}`,
                    okButtonProps: {disabled: !availableCount},
                    onOk() {
                        data.docProducts[0].quantity = availableCount - reservedCount;
                        fetch(url, {
                            method:  'POST',
                            headers: {
                                Authorization: token,
                            },
                            body: JSON.stringify(data),
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
                        .then(function(response) {
                            if(response.created) {
                                detail.reservedCount = availableCount - reservedCount;
                                detail.reserved = true;
                                updateDetail(detail.key, detail);
                                notification.success({
                                    message: `Зарезервировано ${data.docProducts[0].quantity} товаров со склада ${detail.reservedFromWarehouseName}`,
                                });
                            }
                        })
                        .catch(function(error) {
                            console.log('error', error);
                        });
                    },
                });
            }
        })
        .catch(function(error) {
            console.log('error', error);
        });
    }

    unreserveProduct = (stage) => {
        const { detail, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, intl:{formatMessage} } = this.props;
        if(!detail.reserved) {
            detail.stage = stage;
            updateDetail(detail.key, detail);
            return;
        }
        const data = {
            status: "DONE",
            documentType: "TRANSFER",
            type: "EXPENSE",
            supplierDocNumber: orderId,
            payUntilDatetime: null,
            docProducts:[
                {
                    productId: detail.productId,
                    quantity: detail.reservedCount,
                    stockPrice: detail.purchasePrice || 0,
                }
            ],
            warehouseId: reserveWarehouseId,
            counterpartWarehouseId: detail.reservedFromWarehouseId || mainWarehouseId,
            orderId: orderId,
        };
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs`;
        fetch(url, {
            method:  'POST',
            headers: {
                Authorization: token,
            },
            body: JSON.stringify(data),
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
        .then(function(response) {
            if(response.created) {
                notification.success({
                    message: formatMessage({id: 'storage_document.notification.reserve_canceled'}),
                    description: `${formatMessage({id: 'storage'})} ${detail.reservedFromWarehouseName}`,
                });
                detail.reservedCount = 0;
                detail.reserved = false;
                detail.stage = stage;
                updateDetail(detail.key, detail);
            }
        })
        .catch(function(error) {
            console.log('error', error);
        });
    }

    addProduct = () => {
        const { detail, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, intl:{formatMessage} } = this.props;
        console.log(detail)
        var that = this;
        confirm({
            title: formatMessage({id: 'storage_document.error.product_not_found'}),
            onOk() {
                const postData = {
                    name: detail.detailName,
                    groupId: detail.storeGroupId,
                    code: detail.detailCode,
                    brandId: detail.brandId || detail.supplierBrandId,
                    measureUnit: 'PIECE',
                    defaultWarehouseId: mainWarehouseId,
                }
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + `/store_products`;
                fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                    },
                    body: JSON.stringify(postData)
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
                    if(data.created) {
                        updateDetail(detail.key, {...detail, productId: data.id});
                    }
                    
                })
                .catch(function(error) {
                    console.log("error", error);
                    that.getStoreProduct(detail.detailCode, detail.brandId);
                });
            }
        });
    }

    render() {
        const { stage, onClick, agreedAction, detail, updateDetail, orderOrAcceptDetails, isMobile } = this.props;
        return (
            !isMobile ?
                <div className={Styles.detailStageButtonsGroup}>
                    <div className={Styles.buttonsRow}>
                        <Button
                            className={Styles.greenButton}
                            disabled={stage != ALL && !(stage == INACTIVE || stage == NO_SPARE_PART)}
                            onClick={ () => {
                                if(stage != ALL) agreedAction('AGREED');
                                else onClick(undefined, 'AGREED');
                            } }
                        >
                            <FormattedMessage id='stock_table.button.agree' />
                        </Button>
                        <Button
                            className={Styles.greenButton}
                            disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                            onClick={ () => {
                                if(stage != ALL) {
                                    detail.stage = INSTALLED;
                                    updateDetail(detail.key, detail);
                                } else {
                                    onClick(INSTALLED);
                                }
                            } }
                        >
                            <FormattedMessage id='stock_table.button.install' />
                        </Button>
                    </div>
                    <div className={Styles.buttonsRow}>
                        <Button
                            className={Styles.greenButton}
                            disabled={detail && detail.reserved || (stage != ALL && !(detail.agreement == AGREED && stage == INACTIVE || stage == NO_SPARE_PART || stage == ORDERED || stage == ACCEPTED))}
                            onClick={ () => {
                                if(stage != ALL) {
                                    if(detail.productId) {
                                        this.reserveProduct(RESERVED);
                                    }
                                    else {
                                        this.addProduct();
                                    } 
                                } else {
                                    onClick(RESERVED);
                                }
                            } }
                        >
                            <FormattedMessage id='stock_table.button.reserve' />
                        </Button>
                        <Button
                            className={Styles.redButton}
                            disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                            onClick={ () => {
                                if(stage != ALL) {
                                    detail.stage = NO_SPARE_PART;
                                    updateDetail(detail.key, detail);
                                } else {
                                    onClick(NO_SPARE_PART);
                                }
                            } }
                        >
                            <FormattedMessage id='stock_table.button.no_spare_part' />
                        </Button>
                    </div>
                    <div className={Styles.buttonsRow}>
                        <Popover
                            overlayStyle={{zIndex: 9999}}
                            content={
                                <div className={Styles.popoverBlock}>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage == ALL || detail && detail.supplierId == 0 || !(detail.agreement == AGREED && stage == INACTIVE || stage == NO_SPARE_PART)}
                                        onClick={ () => {
                                            orderOrAcceptDetails(detail.supplierId, detail.supplierName, ORDERED, 'ORDER')
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.order' />
                                    </Button>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage == ALL || detail && detail.supplierId == 0 || !(detail.agreement == AGREED && stage == INACTIVE || stage == NO_SPARE_PART || stage == ORDERED)}
                                        onClick={ () => {
                                            orderOrAcceptDetails(detail.supplierId, detail.supplierName, ACCEPTED, 'ACCEPT')
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.accept' />
                                    </Button>
                                </div>
                            }
                            trigger="click"
                        >
                            <Button
                                type='primary'
                            >
                                <FormattedMessage id='order_tabs.stock' />
                            </Button>
                        </Popover>
                        <Popover
                            overlayStyle={{zIndex: 9999}}
                            content={
                                <div className={Styles.popoverBlock}>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == NO_SPARE_PART || stage == RESERVED || stage == ORDERED || stage == ACCEPTED)}
                                        onClick={ () => {
                                            if(stage != ALL) {
                                                this.reserveProduct(GIVEN);
                                            } else {
                                                onClick(GIVEN);
                                            }
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.get' />
                                    </Button>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage != ALL && !(stage == GIVEN || stage == CANCELED)}
                                        onClick={ () => {
                                            if(stage != ALL) {
                                                this.unreserveProduct(RETURNED);
                                            } else {
                                                onClick(RETURNED);
                                            }
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.return' />
                                    </Button>
                                    <Button
                                        className={Styles.yellowButton}
                                        onClick={ () => {
                                            if(stage != ALL) {
                                                this.unreserveProduct(CANCELED);
                                            } else {
                                                onClick(CANCELED);
                                            }
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.cancel' />
                                    </Button>
                                </div>
                            }
                            trigger="click"
                        >
                            <Button
                                type='primary'
                            >
                                <FormattedMessage id='order_tabs.workshop' />
                            </Button>
                        </Popover>
                    </div>
                </div> : //MOBILE
                <div className={Styles.detailStageButtonsGroup}>
                    <div>
                        <Button
                            className={Styles.greenButton}
                            disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                            onClick={ () => {
                                detail.stage = INSTALLED;
                                updateDetail(detail.key, detail);
                            } }
                            style={{width: '100%'}}
                        >
                            <FormattedMessage id='stock_table.button.install' />
                        </Button>
                    </div>
                    <div>
                        <Button
                            className={Styles.redButton}
                            disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == ORDERED || stage == ACCEPTED || stage == GIVEN || stage == RESERVED)}
                            onClick={ () => {
                                detail.stage = NO_SPARE_PART;
                                updateDetail(detail.key, detail);
                            } }
                            style={{width: '100%'}}
                        >
                            <FormattedMessage id='stock_table.button.no_spare_part' />
                        </Button>
                    </div>
                    <div>
                        <Popover
                            overlayStyle={{zIndex: 9999}}
                            content={
                                <div className={Styles.popoverBlock}>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage != ALL && !(stage == INACTIVE || detail.agreement == AGREED && stage == INACTIVE || stage == NO_SPARE_PART || stage == RESERVED || stage == ORDERED || stage == ACCEPTED)}
                                        onClick={ () => {
                                            this.reserveProduct(GIVEN);
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.get' />
                                    </Button>
                                    <Button
                                        className={Styles.greenButton}
                                        disabled={stage != ALL && !(stage == GIVEN || stage == CANCELED)}
                                        onClick={ () => {
                                            this.unreserveProduct(RETURNED);
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.return' />
                                    </Button>
                                    <Button
                                        className={Styles.yellowButton}
                                        onClick={ () => {
                                            this.unreserveProduct(CANCELED);
                                        } }
                                    >
                                        <FormattedMessage id='stock_table.button.cancel' />
                                    </Button>
                                </div>
                            }
                            trigger="click"
                        >
                            <Button
                                type='primary'
                                style={{width: '100%'}}
                            >
                                <FormattedMessage id='order_tabs.workshop' />
                            </Button>
                        </Popover>
                    </div>
                </div>
        )
    }
}