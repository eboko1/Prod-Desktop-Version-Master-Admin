// vendor
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// proj
import book from 'routes/book';

// own
import { ROW_HEIGHT } from '../dashboardConfig';

const AddOrderLink = ({ className, children }) => (
    <Link to={ book.addOrder } className={ className }>
        { children }
    </Link>
);

export const DashboardAddOrderCell = styled.div`
    border-right: 1px solid black;
    border-bottom: 1px dashed black;
    height: ${ROW_HEIGHT}px;
`;

export const DashboardAddOrderLink = styled(AddOrderLink)`
    display: none;
    background: var(--primary);
    color: white;
    height: ${ROW_HEIGHT}px;
    width: 12%;
    position: absolute;
    transform: translate(-90%);

    ${DashboardAddOrderCell}:hover & {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
