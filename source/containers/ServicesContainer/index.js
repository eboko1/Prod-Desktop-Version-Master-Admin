// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Form, Button, Table, Icon, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { stateSelector, setFilters } from 'core/servicesSuggestions/duck';
import {
    createService,
    updateService,
    deleteService,
} from 'core/forms/servicesForm/duck';

import { Catcher } from 'commons';
import { Paper } from 'commons/_uikit';
import { ServicesForm } from 'forms';

import { ServicesTable, EditableTable } from 'components/Tables';

// own
// import Styles from './styles.m.css';

const mapDispatchToProps = {
    setFilters,
    createService,
    updateService,
    deleteService,
};

const mapStateToProps = state => ({
    loading: state.ui.suggestionsLoading,
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
            loading,
            createService,
            updateService,
            deleteService,
            setFilters,
            details,
            servicesPartsSuggestions: {
                stats: { count },
                list,
            },
        } = this.props;

        return (
            <Catcher>
                <Paper>
                    <ServicesForm />
                </Paper>
                { list ? (
                    <Paper>
                        <EditableTable
                            loading={ loading }
                            data={ list }
                            createService={ createService }
                            updateService={ updateService }
                            deleteService={ deleteService }
                            setFilters={ setFilters }
                            count={ count }
                            details={ details }
                        />
                    </Paper>
                ) : null }
            </Catcher>
        );
    }
}
