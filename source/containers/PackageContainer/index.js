// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Table, Icon, Modal, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import book from 'routes/book';
import { PackageForm, AddPackageForm } from 'forms';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
import {
    setCreatePackage,
    setEditPackageId,
    createPackage,
    updatePackage,
    deletePackage,
    hideForms,
    handleError,
} from 'core/package/duck';

const mapDispatchToProps = {
    setCreatePackage,
    setEditPackageId,
    createPackage,
    updatePackage,
    deletePackage,
    hideForms,
    handleError,
};

const mapStateToProps = state => ({
    editPackageId:     state.packages.editPackageId,
    createPackageForm: state.packages.createPackageForm,
    packages:          state.packages.packages,
    errors:            state.packages.errors,
});

const openNotificationWithIcon = type => {
    notification[ type ]({
        message:     'Notification Title',
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class PackageContainer extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title:     <FormattedMessage id='package-container.index' />,
                dataIndex: 'index',
                width:     '10%',
                render:    field => field + 1,
            },
            {
                title:     <FormattedMessage id='package-container.name' />,
                dataIndex: 'name',
                width:     '25%',
            },
            {
                title:     <FormattedMessage id='package-container.roles' />,
                dataIndex: 'roles',
                width:     '35%',
                render:    field => field.map(({ name }) => name).join(','),
            },
            {
                title:  <FormattedMessage id='package-container.view' />,
                width:  '10%',
                render: record => (
                    <Link to={ `${book.packagePage}/${record.id}` }>
                        <Icon className={ Styles.viewPackageIcon } type='table' />
                    </Link>
                ),
            },
            {
                title:  <FormattedMessage id='package-container.edit' />,
                width:  '10%',
                render: record => (
                    <Icon
                        onClick={ () => this.props.setEditPackageId(record.id) }
                        className={ Styles.editPackageIcon }
                        type='edit'
                    />
                ),
            },
            {
                title:  <FormattedMessage id='package-container.delete' />,
                width:  '10%',
                render: record => (
                    <Icon
                        onClick={ () => this.props.deletePackage(record.id) }
                        className={ Styles.deletePackageIcon }
                        type='delete'
                    />
                ),
            },
        ];
    }

    render() {
        const {
            packages,
            createPackageForm,
            editPackageId,
            updatePackage,
            createPackage,
            errors,
        } = this.props;

        if (errors.length) {
            openNotificationWithIcon('error');
            this.props.handleError(errors[ 0 ].id);
        }

        const packageRows = packages.map((packageEntity, index) => ({
            ...packageEntity,
            index,
            key: packageEntity.id,
        }));

        const initPackageName =
            editPackageId && _.find(packages, { id: editPackageId }).name;

        return (
            <Catcher>
                <Button onClick={ () => this.props.setCreatePackage(true) }>
                    <FormattedMessage id='package-container.create' />
                </Button>
                <Modal
                    title={
                        editPackageId ? (
                            <FormattedMessage id='package-container.edit_title' />
                        ) : (
                            <FormattedMessage id='package-container.create_title' />
                        )
                    }
                    visible={ editPackageId || createPackageForm }
                    onCancel={ () => {
                        this.props.hideForms();
                    } }
                    footer={ null }
                >
                    { editPackageId && (
                        <PackageForm
                            editPackageId={ editPackageId }
                            initPackageName={ initPackageName }
                            updatePackage={ updatePackage }
                        />
                    ) ||
                        createPackageForm && (
                            <AddPackageForm createPackage={ createPackage } />
                        ) }
                </Modal>
                <Table dataSource={ packageRows } columns={ this.columns } />
            </Catcher>
        );
    }
}
