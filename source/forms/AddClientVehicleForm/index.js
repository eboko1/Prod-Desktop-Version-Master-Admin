// vendor
import React, { Component } from "react";
import { Button, Row, Col, Form, Select, Icon } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { v4 } from "uuid";
import _ from "lodash";

// proj
import { withReduxForm2 } from "utils";
import { VehicleNumberHistory } from "components";
import {
    MAKE_VEHICLES_INFO_FILTER_TYPE,
    YEAR_VEHICLES_INFO_FILTER_TYPE,
    MODEL_VEHICLES_INFO_FILTER_TYPE,
    onChangeAddClientVehicleForm,
    resetAddClientVehicleForm,
    fetchVehiclesInfo,
} from "core/forms/addClientVehicleForm/duck";
import { DecoratedSelect, DecoratedInput } from "forms/DecoratedFields";

// own
import Styles from "./styles.m.css";
const FormItem = Form.Item;
const Option = Select.Option;

const findLabel = (arr, id, keyName) => [
    keyName,
    _.get(_.find(arr, { id }), "name"),
];

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colon: false,
};

@injectIntl
@withReduxForm2({
    name: "addClientVehicleForm",
    actions: {
        change: onChangeAddClientVehicleForm,
        resetAddClientVehicleForm,
        fetchVehiclesInfo,
    },
})
export class AddClientVehicleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editModeFetching: props.editMode,
        };
    }

    normalizeMainTableData() {
        const {
            year,
            makeId,
            modelId,
            modificationId,
            number,
            vin,
        } = this.props;

        const { setFieldsValue } = this.props.form;

        setFieldsValue({
            year: year,
            makeId: makeId,
            modelId: modelId,
            modificationId: modificationId,
            number: number,
            vin: vin,
        });
    }

    /* eslint-disable complexity */
    render() {
        const {
            year,
            makeId,
            modelId,
            modificationId,
            number,
            makes,
            models,
            modifications,
            lastFilterAction,
            editableVehicle,
            editMode,
        } = this.props;

        const years = Array(new Date().getFullYear() - 1900 + 1)
            .fill(1900)
            .map((val, index) => val + index)
            .reverse();

        const {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
        } = this.props.form;

        const vehicle = getFieldsValue();

        if (this.state.editModeFetching) {
            if (
                ![
                    YEAR_VEHICLES_INFO_FILTER_TYPE,
                    MAKE_VEHICLES_INFO_FILTER_TYPE,
                    MODEL_VEHICLES_INFO_FILTER_TYPE,
                ].includes(lastFilterAction)
            ) {
                const yearFilters = { year: year };
                this.props.fetchVehiclesInfo(
                    YEAR_VEHICLES_INFO_FILTER_TYPE,
                    yearFilters,
                );
            } else if (
                ![
                    MAKE_VEHICLES_INFO_FILTER_TYPE,
                    MODEL_VEHICLES_INFO_FILTER_TYPE,
                ].includes(lastFilterAction)
            ) {
                const makeFilters = _.pick({ ...vehicle, makeId: makeId }, [
                    "year",
                    "makeId",
                ]);
                this.props.fetchVehiclesInfo(
                    MAKE_VEHICLES_INFO_FILTER_TYPE,
                    makeFilters,
                );
            } else if (
                ![MODEL_VEHICLES_INFO_FILTER_TYPE].includes(lastFilterAction)
            ) {
                const modelFilters = _.pick({ ...vehicle, modelId: modelId }, [
                    "modelId",
                    "year",
                    "makeId",
                ]);
                this.props.fetchVehiclesInfo(
                    MODEL_VEHICLES_INFO_FILTER_TYPE,
                    modelFilters,
                );
            } else {
                this.normalizeMainTableData();
                this.setState({
                    editModeFetching: false,
                });
            }
        }

        return (
            <Form className={Styles.form}>
                {editableVehicle && (
                    <div className={Styles.editableVehicle}>
                        <Icon type="car" className={Styles.carIcon} />
                        <ul>
                            <li className={Styles.listItem}>
                                <FormattedMessage id="add_client_form.year" />:{" "}
                                {editableVehicle.year && editableVehicle.year}
                            </li>
                            <li className={Styles.listItem}>
                                <FormattedMessage id="add_client_form.make" />:{" "}
                                {editableVehicle.make && editableVehicle.make}
                            </li>
                            <li className={Styles.listItem}>
                                <FormattedMessage id="add_client_form.model" />:{" "}
                                {editableVehicle.model && editableVehicle.model}
                            </li>
                            <li className={Styles.listItem}>
                                <FormattedMessage id="add_client_form.modification" />
                                :{" "}
                                {editableVehicle.modification &&
                                    editableVehicle.modification}{" "}
                                {editableVehicle.horsePower &&
                                    `(${editableVehicle.horsePower})`}
                            </li>
                        </ul>
                    </div>
                )}
                {years && (
                    <DecoratedSelect
                        field={"year"}
                        initialValue={year}
                        showSearch
                        formItem
                        formItemLayout={formItemLayout}
                        hasFeedback
                        label={<FormattedMessage id="add_client_form.year" />}
                        getFieldDecorator={getFieldDecorator}
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        placeholder={
                            <FormattedMessage id="add_client_form.year_placeholder" />
                        }
                        onSelect={value => {
                            const filters = { year: value };
                            this.props.fetchVehiclesInfo(
                                YEAR_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        }}
                        optionFilterProp="children"
                        getPopupContainer={trigger => trigger.parentNode}
                    >
                        {years
                            .sort((a, b) => b - a)
                            .map(year => (
                                <Option value={year} key={v4()}>
                                    {String(year)}
                                </Option>
                            ))}
                    </DecoratedSelect>
                )}

                {years && (
                    <DecoratedSelect
                        field="makeId"
                        showSearch
                        label={<FormattedMessage id="add_client_form.make" />}
                        hasFeedback
                        formItem
                        formItemLayout={formItemLayout}
                        getFieldDecorator={getFieldDecorator}
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        placeholder={
                            <FormattedMessage id="add_client_form.make_placeholder" />
                        }
                        disabled={
                            ![
                                YEAR_VEHICLES_INFO_FILTER_TYPE,
                                MAKE_VEHICLES_INFO_FILTER_TYPE,
                                MODEL_VEHICLES_INFO_FILTER_TYPE,
                            ].includes(lastFilterAction)
                        }
                        onSelect={value => {
                            const filters = _.pick(
                                { ...vehicle, makeId: value },
                                ["year", "makeId"],
                            );
                            this.props.fetchVehiclesInfo(
                                MAKE_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        }}
                        getPopupContainer={trigger => trigger.parentNode}
                        dropdownMatchSelectWidth={false}
                    >
                        {makes.map(({ id, name }) => (
                            <Option value={id} key={v4()}>
                                {name}
                            </Option>
                        ))}
                    </DecoratedSelect>
                )}

                {years && (
                    <DecoratedSelect
                        field="modelId"
                        showSearch
                        hasFeedback
                        formItem
                        formItemLayout={formItemLayout}
                        label={<FormattedMessage id="add_client_form.model" />}
                        getFieldDecorator={getFieldDecorator}
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        placeholder={
                            <FormattedMessage id="add_client_form.model_placeholder" />
                        }
                        disabled={
                            ![
                                MAKE_VEHICLES_INFO_FILTER_TYPE,
                                MODEL_VEHICLES_INFO_FILTER_TYPE,
                            ].includes(lastFilterAction)
                        }
                        onSelect={value => {
                            const filters = _.pick(
                                { ...vehicle, modelId: value },
                                ["modelId", "year", "makeId"],
                            );
                            this.props.fetchVehiclesInfo(
                                MODEL_VEHICLES_INFO_FILTER_TYPE,
                                filters,
                            );
                        }}
                        getPopupContainer={trigger => trigger.parentNode}
                        dropdownMatchSelectWidth={false}
                    >
                        {models.map(({ id, name }) => (
                            <Option value={id} key={v4()}>
                                {name}
                            </Option>
                        ))}
                    </DecoratedSelect>
                )}
                {years && (
                    <DecoratedSelect
                        field={"modificationId"}
                        showSearch
                        formItem
                        formItemLayout={formItemLayout}
                        hasFeedback
                        label={
                            <FormattedMessage id="add_client_form.modification" />
                        }
                        getFieldDecorator={getFieldDecorator}
                        placeholder={
                            <FormattedMessage id="add_client_form.modification_placeholder" />
                        }
                        disabled={
                            ![MODEL_VEHICLES_INFO_FILTER_TYPE].includes(
                                lastFilterAction,
                            )
                        }
                        rules={[
                            {
                                required: true,
                                message: this.props.intl.formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        getPopupContainer={trigger => trigger.parentNode}
                        dropdownMatchSelectWidth={false}
                    >
                        {modifications.map(({ id, name }) => (
                            <Option value={id} key={v4()}>
                                {name}
                            </Option>
                        ))}
                    </DecoratedSelect>
                )}

                {!this.props.onlyVehicles && (
                    <div className={Styles.numWrapper}>
                        <DecoratedInput
                            field="number"
                            initialValue={number}
                            hasFeedback
                            formItem
                            formItemLayout={formItemLayout}
                            label={
                                <FormattedMessage id="add_client_form.number" />
                            }
                            // formItemLayout={ formItemLayout }
                            rules={[
                                {
                                    required: true,
                                    message: this.props.intl.formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            getFieldDecorator={getFieldDecorator}
                        />

                        <VehicleNumberHistory vehicleNumber={vehicle.number} />
                    </div>
                )}
                {!this.props.onlyVehicles && (
                    <DecoratedInput
                        field="vin"
                        hasFeedback
                        formItem
                        formItemLayout={formItemLayout}
                        label={<FormattedMessage id="add_client_form.vin" />}
                        getFieldDecorator={getFieldDecorator}
                    />
                )}
                <div className={Styles.addButtonWrapper}>
                    <Button
                        type="primary"
                        onClick={() => {
                            validateFields((err, values) => {
                                if (!err) {
                                    const vehicle = values;
                                    const names = _([
                                        findLabel(
                                            makes,
                                            vehicle.makeId,
                                            "makeName",
                                        ),
                                        findLabel(
                                            models,
                                            vehicle.modelId,
                                            "modelName",
                                        ),
                                        findLabel(
                                            modifications,
                                            vehicle.modificationId,
                                            "modificationName",
                                        ),
                                    ])
                                        .fromPairs()
                                        .value();

                                    const filter = {
                                        id: vehicle.modificationId,
                                    };

                                    const modif = _.find(modifications, filter);

                                    this.props.resetAddClientVehicleForm();
                                    if (editMode) {
                                        this.props.editClientVehicle({
                                            ...vehicle,
                                            ...names,
                                            ...(this.props.tecdoc
                                                ? {
                                                      tecdocId: _.get(
                                                          modif,
                                                          "tecdocId",
                                                      ),
                                                  }
                                                : {}),
                                        });
                                    } else {
                                        this.props.addClientVehicle({
                                            ...vehicle,
                                            ...names,
                                            ...(this.props.tecdoc
                                                ? {
                                                      tecdocId: _.get(
                                                          modif,
                                                          "tecdocId",
                                                      ),
                                                  }
                                                : {}),
                                        });
                                    }
                                }
                            });
                        }}
                    >
                        <FormattedMessage
                            id={
                                editMode
                                    ? "edit"
                                    : "add_client_form.add_vehicle"
                            }
                        />
                    </Button>
                </div>
            </Form>
        );
    }
}
