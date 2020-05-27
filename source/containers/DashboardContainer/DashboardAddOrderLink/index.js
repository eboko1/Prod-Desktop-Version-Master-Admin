// vendor
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import book from 'routes/book';

// own
import { ROW_HEIGHT } from '../dashboardConfig';

const AddOrderLink = ({ className, time, stationNum }) => (
    <Link
        to={ {
            pathname: book.addOrder,
            state:    {
                beginDatetime: time.format('YYYY-MM-DD HH:mm'),
                stationNum,
                fromDashboard: true,
            },
        } }
        className={ className }
    >
        <FormattedMessage id='add' />
    </Link>
);

export const DashboardAddOrderCell = styled.div`
    height: ${ROW_HEIGHT}px;
    position: relative;
`;

export const DashboardAddOrderLink = styled(AddOrderLink)`
    display: none;
    background: var(--primary);
    color: white;
    height: ${ROW_HEIGHT}px;
    width: 1050%;
    position: absolute;
    transform: translate(-90%);

    ${DashboardAddOrderCell}:hover & {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
