// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Tabs, Button, Icon} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { DiagnosticPatternsContainer } from 'containers';
import {
    API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate,
    getPartProblems
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';

@injectIntl
@withRouter

class DiagnosticPatternsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics`;
        url += params;
    
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
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }
    render() {
        const { spinner } = this.props;

        return spinner ? (
            <Spinner spin={ spinner }/>
        ) : (
            <Layout
                title={ <FormattedMessage id='diagnostic-page.title' /> }
                controls={
                    <Button
                        type='primary'
                        onClick={ () =>
                            alert('test')
                        }
                    >
                        <FormattedMessage id='diagnostic-page.add_new_template' />
                    </Button>
                }
            >
                <DiagnosticPatternsContainer/>
            </Layout>
        );
    }
}

export default DiagnosticPatternsPage;