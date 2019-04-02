// vendor
import React from 'react';
import { Skeleton } from 'antd';
import styled from 'styled-components';

// own
import { GridCard } from '../GridCard';

export const GridCardSkeleton = ({
    active,
    title,
    avatar,
    loading,
    paragraph,
    className,
    css,
}) => {
    return (
        <GridCard>
            <StyledSkeleton
                active={ active }
                title={ title }
                avatar={ avatar }
                loading={ loading }
                paragraph={ paragraph }
                className={ className }
                css={ css }
            />
        </GridCard>
    );
};

const StyledSkeleton = styled(Skeleton)`
    ${props => props.css}
`;
