// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

// proj
import { stateSelector, setFilters } from 'core/servicesSuggestions/duck';
import {
    createService,
    updateService,
    deleteService,
} from 'core/forms/servicesForm/duck';

import { Catcher, Paper } from 'commons';
import { ServicesForm } from 'forms';
import { EditableTable } from 'components';

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

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ServiceContainer extends Component {
    render() {
        const {
            loading,
            createService,
            updateService,
            deleteService,
            setFilters,
            details,
            filters,
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
                            filters={ filters }
                        />
                    </Paper>
                ) : null }
            </Catcher>
        );
    }
}
