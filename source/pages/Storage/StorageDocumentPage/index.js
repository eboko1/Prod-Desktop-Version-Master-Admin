// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Dropdown, Button, Icon, Menu, notification, Modal, Table, Input, InputNumber, Checkbox, Select, AutoComplete, Badge, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { saveAs } from 'file-saver';
import {setModal, resetModal, MODALS} from 'core/modals/duck';

// proj
import { Layout, Spinner } from 'commons';
import { StorageDocumentForm } from 'forms';
import book from 'routes/book';
import { type } from 'ramda';
import { DetailStorageModal, ToSuccessModal } from 'modals';
import { permissions, isForbidden } from 'utils';
import { Barcode } from 'components';

// own
const Option = Select.Option;
const { error } = Modal;
const dateFormat = 'DD.MM.YYYY';

const mapStateToProps = state => {
    return {
        user: state.auth,
        modal:                 state.modals.modal,
        modalProps:            state.modals.modalProps,
    };
};

const mapDispatchToProps = {
    setModal,
    resetModal,
};

const headerIconStyle = {
    fontSize: 24,
    cursor:   'pointer',
    margin:   '0 0 0 18px',
}

const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      SUPPLIER = 'SUPPLIER',
      RESERVE = 'RESERVE',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTION = 'OWN_CONSUMPTION',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDERINCOME = 'ORDERINCOME',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE',
      MAIN = 'MAIN',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA',
      STOCK = "STOCK";

