// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Table, Icon, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    fetchServices,
    createService,
    updateService,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateServiceForm,
    setShowUpdateServiceForm,
} from 'core/services/duck';

import { Catcher } from 'commons';
import { AddServiceForm, ServiceForm } from 'forms';
import { BusinessSearchField } from 'forms/_formkit';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

const mapDispatchToProps = {
    createService,
    updateService,
    setSort,
    setPage,
    setFilters,
    hideForms,
    setShowCreateServiceForm,
    setShowUpdateServiceForm,
    fetchServices,
};

const mapStateToProps = state => ({
    showCreateServiceForm: state.services.showCreateServiceForm,
    services:              state.services.services,
    rolesPackages:         state.services.rolesPackages,
    errors:                state.services.errors,
    sort:                  state.services.sort,
    filters:               state.services.filters,
    page:                  state.services.page,
    isFetching:            state.ui.servicesFetching,
    businesses:            state.search.businesses,
});

const formItemLayout = {
    labelCol:   { span: 6 },
    wrapperCol: { span: 18 },
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
export default class ServiceContainer extends Component {
    componentDidMount() {
        this.props.fetchServices();
    }

    _handleColumnOrder = (sort, fieldName) =>
        sort.field === fieldName ? sortOptions[ sort.order ] : void 0;

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
            services,
            services,
            filters,
            rolesPackages,
            showCreateServiceForm,

            createService,
            updateService,
            setFilters,
            setShowCreateServiceForm,
        } = this.props;

        const { setShowUpdateServiceForm } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <Catcher>
                <Form layout='inline' className={ Styles.servicesFilters }>
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
                        disabled={ !filters.businessId }
                        onClick={ () => setShowCreateServiceForm(true) }
                    >
                        <FormattedMessage id='business-package-container.create' />
                    </Button>
                </Form>
                <ServicesForm
                    loading={ loading }
                    initialService={ initialService }
                    createService={ createEmployeeService.bind(null, employeeId) }
                    updateService={ updateEmployeeService.bind(null, employeeId) }
                    deleteService={ deleteEmployeeService.bind(null, employeeId) }
                    forbiddenUpdate={ isForbidden(
                        user,
                        permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                    ) }
                />
            </Catcher>
        );
    }
}
