// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Form, Button, Table, Icon, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
// import {
//     fetchServices,
//     createService,
//     updateService,
//     setSort,
//     setPage,
//     setFilters,
//     hideForms,
//     setShowCreateServiceForm,
//     setShowUpdateServiceForm,
// } from 'core/services/duck';

import {
    fetchServices,
    createService,
    updateService,
    deleteService,
    resetFields,
    stateSelector,
} from 'core/forms/servicesForm/duck';

import { Catcher } from 'commons';
import { ServicesForm } from 'forms';

import { ServicesTable } from 'components/Tables';

// own
// import Styles from './styles.m.css';

const mapDispatchToProps = {
    fetchServices,
    createService,
    updateService,
    deleteService,
    resetFields,
    stateSelector,
};

const mapStateToProps = state => ({
    suggestionsList:
        _.get(
            state.forms.servicesForm.services.servicesPartsSuggestions,
            'list',
        ) || [],
    // errors:                state.services.errors,
    // sort:                  state.services.sort,
    // filters:               state.services.filters,
    // page:                  state.services.page,
});

// const formItemLayout = {
//     labelCol:   { span: 6 },
//     wrapperCol: { span: 18 },
// };
//
// const sortOptions = {
//     asc:  'ascend',
//     desc: 'descend',
// };

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ServiceContainer extends Component {
    // componentDidMount() {
    //     this.props.fetchServices();
    // }
    //
    // _handleColumnOrder = (sort, fieldName) =>
    //     sort.field === fieldName ? sortOptions[ sort.order ] : void 0;
    //
    // _handleTableChange = (pagination, filters, sorter) => {
    //     if (!sorter) {
    //         return;
    //     }
    //     const sort = {
    //         field: sorter.field,
    //         order: sorter.order === 'ascend' ? 'asc' : 'desc',
    //     };
    //
    //     if (!_.isEqual(sort, this.props.sort)) {
    //         this.props.setSort(sort);
    //     }
    // };
    render() {
        const { suggestionsList, deleteService } = this.props;

        return (
            <Catcher>
                <ServicesForm />
                { suggestionsList ? (
                    <ServicesTable
                        data={ suggestionsList }
                        deleteService={ deleteService }
                    />
                ) : null }
            </Catcher>
        );
    }
}