const typeToDocumentType = {
    income: {
        type: INCOME,
        documentType: [SUPPLIER, CLIENT, INVENTORY],
    },
    expense: {
        type: EXPENSE,
        documentType: [CLIENT, SUPPLIER, INVENTORY, OWN_CONSUMPTION],
    },
    transfer: {
        type: EXPENSE,
        documentType: [TRANSFER, RESERVE, TOOL, REPAIR_AREA],
    },
    order: {
        type: ORDER,
        documentType: [SUPPLIER, ADJUSTMENT, ORDERINCOME],
    }, 
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
class StorageDocumentPage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
            brands: [],
            counterpartSupplier: [],
            employees: [],
            clientList: [],
            formData: {
                type: INCOME,
                documentType: SUPPLIER,
                sum: 0,
                docProducts: [],
            },
            fetched: false,
            warnings: 0,
            loading: false,
            mainWarehouseId: undefined,
            reserveWarehouseId: undefined,
            toolWarehouseId: undefined,
            repairAreaWarehouseId: undefined,
        }

        this.updateFormData = this.updateFormData.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
        this.addDocProduct = this.addDocProduct.bind(this);
        this.deleteDocProduct = this.deleteDocProduct.bind(this);
        this.editDocProduct = this.editDocProduct.bind(this);
    }

    updateFormData(formData, saveMode = false) {
        Object.entries(formData).map((field)=>{
            this.state.formData[field[0]] = field[1];
        })
        if(saveMode) {
            this.updateDocument(saveMode);
        }
        else {
            this.setState({
                update: true,
            })
        }
    }

    addDocProduct(docProduct, arrayMode = false) {
        if(arrayMode) {
            const newProducts = [],
                  warningProducts = [];

            console.log(docProduct)
            docProduct.map((product)=>{
                product.sum = Math.round(product.sum*10)/10;
                this.state.formData.sum += product.sum;
                if(!product.brandId && product.brandName) {
                    const brand = this.state.brands.find((elem)=>elem.brandName == product.brandName);
                    product.brandId = brand ? brand.brandId : undefined;
                }
                if(product.quantity) {
                    if(!product.productId) {
                        warningProducts.push(product);
                    } else {
                        newProducts.push(product);
                    }
                }
            })
            this.state.formData.docProducts = this.state.formData.docProducts.concat(newProducts);
            if(warningProducts.length) {
                this.state.formData.docProducts = warningProducts.concat(this.state.formData.docProducts);
                this.setState({
                    forceUpdate: true,
                })
            }
            else {
                this.updateDocument();
            }
            
        }
        else {
            docProduct.sum = Math.round(docProduct.sum*10)/10;
            this.state.formData.docProducts.push({
                key: this.state.formData.docProducts.length,
                ...docProduct
            });
            this.state.formData.sum += docProduct.sum;
            this.setState({
                update: true,
            })
            this.updateDocument();
        }
    }

    deleteDocProduct(key) {
        const {formData } = this.state;
        formData.sum -= formData.docProducts[key].sum;

        this.state.formData.docProducts = this.state.formData.docProducts.filter((elem)=>elem.key != key);
        this.updateDocument();
    } 

    editDocProduct(key, docProduct) {
        const {formData } = this.state;
        
        formData.docProducts[key] = {
            key: key,
            ...docProduct
        };
        formData.sum = 0;
        formData.docProducts.map((elem)=>{
            formData.sum += elem.quantity * elem.stockPrice;
        })
        this.updateDocument();
    }

    //saveFormRef = formRef => {
    //    this.formRef = formRef;
    //};

    verifyFields() {
        const { intl: {formatMessage} } = this.props;
        const { formData } = this.state;
        const showError = () => {
            notification.error({
                message: formatMessage({id: 'storage_document.error.required_fields'}),
            });
        }

        if(!formData.type) {
            showError();
            return false;
        }

        switch(formData.type) {
            case INCOME:
            case EXPENSE:
                if(!formData.incomeWarehouseId && !formData.expenseWarehouseId){
                    showError();
                    return false;
                }
                break;
            case TRANSFER:
            case RESERVE:
                if(!formData.incomeWarehouseId || !formData.expenseWarehouseId) {
                    showError();
                    return false;
                }
                break;
            case ORDER:
                if(!formData.counterpartId) {
                    showError();
                    return false;
                }
                break;
        }

        
        return true;
    }

    createDocument() {
        if(!this.verifyFields()) {
            return;
        }
        
        const { formData } = this.state

        const createData = {
            status: NEW,
            type: formData.type,
            documentType: formData.documentType,
            payUntilDatetime: formData.payUntilDatetime ? formData.payUntilDatetime.toISOString() : null,
            docProducts: [],
        }

        if(formData.supplierDocNumber) {
            createData.supplierDocNumber = formData.supplierDocNumber;
        }

        switch(formData.type) {
            case INCOME:
            case EXPENSE:
                createData.warehouseId = formData.incomeWarehouseId || formData.expenseWarehouseId;
                if(formData.documentType == SUPPLIER) {
                    createData.counterpartBusinessSupplierId = formData.counterpartId;
                }
                else if(formData.documentType == CLIENT) {
                    createData.counterpartClientId = formData.counterpartId;
                }
                break;
            case TRANSFER:
                createData.type = EXPENSE;
                createData.documentType = TRANSFER;
                createData.warehouseId = formData.expenseWarehouseId;
                createData.counterpartWarehouseId = formData.incomeWarehouseId;
                if(formData.documentType == TOOL || formData.documentType == REPAIR_AREA) {
                    createData.counterpartEmployeeId = formData.counterpartId;
                }
                delete createData.supplierDocNumber;
                delete createData.payUntilDatetime;
                break;
            case ORDER:
                if(formData.documentType == SUPPLIER) {
                    createData.type = INCOME;
                }
                else if(formData.documentType == ADJUSTMENT) {
                    createData.type = EXPENSE;
                }
                else if(formData.documentType == ORDERINCOME) {
                    createData.type = EXPENSE;
                    createData.documentType = SUPPLIER;
                }
                createData.counterpartBusinessSupplierId = formData.counterpartId;
                createData.context = ORDER;
                delete createData.warehouseId;
                break;
        }

        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/store_docs';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(createData)
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
            that.props.history.replace(`${book.storageDocument}/${data.id}`);
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error);
            notification.error({
                message: 'Ошибка склада',
            });
        });
    }

    updateDocument(saveMode = false) {
        this.setState({loading: true});
        if(!this.verifyFields()) {
            return;
        }

        const { formData } = this.state;
        const { intl: {formatMessage} } = this.props;
        
        const createData = {
            status: formData.status,
            supplierDocNumber: formData.supplierDocNumber || null,
            payUntilDatetime: formData.payUntilDatetime ? formData.payUntilDatetime.toISOString() : null,
            docProducts: [],
        }

        switch(formData.type) {
            case INCOME:
            case EXPENSE:
                createData.warehouseId = formData.incomeWarehouseId || formData.expenseWarehouseId;
                if(formData.documentType == SUPPLIER) {
                    createData.counterpartBusinessSupplierId = formData.counterpartId;
                }
                else if(formData.documentType == CLIENT) {
                    createData.counterpartClientId = formData.counterpartId;
                }
                break;
            case TRANSFER:
                createData.warehouseId = formData.expenseWarehouseId;
                createData.counterpartWarehouseId = formData.incomeWarehouseId;
                break;
            case ORDER:
                createData.counterpartBusinessSupplierId = formData.counterpartId;
                break;
        }

        var productsError = false;

        formData.docProducts.map((elem)=>{
            if(elem.productId) {
                createData.docProducts.push({
                    productId: elem.productId,
                    quantity: elem.quantity || 1,
                    stockPrice: formData.type == EXPENSE ? elem.sellingPrice : elem.stockPrice,
                    sellingPrice: elem.sellingPrice,
                })
                if(elem.tradeCode) {
                    createData.docProducts[createData.docProducts.length-1].supplierPartNumber = elem.tradeCode;
                }
                if(elem.storeDocProductId) {
                    createData.docProducts[createData.docProducts.length-1].storeDocProductId = elem.storeDocProductId;
                }
            } else if(!saveMode) {
                /*notification.warning({
                    message: this.props.intl.formatMessage({id: 'error'}),
                });*/
                productsError = true;
                return;
            } else if(elem.code && elem.brandId) {
                createData.docProducts.push({
                    addToStore: true,
                    groupId: elem.groupId,
                    code: elem.detailCode,
                    name: elem.detailName || elem.detailCode,
                    brandId: elem.brandId,
                    //tradeCode: elem.tradeCode,

                    quantity: elem.quantity || 1,
                    stockPrice: elem.stockPrice,
                })
                if(elem.storeDocProductId) {
                    createData.docProducts[createData.docProducts.length-1].storeDocProductId = elem.storeDocProductId;
                }
            }
        })
        if(productsError) {
            this.setState({loading: false});
            return;
        };
        
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs/${this.props.id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(createData)
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
            console.log(data);
            if(data.updated) {
                that.getStorageDocument();
            } else {
                const availableInfo = [];
                data.notAvailableProducts.map(({available, reservedCount, productId: {product}})=>{
                    availableInfo.push(
                        <span style={{
                            display: 'flex',
                            margin: '8 0 0 0',
                            justifyContent: 'space-between',
                            fontSize: 14,
                        }}>
                            <span style={{fontWeight: 500}}>{product.name} ({product.code})</span>
                            <span style={{padding: '0 0 0 12'}}>{formatMessage({id:'storage.available'})} { available } / {available - reservedCount} {formatMessage({id: 'pc'})}</span>
                        </span>
                    );
                })
                error({
                    title: formatMessage({id: 'storage_document.error.available'}),
                    content: availableInfo.map((txt, key)=>txt),
                    cancelButtonProps: {style: {display: 'none'}},
                    width: 'fit-content',
                    style: {
                        minWidth: 600,
                    },
                    onOk() {
                        that.getStorageDocument();
                    },
                    onCancel() {
                        that.getStorageDocument();
                    }
                });
            }
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({loading: false});
            notification.error({
                message: that.props.intl.formatMessage({id: 'error'}),
            });
            that.getStorageDocument();
        });
    }

    getWarehouses() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/warehouses';
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
        .then(function (warehouses) {
            const type = that.props.location.state && that.props.location.state.formData.type;
            const documentType = that.props.location.state && that.props.location.state.formData.documentType;
            var mainWarehouseId, reserveWarehouseId, toolWarehouseId, repairAreaWarehouseId;
            warehouses.map((warehouse)=>{
                switch(warehouse.attribute) {
                    case MAIN:
                        mainWarehouseId = warehouse.id;
                        break;
                    case RESERVE:
                        reserveWarehouseId = warehouse.id;
                        break;
                    case TOOL:
                        toolWarehouseId = warehouse.id;
                        break;
                    case REPAIR_AREA:
                        repairAreaWarehouseId = warehouse.id;
                        break;
                }
            })
            if(warehouses.length) {
                var { incomeWarehouseId, expenseWarehouseId } = that.state.formData;
                switch(type) {
                    case INCOME:
                        incomeWarehouseId = mainWarehouseId;
                        break
                    case EXPENSE:
                        expenseWarehouseId = mainWarehouseId;
                        break;
                    case TRANSFER:
                        expenseWarehouseId = reserveWarehouseId;
                        incomeWarehouseId = mainWarehouseId;
                        break;
                    case ORDER:
                        incomeWarehouseId = mainWarehouseId;
                        break;
                    default:
                        incomeWarehouseId = mainWarehouseId;
                }
                if(documentType == TOOL) {
                    expenseWarehouseId = toolWarehouseId;
                    incomeWarehouseId = repairAreaWarehouseId;
                } else if(documentType == REPAIR_AREA) {
                    expenseWarehouseId = repairAreaWarehouseId;
                    incomeWarehouseId = toolWarehouseId;
                }
                that.state.formData.type = type || INCOME;
                that.state.formData.documentType =  documentType ? 
                                                    documentType : 
                                                        type ? 
                                                        typeToDocumentType[type.toLowerCase()].documentType[0] : 
                                                        SUPPLIER;
                that.state.formData.incomeWarehouseId = incomeWarehouseId;
                that.state.formData.expenseWarehouseId = expenseWarehouseId;
            } 
            that.setState({
                warehouses: warehouses,
                mainWarehouseId: mainWarehouseId,
                reserveWarehouseId: reserveWarehouseId,
                toolWarehouseId: toolWarehouseId,
                repairAreaWarehouseId: repairAreaWarehouseId,
                fetched: !Boolean(that.props.id),
            })
            if(that.props.id) that.getStorageDocument();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getEmployees() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/employees';
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
            data.map((elem)=>{
                elem.phone = `+38(${elem.phone.substring(2, 5)}) ${elem.phone.substring(5, 8)}-${elem.phone.substring(8, 10)}-${elem.phone.substring(10)}`;
            })
            data = data.filter((elem)=>!elem.disabled);
            that.setState({
                employees: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getCounterpartSupplier() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/business_suppliers?all=true';
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
                counterpartSupplier: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getBrands() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/brands`;
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
            that.setState({
                brands: data,
            });
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    getClientList() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/clients`;
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
            that.setState({
                clientList: data.clients,
            });
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    getStorageDocument() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs/${this.props.id}`;
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
            const INC = 'INC',
                  CRT = 'CRT',
                  STP = 'STP',
                  OUT = 'OUT',
                  SRT = 'SRT',
                  CST = 'CST',
                  STM = 'STM',
                  TSF = 'TSF',
                  RES = 'RES',
                  ORD = 'ORD',
                  BOR = 'BOR',
                  COM = 'COM',
                  TOL = 'TOL',
                  TOR = 'TOR';

            data.counterpartId = data.counterpartBusinessSupplierId || data.counterpartClientId || data.counterpartEmployeeId;
            data.payUntilDatetime = data.payUntilDatetime && moment(data.payUntilDatetime);
            data.docProducts.map((elem, key)=>{
                elem.brandId = elem.product.brandId;
                elem.brandName = elem.product.brand && elem.product.brand.name;
                elem.detailCode = elem.product.code;
                elem.detailName = elem.product.name;
                elem.groupId = elem.product.groupId;
                elem.tradeCode = elem.product.tradeCode || elem.supplierPartNumber;
                elem.sum = elem.stockPrice * elem.quantity;
                elem.key = key;
                elem.sellingSum = elem.sellingPrice * elem.quantity;
                elem.purchasePrice = elem.purchasePrice || elem.stockPrice;
            })
            switch (data.operationCode) {
                case INC:
                case CRT:
                case STP:
                    data.type = INCOME;
                    break;
                case OUT:
                case SRT:
                case CST:
                case STM:
                    data.type = EXPENSE;
                    break;
                case TSF:
                    data.type = TRANSFER;
                    data.documentType = TRANSFER;
                    break;
                case RES:
                    data.type = TRANSFER;
                    data.documentType = RESERVE;
                    break;
                case TOL:
                    data.type = TRANSFER;
                    data.documentType = REPAIR_AREA;
                    break;
                case TOR:
                    data.type = TRANSFER;
                    data.documentType = TOOL;
                    break;
                case ORD:
                case BOR:
                    data.type = ORDER;
                    break;
                case COM:
                    data.type = ORDER;
                    data.documentType = ORDERINCOME;
                    break;
                
            }

            switch (data.type) {
                case INCOME:
                    data.incomeWarehouseId = data.warehouseId;
                    break;
                case EXPENSE:
                    data.expenseWarehouseId = data.warehouseId;
                    break;
                case TRANSFER:
                    data.incomeWarehouseId = data.counterpartWarehouseId;
                    data.expenseWarehouseId = data.warehouseId;
                    break;
                case ORDER:
                    data.incomeWarehouseId = that.state.warehouses.length ? that.state.warehouses[0].id : undefined;
                    break;
            }

            that.setState({
                formData: data,
                loading: false,
                fetched: true,
            })
            console.log(that);
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({loading: true});
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const { id, location } = this.props;
        
        if(this._isMounted) {
            if(this._isMounted && location.state && location.state.showForm) {
                const { formData } = location.state || {};
                this.updateFormData(location.state.formData);
            }
            this.getWarehouses();
        }

        this.getBrands();
        this.getClientList();
        this.getCounterpartSupplier();
        this.getEmployees();

        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.forceUpdate) {
            this.setState({
                forceUpdate: false,
            })
        }
    }

    render() {
        const { 
            warehouses,
            counterpartSupplier,
            employees, formData,
            brands, clientList,
            fetched, forceUpdate,
            loading,
            mainWarehouseId,
            reserveWarehouseId,
            toolWarehouseId,
            repairAreaWarehouseId,
        } = this.state;

        const { id, intl: {formatMessage}, user, modal, setModal, resetModal } = this.props;

        const dateTime = formData.createdDatetime || new Date();
        const titleType = " " + formatMessage({id: `storage_document.docType.${formData.type}.${formData.documentType}`}).toLowerCase();

        this.state.warnings = 0;
        formData.docProducts.map((elem, i)=>{
            elem.key = i;
            if(!elem.productId) this.state.warnings++;
        })

        return !fetched ? (
            <Spinner spin={true}/>
            ) : (
            <Layout
                title={ id ? 
                <span>
                    {formData.status == 'NEW' ? 
                        <FormattedMessage id='storage_document.status_created' />  :
                        <FormattedMessage id='storage_document.status_confirmed' />
                    }
                    {titleType} {formData.documentNumber}
                </span> :
                <FormattedMessage id='storage.new_document' /> 
                }
                description={
                    <div>
                        <FormattedMessage id='order-page.creation_date'/>
                        { `: ${moment(dateTime).format('DD MMMM YYYY, HH:mm')}` }
                    </div>
                }
                controls={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {id ? 
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {formData.status != DONE ? 
                                <ChangeStatusDropdown
                                    type={formData.type}
                                    documentType={formData.documentType}
                                    updateDocument={this.updateFormData}
                                    setModal={setModal}
                                /> :
                                <Barcode
                                    barcodeValue={formData.documentNumber}
                                    iconStyle={{
                                        fontSize: 24
                                    }}
                                />
                            }
                            <ReportsDropdown
                                id={id}
                            />
                        </div>
                        : null}
                        {formData.status != DONE && (
                            <div style={{display: 'flex'}}>
                                {
                                    formData.type == ORDER && (
                                        !isForbidden(user, permissions.ACCESS_SUPPLIER_ORDER_STORE_DOCS_AUTO) && formData.documentType == SUPPLIER || 
                                        !isForbidden(user, permissions.ACCESS_INCOME_STORE_DOCS_AUTO) && formData.documentType == ORDERINCOME
                                    ) && 
                                        <AutomaticOrderCreationModal
                                            supplierId={formData.counterpartId}
                                            addDocProduct={this.addDocProduct}
                                            type={formData.type}
                                            documentType={formData.documentType}
                                            disabled={formData.status != NEW}
                                        />
                                }
                                {((formData.type == INCOME && formData.documentType == CLIENT) || (formData.type == EXPENSE && formData.documentType == SUPPLIER)) &&
                                    <ReturnModal
                                        counterpartId={formData.counterpartId}
                                        addDocProduct={this.addDocProduct}
                                        type={formData.type}
                                        documentType={formData.documentType}
                                        brands={brands}
                                        disabled={formData.status != NEW}
                                        user={user}
                                    />
                                }
                                <Badge 
                                    count={this.state.warnings}
                                    style={{ backgroundColor: 'var(--approve)' }} 
                                >
                                    <Icon
                                        type='save'
                                        style={{
                                            ...headerIconStyle,                                        }}
                                        onClick={()=>{
                                            if(id) {
                                                this.setState({loading: true});
                                                setTimeout(()=> this.updateDocument(true), 500);
                                            } 
                                            else {
                                                this.createDocument();
                                            }
                                        }}
                                    />
                                </Badge>
                            </div>
                        )}
                        {id && formData.status != DONE &&
                            <Popconfirm
                                type='danger'
                                title={ formatMessage({
                                    id: 'add_order_form.delete_confirm',
                                }) }
                                placement="bottom"
                                onConfirm={ () => {
                                    var that = this;
                                    let token = localStorage.getItem('_my.carbook.pro_token');
                                    let url = __API_URL__ + `/store_docs/${this.props.id}`;
                                    fetch(url, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': token,
                                        },
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
                                        that.props.history.goBack();
                                    })
                                    .catch(function (error) {
                                        console.log('error', error);
                                    });
                                } }
                            >
                                <Icon
                                    type='delete'
                                    style={headerIconStyle}
                                />
                            </Popconfirm>
                        }
                        <Icon
                            type='close'
                            style={headerIconStyle}
                            onClick={()=>{
                                this.props.history.goBack();
                            }}
                        />
                    </div>
                }
            >
                <StorageDocumentForm
                    id={id}
                    forceUpdate={forceUpdate}
                    clientList={clientList}
                    wrappedComponentRef={ this.saveFormRef }
                    warehouses={warehouses}
                    counterpartSupplier={counterpartSupplier}
                    employees={employees}
                    typeToDocumentType={typeToDocumentType}
                    updateFormData={this.updateFormData}
                    formData={formData}
                    brands={brands}
                    addDocProduct={this.addDocProduct}
                    deleteDocProduct={this.deleteDocProduct}
                    editDocProduct={this.editDocProduct}
                    loading={loading}
                    user={user}
                    mainWarehouseId={mainWarehouseId}
                    reserveWarehouseId={reserveWarehouseId}
                    toolWarehouseId={toolWarehouseId}
                    repairAreaWarehouseId={repairAreaWarehouseId}
                />
                <ToSuccessModal
                    visible={modal}
                    resetModal={resetModal}
                    remainPrice={formData.sum}
                    clientId={
                        formData.documentType == CLIENT ? 
                            formData.counterpartId : 
                            undefined
                    }
                    onSubmit={()=>{this.updateFormData({status: DONE}, true)}}
                    storeDocId={id}
                />
            </Layout>
        );
    }
}

export default StorageDocumentPage;

class ChangeStatusDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            payModalVisible: false,
        }
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item
                    onClick={()=>{
                        if(this.props.type == EXPENSE) {
                            this.props.setModal(MODALS.TO_SUCCESS)
                        } else {
                            this.props.updateDocument({status: DONE}, true);
                        }
                    }}
                >
                    <FormattedMessage id='storage_document.status_confirmed' />
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                <div 
                    style={ {
                        cursor:   'pointer',
                        marginRight: 5,
                    } }
                >
                    <Icon
                        type='swap'
                        style={{
                            marginRight: 5,
                            fontSize: 18
                        }}
                    />
                    <FormattedMessage id='change_status_dropdown.change_status' />
                </div>
            </Dropdown>
        );
    }
}

class ReportsDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item
                    onClick={async ()=>{
                        let token = localStorage.getItem('_my.carbook.pro_token');
                        let url = __API_URL__ + `/orders/reports/${this.props.id}`;
                        try {
                            const response = await fetch(url, {
                                method:  'GET',
                                headers: {
                                    Authorization: token,
                                },
                            });
                            const reportFile = await response.blob();

                            const contentDispositionHeader = response.headers.get(
                                'content-disposition',
                            );
                            const fileName = contentDispositionHeader.match(
                                /^attachment; filename="(.*)"/,
                            )[ 1 ];
                            await saveAs(reportFile, fileName);
                        } catch (error) {
                            console.error('ERROR:', error);
                        }
                    }}
                >
                    <FormattedMessage id='storage_document.document' />
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={ menu }>
                <Icon
                    type='printer'
                    style={headerIconStyle}
                />
            </Dropdown>
        );
    }
}

@injectIntl
class ReturnModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            brandSearchValue: "",
            storageProducts: [],
            recommendedReturnsVisible: false,
            returnDataSource: [],
            selectedProduct: {
                brandId: undefined,
                brandName: undefined,
                detailCode: undefined,
                detailName: undefined,
                stockPrice: 0,
                quantity: 0,
                storeDocProductId: undefined,
            }
        };

        this.returnTableColumns = [
            {
                title: <FormattedMessage id='storage_document.document' />,
                key: 'documentNumber',
                dataIndex: 'documentNumber',
            },
            {
                title: <FormattedMessage id='date' />,
                key: 'doneDatetime',
                dataIndex: 'doneDatetime',
                render: (doneDatetime, row) => {
                    return (
                        moment(doneDatetime).format('LL')
                    )
                },
            },
            {
                title: <FormattedMessage id='order_form_table.price' />,
                key: 'price',
                render: (row) => {
                    return this.props.documentType == CLIENT ? (
                        row.stockPrice
                    ) : (
                        row.sellingPrice
                    )
                },
            },
            {
                title: <FormattedMessage id='order_form_table.count' />,
                key: 'returnQuantity',
                dataIndex: 'returnQuantity',
            },
            {
                title: <FormattedMessage id='order_form_table.sum' />,
                key: 'sum',
                dataIndex: 'sum',
            },
            {
                title: <FormattedMessage id='storage_document.return' />,
                key: 'quantity',
                dataIndex: 'quantity',
                render: (quantity, row) => {
                    return (
                        <InputNumber
                            min={0}
                            max={row.returnQuantity}
                            value={quantity}
                            step={1}
                            onChange={(value)=>{
                                row.quantity = value;
                                this.setState({})
                            }}
                        />
                    )
                },
            },
            {
                key: 'select',
                render: (row) => {
                    return (
                        <Button
                            type='primary'
                            disabled={!row.quantity}
                            onClick={()=>{
                                this.state.selectedProduct.stockPrice = row.stockPrice || row.sellingPrice;
                                this.state.selectedProduct.quantity = row.quantity;
                                this.state.selectedProduct.storeDocProductId = row.storeDocProductId;
                                this.setState({
                                    recommendedReturnsVisible: false,
                                })
                            }}
                        >
                            <FormattedMessage id='select' />
                        </Button>
                    )
                },
            },
        ];
    }

    handleOk() {
        this.props.addDocProduct(this.state.selectedProduct);
        this.handleCancel();

    }

    handleCancel() {
        this.setState({
            visible: false,
            recommendedReturnsVisible: false,
            returnDataSource: [],
            brandSearchValue: "",
            storageProducts: [],
            selectedProduct: {
                brandId: undefined,
                brandName: undefined,
                detailCode: undefined,
                detailName: undefined,
                stockPrice: 0,
                quantity: 0,
                storeDocProductId: undefined,
            }
        });
    }

    getStorageProducts() {
        console.log(this);
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
            that.setState({
                storageProducts: data.list
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    fetchData() {
        this.getStorageProducts();
    }

    fetchReturnData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs/return?documentType=${this.props.documentType}&productId=${this.state.selectedProduct.productId}`;
        if(this.props.documentType == CLIENT) url += `&counterpartClientId=${this.props.counterpartId}`;
        else url += `&counterpartBusinessSupplierId=${this.props.counterpartId}`;
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
            data.map((elem, i)=>{
                elem.key = i;
                elem.quantity = elem.returnQuantity;
                elem.sum = Math.abs(elem.sum);
            })
            that.setState({
                returnDataSource: data,
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    render() {
        const {type, documentType, user } = this.props;
        const {
            visible,
            brandSearchValue,
            storageProducts,
            selectedProduct,
            recommendedReturnsVisible,
            returnDataSource,
        } = this.state;
        return (
            <div>
                <Icon
                    type="rollback"
                    style={{
                        ...headerIconStyle,
                        color: this.props.disabled ? 'var(--text2)' : null,
                        pointerEvents: this.props.disabled ? 'none' : 'all',
                    }}
                    onClick={()=>{
                        this.fetchData();
                        this.setState({
                            visible: true,
                        });
                    }}
                />
                <Modal
                    visible={visible}
                    width={'fit-content'}
                    okButtonProps={{disabled: !selectedProduct.storeDocProductId}}
                    onOk={()=>{
                        this.handleOk();
                    }}
                    onCancel={()=>{
                        this.handleCancel();
                    }}
                    maskClosable={false}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            margin: '24px 0 0 0',
                        }}
                    >
                        <div style={{minWidth: 140}}>
                            <FormattedMessage id='order_form_table.brand' />
                            <Select
                                disabled
                                value={selectedProduct.brandId}
                                style={{color: 'var(--text)'}}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            >
                                {this.props.brands.map((elem, index)=>(
                                    <Option key={index} value={elem.brandId} supplier_id={elem.supplierId}>
                                        {elem.brandName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <FormattedMessage id='order_form_table.detail_code' />
                            <Select
                                showSearch
                                value={selectedProduct.detailCode}
                                style={{color: 'var(--text)', minWidth: 180}}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                onChange={(value, option)=>{
                                    this.state.selectedProduct.detailCode = option.props.code;
                                    this.state.selectedProduct.brandId = option.props.brand_id;
                                    this.state.selectedProduct.detailName = option.props.name;
                                    this.state.selectedProduct.tradeCode = option.props.trade_code;
                                    this.state.selectedProduct.productId = value;
                                    this.setState({update: true})
                                }}
                            >
                                {this.state.storageProducts.map((elem, index)=>(
                                    <Option key={index} value={elem.id} brand_id={elem.brandId} name={elem.name} trade_code={elem.tradeCode} code={elem.code}>
                                        {elem.code}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {documentType == SUPPLIER &&
                            <div>
                                <FormattedMessage id='order_form_table.detail_code' /> (<FormattedMessage id='storage.supplier'/>)
                                <Input
                                    disabled
                                    value={selectedProduct.tradeCode}
                                    style={{
                                        color: 'var(--text)'
                                    }}
                                />
                            </div>
                        }
                        <div>
                            <FormattedMessage id='order_form_table.detail_name' />
                            <Input
                                disabled
                                value={selectedProduct.detailName}
                                style={{
                                    color: 'var(--text)'
                                }}
                            />
                        </div>
                        <div>
                            <div><FormattedMessage id='order_form_table.price' /></div>
                            <InputNumber
                                value={selectedProduct.stockPrice}
                                min={0}
                                onChange={(value)=>{
                                    selectedProduct.stockPrice = value;
                                    this.setState({})
                                }}
                            />
                        </div>
                        <div>
                            <div><FormattedMessage id='order_form_table.count' /></div>
                            <InputNumber
                                value={selectedProduct.quantity}
                                min={1}
                                onChange={(value)=>{
                                    selectedProduct.quantity = value;
                                    this.setState({})
                                }}
                            />
                        </div>
                        <div>
                            <div><FormattedMessage id='order_form_table.sum' /></div>
                            <InputNumber
                                disabled
                                value={Math.round(selectedProduct.quantity*selectedProduct.stockPrice*10)/10}
                                min={0}
                                style={{
                                    color: 'var(--text)'
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                disabled={!selectedProduct.detailCode}
                                type='primary'
                                onClick={()=>{
                                    this.fetchReturnData();
                                    this.setState({
                                        recommendedReturnsVisible: true,
                                    })
                                }}
                            >
                                <Icon type="unordered-list" />
                            </Button>
                        </div>  
                    </div>
                </Modal>
                <Modal
                    visible={recommendedReturnsVisible}
                    style={{
                        minWidth: '50%'
                    }}
                    width={'fit-content'}
                    onOk={()=>{
                        this.setState({
                            recommendedReturnsVisible: false,
                        })
                    }}
                    onCancel={()=>{
                        this.setState({
                            recommendedReturnsVisible: false,
                        })
                    }}
                    maskClosable={false}
                >
                    <Table 
                        columns={this.returnTableColumns}
                        dataSource={returnDataSource}
                    />
                </Modal>
            </div>
        );
    }
}

@injectIntl
class AutomaticOrderCreationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            visible: false,
            loading: true,
        };

        const { formatMessage } = props.intl;

        this.orderColumns = [
            {
                title:     "№",
                width:     '3%',
                key:       'key',
                dataIndex: 'key',
                render:     (data)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:     textToColumn(
                                formatMessage({id: 'order_form_table.detail_code'}),
                                formatMessage({id: 'order_form_table.brand'}),
                            ),
                width:     'auto',
                key:       'codeAndBrand',
                render:     (elem)=>{
                    return (
                        textToColumn(
                            elem.detailCode,
                            elem.brandName
                        )
                    )
                }
            },
            {
                title:     textToColumn(
                                `${formatMessage({id: 'order_form_table.detail_code'})} (${formatMessage({id: 'storage.supplier'})})`,
                                formatMessage({id: 'order_form_table.detail_name'}),
                            ),
                width:     'auto',
                key:       'SupplierCodeAndName',
                render:     (elem)=>{
                    return (
                        textToColumn(
                            elem.tradeCode,
                            elem.detailName
                        )
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.price' />,
                key:       'stockPrice',
                dataIndex: 'stockPrice',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={this.props.documentType == ADJUSTMENT}
                            style={{color: 'var(--text)'}}
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                elem.stockPrice = value;
                                elem.sum = elem.quantity * value;
                                this.setState({update: true});
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='storage.in_orders' />,
                key:       'countInOrders',
                dataIndex: 'countInOrders',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                            }}
                            value={data}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='storage.in_stock' />,
                key:       'countInWarehouses',
                dataIndex: 'countInWarehouses',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                            }}
                            value={data}
                        />
                    )
                }
            },
            {
                title:     textToColumn(
                                formatMessage({id: 'storage.reserve'}),
                                formatMessage({id: 'storage.min'}),
                            ),
                width:     'auto',
                key:       'storageBalanceReserveAndMin',
                render:     (elem)=>{
                    return (
                        <>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.reservedCount}
                                />
                            </div>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.min}
                                />
                            </div>
                        </>
                    )
                }
            },
            {
                title:     textToColumn(
                                formatMessage({id: 'storage.ordered'}),
                                formatMessage({id: 'storage.max'}),
                            ),
                width:     'auto',
                key:       'storageBalanceOrderedAndMax',
                render:     (elem)=>{
                    return (
                        <>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.countInStoreOrders}
                                />
                            </div>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.max}
                                />
                            </div>
                        </>
                    )
                }
            },
            {
                title:     textToColumn(
                                formatMessage({id: 'storage.deficit'}),
                                formatMessage({id: 'storage.to_order'}),
                            ),
                width:     'auto',
                key:       'storageBalanceDeficitAndToOrder',
                render:     (elem)=>{
                    return (
                        <>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.lack}
                                />
                            </div>
                            <div>
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.toOrder}
                                />
                            </div>
                        </>
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'quantity',
                dataIndex: 'quantity',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            max={this.props.documentType == ADJUSTMENT ? elem.toOrder : undefined}
                            onChange={(value)=>{
                                elem.quantity = value;
                                elem.sum = value * elem.stockPrice;
                                this.setState({update: true});
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.sum' />,
                key:       'sum',
                width:     'auto',
                render:     (elem)=>{
                    return (
                        <InputNumber
                            disabled
                            style={{
                                color: 'black',
                            }}
                            value={Math.round(elem.sum*10)/10}
                        />
                    )
                }
            },
            {
                key:       'switch',
                width:     'auto',
                render:     (elem)=>{
                    const checked = elem.checked;
                    return (
                        <Checkbox
                            checked={checked}
                            onChange={(event)=>{
                                elem.checked = event.target.checked;
                                this.setState({update: true})
                            }}
                        />
                    )
                }
            }
        ];

        this.incomeColumns = [
            {
                title:     "№",
                width:     '3%',
                key:       'key',
                dataIndex: 'key',
                render:     (data)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:     textToColumn(
                                formatMessage({id: 'order_form_table.detail_code'}),
                                formatMessage({id: 'order_form_table.brand'}),
                            ),
                width:     'auto',
                key:       'codeAndBrand',
                render:     (elem)=>{
                    return (
                        textToColumn(
                            elem.detailCode,
                            elem.brandName
                        )
                    )
                }
            },
            {
                title:     textToColumn(
                                `${formatMessage({id: 'order_form_table.detail_code'})} (${formatMessage({id: 'storage.supplier'})})`,
                                formatMessage({id: 'order_form_table.detail_name'}),
                            ),
                width:     'auto',
                key:       'SupplierCodeAndName',
                render:     (elem)=>{
                    return (
                        textToColumn(
                            elem.tradeCode,
                            elem.detailName
                        )
                    )
                }
            },
            {
                title:     <FormattedMessage id='storage.ordered' />,
                key:       'ordered',
                width:     'auto',
                children: [
                    {
                        title:     <FormattedMessage id='order_form_table.price' />,
                        key:       'orderedStockPrice',
                        dataIndex: 'orderedStockPrice',
                        width:     'auto',
                        render:     (data, elem)=>{
                            return (
                                <InputNumber
                                    disabled
                                    value={data}
                                    style={{
                                        color: 'black',
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title:     <FormattedMessage id='order_form_table.count' />,
                        key:       'orderedQuantity',
                        dataIndex: 'orderedQuantity',
                        width:     'auto',
                        render:     (data, elem)=>{
                            return (
                                <InputNumber
                                    disabled
                                    value={data}
                                    style={{
                                        color: 'black',
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title:     <FormattedMessage id='order_form_table.sum' />,
                        key:       'orderedSum',
                        width:     'auto',
                        render:     (elem)=>{
                            return (
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.orderedSum || 0}
                                />
                            )
                        }
                    },
                ],
            },
            {
                title:     'Пришло',
                key:       'income',
                width:     'auto',
                children: [
                    {
                        title:     <FormattedMessage id='order_form_table.price' />,
                        key:       'stockPrice',
                        dataIndex: 'stockPrice',
                        width:     'auto',
                        render:     (data, elem)=>{
                            return (
                                <InputNumber
                                    value={data}
                                    min={0}
                                    onChange={(value)=>{
                                        elem.stockPrice = value;
                                        elem.sum = value * elem.quantity;
                                        this.setState({update: true});
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title:     <FormattedMessage id='order_form_table.count' />,
                        key:       'quantity',
                        dataIndex: 'quantity',
                        width:     'auto',
                        render:     (data, elem)=>{
                            return (
                                <InputNumber
                                    value={data}
                                    min={0}
                                    onChange={(value)=>{
                                        elem.quantity = value;
                                        elem.sum = value * elem.stockPrice;
                                        this.setState({update: true});
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title:     <FormattedMessage id='order_form_table.sum' />,
                        key:       'sum',
                        width:     'auto',
                        render:     (elem)=>{
                            return (
                                <InputNumber
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                    value={elem.sum || 0}
                                />
                            )
                        }
                    },
                ],
            },
            {
                key:       'switch',
                width:     'auto',
                render:     (elem)=>{
                    const checked = elem.checked;
                    return (
                        <Checkbox
                            checked={checked}
                            onChange={(event)=>{
                                elem.checked = event.target.checked;
                                this.setState({update: true})
                            }}
                        />
                    )
                }
            }
        ]
    }

    handleOk() {
        const result = [];
        this.state.dataSource.map((elem)=>{
            if(elem.checked) {
                result.push(elem);
            }
        })
        this.props.addDocProduct(result, true);
        this.handleCancel();

    }

    handleCancel() {
        this.setState({
            dataSource: [],
            visible: false,
            loading: true,
        });
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        if(this.props.documentType == SUPPLIER) {
            let url = __API_URL__ + `/store_orders/recommended_products?businessSupplierId=${this.props.supplierId}`;
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
                data.map((elem, i)=>{
                    elem.quantity = elem.quantity || 1;
                    elem.toOrder = elem.quantity;
                    elem.key = i;
                    elem.detailName = elem.name;
                    elem.stockPrice = elem.stockPrice || 0;
                    elem.detailCode = elem.code;
                    elem.sum = Math.round( ((elem.quantity * elem.stockPrice) || 0)*10 ) / 10;
                    elem.groupId = elem.storeGroupId;
                    elem.tradeCode = elem.supplierPartNumber;
                    elem.checked = that.props.documentType == SUPPLIER;
                    console.log(elem)
                })
                that.setState({
                    dataSource: data,
                    loading: false,
                })
            })
            .catch(function(error) {
                console.log("error", error);
            });
        }
        else if(this.props.documentType == ORDERINCOME || this.props.documentType == ADJUSTMENT) {
            let url = __API_URL__ + `/store_orders/ordered_products?businessSupplierId=${this.props.supplierId}`;
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
                data.map((elem, i)=>{
                    elem.quantity = elem.quantity || 1;
                    elem.orderedSum = elem.sum;
                    elem.orderedStockPrice = elem.stockPrice;
                    elem.orderedQuantity = elem.quantity;
                    elem.productId = elem.id;
                    elem.toOrder = elem.quantity;
                    elem.brandName = elem.brand && elem.brand.name;
                    elem.key = i;
                    elem.detailName = elem.name;
                    elem.detailCode = elem.code;
                    elem.stockPrice = elem.stockPrice || 0;
                    elem.sum = Math.round( ((elem.quantity * elem.stockPrice) || 0)*10 ) / 10;
                    elem.orderedSum = elem.sum;
                    elem.groupId = elem.storeGroupId;
                    elem.tradeCode = elem.supplierPartNumber;
                    elem.checked = true;
                })
                that.setState({
                    dataSource: data,
                    loading: false,
                })
            })
            .catch(function(error) {
                console.log("error", error);
            });
        }
    }


    render() {
        const { visible, dataSource, loading } = this.state;
        return (
            <div>
                <Icon
                    type="check-circle"
                    style={{
                        ...headerIconStyle,
                        color: this.props.disabled ? 'var(--text2)' : null,
                        pointerEvents: this.props.disabled ? 'none' : 'all',
                    }}
                    onClick={()=>{
                        this.fetchData();
                        this.setState({
                            visible: true,
                        })
                    }}
                />
                <Modal
                    visible={visible}
                    width={'fit-content'}
                    onOk={()=>{
                        this.handleOk();
                    }}
                    onCancel={()=>{
                        this.handleCancel();
                    }}
                    maskClosable={false}
                >
                    <Table
                        columns={
                            this.props.documentType == ORDERINCOME ? 
                            this.incomeColumns : 
                            this.orderColumns
                        }
                        dataSource={dataSource}
                        pagination={{pageSize: 6}}
                        loading={loading}
                    />
                </Modal>
            </div>
        );
    }
}



function textToColumn(textFirst, textSecond) {
    return ( 
        <div>
            <p>
                {textFirst}
            </p>
            <p>
                {textSecond}
            </p>
        </div>
    )
}