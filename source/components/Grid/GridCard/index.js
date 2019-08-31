// vendor
import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

export const GridCard = ({ children, css, height }) => {
    return (
        <StyledGridCard css={ css } height={ height }>
            { children }
        </StyledGridCard>
    );
};

const StyledGridCard = styled(Card.Grid)`
    text-align: center;
    height: ${props => props.height ? props.height : 600}px;
    padding: 0;

    text-align: center;
    height: 600px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    margin: 12px 0px;
    background: white;

    ${props => props.css}
`;
