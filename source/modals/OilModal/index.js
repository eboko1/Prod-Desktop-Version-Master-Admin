// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { DetailSupplierModal } from 'modals';
import { AvailabilityIndicator } from 'components';
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


@injectIntl
class OilModal extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fetched: false,
            dataSource: [],
            storeOptions: [],
            storeFilter: undefined,
            brandOptions: [],
            brandFilter: [],
            codeFilter: undefined,
            attributesFilters: [],
            inStock: false,
        }

        this.setSupplier = this.setSupplier.bind(this);

        this.columns = [
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.store" />
                            <div style={{fontWeight: '400', fontSize: 12}}>
                                В наличии
                                <Checkbox
                                    checked={this.state.inStock}
                                    onChange={()=>{
                                        this.setState({
                                            inStock: !this.state.inStock,
                                        })
                                    }}
                                /> 
                            </div>
                        </div>
                    )
                },
                key:       'store',
                dataIndex: 'store',
                width:     '8%',
                sorter: (a, b) => {
                    let aStore = a.store ? a.store[0] : 0;
                    let bStore = b.store ? b.store[0] : 0;
                    return Number(aStore) - Number(bStore);
                },
                sortDirections: ['descend', 'ascend'],
                render: (store) => {
                    return (
                        <AvailabilityIndicator
                            indexArray={store}
                        />
                    )
                },
            },
            {
                key:       'select',
                width:     '5%',
                render: (elem)=>{
                    var supplierBrandId = elem.supplierBrandId ? elem.supplierBrandId : (elem.price ? elem.price.supplierBrandId : undefined);
                    var brandId = elem.brandId ? elem.brandId : (elem.price ? elem.price.brandId : undefined);
                    var name = elem.storeGroupId == 1000000 ? elem.description : elem.storeGroupName;
                    var supplierOriginalCode = elem.price ? elem.price.supplierOriginalCode : undefined;
                    console.log(elem)
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.partNumber, brandId, elem.storeId, this.props.tableKey, elem.storeGroupId, name, supplierOriginalCode);
                                this.props.setSupplier(elem.businessSupplierId, elem.businessSupplierName, supplierBrandId, elem.purchasePrice, elem.salePrice, elem.store, supplierOriginalCode, this.props.tableKey);
                                this.handleCancel();
                            }}
                        >
                            <FormattedMessage id="select" />
                        </Button>
                    )
                }
            },
        ];
    }

    setSupplier(supplierId, businessSupplierName, supplierBrandId, purchasePrice, price, store, supplierOriginalCode, key) {
        this.state.dataSource[key].businessSupplierId = supplierId;
        this.state.dataSource[key].businessSupplierName = businessSupplierName;
        this.state.dataSource[key].purchasePrice = purchasePrice;
        this.state.dataSource[key].supplierBrandId = supplierBrandId;
        this.state.dataSource[key].salePrice = price;
        this.state.dataSource[key].store = store;
        this.state.dataSource[key].price.supplierOriginalCode = supplierOriginalCode;
        this.setState({
            update: true
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            fetched: false,
            dataSource: [],
        })
    };

    fetchData() {
        
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { dataSource, storeFilter, brandFilter, codeFilter, inStock } = this.state;
        const disabled = this.props.disabled || isForbidden(this.props.user, permissions.ACCESS_TECDOC_MODAL_WINDOW);

        return (
            <div>
                <Button
                    type='primary'
                    disabled={disabled}
                    onClick={()=>{
                        this.fetchData();
                        this.setState({
                            visible: true,
                        })
                    }}
                    title={this.props.intl.formatMessage({id: "details_table.details_catalogue"})}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            backgroundColor: disabled ? 'black' : 'white',
                            mask: `url(${images.oilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.oilIcon}) no-repeat center / contain`,
                        }}
                    ></div>
                </Button>
                <Modal
                    width="90%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="details_table.oils_and_liquids" />}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.state.fetched ? 
                        <Table
                            rowClassName={Styles.tableRow}
                            pagination={{ pageSize: 6 }}
                            dataSource={tblData}
                            columns={this.columns}
                        />
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </div>
        )
    }
}
export default OilModal;