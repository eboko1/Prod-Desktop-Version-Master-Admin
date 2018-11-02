// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Form, Button, Table, Icon, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { stateSelector, setFilters } from 'core/servicesSuggestions/duck';

import { Catcher } from 'commons';
import { ServicesForm } from 'forms';

import { ServicesTable } from 'components/Tables';

// own
// import Styles from './styles.m.css';

const mapDispatchToProps = {
    setFilters,
};

const mapStateToProps = state => ({
    ...stateSelector(state),
});

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
        const {
            deleteService,
            setFilters,
            servicesPartsSuggestions: {
                stats: { count },
                list,
            },
        } = this.props;

        return (
            <Catcher>
                <ServicesForm />
                { list ? (
                    <ServicesTable
                        data={ list }
                        deleteService={ deleteService }
                        setFilters={ setFilters }
                        count={ count }
                    />
                ) : null }
            </Catcher>
        );
    }
}
