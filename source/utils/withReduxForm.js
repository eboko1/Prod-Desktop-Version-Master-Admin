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

export const withReduxForm = ({ name, actions }) => Enhanceable => {
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
            props.change(fields, {
                form:  name,
                field: Object.keys(fields).toString(),
            });
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
