// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

// proj
import { getDisplayName } from 'utils';

const isField = value =>
    value.hasOwnProperty('dirty') && value.name && !_.isObject(value.name);

const extractFieldsConfigs = config => {
    // TODO lodash
    return _(config)
        .values()
        .filter(Boolean)
        .map(value => {
            if (isField(value)) {
                return [ value ];
            } else if (_.isObject(value)) {
                return _.values(extractFieldsConfigs(value));
            }

            return [];
        })
        .flatten()
        .map(value => [ value.name, value ])
        .fromPairs()
        .value();
};

const change = (props, fields) => {
    props.change(fields, {
        form:  name,
        field: Object.keys(fields).toString(),
    });
};

export const withReduxForm = ({ name, actions, debouncedFields = [] }) => Enhanceable => {
    const debouncedFunctions = {};

    @connect(state => ({ ...state.forms[ name ] }), { ...actions })
    @Form.create({
        mapPropsToFields(props) {
            const { fields } = props;
            const flattenFields = extractFieldsConfigs(fields);

            const createFields = {};
            _.forOwn(flattenFields, (value, key) => {
                createFields[ key ] = Form.createFormField(value);
            });

            return createFields;
        },
        onFieldsChange(props, fields) {
            const debouncedKey = Object.keys(fields).toString();
            if (!debouncedFields.includes(debouncedKey)) {
                return change(props, fields);
            }
            if (!debouncedFunctions[ debouncedKey ]) {
                debouncedFunctions[ debouncedKey ] = _.debounce(
                    change,
                    1000,
                );
            }
            debouncedFunctions[ debouncedKey ](props, fields);
        },
    })
    class ConnectedForm extends Component {
        render() {
            return <Enhanceable { ...this.props } />;
        }
    }

    ConnectedForm.displayName = `withReduxForm(${getDisplayName(Enhanceable)})`;

    return ConnectedForm;
};

export const hasErrors = fieldsError =>
    Object.keys(fieldsError).some(field => fieldsError[ field ]);
