// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Table, Icon, Modal, Input } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    updateManagerRole,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setSearchQuery,
    setShowUpdateManagerRoleForm,
} from 'core/managerRole/duck';

import { Catcher } from 'commons';
import { ManagerRoleForm } from 'forms';
import { BusinessSearchField } from 'forms/_formkit';

// own
import Styles from './styles.m.css';

const FormItem = Form.Item;

const mapDispatchToProps = {
    updateManagerRole,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowUpdateManagerRoleForm,
    setSearchQuery,
};

const mapStateToProps = state => ({
    managerRole:  state.managerRole.managerRole,
    managerRoles: state.managerRole.managerRoles,
    errors:       state.managerRole.errors,
    sort:         state.managerRole.sort,
    filters:      state.managerRole.filters,
    page:         state.managerRole.page,
    count:        state.managerRole.count,
    searchQuery:  state.managerRole.searchQuery,
});

const formItemLayout = {
    labelCol:   { span: 6 },
    wrapperCol: { span: 14 },
};

const sortOptions = {
    asc:  'ascend',
    desc: 'descend',
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ManagerRoleContainer extends Component {
    constructor(props) {
        super(props);
        const { sort, setShowUpdateManagerRoleForm } = props;
        const { formatMessage } = props.intl;

        this.columns = [
            {
                title: formatMessage({
                    id: 'manager-role-container.business_name',
                }),
                dataIndex: 'businessName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'businessName'),
                width:     '25%',
            },
            {
                title: formatMessage({
                    id: 'manager-role-container.manager_name',
                }),
                dataIndex: 'managerName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'managerName'),
                width:     '20%',
            },
            {
                title: formatMessage({
                    id: 'manager-role-container.manager_surname',
                }),
                dataIndex: 'managerSurname',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'managerSurname'),
                width:     '20%',
            },
            {
                title: formatMessage({
                    id: 'manager-role-container.roles',
                }),
                dataIndex: 'roles',
                render:    name => name.map(({ roleName }) => roleName).join(','),
                width:     '20%',
            },

            {
                width:  '15%',
                render: record => (
                    <Icon
                        className={ Styles.businessEditIcon }
                        onClick={ () => setShowUpdateManagerRoleForm(record) }
                        type='edit'
                    />
                ),
            },
        ];
    }

    _handleColumnOrder = (sort, fieldName) =>
        sort.field === fieldName ? sortOptions[ sort.order ] : false;

    _handleTableChange = (pagination, filters, sorter) => {
        if (!sorter) {
            return;
        }
        const sort = {
            field: sorter.field,
            order: sorter.order === 'ascend' ? 'asc' : 'desc',
        };

        if (!_.isEqual(sort, this.props.sort)) {
            this.props.setSort(sort);
        }
    };

    render() {
        const {
            managerRole,
            managerRoles,
            filters,
            searchQuery,

            hideForms,
            setSearchQuery,
            updateManagerRole,
            setFilters,
        } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.page,
            onChange:         page => this.props.setPage(page),
        };

        return (
            <Catcher>
                <Form layout='inline' className={ Styles.businessPackageFilters }>
                    <FormItem
                        { ...formItemLayout }
                        className={ Styles.formItemSelectFilter }
                        label={
                            <FormattedMessage id='business-package-container.search' />
                        }
                        colon={ false }
                    >
                        <Input
                            value={ searchQuery }
                            onChange={ ({ target: { value } }) =>
                                setSearchQuery(value)
                            }
                        />
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        className={ Styles.formItemSelectFilter }
                        label={
                            <FormattedMessage id='business-package-container.business' />
                        }
                        colon={ false }
                    >
                        <BusinessSearchField
                            businessId={ filters.businessId }
                            onSelect={ businessId => setFilters({ businessId }) }
                        />
                    </FormItem>
                </Form>
                <Table
                    size='small'
                    rowKey={ record => record.managerId }
                    onChange={ this._handleTableChange }
                    pagination={ pagination }
                    dataSource={ managerRoles }
                    columns={ this.columns }
                />
                <Modal
                    title={
                        <FormattedMessage id='manager-role-container.edit_form_title' />
                    }
                    visible={ Boolean(managerRole) }
                    onCancel={ () => hideForms() }
                    footer={ null }
                >
                    { managerRole && (
                        <ManagerRoleForm
                            managerRole={ managerRole }
                            updateManagerRole={ updateManagerRole }
                        />
                    ) }
                </Modal>
            </Catcher>
        );
    }
}
