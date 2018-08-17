// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { RoleForm, AddRoleForm } from 'forms';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
import {
    setCreateRoleForm,
    setEditRoleId,
    createRole,
    updateRole,
    deleteRole,
    hideForms,
} from 'core/role/duck';

const mapDispatchToProps = {
    setCreateRoleForm,
    setEditRoleId,
    createRole,
    updateRole,
    deleteRole,
    hideForms,
};

const mapStateToProps = state => ({
    editRoleId:     state.roles.editRoleId,
    createRoleForm: state.roles.createRoleForm,
    roles:          state.roles.roles,
});

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class RoleContainer extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title:     <FormattedMessage id='role-container.index' />,
                dataIndex: 'index',
                width:     'auto',
                render:    field => field + 1,
            },
            {
                title:     <FormattedMessage id='role-container.name' />,
                dataIndex: 'name',
                width:     '20%',
            },
            {
                title:     <FormattedMessage id='role-container.grants' />,
                dataIndex: 'grants',
                width:     '30%',
                render:    field =>
                    field
                        .map(grant =>
                            this.props.intl.formatMessage({
                                id: `role-container.${grant.toLowerCase()}`,
                            }))
                        .map(message => 
                            <>
                                {message} <br />
                            </>),
            },
            {
                title:  <FormattedMessage id='role-container.grant_other' />,
                width:  '12%',
                render: record =>
                    record.grantOther ? (
                        <Icon
                            className={ Styles.editRoleIcon }
                            type='check-circle'
                        />
                    ) : (
                        <Icon
                            className={ Styles.editRoleIcon }
                            type='close-circle'
                        />
                    ),
            },
            {
                // title:  <FormattedMessage id='role-container.edit' />,
                width:  '12%',
                render: record => (
                    <Icon
                        color='red'
                        onClick={ () => this.props.setEditRoleId(record.id) }
                        className={ Styles.editRoleIcon }
                        type='edit'
                    />
                ),
            },
            {
                // title:  <FormattedMessage id='role-container.delete' />,
                width:  '12%',
                render: record => (
                    <Icon
                        onClick={ () =>
                            this.props.deleteRole(
                                this.props.packageId,
                                record.id,
                            )
                        }
                        className={ Styles.deleteRoleIcon }
                        type='delete'
                    />
                ),
            },
        ];
    }

    render() {
        const {
            roles,
            createRoleForm,
            editRoleId,
            updateRole,
            createRole,
            packageId,
        } = this.props;

        // TODO reselect
        const roleRows = roles.map((item, index) => ({
            ...item,
            index,
            key: item.id,
        }));

        const initRole = editRoleId && _.find(roles, { id: editRoleId });

        return (
            <Catcher>
                <Button
                    className={ Styles.addRoleButton }
                    type='primary'
                    onClick={ () => {
                        this.props.setCreateRoleForm(true);
                    } }
                >
                    <FormattedMessage id='role-container.create' />
                </Button>
                <Modal
                    title={
                        editRoleId ? (
                            <FormattedMessage id='role-container.edit_title' />
                        ) : (
                            <FormattedMessage id='role-container.create_title' />
                        )
                    }
                    visible={ editRoleId || createRoleForm }
                    onCancel={ () => {
                        this.props.hideForms();
                    } }
                    footer={ null }
                >
                    { editRoleId && (
                        <RoleForm
                            editRoleId={ editRoleId }
                            role={ initRole }
                            updateRole={ updateRole.bind(null, packageId) }
                        />
                    ) ||
                        createRoleForm && (
                            <AddRoleForm
                                createRole={ createRole.bind(null, packageId) }
                            />
                        ) }
                </Modal>
                <Table
                    pagination={ {
                        hideOnSinglePage: true,
                        size:             'large',
                    } }
                    size='small'
                    dataSource={ roleRows }
                    columns={ this.columns }
                />
            </Catcher>
        );
    }
}
