// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Form, Icon, Select } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchServicesSuggestions,
    selectServicesSuggestionsOptions,
} from 'core/servicesSuggestions/duck';
import {
    onChangeServicesForm,
    createService,
    updateService,
    deleteService,
    resetFields,
} from 'core/forms/servicesForm/duck';
// import { selectBusiness } from 'core/form/servicesForm/duck';

import { Catcher } from 'commons';
import {
    DecoratedInputNumber,
    DecoratedSelect,
    LimitedDecoratedSelect,
} from 'forms/DecoratedFields';
// import { BusinessSearchField } from 'forms/_formkit';
import { withReduxForm2 } from 'utils';

// own
const Option = Select.Option;

@injectIntl
@withReduxForm2({
    name:    'servicesForm',
    actions: {
        change: onChangeServicesForm,
        fetchServicesSuggestions,
        resetFields,
        createService,
        updateService,
        deleteService,
        // selectBusiness,
    },
    mapStateToProps: state => ({
        ...selectServicesSuggestionsOptions(state),
    }),
})
export class ServicesForm extends Component {
    render() {
        const {
            form,
            resetFields,
            createService,
            updateService,
            deleteService,

            services,
            details,
        } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Catcher>
                <Form layout='horizontal'>
                    { /* <BusinessSearchField /> */ }
                    <DecoratedSelect
                        // cnStyles={ Styles.select }
                        field={ 'serviceId' }
                        getFieldDecorator={ getFieldDecorator }
                        // initialValue={ _getDefaultValue(key, 'serviceId') }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '50%' } }
                        mode={ 'combobox' }
                        optionLabelProp={ 'children' }
                        optionFilterProp={ 'children' }
                        showSearch
                    >
                        { services.map(({ serviceId, serviceName }) => (
                            <Option value={ String(serviceId) } key={ serviceId }>
                                { serviceName }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <LimitedDecoratedSelect
                        // cnStyles={
                        //     getFieldValue(
                        //         `details[${key}][multipleSuggestions]`,
                        //     )
                        //         ? Styles.multipleSuggest
                        //         : void 0
                        // }
                        field={ 'detailId' }
                        getFieldDecorator={ getFieldDecorator }
                        mode={ 'combobox' }
                        optionLabelProp={ 'children' }
                        showSearch
                        // onChange={ value =>
                        //     this._handleDetailSelect(key, value, modificationId)
                        // }
                        // initialValue={ this._getDefaultValue(key, 'detailName') }
                        // placeholder={ detailSelectPlaceholder }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '50%' } }
                        // defaultValues={ defaultDetails }
                    >
                        { details.map(({ detailId, detailName }) => (
                            <Option value={ String(detailId) } key={ detailId }>
                                { detailName }
                            </Option>
                        )) }
                    </LimitedDecoratedSelect>
                    <DecoratedInputNumber
                        field={ 'quantity' }
                        getFieldDecorator={ getFieldDecorator }
                        // initialValue={ _getDefaultValue(key, 'quantity') }
                    />
                    <Icon
                        type='save'
                        // className={ Styles.saveIcon }
                        onClick={ () => {
                            createService({
                                ...form.getFieldsValue([ 'serviceId', 'detailId', 'quantity' ]),
                            });
                            resetFields();
                        } }
                    />
                </Form>
            </Catcher>
        );
    }
}
