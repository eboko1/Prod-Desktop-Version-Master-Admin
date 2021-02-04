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
import { permissions, isForbidden } from 'utils';
// own

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
export default class RequisiteSettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            requisiteData: undefined,
            dataSource: [],
            loading: true,
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

    async componentDidMount() {
        await this.updateDataSource();
        if(this.props.location.state && this.props.location.state.showForm) {
            this.setState({
                modalVisible: true,
            })
        }
    }

    setDataSource(data) {
        data.map((elem, i)=>{
            elem.key=i;
        });
        this.setState({
            dataSource: data,
            loading: false,
        })
    }

    async updateDataSource() {
        await this.setState({
            loading: true,
        })
        await getData(this.setDataSource);
        await this.setState({
            modalVisible: false,
            requisiteData: undefined,
        })
        await this.forceUpdate();
    }

    render() {
        const { user } = this.props;
        const { modalVisible, requisiteData, dataSource, loading } = this.state;

        const isCRUDForbidden = isForbidden(user, permissions.ACCESS_CATALOGUE_REQUISITES_CRUD);
        return (
            <Layout
                title={ <FormattedMessage id='navigation.requisites' /> }
                controls={[
                    <Button
                        type='primary'
                        onClick={()=>this.showModal()}
                        disabled={isCRUDForbidden}
                    >
                        <FormattedMessage id='add' />
                    </Button>
                ]}
            >
                <RequisiteSettingContainer
                    loading={loading}
                    modalVisible={modalVisible}
                    showModal={this.showModal}
                    hideModal={this.hideModal}
                    requisiteData={requisiteData}
                    dataSource={dataSource}
                    updateDataSource={this.updateDataSource}
                    deleteRequisite={deleteRequisite}
                    postRequisite={postRequisite}
                    updateRequisite={updateRequisite}
                    disabled={isCRUDForbidden}
                />
            </Layout>
        );
    }
}
