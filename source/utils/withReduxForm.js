// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

// proj
import { getDisplayName } from 'utils';

export const withReduxForm = ({ name, fields, actions }) => Enhanceable => {
    const mapStateToProps = state => {
        const formState = { fields: {} };
        fields.forEach(field => {
            formState.fields[ field ] = state.forms.order[ field ];
        });

        return formState;
    };
    @connect(mapStateToProps, { ...actions })
    @Form.create({
        mapPropsToFields(props) {
            const { fields } = props;
            const createFields = {};
            _.forOwn(fields, (value, key) => {
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
