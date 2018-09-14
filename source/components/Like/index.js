// vendor
import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';

const Recommendation = ({ like, className }) => (
    <Icon
        className={ className }
        type={ like ? 'like' : 'dislike' }
        theme='outlined'
    />
);

export const Like = styled(Recommendation)`
    font-size: 28px;
    color: ${props => props.like ? 'var(--enabled)' : 'var(--disabled)'};
`;
