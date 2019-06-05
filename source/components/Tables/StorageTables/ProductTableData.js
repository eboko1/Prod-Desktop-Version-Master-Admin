// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

// proj
import book from 'routes/book';

const productDataCSS = css`
    display: flex;
    color: var(--link);
    flex-direction: column;
    font-weight: bold;
    cursor: pointer;
`;

const StyledLink = styled(Link)`
    ${productDataCSS}
`;

const StyledBlock = styled.div`
    ${productDataCSS}
`;

const ProductCode = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
`;

export const ProductTableData = props => {
    return props.link ? (
        <StyledLink to={ book.productsTracking }>
            <span>{ props.name }</span>
            <ProductCode>{ props.code }</ProductCode>
        </StyledLink>
    ) : (
        <StyledBlock>
            <span>{ props.name }</span>
            <ProductCode>{ props.code }</ProductCode>
        </StyledBlock>
    );
};
