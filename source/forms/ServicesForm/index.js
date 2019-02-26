// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Icon, Select } from "antd";
import _ from "lodash";

// proj
import {
    fetchServicesSuggestions,
    selectServicesSuggestionsOptions,
} from "core/servicesSuggestions/duck";
import {
    onChangeServicesForm,
    createService,
    updateService,
    deleteService,
    resetFields,
} from "core/forms/servicesForm/duck";

import { Catcher } from "commons";
import {
    DecoratedInputNumber,
    DecoratedSelect,
    LimitedDecoratedSelect,
} from "forms/DecoratedFields";
import { withReduxForm2 } from "utils";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

@injectIntl
@withReduxForm2({
    name: "servicesForm",
    actions: {
        change: onChangeServicesForm,
        fetchServicesSuggestions,
        resetFields,
        createService,
        updateService,
        deleteService,
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
        const {
            getFieldDecorator,
            getFieldsValue,
            validateFields,
        } = this.props.form;

        return (
            <Catcher>
                <Form layout="horizontal" className={Styles.form}>
                    <DecoratedSelect
                        cnStyles={Styles.servicesSelect}
                        field={"serviceId"}
                        getFieldDecorator={getFieldDecorator}
                        // initialValue={ _getDefaultValue(key, 'serviceId') }
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: "50%" }}
                        mode={"combobox"}
                        optionLabelProp={"children"}
                        optionFilterProp={"children"}
                        showSearch
                        placeholder={"Выберете работу"}
                        rules={[
                            {
                                required: true,
                                message: "serviceId is required!",
                            },
                        ]}
                    >
                        {services.map(({ serviceId, serviceName }) => (
                            <Option value={String(serviceId)} key={serviceId}>
                                {serviceName}
                            </Option>
                        ))}
                    </DecoratedSelect>
                    <LimitedDecoratedSelect
                        cnStyles={Styles.detailsSelect}
                        field={"detailId"}
                        getFieldDecorator={getFieldDecorator}
                        mode={"combobox"}
                        optionLabelProp={"children"}
                        showSearch
                        placeholder={"Выберете деталь"}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: "50%" }}
                        rules={[
                            {
                                required: true,
                                message: "detailId is required!",
                            },
                        ]}
                    >
                        {details.map(({ detailId, detailName }) => (
                            <Option value={String(detailId)} key={detailId}>
                                {detailName}
                            </Option>
                        ))}
                    </LimitedDecoratedSelect>
                    <DecoratedInputNumber
                        placeholder={"кол-во"}
                        cnStyles={Styles.quantity}
                        field={"quantity"}
                        getFieldDecorator={getFieldDecorator}
                        rules={[
                            {
                                required: true,
                                message: "quantity is required!",
                            },
                        ]}
                        min={1}
                        // initialValue={ _getDefaultValue(key, 'quantity') }
                    />
                    <Icon
                        type="save"
                        className={Styles.saveIcon}
                        onClick={() => {
                            validateFields((error, values) => {
                                if (error) {
                                    return; // eslint-disable-line
                                }
                                createService({
                                    ...getFieldsValue([
                                        "serviceId",
                                        "detailId",
                                        "quantity",
                                    ]),
                                });
                                resetFields();
                            });
                        }}
                    />
                </Form>
            </Catcher>
        );
    }
}
