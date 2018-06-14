// vendor
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Form } from 'antd';
import { connect } from 'react-redux';

import { authActions } from 'core/auth/actions';
import { antdReduxFormActions } from 'core/forms/antdReduxForm/actions';
import { selectLoginForm } from 'core/forms/antdReduxForm/reducer';

import { getDisplayName } from 'utils';

const mapStateToProps = state => ({
    // authenticationFetching: selectAuthenticationFetching(state),
    ...selectLoginForm(state),
});

const mapDispatchToProps = (dispatch, props) => {
    return {
        actions: bindActionCreators(
            {
                fetchOrders: antdReduxFormActions.change,
            },
            dispatch,
        ),
    };
};

export const ordersTableHoc = Enhanceable => {
    @connect(mapStateToProps, mapDispatchToProps)
    @Form.create({
        mapPropsToFields(props) {
            return {
                email: Form.createFormField({
                    ...props.email,
                    value: props.email.value,
                }),
                password: Form.createFormField({
                    ...props.password,
                    value: props.password.value,
                }),
            };
        },
        onFieldsChange(props, fields) {
            props.actions.change('login', fields);
        },
    })
    class CostumizedOrdersTable extends Component {
        render() {
            return <Enhanceable { ...this.props } />;
        }
    }

    CostumizedOrdersTable.displayName = `ordersTableHoc(${getDisplayName(
        Enhanceable,
    )})`;

    return CostumizedOrdersTable;
};
