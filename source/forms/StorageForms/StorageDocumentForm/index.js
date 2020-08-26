// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Table, Select, Icon, DatePicker, AutoComplete, InputNumber, Modal, TreeSelect } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { Numeral } from "commons";
import { withReduxForm, isForbidden, permissions } from "utils";
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
const formItemStyle = {
    style: {
        marginBottom: 0,
    }
};
const mask = "0,0.00";

@withReduxForm({
    name: "storageDocumentForm",
})
@injectIntl
class StorageDocumentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
        this.hideModal = this.hideModal.bind(this);
    }

    showModal() {
        this.setState({
            modalVisible: true,
        })
    }

    hideModal() {
        this.setState({
            modalVisible: false,
        })
    }

    render() {
        const { addDocProduct, updateFormData, typeToDocumentType, warehouses, counterpartSupplier, brands } = this.props;
        const { type, documentType, supplierDocNumber, counterpartId, docProducts, status, sum, payUntilDatetime, warehouseId } = this.props.formData;
        const dateFormat = 'DD.MM.YYYY';
        const disabled = status == 'DONE';
        
        return (
            <>
            <Form
                {...formItemLayout}
                style={{
                    margin: "15px 0",
                    padding: "0 10px 15px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid gray"
                }}
            >
                <div
                    style={{
                        width: "35%"
                    }}
                >
                    <div>
                        <FormattedMessage id='storage.type'/>
                        <Select
                            disabled={disabled || status=='NEW'}
                            value={type}
                            onChange={(value)=>{
                                updateFormData({
                                    type: value,
                                    documentType: undefined,
                                })
                            }}
                        >
                            <Option
                                value='INCOME'
                            >
                                <FormattedMessage id='storage.INCOME'/>
                            </Option>
                            <Option
                                value='EXPENSE'
                            >
                                <FormattedMessage id='storage.EXPENSE'/>
                            </Option>
                            <Option
                                value='TRANSFER'
                            >
                                <FormattedMessage id='storage.TRANSFER'/>
                            </Option>
                            <Option
                                value='RESERVE'
                            >
                                <FormattedMessage id='storage.RESERVE'/>
                            </Option>
                            <Option
                                value='ORDER'
                            >
                                <FormattedMessage id='storage.ORDER'/>
                            </Option>
                        </Select>
                    </div>
                    {(type == 'INCOME' || type == 'EXPENSE') && 
                    <div>
                        <FormattedMessage id='storage_document.counterparty_type'/>
                        <Select
                            disabled={disabled || status=='NEW'}
                            value={documentType}
                            onChange={(value)=>{
                                updateFormData({
                                    documentType: value,
                                })
                            }}
                        >
                            {type && typeToDocumentType[type.toLowerCase()].documentType.map((docType, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={docType}
                                    >
                                        <FormattedMessage id={`storage_document.${String(docType).toLowerCase()}`}/>
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>}
                    {(type == 'INCOME' || type == 'EXPENSE' || type == 'ORDER') && 
                    <div style={{position: 'relative'}}>
                        <FormattedMessage id='storage_document.counterparty'/>
                        <Select
                            disabled={disabled}
                            value={counterpartId}
                            onChange={(value)=>{
                                updateFormData({
                                    counterpartId: value,
                                })
                            }}
                        >
                            {counterpartSupplier.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>}
                </div>
                <div
                    style={{
                        width: "30%"
                    }}
                >
                    <div>
                        <FormattedMessage id='storage_document.storage_expenses'/>
                        <Select
                            disabled={type == 'INCOME' || type == 'ORDER' || disabled}
                            value={!(type == 'INCOME' || type == 'ORDER') ? warehouseId : undefined}
                            onSelect={(value)=>{
                                updateFormData({
                                    warehouseId: value,
                                })
                            }}
                        >
                            {warehouses.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div>
                        <FormattedMessage id='storage_document.storage_income'/>
                        <Select
                            disabled={type == 'EXPENSE' || type == 'ORDER' || disabled}
                            value={!(type == 'EXPENSE' || type == 'ORDER') ? warehouseId : undefined}
                            onSelect={(value)=>{
                                updateFormData({
                                    warehouseId: value,
                                })
                            }}
                        >
                            {warehouses.map((elem, i)=>{
                                return (
                                    <Option
                                        key={i}
                                        value={elem.id}
                                    >
                                        {elem.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    {(type == 'INCOME' || type == 'EXPENSE' || type == 'ORDER') && 
                    <div>
                        <FormattedMessage id='storage.document_num'/>
                        <Input
                            disabled={disabled}
                            value={supplierDocNumber}
                            onChange={(event)=>{
                                updateFormData({
                                    supplierDocNumber: event.target.value,
                                })
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    </div>}
                </div>
                <div
                    style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <div className={Styles.sumWrapper}>
                                <FormattedMessage id="sum" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.sumNumeral}
                                    nullText="0"
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                >
                                    {sum || 0}
                                </Numeral>
                            </div>
                            <div className={Styles.sumWrapper}>
                                <FormattedMessage id="remain" />
                                <Numeral
                                    mask={mask}
                                    className={Styles.totalSum}
                                    currency={this.props.intl.formatMessage({
                                        id: "currency",
                                    })}
                                    nullText="0"
                                >
                                    {sum - sum}
                                </Numeral>
                            </div>
                        </div>
                        <div
                            className={Styles.sumWrapper}
                            style={{
                                background: 'var(--static)',
                                fontSize: 16,
                                height: 'auto',
                                width: '50%',
                                justifyContent: 'center'
                            }}
                        >
                            <FormattedMessage id="paid" />
                            <Numeral
                                mask={mask}
                                className={Styles.sumNumeral}
                                nullText="0"
                                currency={this.props.intl.formatMessage({
                                    id: "currency",
                                })}
                            >
                                {disabled ? sum : 0}
                            </Numeral>
                        </div>
                    </div>
                   {(type == 'INCOME' || type == 'EXPENSE' || type == 'ORDER') && 
                   <div>
                        <FormattedMessage id="header.until" />
                        <DatePicker
                            style={{
                                width: '100%'
                            }}
                            defaultValue={payUntilDatetime}
                            disabled={disabled}
                            format={dateFormat}
                            onChange={(date, stringDate)=>{
                                updateFormData({
                                    payUntilDatetime: date,
                                })
                            }}
                        />
                    </div>}
                </div>
            </Form>
            <div style={{
                margin: "24px",
            }}>
                <DocProductsTable
                    docProducts={docProducts}
                    disabled={disabled}
                    updateFormData={updateFormData}
                    businessSupplierId={counterpartId}
                />
                <Button
                    style={{
                        marginTop: 10
                    }}
                    onClick={()=>{
                        this.showModal();
                    }}
                >
                    <Icon type='plus'/>
                </Button>
                <AddProductModal
                    visible={this.state.modalVisible}
                    hideModal={this.hideModal}
                    brands={brands}
                    addDocProduct={addDocProduct}
                />
            </div>
            </>
        );
    }
}

export default StorageDocumentForm;

class DocProductsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            brandSearchValue: "",
            brands: [],
            detailOptions: [],
        }
        this.columns = [
            {
                width:     '3%',
                key:       'edit',
                render:     (elem)=>{
                    return (
                        <Button
                            disabled={this.props.disabled}
                            onClick={()=>{

                            }}
                        >
                            <Icon type='edit' />
                        </Button>
                    )
                }
            },
            {
                title:     "№",
                width:     '5%',
                key:       'key',
                dataIndex: 'key',
                render:     (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '20%',
                key:       'brandName',
                dataIndex: 'brandName',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                width:     '20%',
                key:       'detailCode',
                dataIndex: 'detailCode',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'quantity',
                dataIndex: 'quantity',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                width:     '3%',
                key:       'delete',
                render:     (elem)=>{
                    return (
                        <Button
                            disabled={this.props.disabled}
                            type={'danger'}
                            onClick={()=>{

                            }}
                        >
                            <Icon type='delete' />
                        </Button>
                    )
                }
            },
        ];
    }

    render() {
        const { disabled, docProducts } = this.props;
        const tableData = docProducts;
        return (
            <Table
                columns={this.columns}
                dataSource={tableData}
            />
        );
    }
}

class AddProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            alertModalVisible: false,
            detailOptions: [],
            storeGroupsTree: [],
            storageProducts: [],
            brandSearchValue: "",
            visible: false,
            brandId: undefined,
            brandName: undefined,
            detailCode: undefined,
            groupId: undefined,
            supplierPartNumber: undefined,
            detailName: undefined,
            stockPrice: 0,
            quantity: 1,
        }

        this.confirmAlertModal = this.confirmAlertModal.bind(this);
        this.cancelAlertModal = this.cancelAlertModal.bind(this);
    }

    getOptions(brandId) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/pricelists`;
        if(brandId) url += `?brandId=${brandId}`;
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
            that.setState({
                detailOptions: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getStoreGroups() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_groups`;
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
            data.map((elem, index) => {
                elem.key = index;
            });
            that.buildStoreGroupsTree(data);
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    getStorageProducts() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_products`;
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
            console.log(data.list)
            that.setState({
                storageProducts: data.list
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    buildStoreGroupsTree(data) {
        var treeData = [];
        for (let i = 0; i < data.length; i++) {
            const parentGroup = data[ i ];
            treeData.push({
                title:      `${parentGroup.name} (#${parentGroup.id})`,
                name:       parentGroup.name,
                value:      parentGroup.id,
                className:  Styles.groupTreeOption,
                key:        `${i}`,
                selectable: false,
                children:   [],
            });
            for (let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[ j ];
                treeData[ i ].children.push({
                    title:      `${childGroup.name} (#${childGroup.id})`,
                    name:       childGroup.name,
                    value:      childGroup.id,
                    className:  Styles.groupTreeOption,
                    key:        `${i}-${j}`,
                    selectable: false,
                    children:   [],
                });
                for (let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[ k ];
                    treeData[ i ].children[ j ].children.push({
                        title:     `${lastNode.name} (#${lastNode.id})`,
                        name:      lastNode.name,
                        value:     lastNode.id,
                        className: Styles.groupTreeOption,
                        key:       `${i}-${j}-${k}`,
                        children:  [],
                    });
                    for (let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[ l ];
                        treeData[ i ].children[ j ].children[ k ].children.push({
                            title:     `${elem.name} (#${elem.id})`,
                            name:      elem.name,
                            value:     elem.id,
                            className: Styles.groupTreeOption,
                            key:       `${i}-${j}-${k}-${l}`,
                        });
                    }
                }
            }
        }
        this.setState({
            storeGroupsTree: treeData,
        })
    }

    getProductId(detailCode) {
        const { storageProducts } = this.state;
        const storageProduct = storageProducts.find((elem)=>elem.code==detailCode);
        if(storageProduct) {
            this.setState({
                groupId: storageProduct.groupId,
                productId: storageProduct.id,
                detailName: storageProduct.name,
                brandId: storageProduct.brandId,
                brandName: storageProduct.brandName,
            })
            return true;
        }
        else {
            this.setState({
                productId: undefined,
            })
            return false;
        }
    }

    componentDidMount() {
        this.getStoreGroups();
        this.getStorageProducts();
    }

    confirmAlertModal() {
        const { 
            brandId,
            brandName,
            detailCode,
            supplierPartNumber,
            groupId,
            detailName,
            stockPrice,
            quantity, 
            productId,
        } = this.state;

        this.props.addDocProduct({
            addToStore: true,
            productId: productId,
            detailCode: detailCode,
            brandName: brandName,
            brandId: brandId,
            supplierPartNumber: supplierPartNumber,
            detailName: detailName,
            stockPrice: stockPrice,
            quantity: quantity,
            groupId: groupId,
            sum: quantity*stockPrice,
        });
        this.setState({
            alertModalVisible: false,
        });
        this.handleCancel();
    }

    cancelAlertModal() {
        this.setState({
            alertModalVisible: false,
        })
    }

    handleOk() {
        const { 
            brandId,
            brandName,
            detailCode,
            supplierPartNumber,
            groupId,
            detailName,
            stockPrice,
            quantity, 
            productId,
        } = this.state;

        if(!this.getProductId(detailCode)) {
            this.setState({
                alertModalVisible: true,
            })
        }
        else {
            this.props.addDocProduct({
                productId: productId,
                detailCode: detailCode,
                brandName: brandName,
                brandId: brandId,
                supplierPartNumber: supplierPartNumber,
                detailName: detailName,
                stockPrice: stockPrice,
                quantity: quantity,
                groupId: groupId,
                sum: quantity*stockPrice,
            });
            this.handleCancel();
        }
    }

    handleCancel() {
        this.setState({
            brandSearchValue: "",
            visible: false,
            brandId: undefined,
            brandName: undefined,
            detailCode: undefined,
            groupId: undefined,
            supplierPartNumber: undefined,
            detailName: undefined,
            stockPrice: 0,
            quantity: 1,
        });
        this.props.hideModal();
    }

    render() {
        const {
            alertModalVisible,
            detailOptions,
            storeGroupsTree,
            brandId,
            brandName,
            detailCode,
            supplierPartNumber,
            groupId,
            detailName,
            stockPrice,
            quantity,
        } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                onOk={()=>{
                    this.handleOk();
                }}
                onCancel={()=>{
                    this.handleCancel();
                }}
            >
                <div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.brand' />
                        <Select
                            showSearch
                            value={brandId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.getOptions(value)
                                this.setState({
                                    brandId: value,
                                    brandName: option.props.children,
                                })
                            }}
                            onSearch={(input)=>{
                                this.setState({
                                    brandSearchValue: input,
                                })
                            }}
                            onBlur={()=>{
                                this.setState({
                                    brandSearchValue: "",
                                })
                            }}
                        >
                            {
                                this.state.brandSearchValue.length > 1 ? 
                                    this.props.brands.map((elem, index)=>(
                                        <Option key={index} value={elem.brandId} supplier_id={elem.supplierId}>
                                            {elem.brandName}
                                        </Option>
                                    )) :
                                    brandId ? 
                                    <Option key={0} value={brandId}>
                                        {brandName}
                                    </Option> : 
                                    []
                            }
                        </Select>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' />
                        <AutoComplete
                            value={detailCode}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            onChange={(value)=>{
                                this.setState({
                                    detailCode: value,
                                    supplierPartNumber: value,
                                });
                                this.getProductId(value);
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    detailCode: value,
                                    detailName: option.props.detail_name,
                                    supplierPartNumber: option.props.supplier_number,
                                    stockPrice: option.props.price,
                                });
                                this.getProductId(value);
                            }}
                            filterOption={(input, option) => {
                                return (
                                    String(option.props.value).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                        >
                            {
                                detailOptions.map((elem, key)=>{
                                    return (
                                        <Option
                                            key={key}
                                            value={elem.partNumber}
                                            detail_name={elem.itemName}
                                            price={elem.purchasePrice}
                                            supplier_number={elem.supplierPartNumber}
                                        >
                                            {elem.partNumber}
                                        </Option>
                                    )
                                })
                            }
                        </AutoComplete>
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_code' /> (<FormattedMessage id='storage.supplier'/>)
                        <Input
                            value={supplierPartNumber}
                            disabled
                            style={{
                                color: 'black'
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.store_group'/>
                        <TreeSelect
                            showSearch
                            value={groupId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={storeGroupsTree}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    groupId: value
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.detail_name' />
                        <Input
                            value={detailName}
                            onChange={(event)=>{
                                this.setState({
                                    detailName: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.purchasePrice' />:
                        <InputNumber
                            value={stockPrice}
                            style={{
                                marginLeft: 10,
                            }}
                            min={0}
                            onChange={(value)=>{
                                this.setState({
                                    stockPrice: value
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.count' />:
                        <InputNumber
                            value={quantity}
                            style={{
                                marginLeft: 10,
                            }}
                            min={0}
                            onChange={(value)=>{
                                this.setState({
                                    quantity: value
                                })
                            }}
                        />
                    </div>
                    <div className={Styles.addProductItemWrap}>
                        <FormattedMessage id='order_form_table.sum' />:
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                                marginLeft: 10,
                            }}
                            value={quantity*stockPrice}
                        />
                    </div>
                </div>
                <AlertModal
                    visible={alertModalVisible}
                    confirmAlertModal={this.confirmAlertModal}
                    cancelAlertModal={this.cancelAlertModal}
                >
                    Даного товара нет в справочнике товаров. Добавить?
                </AlertModal>
            </Modal>
        );
    }
}


class AlertModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                onOk={this.props.confirmAlertModal}
                onCancel={this.props.cancelAlertModal}
            >
                {this.props.children}
            </Modal>
        );
    }
}