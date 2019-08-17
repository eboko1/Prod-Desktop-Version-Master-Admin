// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, message, notification } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import {
    selectErrorType,
    selectErrorEntity,
    setErrorMessage,
    resetErrorMessage,
} from 'core/errorMessage/duck';

import { getDisplayName } from 'utils';

// own
const _errorMessages = Object.freeze({
    CLIENT_VEHICLE_DISABLED:                  'CLIENT_VEHICLE_DISABLED',
    MANAGER_DISABLED:                         'MANAGER_DISABLED',
    INVALID_CREDENTIALS:                      'INVALID_CREDENTIALS',
    UNIQUE_CONSTRAINT_VIOLATION_PRODUCT_CODE:
        'UNIQUE_CONSTRAINT_VIOLATION_PRODUCT_CODE',
    STORE_DOC_PRODUCTS_ARE_USED:      'STORE_DOC_PRODUCTS_ARE_USED',
    ORDER_HAS_NOT_AVAILABLE_PRODUCTS: 'ORDER_HAS_NOT_AVAILABLE_PRODUCTS',
});

const ErrorStatusCode = styled.span`
    font-weight: bold;
    margin-right: 8px;
`;

export const withErrorMessage = () => Enhanceable => {
    @injectIntl
    @connect(
        state => ({
            errorType: selectErrorType(state),
            error:     selectErrorEntity(state),
        }),
        {
            setErrorMessage,
            resetErrorMessage,
        },
    )
    class Enhanced extends Component {
        componentDidUpdate(prevProps) {
            if (prevProps.errorType !== this.props.errorType) {
                if (!_.isEmpty(this.props.error.data)) {
                    this._renderErrorNotification(this.props.error.data);
                } else {
                    this._renderErrorMessage();
                }
            }
        }

        _renderErrorNotification = data => {
            const { notAvailableProducts } = data;

            return notification.open({
                message: this.props.intl.formatMessage({
                    id: this.props.error.message,
                }),
                description:
                    !_.isEmpty(notAvailableProducts) &&
                    notAvailableProducts.map(({ productCode, id }) => (
                        <div key={ id }>{ productCode }</div>
                    )),
                icon: <Icon type='close-circle' style={ { color: '#eb0c0c' } } />,
            });
        };

        _renderErrorMessage = () => {
            const { errorType, error, resetErrorMessage } = this.props;

            // https://ant.design/components/message/
            return (
                Object.keys(_errorMessages).includes(errorType) &&
                message.error(
                    <div>
                        <ErrorStatusCode>{ error.status }</ErrorStatusCode>
                        { this.props.intl.formatMessage({
                            id: error.message,
                        }) }
                    </div>,
                    3,
                    resetErrorMessage,
                )
            );
        };

        render() {
            return <Enhanceable { ...this.props } />;
        }
    }

    Enhanced.displayName = `withErrorMessage(${getDisplayName(Enhanceable)})`;

    return Enhanced;
};
