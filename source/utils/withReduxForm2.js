// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

// proj
import { getDisplayName, extractFieldsConfigs, isField } from 'utils';

const change = (props, fields) => {
    props.change(fields, {
        form:  name,
        field: Object.keys(fields).toString(),
    });
};

export const withReduxForm2 = ({
    name,
    actions,
    debouncedFields = [],
    mapStateToProps = () => ({}),
}) => Enhanceable => {
    const debouncedFunctions = {};

    @connect(state => ({ ...state.forms[ name ], ...mapStateToProps(state) }), {
        ...actions,
    })
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
            const currentFieldsValues = _.pick(props.fields, _.keys(fields));

            const mergedFields = _.mergeWith(
                currentFieldsValues,
                fields,
                (objValue, srcValue) => isField(objValue) ? srcValue : void 0,
            );

            const debouncedKey = Object.keys(mergedFields).toString();
            if (!debouncedFields.includes(debouncedKey)) {
                return change(props, mergedFields);
            }
            if (!debouncedFunctions[ debouncedKey ]) {
                debouncedFunctions[ debouncedKey ] = _.debounce(change, 1000);
            }
            debouncedFunctions[ debouncedKey ](props, mergedFields);
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
