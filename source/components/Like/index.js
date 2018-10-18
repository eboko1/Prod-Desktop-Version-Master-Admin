// vendor
import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const Recommendation = ({
    like,
    text,
    className,
    iconClassName,
    textClassName,
}) => (
    <div className={ className }>
        <Icon
            className={ iconClassName }
            type={ like ? 'like' : 'dislike' }
            theme='outlined'
        />
        { text && (
            <Text className={ textClassName }>
                { like ? (
                    <FormattedMessage id='recommend' />
                ) : (
                    <FormattedMessage id='not_recommend' />
                ) }
            </Text>
        ) }
    </div>
);

const Text = styled.div`
    font-size: 18px;
    display: flex;
    align-items: center;
`;

export const Like = styled(Recommendation)`
    display: flex;
    align-items: center;
    font-size: 28px;
    color: ${props => props.like ? 'var(--enabled)' : 'var(--disabled)'};
`;
