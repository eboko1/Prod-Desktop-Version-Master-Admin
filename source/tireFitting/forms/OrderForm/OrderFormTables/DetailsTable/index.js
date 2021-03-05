// vendor
import React, { Component } from 'react';
import {
    Table,
    InputNumber,
    Icon,
    Popconfirm,
    Select,
    Button,
    Input,
    Modal,
    notification,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden, images } from 'utils';
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { DetailProductModal } from 'tireFitting';

// own
import Styles from './styles.m.css';
import { value } from 'numeral';
const Option = Select.Option;
const { confirm, warning } = Modal;

@injectIntl
class DetailsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productModalVisible:  false,
            productModalKey:      0,
            dataSource:           [],
            reserveWarehouseId:   undefined,
            mainWarehouseId:      undefined,
            fetched:              false,
            reserveModalVisible: false,
            reserveModalData: undefined,
        };

        this.storeGroups = [];

        this.updateDetail = this.updateDetail.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);

        this.brands = this.props.allDetails.brands.map(
            ({ supplierId, brandId, brandName }) => (
                <Option value={ String(brandId) } key={ `allBrands-${brandId}` }>
                    { brandName }
                </Option>
            ),
        );

        this.columns = [
            {
                key:       'buttonGroup',
                dataIndex: 'key',
                render:    (data, elem) => {
                    return (
                        <div
                            style={ {
                                display:        'flex',
                                justifyContent: 'space-evenly',
                            } }
                        >
                            <Button
                                type='primary'
                                disabled={
                                    this.props.disabled
                                }
                                onClick={ () => {
                                    this.showDetailProductModal(data);
                                } }
                                title={ this.props.intl.formatMessage({
                                    id: 'details_table.add_edit_button',
                                }) }
                            >
                                <div
                                    style={ {
                                        width:           18,
                                        height:          18,
                                        backgroundColor:
                                            this.props.disabled
                                                ? 'black'
                                                : 'white',
                                        mask:       `url(${images.pistonIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.pistonIcon}) no-repeat center / contain`,
                                    } }
                                ></div>
                            </Button>
                        </div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detail',
                dataIndex: 'detailName',
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
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
                        <FormattedMessage id='order_form_table.sum' />
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
                key:       'sum',
                dataIndex: 'sum',
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
                key:    'delete',
                render: elem => {
                    return (
                        <Popconfirm
                            disabled={ this.props.disabled }
                            title={
                                <FormattedMessage id='add_order_form.delete_confirm' />
                            }
                            onConfirm={ async () => {
                                var that = this;
                                let token = localStorage.getItem(
                                    '_my.carbook.pro_token',
                                );
                                let url = API_URL;
                                let params = `/orders/${this.props.orderId}/details?ids=[${elem.id}]`;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method:  'DELETE',
                                        headers: {
                                            Authorization:  token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        that.updateDataSource();
                                    } else {
                                        console.log('BAD', result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
                            } }
                        >
                            <Icon
                                type='delete'
                                className={
                                    this.props.disabled
                                        ? Styles.disabledIcon
                                        : Styles.deleteIcon
                                }
                            />
                        </Popconfirm>
                    );
                },
            },
        ];
    }

    showDetailProductModal(key) {
        this.setState({
            productModalVisible: true,
            productModalKey:     key,
        });
    }
    hideDetailProductModal() {
        this.setState({
            productModalVisible: false,
        });
    }

    fetchData() {
        this.setState({
            fetched: true,
        })
        this.storeGroups = this.props.details;
    }

    
    updateDataSource = async () => {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }
        const callback = (data) => {
            data.orderDetails.map((elem, index) => {
                elem.key = index;
                elem.brandId = elem.supplierBrandId || undefined;
                elem.brandName = elem.supplierBrandName;
            });
            this.setState({
                dataSource: data.orderDetails,
                fetched: true,
            });
        }
        await this.props.reloadOrderForm(callback, 'details');
        await this.setState({
            fetched: true,
        });
    }

    async updateDetail(key, detail) {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }

        this.state.dataSource[ key ] = detail;
        const newDetail = 
        {
            id:              detail.id,
            storeGroupId:    detail.storeGroupId,
            name:            detail.detailName,
            count:   detail.count,
            price:   detail.price ? Math.round(detail.price * 10) / 10 : 1,
        }
        const data = {
            updateMode: true,
            details:    [
                newDetail,
            ],
        };

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
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
                this.updateDataSource();
            } else {
                console.log('BAD', result);
            }
        } catch (error) {
            console.error('ERROR:', error);
            this.updateDataSource();
        }
        
        this.setState({
            update: true,
        });
    }

    componentDidMount() {
        this.fetchData();
        let tmp = [ ...this.props.orderDetails ];
        tmp.map((elem, i) => {
            elem.key = i;
            elem.brandId = elem.supplierBrandId || undefined;
            elem.brandName = elem.supplierBrandName;
        });
        this.setState({
            dataSource: tmp,
        });
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.showOilModal && this.props.showOilModal) {
            this.setState({
                productModalVisible: true,
                productModalKey: this.state.dataSource.length ? this.state.dataSource.length-1 : 0,
            })
        }
        if(
            prevProps.activeKey != 'details' && this.props.activeKey == 'details' ||
            prevProps.orderDetails != this.props.orderDetails
        ) {
            let tmp = [ ...this.props.orderDetails ];
            tmp.map((elem, i) => {
                elem.key = i;
                elem.brandId = elem.supplierBrandId || undefined;
                elem.brandName = elem.supplierBrandName;
            });
            this.setState({
                dataSource: tmp,
            });
        }
    }

    render() {
        const {
            orderFetching,
            detailsSuggestionsFetching,
            suggestionsFetching,
            labors,
            detailsTreeData,
            user,
            tecdocId,
            orderId,
            allDetails,
            clientVehicleVin,
            showOilModal,
            oilModalData,
            clearOilData,
            isMobile,
        } = this.props;
        const { fetched, dataSource, productModalVisible, productModalKey } = this.state;

        const columns = !isMobile ? this.columns : this.columns.filter(({key})=>key != "delete" && key != "buttonGroup");
        if ( 
            !isMobile && (
                dataSource.length == 0 ||
                dataSource[ dataSource.length - 1 ].detailName != undefined
            )
        ) {
            dataSource.push({
                key:          dataSource.length,
                id:           undefined,
                storeGroupId: undefined,
                detailId:     undefined,
                detailName:   undefined,
                count:         0,
                price:         0,
                sum:           0,
            });
        }

        return (
            <Catcher>
                <Table
                    className={ Styles.detailsTable }
                    loading={
                        detailsSuggestionsFetching ||
                        suggestionsFetching ||
                        !fetched
                    }
                    columns={ columns }
                    dataSource={ dataSource }
                    pagination={ false }
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                isMobile && this.showDetailProductModal(rowIndex);
                            },
                            onDoubleClick: event => {},
                        };
                    }}
                />
                {isMobile &&
                    <div
                        style={{
                            margin: '12px 0px 8px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            onClick={()=>this.showDetailProductModal(this.state.dataSource.length)}
                        >
                            <FormattedMessage id='add' />
                        </Button>
                    </div>
                }
                <DetailProductModal
                    isMobile={isMobile}
                    labors={ labors }
                    treeData={ detailsTreeData }
                    user={ user }
                    tecdocId={ tecdocId }
                    visible={ productModalVisible }
                    orderId={ orderId }
                    hideModal={ () => {
                        this.hideDetailProductModal();
                    } }
                    brands={ allDetails.brands }
                    allDetails={ allDetails.details }
                    detail={ dataSource[ productModalKey ] }
                    tableKey={ productModalKey }
                    updateDetail={ this.updateDetail }
                    updateDataSource={ this.updateDataSource }
                    clientVehicleVin={ clientVehicleVin }
                    showOilModal={ showOilModal }
                    oilModalData={ oilModalData }
                    clearOilData={ clearOilData }
                />
            </Catcher>
        );
    }
}

export default DetailsTable;