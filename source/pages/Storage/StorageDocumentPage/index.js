// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Dropdown, Button, Icon, Menu } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { StorageDocumentForm } from 'forms';
import book from 'routes/book';
// own


const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      SUPPLIER = 'SUPPLIER',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTY = 'OWN_CONSUMPTY',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT';

const typeToDocumentType = {
    income: {
        type: [INCOME],
        documentType: [SUPPLIER, CLIENT, INVENTORY],
    },
    expense: {
        type: [EXPENSE],
        documentType: [SUPPLIER, CLIENT, INVENTORY, OWN_CONSUMPTY],
    },
    transfer: {
        type: [EXPENSE],
        documentType: [TRANSFER],
    },
    reserve: {
        type: [EXPENSE],
        documentType: [TRANSFER],
    },
    order: {
        type: [INCOME, EXPENSE],
        documentType: [SUPPLIER, ADJUSTMENT],
    }, 
}

@connect(
    mapStateToProps,
    null,
)
class StorageDocumentPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
            brands: [],
            counterpartSupplier: [],
            formData: {
                type: this.props.location.type,
                documentType: undefined,
                sum: 0,
                docProducts: [],
            },
        }

        this.updateFormData = this.updateFormData.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
        this.addDocProduct = this.addDocProduct.bind(this);
    }

    updateFormData(formData) {
        console.log(formData)
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
        console.log(this.state.formData)
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    createDocument() {
        const { formData } = this.state
        
        const createData = {
            status: 'NEW',
            warehouseId: formData.warehouseId || null,
            type: formData.type,
            documentType: formData.documentType,
            supplierDocNumber: formData.supplierDocNumber || null,
            counterpartBusinessSupplierId: formData.counterpartId || null,
            payUntilDatetime: formData.payUntilDatetime ? formData.payUntilDatetime.toISOString() : null,
            docProducts: [],
        }
        formData.docProducts.map((elem)=>{
            if(elem.productId) {
                createData.docProducts.push({
                    productId: elem.productId,
                    quantity: elem.quantity,
                    stockPrice: elem.stockPrice,
                })
            }
            else {
                createData.docProducts.push({
                    addToStore: true,
                    code: elem.detailCode,
                    name: elem.detailName,
                    brandId: elem.brandId,
                    groupId: elem.groupId,
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
            that.props.history.push(`${book.storageDocument}/${data.id}`)
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    updateDocument(status) {
        const { formData } = this.state
        
        const createData = {
            status: status,
            warehouseId: formData.warehouseId || null,
            supplierDocNumber: formData.supplierDocNumber || null,
            counterpartBusinessSupplierId: formData.counterpartId || null,
            payUntilDatetime: formData.payUntilDatetime ? formData.payUntilDatetime.toISOString() : null,
            docProducts: [],
        }
        formData.docProducts.map((elem)=>{
            if(elem.productId) {
                createData.docProducts.push({
                    productId: elem.productId,
                    quantity: elem.quantity,
                    stockPrice: elem.stockPrice,
                })
            }
            else {
                createData.docProducts.push({
                    addToStore: true,
                    code: elem.detailCode,
                    name: elem.detailName,
                    brandId: elem.brandId,
                    groupId: elem.groupId,
                    quantity: elem.quantity,
                    stockPrice: elem.stockPrice,
                })
            }
        })
        console.log(formData, createData);
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
        .then(function (data) {
            that.setState({
                warehouses: data,
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
            console.log(data);
            data.counterpartId = data.counterpartBusinessSupplierId;
            data.payUntilDatetime = moment(data.payUntilDatetime);
            data.docProducts.map((elem, key)=>{
                elem.brandId = elem.product.brandId,
                elem.brandName = elem.product.brandName,
                elem.detailCode = elem.product.code,
                elem.detailName = elem.product.name,
                elem.groupId = elem.product.groupId,
                elem.sum = elem.stockPrice * elem.quantity,
                elem.key = key;
            })
            that.setState({
                formData: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        const { id } = this.props;
        this.getWarehouses();
        this.getBrands()
        this.getCounterpartSupplier();
        if(id) {
            this.getStorageDocument();
        }
    }

    render() {
        const { warehouses, counterpartSupplier, formData, brands } = this.state;
        const { id } = this.props;
        const dateTime = formData.createdDatetime || new Date();
        return (
            <Layout
                title={ <FormattedMessage id='storage.new_document' /> }
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
                            {formData.status != 'DONE' && 
                            <ChangeStatusDropdown
                                updateDocument={this.updateDocument}
                            />}
                            <ReportsDropdown/>
                        </>
                        : null}
                        {formData.status != 'DONE' &&
                        <Icon
                            type='save'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={()=>{
                                if(id) {
                                    this.saveDocument();
                                } 
                                else {
                                    this.createDocument();
                                }
                            }}
                        />}
                        {id && formData.status != 'DONE' &&
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
                    wrappedComponentRef={ this.saveFormRef }
                    warehouses={warehouses}
                    counterpartSupplier={counterpartSupplier}
                    typeToDocumentType={typeToDocumentType}
                    updateFormData={this.updateFormData}
                    formData={formData}
                    brands={brands}
                    addDocProduct={this.addDocProduct}
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
                        this.props.updateDocument('DONE')
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
                    <FormattedMessage id='diagnosticAct' />
                </Menu.Item>
                <Menu.Item
                    onClick={()=>{
                    }}
                >
                    <FormattedMessage id='diagnosticResult' />
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
