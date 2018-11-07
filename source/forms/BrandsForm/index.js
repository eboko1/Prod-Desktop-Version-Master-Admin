// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Modal, Select, Form, Button, Icon, InputNumber } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import {
    onChangeBrandsForm,
    fetchPriorityBrands,
    setSort,
    setSearchSuppliers,
    setSearchBusinesses,
    setSearchProducts,
    setUpdateBrands,
    updatePriorityBrand,
    deletePriorityBrand,
    createPriorityBrand,
} from 'core/forms/brandsForm/duck';
import { setModal, resetModal } from 'core/modals/duck';

import { DecoratedSelect, DecoratedInputNumber } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';
import { Catcher } from 'commons';
import Styles from '../../containers/ManagerRoleContainer/styles.m.css';

// own

const Option = Select.Option;
const FormItem = Form.Item;

const sortOptions = {
    asc:  'ascend',
    desc: 'descend',
};

@injectIntl
@withReduxForm({
    name:    'brandsForm',
    actions: {
        change: onChangeBrandsForm,
        fetchPriorityBrands,
        setSort,
        setSearchSuppliers,
        setSearchBusinesses,
        setSearchProducts,
        setUpdateBrands,
        updatePriorityBrand,
        deletePriorityBrand,
        createPriorityBrand,
        setModal,
        resetModal,
    },
})
export class BrandsForm extends Component {
    componentDidMount() {
        this.props.fetchPriorityBrands();
    }

    _getColumnOrder = (sort, fieldName) =>
        sort.field === fieldName ? sortOptions[ sort.order ] : void 0;

    _handleTableChange = (pagination, filters, sorter) => {
        if (!sorter) {
            return;
        }
        const sort = {
            field: sorter.columnKey,
            order: sorter.order === 'ascend' ? 'asc' : 'desc',
        };

        this.props.setSort(sort);
    };

    render() {
        const {
            form: { getFieldDecorator, validateFields },
        } = this.props;
        const priorityBrands = this.props.priorityBrands;
        const count = _.get(priorityBrands, [ 'stats', 'count' ], 0);
        const list = _.get(priorityBrands, [ 'list' ], []);
        const page = _.get(this.props, [ 'sort', 'page' ], 1);
        const sort = _.get(this.props, 'sort', {});
        const { formatMessage } = this.props.intl;

        const pagination = {
            pageSize:         11,
            size:             'large',
            total:            Math.ceil(count / 10) * 11,
            hideOnSinglePage: true,
            current:          page,
            onChange:         page => {
                this.props.setSort({ page });
            },
        };

        const getSearchSelect = (
            item,
            searchAction,
            idFieldName,
            valueFieldName,
            searchResults,
            idField = 'id',
        ) => {
            return (
                <DecoratedSelect
                    getFieldDecorator={ getFieldDecorator }
                    key={ `${item.id}-${idFieldName}` }
                    field={ `${item.id}.${idFieldName}` }
                    formItem
                    className={ Styles.brandsFormItem }
                    cnStyles={ Styles.brandsSelect }
                    showSearch
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    onFocus={ () =>
                        _.isNil(_.get(searchResults, [ item.id ])) &&
                        searchAction(item.id, '')
                    }
                    onSearch={ query => searchAction(item.id, query) }
                    initialValue={ item[ idFieldName ] || void 0 }
                    filterOption={ false }
                >
                    { _.uniqBy(
                        [
                            ..._.get(searchResults, [ item.id ], []),
                            {
                                [ idField ]: item[ idFieldName ],
                                name:        item[ valueFieldName ],
                            },
                        ],
                        value => value[ idField ],
                    ).map(({ [ idField ]: id, name }) => (
                        <Option value={ id } key={ String(id) }>
                            { name }
                        </Option>
                    )) }
                </DecoratedSelect>
            );
        };

        const columns = [
            {
                title:  formatMessage({ id: 'brands.business_name' }),
                width:  '20%',
                key:    'businessName',
                render: item => {
                    return getSearchSelect(
                        item,
                        this.props.setSearchBusinesses,
                        'businessId',
                        'businessName',
                        this.props.searchBusinesses,
                        'businessId',
                    );
                },
            },
            {
                title:     formatMessage({ id: 'brands.product_name' }),
                sorter:    true,
                sortOrder: this._getColumnOrder(sort, 'productName'),
                width:     '20%',
                key:       'productName',
                render:    item => {
                    return getSearchSelect(
                        item,
                        this.props.setSearchProducts,
                        'productId',
                        'productName',
                        this.props.searchProducts,
                        'productId',
                    );
                },
            },
            {
                title:  formatMessage({ id: 'brands.supplier_name' }),
                width:  '20%',
                key:    'supplierName',
                render: item => {
                    return getSearchSelect(
                        item,
                        this.props.setSearchSuppliers,
                        'supplierId',
                        'supplierName',
                        this.props.searchSuppliers,
                        'supplierId',
                    );
                },
            },
            {
                title:  formatMessage({ id: 'brands.priority' }),
                width:  '20%',
                key:    'priority',
                render: item => {
                    return (
                        <DecoratedInputNumber
                            getFieldDecorator={ getFieldDecorator }
                            className={ Styles.brandsFormItem }
                            field={ `${item.id}.priority` }
                            key={ `${item.id}-priority` }
                            min={ 0 }
                            max={ 500 }
                            formItem
                            rules={ [
                                {
                                    required: true,
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                            initialValue={ item.priority || void 0 }
                        />
                    );
                },
            },
            {
                width:  '20%',
                render: item => {
                    return item.id === -1 ? (
                        <div>
                            <Icon
                                className={ Styles.brandSaveIcon }
                                type='save'
                                onClick={ () => {
                                    validateFields(
                                        [ String(item.id) ],
                                        (err, values) => {
                                            if (!err) {
                                                this.props.createPriorityBrand(
                                                    _.chain(values)
                                                        .values()
                                                        .first()
                                                        .value(),
                                                );
                                            }
                                        },
                                    );
                                } }
                            />
                        </div>
                    ) : (
                        <div>
                            <Icon
                                className={ Styles.brandSaveIcon }
                                type='save'
                                onClick={ () => {
                                    validateFields(
                                        [ String(item.id) ],
                                        (err, values) => {
                                            if (!err) {
                                                this.props.updatePriorityBrand(
                                                    item.id,
                                                    _.chain(values)
                                                        .values()
                                                        .first()
                                                        .value(),
                                                );
                                            }
                                        },
                                    );
                                } }
                            />
                            <Icon
                                className={ Styles.brandDeleteIcon }
                                type='delete'
                                onClick={ () =>
                                    this.props.deletePriorityBrand(item.id)
                                }
                            />
                        </div>
                    );
                },
            },
        ];

        return (
            <Catcher>
                <Table
                    size='small'
                    columns={ columns }
                    dataSource={ [{ id: -1 }, ...list ] }
                    loading={ this.props.brandsFetching }
                    onChange={ this._handleTableChange }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    pagination={ pagination }
                    rowClassName={ ({ id }) => {
                        if (id === -1) {
                            return Styles.newBrandRow;
                        } else if (this.props.fields[ id ]) {
                            return Styles.editedBrandRow;
                        }
                    } }
                    // onChange={ handleTableChange }
                />
            </Catcher>
        );
    }
}
