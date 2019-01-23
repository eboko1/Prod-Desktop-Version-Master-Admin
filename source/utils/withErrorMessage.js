// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
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

const errorMessages = Object.freeze({
    CLIENT_VEHICLE_DISABLED: 'CLIENT_VEHICLE_DISABLED',
});

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

            return (
                Object.keys(errorMessages).includes(errorType) &&
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
            // https://ant.design/components/message/

            return <Enhanceable { ...this.props } />;
        }
    }

    Enhanced.displayName = `withErrorMessage(${getDisplayName(Enhanceable)})`;

    return Enhanced;
};

const ErrorStatusCode = styled.span`
    font-weight: bold;
    margin-right: 8px;
`;

// error.response ? (
//     <div>
//         { error.response.statusCode }
//         111
//         <FormattedMessage
//             id={ `error_message.${
//                 error.response.message
//             }` }
//         />
//     </div>
// ) :
//     `${error.status}222 ${error.message}`
// ,
