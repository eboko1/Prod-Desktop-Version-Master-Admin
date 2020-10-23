// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'antd';

// proj
import { Layout, Spinner } from "commons";
import { getData } from "core/requisiteSettings/saga";
import { RequisiteSettingContainer } from "containers";
// own

export default class RequisiteSettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            requisiteData: undefined,
        };
    }

    showModal = (requisiteData = undefined) => {
        this.setState({
            modalVisible: true,
            requisiteData: requisiteData,
        })
    }

    hideModal = () => {
        this.setState({
            modalVisible: false,
            requisiteData: undefined,
        })
    }


    render() {
        const { modalVisible, requisiteData } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.requisites' /> }
                controls={[
                    <Button
                        type='primary'
                        onClick={()=>this.showModal()}
                    >
                        <FormattedMessage id='add' />
                    </Button>
                ]}
            >
                <RequisiteSettingContainer
                    getData={getData}
                    modalVisible={modalVisible}
                    showModal={this.showModal}
                    hideModal={this.hideModal}
                    requisiteData={requisiteData}
                />
            </Layout>
        );
    }
}
