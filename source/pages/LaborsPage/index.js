// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import {
    API_URL,
} from 'core/forms/orderDiagnosticForm/saga';
import { Layout, Spinner } from 'commons';

export default class LaborsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labors: [],
        }
    }

    fetchLabors() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/labors`;
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
            that.setState({
                labors: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.fetchLabors();
    }

    render() {
        console.log(this.state);
        const {labors} = this.state.labors;
        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
            >
                {labors ? 
                labors.map((elem)=>(
                    <div>
                        <span>{elem.laborId}</span> - <span>{elem.name}</span>
                    </div>
                )) : null
            }
            </Layout>
        );
    }
}
