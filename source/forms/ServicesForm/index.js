// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

// proj
import {
    onChangeServicesForm,
    fetchServices,
    createService,
    updateService,
    deleteService,
    resetFields,
    stateSelector,
} from 'core/forms/servicesForm/duck';
// import { selectBusiness } from 'core/form/servicesForm/duck';

import { Catcher } from 'commons';
import { ArrayServiceInput, BusinessSearchField } from 'forms/_formkit';
import { withReduxForm2 } from 'utils';

// own

@injectIntl
@withReduxForm2({
    name:    'servicesForm',
    actions: {
        change: onChangeServicesForm,
        fetchServices,
        resetFields,
        createService,
        updateService,
        deleteService,
        // selectBusiness,
    },
    mapStateToProps: state => ({
        ...stateSelector(state),
    }),
})
export class ServicesForm extends Component {
    render() {
        return (
            <Catcher>
                <ArrayServiceInput { ...this.props } />
            </Catcher>
        );
    }
}
