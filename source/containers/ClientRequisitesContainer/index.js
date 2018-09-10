// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, Modal, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    setCreateClientRequisiteForm,
    setEditClientRequisiteId,
    createClientRequisite,
    updateClientRequisite,
    deleteClientRequisite,
    hideForms,
} from 'core/clientRequisite/duck';
import { Catcher } from 'commons';
import { RequisiteForm, AddRequisiteForm } from 'forms';

// own
import Styles from './styles.m.css';

const mapDispatchToProps = {
    setCreateClientRequisiteForm,
    setEditClientRequisiteId,
    createClientRequisite,
    updateClientRequisite,
    deleteClientRequisite,
    hideForms,
};

const mapStateToProps = state => ({
    editClientRequisiteId:     state.clientRequisites.editClientRequisiteId,
    createClientRequisiteForm: state.clientRequisites.createClientRequisiteForm,
});
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientRequisitesContainer extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title:     <FormattedMessage id='client_requisites_container.index' />,
                dataIndex: 'index',
                width:     'auto',
                render:    field => field + 1,
            },
            {
                title:     <FormattedMessage id='client_requisites_container.enabled' />,
                dataIndex: 'enabled',
                width:     '11%',
                render:    record => {
                    return record ? (
                        <Icon
                            type='check-circle'
                        />
                    ) : (
                        <Icon
                            type='close-circle'
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='client_requisites_container.name' />,
                dataIndex: 'name',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='client_requisites_container.address' />,
                dataIndex: 'address',
                width:     '10%',
            },
            {
                title:     <FormattedMessage id='client_requisites_container.bank' />,
                dataIndex: 'bank',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='client_requisites_container.ifi' />,
                dataIndex: 'ifi',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='client_requisites_container.ca' />,
                dataIndex: 'ca',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='client_requisites_container.itn' />,
                dataIndex: 'itn',
                width:     '15%',
            },

            {
                // title:  <FormattedMessage id='ClientRequisite-container.edit' />,
                width:  '12%',
                render: record => (
                    <Icon
                        className={ Styles.editClientRequisiteIcon }
                        color='red'
                        onClick={ () => this.props.setEditClientRequisiteId(record.id) }
                        type='edit'
                    />
                ),
            },
            {
                // title:  <FormattedMessage id='ClientRequisite-container.delete' />,
                width:  '12%',
                render: record => (
                    <Icon
                        className={ Styles.deleteClientRequisiteIcon }
                        onClick={ () =>
                            this.props.deleteClientRequisite(
                                this.props.clientId,
                                record.id,
                            )
                        }
                        type='delete'
                    />
                ),
            },
        ];
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


        const requisitesRows = requisites.map((item, index) => ({
            ...item,
            index,
            key: item.id,
        }));

        const initClientRequisite = editClientRequisiteId && _.find(requisites, { id: editClientRequisiteId });

        return (
            <Catcher>
                <Row
                    type='flex'
                    justify='space-between'
                    align='top'
                    className={ Styles.header }>
                    <Col span={ 12 }>
                        <h2 className={ Styles.title }>
                            <FormattedMessage id='client_requisites_container.requisites_list' />
                        </h2>
                    </Col>
                    <Col span={ 6 }>
                        <Button
                            className={ Styles.addClientRequisiteButton }
                            type='primary'
                            onClick={ () => {
                                this.props.setCreateClientRequisiteForm(true);
                            } }
                        >
                            <FormattedMessage id='client_requisites_container.create' />
                        </Button>
                    </Col>
                </Row>



                <Modal
                    title={
                        editClientRequisiteId ? (
                            <FormattedMessage id='client_requisites_container.edit_title' />
                        ) : (
                            <FormattedMessage id='client_requisites_container.create_title' />
                        )
                    }
                    visible={ editClientRequisiteId || createClientRequisiteForm }
                    onCancel={ () => {
                        this.props.hideForms();
                    } }
                    footer={ null }
                >
                    { editClientRequisiteId && (
                        <RequisiteForm
                            editClientRequisiteId={ editClientRequisiteId }
                            requisite={ initClientRequisite }
                            updateRequisite={ updateClientRequisite.bind(null, clientId) }
                        />
                    ) ||
                    createClientRequisiteForm && (
                        <AddRequisiteForm
                            createRequisite={ createClientRequisite.bind(null, clientId) }
                        />
                    ) }
                </Modal>

                <Table
                    pagination={ {
                        hideOnSinglePage: true,
                        size:             'large',
                    } }
                    size='small'
                    dataSource={ requisitesRows }
                    columns={ this.columns }
                />
            </Catcher>
        );
    }
}
