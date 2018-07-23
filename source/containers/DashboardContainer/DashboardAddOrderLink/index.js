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
    background-color: tomato;
    border: 1px solid red;
    height: ${ROW_HEIGHT}px;
`;

export const DashboardAddOrderLink = styled(AddOrderLink)`
    display: none;
    color: palevioletred;
    background: papayawhip;
    height: ${ROW_HEIGHT}px;
    width: 10%;
    position: absolute;
    transform: translate(-90%);

    ${DashboardAddOrderCell}:hover & {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
