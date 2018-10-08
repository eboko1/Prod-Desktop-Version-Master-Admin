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
            <span className={ textClassName }>
                { like ? (
                    <FormattedMessage id='recommend' />
                ) : (
                    <FormattedMessage id='dont_recommend' />
                ) }
            </span>
        ) }
    </div>
);

export const Like = styled(Recommendation)`
    font-size: 28px;
    color: ${props => props.like ? 'var(--enabled)' : 'var(--disabled)'};
`;
