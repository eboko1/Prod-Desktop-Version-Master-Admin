// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import styled from 'styled-components';

export const PromoCodeToast = ({ promoCodeDiscount }) => {
    return (
        <Toast promocodediscount={ promoCodeDiscount }>
            <StatusIcon
                type={ promoCodeDiscount === 'error' ? 'frown' : 'smile' }
                promocodediscount={ promoCodeDiscount }
            />

            { promoCodeDiscount === 'error' ? (
                <Text>
                    <FormattedMessage id='subscription.promo_code_invalid' />
                    &nbsp;
                    <br />
                    <FormattedMessage id='subscription.please_try_again' />
                </Text>
            ) : (
                <Text>
                    <FormattedMessage id='subscription.promo_code_verified' />
                    &nbsp;{ promoCodeDiscount } %
                    <FormattedMessage id='subscription.promo_code_discount' />
                </Text>
            ) }
        </Toast>
    );
};

const Toast = styled.div`
    margin-bottom: 10px;
    padding: 12px;
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

const Text = styled.div`
    white-space: nowrap;
`;
