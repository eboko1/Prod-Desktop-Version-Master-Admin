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
    console.log(state);
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
        }
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

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
            console.log(data);
            that.setState({
                warehouses: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.getWarehouses()
    }

    render() {
        console.log(this);
        const { warehouses } = this.state;
        const { id } = this.props;
        const dateTime = new Date();
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
                            <ChangeStatusDropdown/>
                            <ReportsDropdown/>
                        </>
                        : null}
                        <Icon
                            type='save'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={()=>{

                            }}
                        />
                        {id &&
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
                <StorageDocumentForm
                    wrappedComponentRef={ this.saveFormRef }
                    warehouses={warehouses}
                />
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
