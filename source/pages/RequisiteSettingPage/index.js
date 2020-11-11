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
import { getData, deleteRequisite, postRequisite, updateRequisite } from "core/requisiteSettings/saga";
import { RequisiteSettingContainer } from "containers";
// own

export default class RequisiteSettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            requisiteData: undefined,
            dataSource: [],
        };

        this.setDataSource = this.setDataSource.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = (requisiteData = undefined) => {
        this.setState({
            modalVisible: true,
            requisiteData: requisiteData,
        })
    }

    hideModal() {
        this.setState({
            modalVisible: false,
            requisiteData: undefined,
        })
        this.updateDataSource();
    }

    componentDidMount() {
        this.updateDataSource();
    }

    setDataSource(data) {
        data.map((elem, i)=>{
            elem.key=i;
        });
        this.setState({
            dataSource: data,
        })
    }

    async updateDataSource() {
        await getData(this.setDataSource);
        await this.setState({
            modalVisible: false,
            requisiteData: undefined,
        })
        await this.forceUpdate();
    }

    render() {
        const { modalVisible, requisiteData, dataSource } = this.state;
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
                    modalVisible={modalVisible}
                    showModal={this.showModal}
                    hideModal={this.hideModal}
                    requisiteData={requisiteData}
                    dataSource={dataSource}
                    updateDataSource={this.updateDataSource}
                    deleteRequisite={deleteRequisite}
                    postRequisite={postRequisite}
                    updateRequisite={updateRequisite}
                />
            </Layout>
        );
    }
}
