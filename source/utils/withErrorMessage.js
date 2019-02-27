// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { message } from 'antd';
import styled from 'styled-components';

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
    CLIENT_VEHICLE_DISABLED: 'CLIENT_VEHICLE_DISABLED',
    MANAGER_DISABLED:        'MANAGER_DISABLED',
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
                this._renderErrorMessage();
            }
        }

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
