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
            counterpartSupplier: [],
            formData: {
                type: undefined,
                documentType: undefined,
                docProducts: [],
            },
        }

        this.updateFormData = this.updateFormData.bind(this);
        this.updateDocProducts = this.updateDocProducts.bind(this);
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

    updateDocProducts(key, productData) {
        console.log(productData)
        const { brandId, productId, quantity, stockProce } = productData;
        if(key > this.state.formData.docProducts.length - 1) {
            this.state.formData.docProducts.push({
                brandId: brandId,
                productId: productId,
                quantity: quantity,
                stockProce: stockProce,
            })
        }
        else {
            this.state.formData.docProducts[key].brandId = brandId;
            this.state.formData.docProducts[key].productId = productId;
            this.state.formData.docProducts[key].quantity = quantity;
            this.state.formData.docProducts[key].stockProce = stockProce;
        }
        this.setState({
            update: true,
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    createDocument() {
        const { formData } = this.state
        console.log(formData);

        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/store_docs';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(formData)
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
        let url = __API_URL__ + '/business_suppliers';
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
            data.counterpartId = data.businessSupplierId;
            data.docProducts.map((elem, key)=>{
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
        this.getCounterpartSupplier();
        if(id) {
            this.getStorageDocument();
        }
    }

    render() {
        const { warehouses, counterpartSupplier, formData } = this.state;
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
                            {formData.status != 'DONE' && <ChangeStatusDropdown/>}
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
                    updateDocProducts={this.updateDocProducts}
                    formData={formData}
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
                    }}
                >
                    <FormattedMessage id='DONE' />
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
