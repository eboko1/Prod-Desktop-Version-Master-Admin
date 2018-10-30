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
        const {
            initialService,
            form,
            intl,
            fields,
            loading,
            filters,

            updateService,
            createService,
            deleteService,
            resetFields,
        } = this.props;
        console.log('→ ServiceForm props', this.props);

        return (
            <Catcher>
                { /* <BusinessSearchField
                // businessId={ filters.businessId }
                // onSelect={ businessId => selectBusiness({ businessId }) }
                /> */ }
                <ArrayServiceInput
                    { ...this.props }
                    // loading={ loading }
                    // fields={ fields }
                    // resetFields={ resetFields }
                    // updateService={ updateService }
                    // createService={ createService }
                    // deleteService={ deleteService }
                    // initialService={ initialService }
                    // form={ form }
                    // intl={ intl }
                />
            </Catcher>
        );
    }
}
