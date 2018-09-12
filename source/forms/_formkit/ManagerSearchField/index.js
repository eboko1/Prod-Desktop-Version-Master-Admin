// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { setManagerSearchQuery } from 'core/search/duck';

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    managers:           state.search.managers,
    isFetchingManagers: state.search.isFetchingManagers,
    user:               state.auth,
});

const mapDispatchToProps = {
    setManagerSearchQuery,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ManagerSearchField extends Component {
    componentDidMount() {
        this.props.setManagerSearchQuery();
    }

    render() {
        const {
            onSelect,
            setManagerSearchQuery,
            user: { name, surname, id },
        } = this.props;
        const {
            managers: initManagers,
            isFetchingManagers,
            managerId,
        } = this.props;
        const managers = !_.find(initManagers, { managerId: id })
            ? [ ...initManagers, { managerId: id, managerName: name, managerSurname: surname }]
            : initManagers;

        return (
            <Select
                style={ { width: '60%' } }
                showSearch
                allowClear
                placeholder={ <FormattedMessage id='select_manager' /> }
                filterOption={ false }
                notFoundContent={
                    isFetchingManagers ? (
                        <Spin size='small' />
                    ) : (
                        <FormattedMessage id='not_found' />
                    )
                }
                onSearch={ item => setManagerSearchQuery(item) }
                onChange={ managerId => onSelect(managerId) }
                value={ managerId }
            >
                { isFetchingManagers
                    ? []
                    : managers.map(
                        ({ managerId, managerName, managerSurname }) => (
                            <Option key={ managerId } value={ managerId }>
                                { managerName } { managerSurname }
                            </Option>
                        ),
                    ) }
            </Select>
        );
    }
}
