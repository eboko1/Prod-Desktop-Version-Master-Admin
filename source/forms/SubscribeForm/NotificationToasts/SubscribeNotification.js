// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import styled from 'styled-components';

// own

import { paymentTypes } from '../config';

export const SubscribeNotification = ({ type }) => {
    return (
        <Toast>
            { type === paymentTypes.CASHLESS && (
                <>
                    <StatusIcon type='check-circle' />
                    &nbsp;
                    <FormattedMessage id='subscription.cashless_success' />
                    &nbsp;
                    <br />
                    <FormattedMessage id='subscription.support_will_contact' />
                </>
            ) }
        </Toast>
    );
};

const Toast = styled.div`
    margin-bottom: 10px;
    padding: 12px;
    font-size: 24px;
    border: ${props =>
        props.promocodediscount === 'error'
            ? '1px solid var(--warning)'
            : '1px solid var(--secondary)'};
    border-radius: 3px;
    background-color: ${props =>
        props.promocodediscount === 'error'
            ? 'rgba(var(--warningRGB), 0.2)'
            : 'rgba(var(--secondaryRGB), 0.1)'};
    color: ${props =>
        props.promocodediscount === 'error'
            ? 'var(--warning)'
            : 'var(--secondary)'};
    text-align: center;
    flex: 1 1 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StatusIcon = styled(Icon)`
    color: ${props =>
        props.promocodediscount === 'error'
            ? 'var(--warning)'
            : 'var(--secondary)'};
    margin-right: 10px;
    font-size: 24px;
`;
