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

class StorageDocumentPage extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.incomes' /> }
                controls={
                    <>
                        <ChangeStatusDropdown/>
                        <ReportsDropdown/>
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
                        <Icon
                            type='delete'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                                margin:   '0 10px',
                            } }
                            onClick={()=>{

                            }}
                        />
                        <Icon
                            type='close'
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                            } }
                            onClick={()=>{

                            }}
                        />
                    </>
                }
            >
                <StorageDocumentForm
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
