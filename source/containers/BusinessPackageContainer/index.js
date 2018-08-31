// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Table, Icon, Modal, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    fetchBusinessPackages,
    createBusinessPackage,
    updateBusinessPackage,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateBusinessPackageForm,
    setShowUpdateBusinessPackageForm,
} from 'core/businessPackage/duck';

import { Catcher } from 'commons';
import { AddBusinessPackageForm, BusinessPackageForm } from 'forms';
import { BusinessSearchField } from 'forms/_formkit';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

const mapDispatchToProps = {
    createBusinessPackage,
    updateBusinessPackage,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateBusinessPackageForm,
    setShowUpdateBusinessPackageForm,
    fetchBusinessPackages,
};

const mapStateToProps = state => ({
    showCreateBusinessPackageForm:
        state.businessPackage.showCreateBusinessPackageForm,
    businessPackage:  state.businessPackage.businessPackage,
    businessPackages: state.businessPackage.businessPackages,
    rolesPackages:    state.businessPackage.rolesPackages,
    errors:           state.businessPackage.errors,
    sort:             state.businessPackage.sort,
    filters:          state.businessPackage.filters,
    page:             state.businessPackage.page,
    isFetching:       state.ui.businessPackageFetching,
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
export default class BusinessPackageContainer extends Component {
    constructor(props) {
        super(props);
        const { sort, setShowUpdateBusinessPackageForm } = props;
        const { formatMessage } = props.intl;

        this.columns = [
            {
                title: formatMessage({
                    id: 'business-package-container.business_name',
                }),
                dataIndex: 'businessName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'businessName'),
                width:     '15%',
            },
            {
                title: formatMessage({
                    id: 'business-package-container.business_address',
                }),
                dataIndex: 'businessAddress',
                width:     '20%',
            },
            {
                title: formatMessage({
                    id: 'business-package-container.activation_datetime',
                }),
                dataIndex: 'activationDatetime',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'activationDatetime'),
                width:     '15%',
                render:    (name, record) =>
                    moment(record.activationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: formatMessage({
                    id: 'business-package-container.expiration_datetime',
                }),
                dataIndex: 'expirationDatetime',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'expirationDatetime'),
                width:     '15%',
                render:    (name, record) =>
                    moment(record.expirationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: formatMessage({
                    id: 'business-package-container.package_name',
                }),
                dataIndex: 'packageName',
                sorter:    true,
                sortOrder: this._handleColumnOrder(sort, 'packageName'),
                width:     '20%',
            },

            {
                width:  '15%',
                render: record => (
                    <Icon
                        className={ Styles.businessEditIcon }
                        onClick={ () => setShowUpdateBusinessPackageForm(record) }
                        type='edit'
                    />
                ),
            },
        ];
    }

    componentDidMount() {
        this.props.fetchBusinessPackages();
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
            businesses,
            businessPackage,
            businessPackages,
            filters,
            rolesPackages,
            showCreateBusinessPackageForm,

            createBusinessPackage,
            updateBusinessPackage,
            setFilters,
            setShowCreateBusinessPackageForm,
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
                            <FormattedMessage id='business-package-container.package' />
                        }
                        colon={ false }
                    >
                        <Select
                            optionFilterProp='children'
                            allowClear
                            filterOption={ (input, option) =>
                                Boolean(
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase() !== -1),
                                )
                            }
                            onChange={ packageId =>
                                this.props.setFilters({ packageId })
                            }
                            value={ filters.packageId || void 0 }
                            showSearch
                        >
                            { rolesPackages.map(({ id, name }) => (
                                <Option key={ id } value={ id }>
                                    { name }
                                </Option>
                            )) }
                        </Select>
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
                    <Button
                        style={ { alignSelf: 'normal' } }
                        disabled={ !filters.businessId || !filters.packageId }
                        onClick={ () => setShowCreateBusinessPackageForm(true) }
                    >
                        <FormattedMessage id='business-package-container.create' />
                    </Button>
                </Form>
                <Table
                    size='small'
                    loading={ this.props.isFetching }
                    rowClassName={ record =>
                        moment(record.expirationDatetime).isBefore(moment())
                            ? Styles.expiredRaw
                            : null
                    }
                    rowKey={ record => record.id }
                    onChange={ this._handleTableChange }
                    pagination={ pagination }
                    dataSource={ businessPackages }
                    columns={ this.columns }
                />
                <Modal
                    title={
                        <FormattedMessage id='business-package-container.create_form_title' />
                    }
                    visible={ Boolean(
                        showCreateBusinessPackageForm &&
                            filters.businessId &&
                            filters.packageId,
                    ) }
                    onCancel={ () => this.props.hideForms() }
                    footer={ null }
                >
                    <AddBusinessPackageForm
                        { ...filters }
                        businessName={
                            filters.businessId &&
                            _.get(
                                _.find(businesses, {
                                    businessId: filters.businessId,
                                }),
                                'name',
                            )
                        }
                        packageName={
                            filters.packageId &&
                            _.get(
                                _.find(rolesPackages, {
                                    id: filters.packageId,
                                }),
                                'name',
                            )
                        }
                        createBusinessPackage={ createBusinessPackage }
                    />
                </Modal>
                <Modal
                    title={
                        <FormattedMessage id='business-package-container.edit_form_title' />
                    }
                    visible={ Boolean(businessPackage) }
                    onCancel={ () => this.props.hideForms() }
                    footer={ null }
                >
                    <BusinessPackageForm
                        businessPackage={ businessPackage }
                        updateBusinessPackage={ updateBusinessPackage }
                    />
                </Modal>
            </Catcher>
        );
    }
}
