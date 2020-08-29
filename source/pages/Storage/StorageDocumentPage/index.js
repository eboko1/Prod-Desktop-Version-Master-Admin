// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Dropdown, Button, Icon, Menu, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout, Spinner } from 'commons';
import { StorageDocumentForm } from 'forms';
import book from 'routes/book';
import { type } from 'ramda';
// own


const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      SUPPLIER = 'SUPPLIER',
      RESERVE = 'RESERVE',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTY = 'OWN_CONSUMPTY',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE';

const typeToDocumentType = {
    income: {
        type: INCOME,
        documentType: [SUPPLIER, CLIENT, INVENTORY],
    },
    expense: {
        type: EXPENSE,
        documentType: [CLIENT, SUPPLIER, INVENTORY, OWN_CONSUMPTY],
    },
    transfer: {
        type: EXPENSE,
        documentType: [TRANSFER],
    },
    reserve: {
        type: EXPENSE,
        documentType: [TRANSFER],
    },
    order: {
        type: ORDER,
        documentType: [SUPPLIER, ADJUSTMENT],
    }, 
}

@connect(
    mapStateToProps,
    null,
)
class StorageDocumentPage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
            brands: [],
            counterpartSupplier: [],
            clientList: [],
            formData: {
                type: INCOME,
                documentType: SUPPLIER,
                sum: 0,
                docProducts: [],
            },
            fetched: false,
        }

        this.updateFormData = this.updateFormData.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
        this.addDocProduct = this.addDocProduct.bind(this);
        this.deleteDocProduct = this.deleteDocProduct.bind(this);
        this.editDocProduct = this.editDocProduct.bind(this);
    }

    updateFormData(formData) {
        Object.entries(formData).map((field)=>{
            this.state.formData[field[0]] = field[1];
        })
        this.setState({
            update: true,
        })
    }

    addDocProduct(docProduct) {
        this.state.formData.docProducts.push({
            key: this.state.formData.docProducts.length,
            ...docProduct
        });
        this.state.formData.sum += docProduct.sum,
        this.setState({
            update: true,
        })
    }

    deleteDocProduct(key) {
        const {formData } = this.state;
        formData.sum -= formData.docProducts[key].sum;
        const tmpProducts = [...formData.docProducts.filter((elem)=>elem.key != key)];
        tmpProducts.map((elem, i)=>{elem.key = i});
        this.updateFormData({docProducts: tmpProducts});
        this.forceUpdate()
    } 

    editDocProduct(key, docProduct) {
        console.log(key, docProduct);
        const {formData } = this.state;
        
        formData.docProducts[key] = {
            key: key,
            ...docProduct
        };
        formData.sum = 0;
        formData.docProducts.map((elem)=>{
            formData.sum += elem.quantity * elem.stockPrice;
        })
        this.setState({
            update: true,
        })
    }

    //saveFormRef = formRef => {
    //    this.formRef = formRef;
    //};

    verifyFields() {
        const { formData } = this.state;
        const showError = () => {
            notification.error({
                message: 'Заполните все необходимые поля',
            });
        }

        if(!formData.type || !formData.docProducts.length) {
            showError();
            return false;
        }

        switch(formData.type) {
            case INCOME:
            case EXPENSE:
                if((!formData.incomeWarehouseId && !formData.expenseWarehouseId) || !formData.counterpartId) {
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
            case RESERVE:
                createData.type = EXPENSE;
                createData.documentType = TRANSFER;
                createData.warehouseId = formData.expenseWarehouseId;
                createData.counterpartWarehouseId = formData.incomeWarehouseId;
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
                createData.counterpartBusinessSupplierId = formData.counterpartId;
                createData.context = ORDER;
                delete createData.warehouseId;
                break;
        }

        formData.docProducts.map((elem)=>{
            if(elem.productId) {
                createData.docProducts.push({
                    productId: elem.productId,
                    quantity: elem.quantity,
                    stockPrice: elem.stockPrice,
                })
            }
        })
        console.log(formData, createData);
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
            that.props.history.push(`${book.storageDocument}/${data.id}`);
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    updateDocument(status=NEW) {
        if(!this.verifyFields()) {
            return;
        }

        const { formData } = this.state
        
        const createData = {
            status: status,
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
            case RESERVE:
                createData.warehouseId = formData.expenseWarehouseId;
                createData.counterpartWarehouseId = formData.incomeWarehouseId;
                break;
            case ORDER:
                createData.counterpartBusinessSupplierId = formData.counterpartId;
                break;
        }

        formData.docProducts.map((elem)=>{
            if(elem.productId) {
                createData.docProducts.push({
                    productId: elem.productId,
                    quantity: elem.quantity,
                    stockPrice: elem.stockPrice,
                })
            }
        })
        console.log('upd', formData, createData);
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
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
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
            const type = that.props.location.type;
            if(type && warehouses.length) {
                that.state.formData.type = type;
                var { incomeWarehouseId, expenseWarehouseId } = that.state.formData;
                switch(type) {
                    case INCOME:
                        incomeWarehouseId = warehouses[0].id;
                        break
                    case EXPENSE:
                        expenseWarehouseId = warehouses[0].id;
                        break;
                    case TRANSFER:
                    case RESERVE:
                        incomeWarehouseId = warehouses[0].id;
                        incomeWarehouseId = warehouses[1].id;
                        break;
                    case ORDER:
                        incomeWarehouseId = warehouses[0].id;
                        break;
                }
                that.state.formData.documentType = typeToDocumentType[type.toLowerCase()].documentType[0];
                that.state.formData.incomeWarehouseId = incomeWarehouseId;
                that.state.formData.expenseWarehouseId = expenseWarehouseId;
            }
            that.setState({
                warehouses: warehouses,
                fetched: true,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getCounterpartSupplier() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/business_suppliers?super=true';
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
            console.log(data);
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
        .then(function (data) { console.log(data)
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
                  BOR = 'BOR';

            data.counterpartId = data.counterpartBusinessSupplierId;
            data.payUntilDatetime = data.payUntilDatetime && moment(data.payUntilDatetime);
            data.docProducts.map((elem, key)=>{
                elem.brandId = elem.product.brandId,
                elem.brandName = elem.product.brand.name,
                elem.detailCode = elem.product.code,
                elem.detailName = elem.product.name,
                elem.groupId = elem.product.groupId,
                elem.tradeCode = elem.product.tradeCode,
                elem.sum = elem.stockPrice * elem.quantity,
                elem.key = key;
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
                    break;
                case RES:
                    data.type = RESERVE;
                    break;
                case ORD:
                case BOR:
                    data.type = ORDER;
                    break;
                
            }

            switch (data.type) {
                case INCOME:
                    data.incomeWarehouseId= data.warehouseId;
                    break;
                case EXPENSE:
                    data.expenseWarehouseId= data.warehouseId;
                    break;
                case TRANSFER:
                case RESERVE:
                    data.incomeWarehouseId = data.counterpartWarehouseId;
                    data.expenseWarehouseId= data.warehouseId;
                    break;
            }

            that.setState({
                formData: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const { id, location: { type } } = this.props;
        this.getBrands();
        this.getClientList();
        this.getCounterpartSupplier();
        if(this._isMounted) this.getWarehouses();
        if(id) {
            this.getStorageDocument();
        }
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { warehouses, counterpartSupplier, formData, brands, clientList, fetched } = this.state;
        const { id } = this.props;
        const dateTime = formData.createdDatetime || new Date();
        return !fetched ? (
            <Spinner spin={true}/>
            ) : (
            <Layout
                title={ id ? 
                <span>{formData.documentNumber}</span> :
                <FormattedMessage id='storage.new_document' /> 
                }
                description={
                    <>
                        <FormattedMessage id='order-page.creation_date'/>
                        { `: ${moment(dateTime).format('DD MMMM YYYY, HH:mm')}` }
                    </>
                }
                controls={
                    <>
                        {id ? 
                        <>
                            {formData.status != DONE && 
                            <ChangeStatusDropdown
                                updateDocument={this.updateDocument}
                            />}
                            <ReportsDropdown/>
                        </>
                        : null}
                        {formData.status != DONE &&
                        <Icon
                            type='save'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={()=>{
                                if(id) {
                                    this.updateDocument();
                                } 
                                else {
                                    this.createDocument();
                                }
                            }}
                        />}
                        {id && formData.status != DONE &&
                        <Icon
                            type='delete'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={()=>{

                            }}
                        />}
                        <Icon
                            type='close'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                            } }
                            onClick={()=>{
                                this.props.history.goBack();
                            }}
                        />
                    </>
                }
            >
                <div>
                <StorageDocumentForm
                    clientList={clientList}
                    wrappedComponentRef={ this.saveFormRef }
                    warehouses={warehouses}
                    counterpartSupplier={counterpartSupplier}
                    typeToDocumentType={typeToDocumentType}
                    updateFormData={this.updateFormData}
                    formData={formData}
                    brands={brands}
                    addDocProduct={this.addDocProduct}
                    deleteDocProduct={this.deleteDocProduct}
                    editDocProduct={this.editDocProduct}
                />
                </div>
            </Layout>
        );
    }
}

export default StorageDocumentPage;

class ChangeStatusDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item
                    onClick={()=>{
                        this.props.updateDocument(String(DONE))
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
                        margin:   '0 10px',
                    } }
                >
                    <Icon
                        type='swap'
                        style={ {
                            fontSize: 24,
                            cursor:   'pointer',
                            margin:   '0 10px',
                        } }
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
                    onClick={()=>{
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
                    style={ {
                        fontSize: 24,
                        cursor:   'pointer',
                        margin:   '0 10px',
                    } }
                />
            </Dropdown>
        );
    }
}
