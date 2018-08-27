// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Table, Icon, Modal, Select, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { AddBusinessPackageForm, BusinessPackageForm } from 'forms';
import { BusinessSearchContainer } from 'containers';

// own
import {
    createBusinessPackage,
    updateBusinessPackage,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateBusinessPackageForm,
    setShowUpdateBusinessPackageForm,
} from 'core/businessPackage/duck';
import Styles from './styles.m.css';

const mapDispatchToProps = {
    createBusinessPackage,
    updateBusinessPackage,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateBusinessPackageForm,
    setShowUpdateBusinessPackageForm,
};

const FormItem = Form.Item;
const Option = Select.Option;

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
    }

    render() {
        const {
            businesses,
            businessPackage,
            businessPackages,
            filters,
            rolesPackages,
            sort,
            showCreateBusinessPackageForm,

            createBusinessPackage,
            updateBusinessPackage,
            setFilters,
            setShowCreateBusinessPackageForm,
            setShowUpdateBusinessPackageForm,
        } = this.props;

        const handleColumnOrder = (sort, fieldName) =>
            sort.field === fieldName ? sortOptions[ sort.order ] : false;
        const getFormatMessage = id => this.props.intl.formatMessage({ id });

        const columns = [
            {
                title: getFormatMessage(
                    'business-package-container.business_name',
                ),
                dataIndex: 'businessName',
                sorter:    true,
                sortOrder: handleColumnOrder(sort, 'businessName'),
                width:     '15%',
            },
            {
                title: getFormatMessage(
                    'business-package-container.business_address',
                ),
                dataIndex: 'businessAddress',
                width:     '20%',
            },
            {
                title: getFormatMessage(
                    'business-package-container.activation_datetime',
                ),
                dataIndex: 'activationDatetime',
                sorter:    true,
                sortOrder: handleColumnOrder(sort, 'activationDatetime'),
                width:     '15%',
                render:    (name, record) =>
                    moment(record.activationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: getFormatMessage(
                    'business-package-container.expiration_datetime',
                ),
                dataIndex: 'expirationDatetime',
                sorter:    true,
                sortOrder: handleColumnOrder(sort, 'expirationDatetime'),
                width:     '15%',
                render:    (name, record) =>
                    moment(record.expirationDatetime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
            },
            {
                title: getFormatMessage(
                    'business-package-container.package_name',
                ),
                dataIndex: 'packageName',
                sorter:    true,
                sortOrder: handleColumnOrder(sort, 'packageName'),
                width:     '20%',
            },

            {
                width:  '15%',
                render: record => (
                    <Icon
                        onClick={ () => setShowUpdateBusinessPackageForm(record) }
                        type='edit'
                    />
                ),
            },
        ];

        const handleTableChange = (pagination, filters, sorter) => {
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

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.page,
            onChange:         page => this.props.setPage(page),
        };

        const { isFetchingBusinesses } = this.props;

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
                                !!~option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase())
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
                        <BusinessSearchContainer
                            businessId={ filters.businessId }
                            onSelect={ businessId => setFilters({ businessId }) }
                        />
                    </FormItem>
                    <Button
                        style={ { alignSelf: 'normal' } }
                        disabled={ !filters.businessId || !filters.packageId }
                        onClick={ () => setShowCreateBusinessPackageForm(true) }
                    >
                        {
                            <FormattedMessage id='business-package-container.create' />
                        }
                    </Button>
                </Form>
                <Table
                    size='small'
                    rowClassName={ record =>
                        moment(record.expirationDatetime).isBefore(moment())
                            ? Styles.expiredRaw
                            : null
                    }
                    rowKey={ record => record.id }
                    onChange={ handleTableChange }
                    pagination={ pagination }
                    dataSource={ businessPackages }
                    columns={ columns }
                />
                <Modal
                    title={
                        <FormattedMessage id='business-package-container.create_form_title' />
                    }
                    visible={
                        !!(
                            showCreateBusinessPackageForm &&
                            filters.businessId &&
                            filters.packageId
                        )
                    }
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
                    visible={ !!businessPackage }
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
