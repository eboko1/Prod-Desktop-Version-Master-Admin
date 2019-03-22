// vendor
import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

// proj
// import { media } from 'styles/tools';

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
    display: flex;
    flex-direction: column;

    ${props => props.css}
`;

// ${media.xxl`
//         width: 20%;
//     `};
//     ${media.xl`
//       width: 25%;
//     `};
//     ${media.lg`
//     width: 33.33%;

//         &.ant-card-grid {
//             padding: 18px;
//         }
//     `};
//     ${media.md`
//         width: 33.33%;

//         &.ant-card-grid {
//             padding: 12px;
//         }
//     `};
//     ${media.sm`
//         width: 50%;

//         &.ant-card-grid {
//             padding: 24px;
//         }
//     `};
//     ${media.xs`
//         width: 100%;

//         &.ant-card-grid {
//             padding: 16px;
//         }
//     `};
