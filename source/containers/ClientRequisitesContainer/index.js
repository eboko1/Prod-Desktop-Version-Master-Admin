// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Table, Icon, Modal, Row, Col } from "antd";
import _ from "lodash";

// proj
import {
    setCreateClientRequisiteForm,
    setEditClientRequisiteId,
    createClientRequisite,
    updateClientRequisite,
    deleteClientRequisite,
    hideForms,
} from "core/clientRequisite/duck";

import { Catcher } from "commons";
import { RequisiteForm, AddRequisiteForm } from "forms";
import { RequisiteSettingContainer } from "containers";
import { getData } from "core/requisiteSettings/saga";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    editClientRequisiteId: state.clientRequisites.editClientRequisiteId,
    createClientRequisiteForm: state.clientRequisites.createClientRequisiteForm,
});

const mapDispatchToProps = {
    setCreateClientRequisiteForm,
    setEditClientRequisiteId,
    createClientRequisite,
    updateClientRequisite,
    deleteClientRequisite,
    hideForms,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class ClientRequisitesContainer extends Component {
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
        const {
            requisites,
            createClientRequisiteForm,
            editClientRequisiteId,
            updateClientRequisite,
            createClientRequisite,
            clientId,
        } = this.props;

        const { modalVisible, dataSource, requisiteData } = this.state;

        const requisitesRows = requisites.map((item, index) => ({
            ...item,
            key: index,
        }));

        console.log(requisitesRows)

        const initClientRequisite =
            editClientRequisiteId &&
            _.find(requisites, { id: editClientRequisiteId });

        return (
            <Catcher>
                <Row
                    type="flex"
                    justify="space-between"
                    align="top"
                    className={Styles.header}
                >
                    <Col span={12}>
                        <h2 className={Styles.title}>
                            <FormattedMessage id="client_requisites_container.requisites_list" />
                        </h2>
                    </Col>
                    <Col span={6}>
                        <Button
                            type='primary'
                            onClick={()=>this.showModal()}
                        >
                            <FormattedMessage id='client_requisites_container.create' />
                        </Button>
                    </Col>
                </Row>


                <RequisiteSettingContainer
                    modalVisible={modalVisible}
                    showModal={this.showModal}
                    hideModal={this.hideModal}
                    requisiteData={requisiteData}
                    dataSource={requisitesRows}
                    
                    updateDataSource={this.updateDataSource}
                    /*deleteRequisite={deleteRequisite}
                    postRequisite={postRequisite}
                    updateRequisite={updateRequisite}*/
                />
            </Catcher>
        );
    }
}
