// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Table, Icon, Modal, notification } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { PackageForm, AddPackageForm } from 'forms';
import book from 'routes/book';

// own
import {
    setCreatePackage,
    setEditPackageId,
    createPackage,
    updatePackage,
    deletePackage,
    hideForms,
    handleError,
} from 'core/package/duck';
import Styles from './styles.m.css';

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

const openNotificationWithIcon = (type, message, description) => {
    notification[ type ]({
        message,
        description,
    });
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class PackageContainer extends Component {
    constructor(props) {
        super(props);

        this.apiErrorsMap = {
            REFERENCE_VIOLATION: props.intl.formatMessage({
                id: 'package-container.roles_businesses_restriction',
            }),
            UNIQUE_CONSTRAINT_VIOLATION: props.intl.formatMessage({
                id: 'package-container.unique_name_error',
            }),
        };

        this.columns = [
            {
                title:     <FormattedMessage id='package-container.index' />,
                dataIndex: 'index',
                width:     'auto',
                render:    field => field + 1,
            },
            {
                title:     <FormattedMessage id='package-container.name' />,
                dataIndex: 'name',
                width:     '30%',
                render:    (name, record) => (
                    <Link to={ `${book.packagePage}/${record.id}` }>
                        { record.name }
                    </Link>
                ),
            },
            {
                title:     <FormattedMessage id='package-container.roles' />,
                dataIndex: 'roles',
                width:     '30%',
                render:    field => field.map(({ name }) => name).join(','),
            },
            // {
            //     title:  <FormattedMessage id='package-container.view' />,
            //     width:  '12%',
            //     render: record => (
            //         <Link to={ `${book.packagePage}/${record.id}` }>
            //             <Icon className={ Styles.viewPackageIcon } type='table' />
            //         </Link>
            //     ),
            // },
            {
                // title:  <FormattedMessage id='package-container.edit' />,
                width:  '15%',
                render: record => (
                    <Icon
                        onClick={ () => this.props.setEditPackageId(record.id) }
                        className={ Styles.editPackageIcon }
                        type='edit'
                    />
                ),
            },
            {
                // title:  <FormattedMessage id='package-container.delete' />,
                width:  '15%',
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
            setCreatePackage,
        } = this.props;

        if (errors.length) {
            const currentComponentErrors = errors.filter(({ response }) =>
                _.keys(this.apiErrorsMap).includes(_.get(response, 'message')));

            currentComponentErrors.forEach(componentError => {
                const description = this.apiErrorsMap[
                    componentError.response.message
                ];

                openNotificationWithIcon(
                    'error',
                    this.props.intl.formatMessage({
                        id: 'package-container.error',
                    }),
                    description,
                );
                this.props.handleError(componentError.id);
            });
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
                <Button
                    type='primary'
                    className={ Styles.addPackageButton }
                    onClick={ () => this.props.setCreatePackage(true) }
                >
                    <FormattedMessage id='package-container.create' />
                </Button>
                <Table
                    size='small'
                    pagination={ {
                        hideOnSinglePage: true,
                        size:             'large',
                    } }
                    dataSource={ packageRows }
                    columns={ this.columns }
                />
                <Modal
                    title={
                        editPackageId ? (
                            <FormattedMessage id='package-container.edit_title' />
                        ) : (
                            <FormattedMessage id='package-container.create_title' />
                        )
                    }
                    visible={ editPackageId || createPackageForm }
                    onCancel={ () => this.props.hideForms() }
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
            </Catcher>
        );
    }
}
